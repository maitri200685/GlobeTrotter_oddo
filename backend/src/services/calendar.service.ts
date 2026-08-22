import { TimelineDay, TimelineEvent } from './timeline.service';

export interface CalendarEvent {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  tripId: string;
  itineraryItemId?: string;
}

export class CalendarService {
  /**
   * Transforms a timeline into calendar events
   */
  generateCalendarEvents(timeline: TimelineDay[], tripId: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    for (const day of timeline) {
      for (const item of day.events) {
        if (!item.startTime || !item.endTime) continue;

        // Parse time assuming local time for the trip destination
        const start = new Date(`${day.date}T${item.startTime}`);
        const end = new Date(`${day.date}T${item.endTime}`);
        
        // Handle invalid dates
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
          continue; 
        }

        events.push({
          title: item.title,
          start,
          end,
          tripId,
          itineraryItemId: item.id
        });
      }
    }

    return events;
  }
}
