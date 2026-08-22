import { SupabaseClient } from '@supabase/supabase-js';
import { BudgetService } from './budget.service';
import { ToolContext } from '../agent/agent.types';

export interface PlannedActivity {
  title: string;
  activityId?: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  date: string; // YYYY-MM-DD
  estimatedCost: number;
}

export interface PlannedAccommodation {
  hotelId?: string;
  name: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  estimatedCostPerNight: number;
}

export interface TravelConstraint {
  type: 'budget' | 'date' | 'schedule';
  description: string;
}

export interface TravelPlan {
  objective: string;
  destinations: string[];
  startDate?: string;
  endDate?: string;
  budget?: {
    amount: number;
    currency: string;
  };
  activities: PlannedActivity[];
  accommodations: PlannedAccommodation[];
  constraints: TravelConstraint[];
  status: 'draft' | 'validating' | 'replanning' | 'final' | 'failed';
}

export class PlanningService {
  // Constructor removed as we will instantiate BudgetService dynamically with the context
  constructor() {}

  /**
   * Deterministically validates a proposed travel plan against backend constraints.
   */
  async validatePlan(plan: TravelPlan, context: ToolContext): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // 1. Validate Schedule / Dates
    if (plan.startDate && plan.endDate) {
      const start = new Date(plan.startDate);
      const end = new Date(plan.endDate);
      if (start > end) {
        errors.push(`Trip start date (${plan.startDate}) cannot be after end date (${plan.endDate}).`);
      }

      // Check if activities fall within trip dates
      for (const act of plan.activities) {
        const actDate = new Date(act.date);
        if (actDate < start || actDate > end) {
          errors.push(`Activity "${act.title}" on ${act.date} is outside trip dates (${plan.startDate} to ${plan.endDate}).`);
        }
      }
      
      // Check if accommodations fall within trip dates
      for (const acc of plan.accommodations) {
        const checkIn = new Date(acc.checkInDate);
        const checkOut = new Date(acc.checkOutDate);
        if (checkIn < start || checkOut > end) {
          errors.push(`Accommodation "${acc.name}" from ${acc.checkInDate} to ${acc.checkOutDate} is outside trip dates.`);
        }
      }
    }

    // 2. Validate Overlaps
    const activitiesByDate: Record<string, PlannedActivity[]> = {};
    for (const act of plan.activities) {
      if (!activitiesByDate[act.date]) activitiesByDate[act.date] = [];
      activitiesByDate[act.date].push(act);
    }

    for (const date in activitiesByDate) {
      const acts = activitiesByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
      for (let i = 0; i < acts.length - 1; i++) {
        if (acts[i].endTime > acts[i+1].startTime) {
          errors.push(`Schedule conflict on ${date} between "${acts[i].title}" and "${acts[i+1].title}".`);
        }
      }
    }

    // 3. Validate Budget Constraints
    if (context.tripId) {
      const budgetService = new BudgetService(context.supabase);
      const budgetSummary = await budgetService.getBudgetSummary(context.tripId);
      
      // Calculate plan's additional cost
      let planEstimatedCost = 0;
      for (const act of plan.activities) {
        planEstimatedCost += act.estimatedCost;
      }
      
      for (const acc of plan.accommodations) {
        const days = (new Date(acc.checkOutDate).getTime() - new Date(acc.checkInDate).getTime()) / (1000 * 3600 * 24);
        if (days > 0) {
          planEstimatedCost += (acc.estimatedCostPerNight * days);
        }
      }

      if (budgetSummary.targetBudget > 0) {
        const totalProjected = budgetSummary.totalEstimatedCost + planEstimatedCost;
        if (totalProjected > budgetSummary.targetBudget) {
          errors.push(`Budget exceeded. Projected total: ${totalProjected}. Max budget: ${budgetSummary.targetBudget}. Reduce costs by ${totalProjected - budgetSummary.targetBudget}.`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Persist a valid TravelPlan to Supabase itinerary tables
   */
  async persistPlan(plan: TravelPlan, context: ToolContext): Promise<{ success: boolean; error?: string }> {
    if (!context.tripId) {
      return { success: false, error: 'tripId is missing from context' };
    }

    try {
      // 1. Clear existing itinerary for this trip (simplified replacement logic)
      await context.supabase.from('itinerary_days').delete().eq('trip_id', context.tripId);
      
      // 2. Map plan into days
      const daysMap: Record<string, { id?: string, date: string, items: any[] }> = {};
      
      for (const act of plan.activities) {
        if (!daysMap[act.date]) daysMap[act.date] = { date: act.date, items: [] };
        daysMap[act.date].items.push(act);
      }
      for (const acc of plan.accommodations) {
        // Just adding check-in as an itinerary item for simplicity
        if (!daysMap[acc.checkInDate]) daysMap[acc.checkInDate] = { date: acc.checkInDate, items: [] };
        daysMap[acc.checkInDate].items.push(acc);
      }

      for (const date in daysMap) {
        // Insert day
        const { data: dayData, error: dayError } = await context.supabase
          .from('itinerary_days')
          .insert({ trip_id: context.tripId, day_date: date })
          .select('id')
          .single();
          
        if (dayError || !dayData) throw dayError;

        const dayId = dayData.id;

        // Insert items
        const dayItems = daysMap[date].items;
        for (let i = 0; i < dayItems.length; i++) {
          const item = dayItems[i];
          if ('activityId' in item) { // PlannedActivity
            await context.supabase.from('itinerary_items').insert({
              itinerary_day_id: dayId,
              activity_type: item.activityId ? 'activity' : 'custom',
              activity_id: item.activityId || null,
              start_time: item.startTime,
              end_time: item.endTime,
              sequence_order: i,
              notes: item.title,
              booked_cost: item.estimatedCost
            });
          } else if ('hotelId' in item) { // PlannedAccommodation
            await context.supabase.from('itinerary_items').insert({
              itinerary_day_id: dayId,
              activity_type: 'hotel',
              hotel_id: item.hotelId || null,
              start_time: '14:00', // standard check-in
              end_time: '15:00',
              sequence_order: i,
              notes: `Check-in: ${item.name}`,
              booked_cost: item.estimatedCostPerNight
            });
          }
        }
      }
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

