import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.reqId = reqId as string;
  res.setHeader('X-Request-Id', req.reqId);
  next();
};
