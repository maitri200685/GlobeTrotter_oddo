import { Router } from 'express';
import { chatWithAgent } from '../controllers/agent.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All agent routes require authentication
router.use(requireAuth);

router.post('/chat', chatWithAgent);

export default router;
