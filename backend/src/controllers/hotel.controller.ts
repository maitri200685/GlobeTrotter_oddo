import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';

export const getHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    let query = supabase
      .from('hotels')
      .select('*, cities(name, country, region)')
      .order('name');
    
    if (req.query.city_id) {
      query = query.eq('city_id', req.query.city_id);
    }

    if (req.query.city_name) {
      // Support searching by city name via join
      const { data: city } = await supabase
        .from('cities')
        .select('id')
        .ilike('name', `%${req.query.city_name}%`)
        .single();
      if (city) query = query.eq('city_id', city.id);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Map to frontend Hotel type
    const hotels = (data || []).map((h: any) => ({
      id: h.id,
      name: h.name,
      cityName: h.cities?.name || '',
      country: h.cities?.country || '',
      address: h.address || `${h.cities?.name}, ${h.cities?.country}`,
      rating: h.rating || 4.0,
      pricePerNight: h.price_per_night || 0,
      currency: 'INR',
      amenities: h.amenities || [],
      images: [h.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
      description: h.description || '',
      latitude: h.latitude,
      longitude: h.longitude,
    }));
    
    res.json({ status: 'success', data: hotels });
  } catch (error) {
    next(error);
  }
};
