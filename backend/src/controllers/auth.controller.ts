import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const getMe = (req: Request, res: Response) => {
  // req.user is guaranteed to exist because of requireAuth middleware
  res.json(
    sendSuccess({
      user: {
        id: req.user!.id,
        email: req.user!.email,
      },
    })
  );
};
