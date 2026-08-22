import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { getAdminSupabaseClient } from '../config/supabase';

export const healthCheck = (req: Request, res: Response) => {
  res.json(sendSuccess({ status: 'ok', service: 'globetrotter-backend' }));
};

export const readinessCheck = async (req: Request, res: Response, next: import('express').NextFunction) => {
  try {
    // Verify Supabase connectivity
    const supabase = getAdminSupabaseClient();
    // A simple query to ensure connectivity. 
    // We limit to 1 so it's extremely fast and lightweight.
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    res.json(sendSuccess({ status: 'ready', database: 'connected' }));
  } catch (error) {
    next(error);
  }
};
