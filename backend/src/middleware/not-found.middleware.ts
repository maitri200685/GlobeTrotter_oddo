import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
