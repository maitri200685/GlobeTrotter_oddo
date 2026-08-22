import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { AssistantService } from '../services/assistant.service';
import { z } from 'zod';

const assistantRequestSchema = z.object({
  message: z.string().min(1)
});

export const processAssistantRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    if (!tripId) {
      return res.status(400).json({ status: 'error', message: 'tripId is required' });
    }

    const validatedData = assistantRequestSchema.parse(req.body);
    const supabase = getAuthSupabaseClient(req.token!);

    // Verify access to trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access to the specified trip.'
      });
    }

    const context = {
      userId: req.user!.id,
      token: req.token!,
      tripId: tripId,
      supabase: supabase
    };

    const assistantService = new AssistantService();
    const result = await assistantService.processRequest(validatedData.message, context);

    res.json({
      status: 'success',
      data: {
        intent: result.intent,
        message: result.message,
        status: result.status
      }
    });
  } catch (error) {
    next(error);
  }
};
