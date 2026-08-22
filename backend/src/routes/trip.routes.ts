import { Router } from 'express';
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip } from '../controllers/trip.controller';
import { getShareMeta, updatePrivacy } from '../controllers/share.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth); // All trip routes require auth

router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);

router.get('/:tripId/share', getShareMeta);
router.patch('/:tripId/privacy', updatePrivacy);

export default router;
