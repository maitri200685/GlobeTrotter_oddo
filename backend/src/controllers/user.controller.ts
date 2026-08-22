import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { z } from 'zod';

const updatePreferencesSchema = z.object({
  preferred_currency: z.string().optional(),
  travel_style: z.string().optional(),
  dietary_restrictions: z.string().optional(),
  accommodation_preference: z.string().optional(),
});

export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = getAuthSupabaseClient(req.token!);

    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', req.user!.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found, return default
        return res.json({
          status: 'success',
          data: { preferred_currency: 'USD' }
        });
      }
      throw error;
    }

    res.json({
      status: 'success',
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = updatePreferencesSchema.parse(req.body);
    const supabase = getAuthSupabaseClient(req.token!);

    // Upsert since it might not exist if trigger failed
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: req.user!.id,
        ...updates
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};
