import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import cityRoutes from './city.routes';
import hotelRoutes from './hotel.routes';
import activityRoutes from './activity.routes';
import tripRoutes from './trip.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/cities', cityRoutes);
router.use('/hotels', hotelRoutes);
router.use('/activities', activityRoutes);
router.use('/trips', tripRoutes);

export default router;
