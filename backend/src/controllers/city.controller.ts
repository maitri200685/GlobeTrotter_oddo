import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export const getCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    let query = supabase.from('cities').select('*').order('popularity', { ascending: false });
    
    if (req.query.region) {
      query = query.eq('region', req.query.region);
    }

    if (req.query.q) {
      query = query.ilike('name', `%${req.query.q}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Map to frontend City type
    const cities = (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      country: c.country,
      countryCode: c.country_code,
      region: c.region,
      latitude: c.latitude,
      longitude: c.longitude,
      description: c.description,
      coverImage: c.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      popularity: c.popularity,
      costIndex: c.cost_index,
    }));
    
    res.json({ status: 'success', data: cities });
  } catch (error) {
    next(error);
  }
};

export const getCityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { data, error } = await supabase
      .from('cities')
      .select('*, hotels(*), activities(*)')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('City not found');
      throw error;
    }
    
    res.json({ status: 'success', data: {
      id: data.id,
      name: data.name,
      country: data.country,
      countryCode: data.country_code,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      coverImage: data.image_url,
      popularity: data.popularity,
      costIndex: data.cost_index,
    }});
  } catch (error) {
    next(error);
  }
};
