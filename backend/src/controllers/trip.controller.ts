import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

/** Convert DB status enum → frontend status string */
function mapStatus(dbStatus: string): string {
  switch (dbStatus) {
    case 'planning': return 'upcoming';
    case 'active':   return 'upcoming';
    case 'completed':return 'past';
    case 'archived': return 'past';
    case 'draft':    return 'draft';
    default:         return 'upcoming';
  }
}

/** Map a raw DB trip row (with joined stops) → frontend Trip shape */
function formatTrip(trip: any): any {
  const totalDays = trip.start_date && trip.end_date
    ? Math.max(1, Math.ceil(
        (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1)
    : 0;

  return {
    id: trip.id,
    userId: trip.owner_id,
    title: trip.title,
    description: trip.description || '',
    coverImage: trip.cover_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
    startDate: trip.start_date || '',
    endDate: trip.end_date || '',
    totalDays,
    status: mapStatus(trip.status),
    visibility: trip.visibility || 'private',
    cities: (trip.trip_stops || []).map((stop: any) => ({
      id: stop.id,
      cityName: stop.cities?.name || '',
      country: stop.cities?.country || '',
      daysAllocated: stop.arrival_date && stop.departure_date
        ? Math.max(1, Math.ceil(
            (new Date(stop.departure_date).getTime() - new Date(stop.arrival_date).getTime()) / (1000 * 60 * 60 * 24)
          ))
        : 3,
      order: stop.sequence_order || 1,
      coverImage: stop.cities?.image_url || '',
      coordinates: stop.cities?.latitude ? { lat: stop.cities.latitude, lng: stop.cities.longitude } : undefined,
    })),
    hotels: [],
    transport: [],
    itinerary: (trip.itinerary_days || []).flatMap((day: any) =>
      (day.itinerary_items || []).map((item: any) => ({
        id: item.id,
        dayNumber: day.day_number || 1,
        date: day.day_date || day.date || '',
        cityName: '',
        timeSlot: item.start_time?.substring(0, 5) || '09:00',
        duration: item.end_time && item.start_time
          ? `${Math.round((new Date(`2000-01-01T${item.end_time}`).getTime() - new Date(`2000-01-01T${item.start_time}`).getTime()) / 3600000)} hours`
          : '2 hours',
        title: item.notes || 'Activity',
        category: item.activity_type || 'sightseeing',
        location: '',
        estimatedCost: item.booked_cost || 0,
        currency: 'INR',
        notes: item.notes || '',
        image: '',
        rating: 4.5,
      }))
    ),
    budget: {
      targetBudget: trip.total_budget || 0,
      totalEstimatedCost: 0,
      currency: 'INR',
      status: 'healthy',
      categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 },
    },
    shareId: trip.share_token || null,
    createdAt: trip.created_at || new Date().toISOString(),
    updatedAt: trip.updated_at || new Date().toISOString(),
  };
}

export const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { data, error } = await supabase
      .from('trips')
      .select('*, trip_stops(*, cities(*))')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json({ status: 'success', data: (data || []).map(formatTrip) });
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { data: trip, error } = await supabase
      .from('trips')
      .select('*, trip_stops(*, cities(*)), itinerary_days(*, itinerary_items(*))')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Trip not found');
      throw error;
    }
    
    res.json({ status: 'success', data: formatTrip(trip) });
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { title, description, startDate, endDate, targetBudget, coverImage, currency, travelerCount, travelerType, travelStyle } = req.body;
    
    if (!title?.trim()) {
      res.status(400).json({ status: 'error', message: 'Trip title is required' });
      return;
    }
    
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        title: title.trim(),
        description: description || '',
        start_date: startDate || null,
        end_date: endDate || null,
        total_budget: targetBudget || 0,
        cover_image_url: coverImage || null,
        owner_id: req.user!.id,
        status: 'planning',
        visibility: 'private',
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Return formatted trip (with all expected frontend fields)
    const totalDays = trip.start_date && trip.end_date
      ? Math.max(1, Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1)
      : 0;

    const formattedTrip = {
      id: trip.id,
      userId: trip.owner_id,
      title: trip.title,
      description: trip.description || '',
      coverImage: trip.cover_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
      startDate: trip.start_date || '',
      endDate: trip.end_date || '',
      totalDays,
      status: 'upcoming',
      travelerCount: travelerCount || 2,
      travelerType: travelerType || 'couple',
      travelStyle: travelStyle || 'comfort',
      cities: [],
      hotels: [],
      transport: [],
      itinerary: [],
      budget: {
        targetBudget: trip.total_budget || 0,
        totalEstimatedCost: 0,
        currency: currency || 'INR',
        status: 'healthy',
        categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 },
      },
      shareId: null,
      createdAt: trip.created_at,
      updatedAt: trip.updated_at,
    };
    
    res.status(201).json({ status: 'success', data: formattedTrip });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    // Map frontend field names → DB column names
    const dbUpdates: any = {};
    if (req.body.title !== undefined)       dbUpdates.title = req.body.title;
    if (req.body.description !== undefined) dbUpdates.description = req.body.description;
    if (req.body.startDate !== undefined)   dbUpdates.start_date = req.body.startDate;
    if (req.body.endDate !== undefined)     dbUpdates.end_date = req.body.endDate;
    if (req.body.coverImage !== undefined)  dbUpdates.cover_image_url = req.body.coverImage;
    if (req.body.status !== undefined) {
      // Map frontend status → DB enum
      const statusMap: Record<string, string> = {
        'upcoming': 'planning', 'draft': 'draft', 'past': 'completed', 'planning': 'planning'
      };
      dbUpdates.status = statusMap[req.body.status] || 'planning';
    }
    // Handle budget update
    if (req.body.budget?.targetBudget !== undefined) {
      dbUpdates.total_budget = req.body.budget.targetBudget;
    }

    if (Object.keys(dbUpdates).length === 0) {
      // Nothing to update in DB — this could be a local-only update (cities, hotels, itinerary)
      // Return the existing trip merged with the updates
      const { data: existing, error: fetchErr } = await supabase
        .from('trips')
        .select('*, trip_stops(*, cities(*))')
        .eq('id', req.params.id)
        .single();
      if (fetchErr) throw fetchErr;
      const formatted = formatTrip(existing);
      // Merge in the non-DB fields from request body
      const merged = { ...formatted, ...req.body, id: formatted.id };
      res.json({ status: 'success', data: merged });
      return;
    }
    
    const { data, error } = await supabase
      .from('trips')
      .update(dbUpdates)
      .eq('id', req.params.id)
      .select('*, trip_stops(*, cities(*))')
      .single();
      
    if (error) throw error;
    
    // Merge the DB response with any non-DB fields from request body
    const formatted = formatTrip(data);
    const merged = { ...formatted, ...req.body, id: formatted.id, userId: formatted.userId };
    res.json({ status: 'success', data: merged });
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', req.params.id);
      
    if (error) throw error;
    
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
