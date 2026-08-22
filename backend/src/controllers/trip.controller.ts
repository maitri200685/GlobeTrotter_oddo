import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    // Fetch trips where the user is the owner (RLS handles this but good to be explicit or let RLS do it)
    // Actually RLS will automatically filter trips by owner_id or membership.
    const { data, error } = await supabase
      .from('trips')
      .select('*, trip_stops(*, cities(*))')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Map backend model to frontend expected format
    const formattedTrips = data.map(trip => ({
      id: trip.id,
      userId: trip.owner_id,
      title: trip.title,
      description: trip.description,
      coverImage: trip.cover_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
      startDate: trip.start_date,
      endDate: trip.end_date,
      totalDays: trip.start_date && trip.end_date ? 
        Math.max(1, Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 0,
      status: trip.status || 'upcoming',
      cities: trip.trip_stops?.map((stop: any) => ({
        id: stop.id,
        cityName: stop.cities?.name,
        country: stop.cities?.country,
        daysAllocated: stop.arrival_date && stop.departure_date ? 
            Math.max(1, Math.ceil((new Date(stop.departure_date).getTime() - new Date(stop.arrival_date).getTime()) / (1000 * 60 * 60 * 24))) : 0,
        order: stop.sequence_order,
        coverImage: stop.cities?.cover_image_url,
      })) || [],
      budget: {
        targetBudget: trip.total_budget || 0,
        totalEstimatedCost: 0,
        currency: 'USD',
        status: 'healthy',
        categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 }
      },
      createdAt: trip.created_at,
      updatedAt: trip.updated_at,
    }));
    
    res.json({ status: 'success', data: formattedTrips });
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
    
    // Map to frontend format
    const formattedTrip = {
      id: trip.id,
      userId: trip.owner_id,
      title: trip.title,
      description: trip.description,
      coverImage: trip.cover_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
      startDate: trip.start_date,
      endDate: trip.end_date,
      totalDays: trip.start_date && trip.end_date ? 
        Math.max(1, Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 0,
      status: trip.status || 'upcoming',
      cities: trip.trip_stops?.map((stop: any) => ({
        id: stop.id,
        cityName: stop.cities?.name,
        country: stop.cities?.country,
        daysAllocated: stop.arrival_date && stop.departure_date ? 
            Math.max(1, Math.ceil((new Date(stop.departure_date).getTime() - new Date(stop.arrival_date).getTime()) / (1000 * 60 * 60 * 24))) : 0,
        order: stop.sequence_order,
        coverImage: stop.cities?.cover_image_url,
      })) || [],
      hotels: [] as any[],
      transport: [] as any[],
      itinerary: [] as any[], // We'll need to map itinerary items properly
      budget: {
        targetBudget: trip.total_budget || 0,
        totalEstimatedCost: 0,
        currency: 'USD',
        status: 'healthy',
        categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 }
      },
      createdAt: trip.created_at,
      updatedAt: trip.updated_at,
    };
    
    // Extract itinerary items
    if (trip.itinerary_days) {
      trip.itinerary_days.forEach((day: any) => {
        if (day.itinerary_items) {
          day.itinerary_items.forEach((item: any) => {
             formattedTrip.itinerary.push({
               id: item.id,
               dayNumber: day.day_number,
               date: day.date,
               timeSlot: item.start_time?.substring(0,5) || '09:00',
               duration: '2 hours',
               title: item.title || 'Activity',
               category: item.item_type || 'sightseeing',
               location: 'Unknown',
               estimatedCost: item.cost_amount || 0,
               currency: item.cost_currency || 'USD',
               notes: item.notes,
             } as any);
          });
        }
      });
    }
    
    res.json({ status: 'success', data: formattedTrip });
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { title, description, startDate, endDate, targetBudget, coverImage } = req.body;
    
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        total_budget: targetBudget || 0,
        cover_image_url: coverImage,
        owner_id: req.user!.id // Extracted from verified JWT
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // If initialCity is provided, we should probably map it to a trip_stop, 
    // but for now let's just return the created trip and let frontend format it.
    
    const formattedTrip = {
      id: trip.id,
      userId: trip.owner_id,
      title: trip.title,
      description: trip.description,
      startDate: trip.start_date,
      endDate: trip.end_date,
      budget: { targetBudget: trip.total_budget },
      createdAt: trip.created_at,
      cities: [] as any[],
      hotels: [] as any[],
      transport: [] as any[],
      itinerary: [] as any[],
    };
    
    res.status(201).json({ status: 'success', data: formattedTrip });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    // Assuming req.body contains mapped frontend fields, we need to map them back to backend fields if necessary.
    // E.g., title -> title, targetBudget -> total_budget
    const updates: any = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.startDate !== undefined) updates.start_date = req.body.startDate;
    if (req.body.endDate !== undefined) updates.end_date = req.body.endDate;
    
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json({ status: 'success', data });
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
    
    res.json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
