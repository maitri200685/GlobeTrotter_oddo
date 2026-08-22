import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn({ err, reqId: req.reqId }, `AppError: ${err.message}`);
    return res.status(err.statusCode).json(sendError(err.code, err.message, (err as any).details));
  }

  // Unhandled internal errors
  logger.error({ err, reqId: req.reqId }, 'Unhandled Internal Server Error');
  return res.status(500).json(sendError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'));
};
