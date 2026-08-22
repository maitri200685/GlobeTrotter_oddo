import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { processAssistantRequest } from '../controllers/assistant.controller';

const router = Router();

router.use(requireAuth);

router.post('/:tripId/assistant', processAssistantRequest);

export default router;
