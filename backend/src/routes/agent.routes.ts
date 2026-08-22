import { Router } from 'express';
import { chatWithAgent } from '../controllers/agent.controller';
import { requireAuth } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { status: 'error', message: 'Too many AI requests from this IP, please try again after 15 minutes' }
});

const router = Router();

// All agent routes require authentication
router.use(requireAuth);

router.post('/chat', aiRateLimiter, chatWithAgent);

export default router;
