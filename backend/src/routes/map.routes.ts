import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getRoute } from '../controllers/map.controller';

const router = Router();

router.use(requireAuth);

router.post('/route', getRoute);

export default router;
