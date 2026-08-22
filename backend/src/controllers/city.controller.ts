import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient, getAdminSupabaseClient } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export const getCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Cities can be public, but we use the token if available. 
    // Wait, some pages might need cities without login? Let's use auth client if token, else admin?
    // Actually, requireAuth will ensure we have a token.
    const supabase = getAuthSupabaseClient(req.token!);
    
    let query = supabase.from('cities').select('*').order('name');
    
    if (req.query.region) {
      query = query.eq('region', req.query.region);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getCityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('City not found');
      }
      throw error;
    }
    
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
