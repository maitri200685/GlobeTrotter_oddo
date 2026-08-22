import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { AgentService } from '../agent/agent.service';
import { AgentState } from '../agent/agent.types';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1),
  tripId: z.string().uuid().optional(),
});

export const chatWithAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = chatSchema.parse(req.body);
    const supabase = getAuthSupabaseClient(req.token!);
    
    // Validate trip access if tripId is provided
    if (validatedData.tripId) {
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('id')
        .eq('id', validatedData.tripId)
        .single();
        
      if (tripError || !trip) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized access to the specified trip.'
        });
      }
    }

    const initialState: AgentState = {
      userId: req.user!.id,
      request: validatedData.message,
      tripId: validatedData.tripId,
      iteration: 0,
      status: 'executing',
      observations: []
    };

    const context = {
      userId: req.user!.id,
      token: req.token!,
      tripId: validatedData.tripId,
      supabase: supabase
    };

    const agentService = new AgentService();
    const finalState = await agentService.runAgentLoop(initialState, context);
    
    res.json({
      status: 'success',
      data: {
        message: finalState.finalResponse,
        observations: finalState.observations,
        status: finalState.status,
        iteration: finalState.iteration
      }
    });
  } catch (error) {
    next(error);
  }
};
