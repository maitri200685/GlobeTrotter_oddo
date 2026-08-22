import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export const getHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    let query = supabase.from('hotels').select('*').order('hotel_name');
    
    if (req.query.city_id) {
      query = query.eq('city_id', req.query.city_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
