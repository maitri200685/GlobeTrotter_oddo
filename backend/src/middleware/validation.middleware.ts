import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // We assume the schema might validate body, query, and params
      const validData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      // Optionally re-assign validated data
      if (validData.body !== undefined) req.body = validData.body;
      // Object.assign is safer for query and params
      if (validData.query !== undefined) Object.assign(req.query, validData.query);
      if (validData.params !== undefined) Object.assign(req.params, validData.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Validation failed', error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
};
