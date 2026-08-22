import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { TimelineService } from '../services/timeline.service';
import { CalendarService } from '../services/calendar.service';

export const getTimeline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    const supabase = getAuthSupabaseClient(req.token!);

    // RLS validation: Ensure user can read the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access to the specified trip.'
      });
    }

    const timelineService = new TimelineService();
    const days = await timelineService.getTimeline(tripId, supabase);

    res.json({
      status: 'success',
      data: {
        tripId,
        days
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCalendarEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    const supabase = getAuthSupabaseClient(req.token!);

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }

    const timelineService = new TimelineService();
    const days = await timelineService.getTimeline(tripId, supabase);
    
    const calendarService = new CalendarService();
    const events = calendarService.generateCalendarEvents(days, tripId);

    res.json({ status: 'success', data: events });
  } catch (error) {
    next(error);
  }
};
