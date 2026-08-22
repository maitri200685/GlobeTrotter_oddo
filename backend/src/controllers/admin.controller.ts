import { Request, Response, NextFunction } from 'express';
import { getAdminSupabaseClient, getAuthSupabaseClient } from '../config/supabase';
import { UnauthorizedError } from '../utils/errors';

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user!.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      throw new UnauthorizedError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAdminSupabaseClient(); // Use admin client for global aggregation

    // Parallel counts
    const [usersRes, tripsRes, citiesRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('trips').select('*', { count: 'exact', head: true }),
      supabase.from('cities').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      status: 'success',
      data: {
        totalUsers: usersRes.count || 0,
        activeTrips: tripsRes.count || 0,
        destinations: citiesRes.count || 0,
        aiTokensUsed: 0, // Placeholder
      }
    });
  } catch (error) {
    next(error);
  }
};
