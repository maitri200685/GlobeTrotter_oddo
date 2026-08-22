import { Request, Response, NextFunction } from 'express';
import { getAdminSupabaseClient } from '../config/supabase';
import { UnauthorizedError } from '../utils/errors';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Missing Authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid Authorization header format. Expected "Bearer <token>"');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Missing token in Authorization header');
    }

    // Use admin client to strictly verify the token using Supabase Auth
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Attach verified user and token to request
    req.user = data.user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};
