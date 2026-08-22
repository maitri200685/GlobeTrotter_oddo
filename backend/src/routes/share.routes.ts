import { Router } from 'express';
import { cloneSharedTrip } from '../controllers/share.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/:shareId/clone', cloneSharedTrip);

export default router;
