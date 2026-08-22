import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getTimeline, getCalendarEvents } from '../controllers/timeline.controller';

const router = Router();

router.use(requireAuth);

router.get('/:tripId/timeline', getTimeline);
router.get('/:tripId/calendar', getCalendarEvents);

export default router;
