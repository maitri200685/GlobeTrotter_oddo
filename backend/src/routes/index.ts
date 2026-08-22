import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import cityRoutes from './city.routes';
import hotelRoutes from './hotel.routes';
import activityRoutes from './activity.routes';
import tripRoutes from './trip.routes';
import budgetRoutes from './budget.routes';
import agentRoutes from './agent.routes';
import assistantRoutes from './assistant.routes';
import timelineRoutes from './timeline.routes';
import mapRoutes from './map.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/cities', cityRoutes);
router.use('/hotels', hotelRoutes);
router.use('/activities', activityRoutes);
router.use('/trips', tripRoutes);
router.use('/trips', budgetRoutes);
router.use('/trips', assistantRoutes); // Assistant also scoped under trips
router.use('/trips', timelineRoutes);
router.use('/agent', agentRoutes);
router.use('/maps', mapRoutes);

export default router;
