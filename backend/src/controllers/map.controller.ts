import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { MapService } from '../services/map.service';

const routeSchema = z.object({
  origin: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number()
  })
});

export const getRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = routeSchema.parse(req.body);
    const mapService = new MapService();
    
    const routeData = await mapService.getRoute(validatedData.origin, validatedData.destination);
    
    res.json({
      status: 'success',
      data: routeData
    });
  } catch (error) {
    next(error);
  }
};
