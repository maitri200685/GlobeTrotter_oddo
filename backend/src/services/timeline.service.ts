import { SupabaseClient } from '@supabase/supabase-js';

export interface TimelineEvent {
  id: string;
  type: string; // 'hotel', 'activity', 'transport', 'custom'
  title: string;
  startTime: string;
  endTime: string;
  cost?: number;
}

export interface TimelineDay {
  date: string;
  notes?: string;
  events: TimelineEvent[];
}

export class TimelineService {
  async getTimeline(tripId: string, supabase: SupabaseClient): Promise<TimelineDay[]> {
    const { data: days, error } = await supabase
      .from('itinerary_days')
      .select(`
        id,
        day_date,
        daily_notes,
        itinerary_items (
          id,
          activity_type,
          start_time,
          end_time,
          notes,
          booked_cost,
          sequence_order,
          activities(name),
          hotels(name)
        )
      `)
      .eq('trip_id', tripId)
      .order('day_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch timeline: ${error.message}`);
    }

    if (!days) return [];

    return days.map(day => {
      // Sort items by sequence_order or start_time
      const sortedItems = (day.itinerary_items || []).sort((a: any, b: any) => {
        if (a.start_time && b.start_time) {
          return a.start_time.localeCompare(b.start_time);
        }
        return a.sequence_order - b.sequence_order;
      });

      return {
        date: day.day_date,
        notes: day.daily_notes,
        events: sortedItems.map((item: any) => {
          let title = item.notes || 'Event';
          if (item.activity_type === 'hotel' && item.hotels?.name) {
            title = `Check-in: ${item.hotels.name}`;
          } else if (item.activity_type === 'activity' && item.activities?.name) {
            title = item.activities.name;
          }

          return {
            id: item.id,
            type: item.activity_type,
            title: title,
            startTime: item.start_time,
            endTime: item.end_time,
            cost: item.booked_cost
          };
        })
      };
    });
  }
}
