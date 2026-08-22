import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { processAssistantRequest } from '../controllers/assistant.controller';
import rateLimit from 'express-rate-limit';

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: 'error', message: 'Too many AI requests, please try again later' }
});

const router = Router();

router.use(requireAuth);

router.post('/:tripId/assistant', aiRateLimiter, processAssistantRequest);

export default router;
