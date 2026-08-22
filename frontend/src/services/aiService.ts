/**
 * aiService.ts
 * Frontend AI service abstraction.
 * All AI calls are currently mocked for demo.
 * Replace each method with real API calls when backend is ready.
 * 
 * Backend integration point: POST /api/ai/plan, /api/ai/assist, /api/ai/optimize
 */

import type { Trip, ItineraryItem } from '@/types/trip.types';

export interface AIPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  vibes: string[];
  travelStyle?: string;
}

export interface AIGeneratedTrip {
  title: string;
  description: string;
  cities: string[];
  totalDays: number;
  estimatedBudget: number;
  currency: string;
  highlights: string[];
  itinerarySummary: { day: number; focus: string; activities: string[] }[];
  hotelSuggestions: { name: string; stars: number; pricePerNight: number }[];
  status: 'generated';
}

export interface AISuggestion {
  id: string;
  type: 'swap_hotel' | 'remove_activity' | 'add_activity' | 'reschedule' | 'budget_cut' | 'upgrade';
  title: string;
  description: string;
  budgetImpact: number;
  currency: string;
  category: 'savings' | 'enhancement' | 'optimization';
  priority: 'high' | 'medium' | 'low';
}

export interface AIAssistRequest {
  tripId: string;
  query: string;
  context?: {
    currentBudget: number;
    totalDays: number;
    cities: string[];
  };
}

export interface AIAssistResponse {
  message: string;
  suggestions: AISuggestion[];
  confidence: number;
}

const MOCK_DELAY = (ms = 1000) => new Promise((res) => setTimeout(res, ms));

class AIService {
  /**
   * Generate a complete trip plan from user preferences.
   * Backend: POST /api/ai/plan
   */
  async generateTripPlan(request: AIPlanRequest): Promise<AIGeneratedTrip> {
    await MOCK_DELAY(1200);

    const days = Math.round(
      (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 86400000
    );

    return {
      title: `${request.destination} ${request.vibes[0] || 'Explorer'} Trip`,
      description: `A perfectly curated ${days}-day trip to ${request.destination} for ${request.travelers} traveler${request.travelers > 1 ? 's' : ''}.`,
      cities: [request.destination],
      totalDays: days,
      estimatedBudget: request.budget * 0.92,
      currency: request.currency,
      highlights: [
        `Best ${request.vibes[0] || 'local'} experiences`,
        'Top-rated accommodations for your style',
        'Curated daily itinerary',
        'Budget-optimized routing',
      ],
      itinerarySummary: Array.from({ length: Math.min(days, 5) }, (_, i) => ({
        day: i + 1,
        focus: i === 0 ? 'Arrival & Orientation' : i === days - 1 ? 'Departure' : request.vibes[i % request.vibes.length] || 'Exploration',
        activities: ['Morning: Breakfast & Hotel Check-in', 'Afternoon: Local Sightseeing', 'Evening: Dinner & Leisure'],
      })),
      hotelSuggestions: [
        { name: 'Top Recommended Hotel', stars: 4, pricePerNight: Math.round(request.budget / (days * 5)) },
        { name: 'Budget-Friendly Stay', stars: 3, pricePerNight: Math.round(request.budget / (days * 8)) },
      ],
      status: 'generated',
    };
  }

  /**
   * Get AI suggestions for optimizing an existing trip.
   * Backend: POST /api/ai/assist
   */
  async getAssistantSuggestions(request: AIAssistRequest): Promise<AIAssistResponse> {
    await MOCK_DELAY(900);

    const lower = request.query.toLowerCase();

    const isCostQuery = lower.includes('cheap') || lower.includes('cost') || lower.includes('budget') || lower.includes('save');
    const isHotelQuery = lower.includes('hotel') || lower.includes('stay') || lower.includes('accommodation');
    const isActivityQuery = lower.includes('beach') || lower.includes('activity') || lower.includes('night') || lower.includes('food');
    const isScheduleQuery = lower.includes('relax') || lower.includes('busy') || lower.includes('day') || lower.includes('rest');

    const suggestions: AISuggestion[] = [];

    if (isCostQuery) {
      suggestions.push(
        {
          id: `ai-${Date.now()}-1`,
          type: 'swap_hotel',
          title: 'Switch to 3★ Boutique Stay',
          description: 'Swap to a highly-rated 3-star property. Same location, 35% cheaper, excellent reviews.',
          budgetImpact: -4200,
          currency: 'INR',
          category: 'savings',
          priority: 'high',
        },
        {
          id: `ai-${Date.now()}-2`,
          type: 'budget_cut',
          title: 'Use Local Transport',
          description: 'Switch 3 private cab rides to local transport. Saves time and significant cost.',
          budgetImpact: -2800,
          currency: 'INR',
          category: 'savings',
          priority: 'medium',
        }
      );
    }

    if (isHotelQuery) {
      suggestions.push({
        id: `ai-${Date.now()}-3`,
        type: 'upgrade',
        title: 'Upgrade to Beachfront Property',
        description: 'Available 4.5★ beachfront suite — highly recommended for your travel style.',
        budgetImpact: 3200,
        currency: 'INR',
        category: 'enhancement',
        priority: 'low',
      });
    }

    if (isActivityQuery) {
      suggestions.push({
        id: `ai-${Date.now()}-4`,
        type: 'add_activity',
        title: 'Add Sunset Beachside Dinner',
        description: 'Top-rated 4.9★ oceanfront restaurant. Perfect for your beach + food interests.',
        budgetImpact: 1800,
        currency: 'INR',
        category: 'enhancement',
        priority: 'medium',
      });
    }

    if (isScheduleQuery) {
      suggestions.push({
        id: `ai-${Date.now()}-5`,
        type: 'reschedule',
        title: 'Convert Tomorrow to Leisure Day',
        description: 'Remove all scheduled activities and replace with a free exploration block.',
        budgetImpact: -1200,
        currency: 'INR',
        category: 'optimization',
        priority: 'high',
      });
    }

    // Default suggestion if no category matched
    if (suggestions.length === 0) {
      suggestions.push({
        id: `ai-${Date.now()}-6`,
        type: 'budget_cut',
        title: 'Optimize Overall Transport',
        description: 'Reorganize your route to minimize unnecessary travel time and cost.',
        budgetImpact: -1800,
        currency: 'INR',
        category: 'savings',
        priority: 'medium',
      });
    }

    const messages: Record<string, string> = {
      cost: `I've analyzed your trip budget and found **${suggestions.length} optimizations** that can save up to ₹${Math.abs(suggestions.reduce((s, x) => s + Math.min(0, x.budgetImpact), 0)).toLocaleString()} without affecting experience quality.`,
      hotel: `Here are the best hotel alternatives based on your travel style, location preferences, and remaining budget.`,
      activity: `I found some amazing experiences that perfectly match your interests. Here's what I'd recommend adding to your itinerary.`,
      schedule: `I can help make your schedule more relaxed. Here's how I'd restructure your days.`,
      default: `Based on your trip details, here are my top recommendations to improve your experience.`,
    };

    const messageKey = isCostQuery ? 'cost' : isHotelQuery ? 'hotel' : isActivityQuery ? 'activity' : isScheduleQuery ? 'schedule' : 'default';

    return {
      message: messages[messageKey],
      suggestions,
      confidence: 0.92,
    };
  }

  /**
   * Get budget optimization recommendations.
   * Backend: POST /api/ai/optimize-budget
   */
  async optimizeBudget(tripId: string, currentBudget: number): Promise<AISuggestion[]> {
    await MOCK_DELAY(600);

    return [
      {
        id: `opt-1`,
        type: 'swap_hotel',
        title: 'Downgrade Hotel for 2 nights',
        description: 'Use a budget guesthouse for 2 mid-trip nights when you\'re out all day anyway.',
        budgetImpact: -3400,
        currency: 'INR',
        category: 'savings',
        priority: 'high',
      },
      {
        id: `opt-2`,
        type: 'remove_activity',
        title: 'Remove Redundant Tours',
        description: '2 similar sightseeing tours on Day 1 and Day 3 can be consolidated into one.',
        budgetImpact: -1800,
        currency: 'INR',
        category: 'optimization',
        priority: 'medium',
      },
    ];
  }
}

export const aiService = new AIService();
