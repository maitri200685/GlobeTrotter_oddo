import { Request, Response, NextFunction } from 'express';
import { getAuthSupabaseClient } from '../config/supabase';
import { BudgetService } from '../services/budget.service';
import { NotFoundError } from '../utils/errors';
import { z } from 'zod';

const expenseSchema = z.object({
  trip_id: z.string().uuid(),
  category: z.enum(['transport', 'accommodation', 'activities', 'food', 'other']),
  amount: z.number().min(0),
  expense_date: z.string().optional(),
  description: z.string().optional(),
  is_estimated: z.boolean().optional(),
});

const updateExpenseSchema = z.object({
  category: z.enum(['transport', 'accommodation', 'activities', 'food', 'other']).optional(),
  amount: z.number().min(0).optional(),
  expense_date: z.string().optional(),
  description: z.string().optional(),
  is_estimated: z.boolean().optional(),
});

export const getBudgetSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    const supabase = getAuthSupabaseClient(req.token!);
    
    // RLS validation: Ensure user can read the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new NotFoundError('Trip not found or unauthorized');
    }

    const budgetService = new BudgetService(supabase);
    const summary = await budgetService.getBudgetSummary(tripId);
    
    res.json({ status: 'success', data: summary });
  } catch (error) {
    next(error);
  }
};

export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    const validatedData = expenseSchema.parse({ ...req.body, trip_id: tripId });
    
    const supabase = getAuthSupabaseClient(req.token!);
    
    // RLS validation is handled implicitly if RLS is correctly set up for INSERT,
    // but we can also explicitly check if they can access the trip:
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new NotFoundError('Trip not found or unauthorized');
    }

    const budgetService = new BudgetService(supabase);
    const expense = await budgetService.addExpense(validatedData);
    
    res.status(201).json({ status: 'success', data: expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    const itemId = req.params.itemId as string;
    const validatedData = updateExpenseSchema.parse(req.body);
    
    const supabase = getAuthSupabaseClient(req.token!);
    
    // Check trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new NotFoundError('Trip not found or unauthorized');
    }

    const budgetService = new BudgetService(supabase);
    const expense = await budgetService.updateExpense(itemId, validatedData);
    
    res.json({ status: 'success', data: expense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.tripId as string;
    const itemId = req.params.itemId as string;
    
    const supabase = getAuthSupabaseClient(req.token!);
    
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new NotFoundError('Trip not found or unauthorized');
    }

    const budgetService = new BudgetService(supabase);
    await budgetService.deleteExpense(itemId);
    
    res.json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
