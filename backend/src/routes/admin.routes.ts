import { Router } from 'express';
import { getAnalyticsOverview, checkAdmin } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// First require general authentication
router.use(requireAuth);
// Then verify admin role
router.use(checkAdmin);

router.get('/analytics/overview', getAnalyticsOverview);

export default router;
