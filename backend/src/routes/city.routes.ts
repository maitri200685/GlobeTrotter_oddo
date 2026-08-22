import { Router } from 'express';
import { getCities, getCityById } from '../controllers/city.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Assuming cities are public but requireAuth is safe if we strictly want logged-in users only.
// Let's use requireAuth for all for now, to ensure consistency and use of getAuthSupabaseClient.
router.get('/', requireAuth, getCities);
router.get('/:id', requireAuth, getCityById);

export default router;
