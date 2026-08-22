import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';

export const getActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    let query = supabase
      .from('activities')
      .select('*, cities(name, country, region)')
      .order('name');
    
    if (req.query.city_id) {
      query = query.eq('city_id', req.query.city_id);
    }

    if (req.query.city_name) {
      const { data: city } = await supabase
        .from('cities')
        .select('id')
        .ilike('name', `%${req.query.city_name}%`)
        .single();
      if (city) query = query.eq('city_id', city.id);
    }

    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Map to frontend Activity type
    const activities = (data || []).map((a: any) => ({
      id: a.id,
      title: a.name,
      cityName: a.cities?.name || '',
      country: a.cities?.country || '',
      category: a.category || 'other',
      estimatedCost: a.estimated_cost || 0,
      currency: 'INR',
      durationMinutes: a.duration_minutes || 120,
      description: a.description || '',
      images: [a.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'],
      latitude: a.latitude,
      longitude: a.longitude,
      rating: 4.5,
    }));
    
    res.json({ status: 'success', data: activities });
  } catch (error) {
    next(error);
  }
};
