import { Router } from 'express';
import { getPreferences, updatePreferences } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/me/preferences', getPreferences);
router.patch('/me/preferences', updatePreferences);

export default router;
