import { Router } from 'express';
import { getBudgetSummary, addExpense, updateExpense, deleteExpense } from '../controllers/budget.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All budget routes require authentication
router.use(requireAuth);

router.get('/:tripId/budget', getBudgetSummary);
router.post('/:tripId/budget/items', addExpense);
router.patch('/:tripId/budget/items/:itemId', updateExpense);
router.delete('/:tripId/budget/items/:itemId', deleteExpense);

export default router;
