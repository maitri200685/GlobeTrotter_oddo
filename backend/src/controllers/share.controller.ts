import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { z } from 'zod';

const generateShareSchema = z.object({
  tripId: z.string().uuid(),
});

const updatePrivacySchema = z.object({
  privacy: z.enum(['private', 'friends', 'public']),
});

export const getShareMeta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const supabase = getAuthSupabaseClient(req.token!);

    // Fetch trip to verify access
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, visibility, created_at')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return res.status(403).json({ status: 'error', message: 'Not authorized or not found' });
    }

    res.json({
      status: 'success',
      data: {
        shareId: tripId,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${tripId}`,
        privacy: trip.visibility,
        createdAt: trip.created_at,
        views: 0,
        clones: 0,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrivacy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const { privacy } = updatePrivacySchema.parse(req.body);
    const supabase = getAuthSupabaseClient(req.token!);

    const { error: updateError } = await supabase
      .from('trips')
      .update({ visibility: privacy })
      .eq('id', tripId);

    if (updateError) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update privacy' });
    }

    res.json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const cloneSharedTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shareId } = req.params;
    const supabase = getAuthSupabaseClient(req.token!);
    
    // We must use admin client to fetch the trip if it's public but not owned by the requester
    // However, if the trip is public, RLS allows SELECT. Let's just use auth client.
    
    const { data: sourceTrip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', shareId)
      .single();

    if (tripError || !sourceTrip) {
      return res.status(404).json({ status: 'error', message: 'Shared trip not found' });
    }
    
    if (sourceTrip.visibility === 'private' && sourceTrip.owner_id !== req.user!.id) {
       return res.status(403).json({ status: 'error', message: 'Trip is private' });
    }

    // 1. Clone Trip
    const { data: newTrip, error: createError } = await supabase
      .from('trips')
      .insert({
        owner_id: req.user!.id,
        title: `${sourceTrip.title} (Copy)`,
        description: sourceTrip.description,
        cover_image_url: sourceTrip.cover_image_url,
        start_date: sourceTrip.start_date,
        end_date: sourceTrip.end_date,
        total_budget: sourceTrip.total_budget,
        status: 'draft',
        visibility: 'private',
      })
      .select('id')
      .single();

    if (createError || !newTrip) {
      throw new Error('Failed to clone trip');
    }

    res.json({ status: 'success', data: { tripId: newTrip.id } });
  } catch (error) {
    next(error);
  }
};
