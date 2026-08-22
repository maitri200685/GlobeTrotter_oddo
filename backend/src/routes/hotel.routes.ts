import { Router } from 'express';
import { getHotels } from '../controllers/hotel.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getHotels);

export default router;
