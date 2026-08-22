import { SupabaseClient } from '@supabase/supabase-js';

export interface ExpenseDTO {
  id?: string;
  trip_id: string;
  category: 'transport' | 'accommodation' | 'activities' | 'food' | 'other';
  amount: number;
  expense_date?: string;
  description?: string;
  is_estimated?: boolean;
}

export interface BudgetSummary {
  targetBudget: number;
  totalEstimatedCost: number;
  currency: string;
  status: 'healthy' | 'warning' | 'over_budget';
  categories: {
    transport: number;
    accommodation: number;
    activities: number;
    food: number;
    other: number;
  };
}

export class BudgetService {
  constructor(private supabase: SupabaseClient) {}

  async getBudgetSummary(tripId: string): Promise<BudgetSummary> {
    // 1. Fetch trip total_budget
    const { data: tripData, error: tripError } = await this.supabase
      .from('trips')
      .select('total_budget')
      .eq('id', tripId)
      .single();

    if (tripError) throw tripError;
    const targetBudget = tripData.total_budget || 0;

    // 2. Fetch all expenses
    const { data: expenses, error: expensesError } = await this.supabase
      .from('expenses')
      .select('amount, category')
      .eq('trip_id', tripId);

    if (expensesError) throw expensesError;

    // 3. Deterministic calculation
    const categories = {
      transport: 0,
      accommodation: 0,
      activities: 0,
      food: 0,
      other: 0,
    };

    let totalEstimatedCost = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      totalEstimatedCost += amount;
      
      const category = expense.category as keyof typeof categories;
      if (categories[category] !== undefined) {
        categories[category] += amount;
      } else {
        categories.other += amount;
      }
    });

    let status: 'healthy' | 'warning' | 'over_budget' = 'healthy';
    if (targetBudget > 0) {
      if (totalEstimatedCost > targetBudget) {
        status = 'over_budget';
      } else if (totalEstimatedCost > targetBudget * 0.9) {
        status = 'warning';
      }
    }

    return {
      targetBudget,
      totalEstimatedCost,
      currency: 'USD',
      status,
      categories,
    };
  }

  async addExpense(expense: ExpenseDTO) {
    if (expense.amount < 0) {
      throw new Error('Expense amount cannot be negative');
    }

    const { data, error } = await this.supabase
      .from('expenses')
      .insert({
        trip_id: expense.trip_id,
        category: expense.category,
        amount: expense.amount,
        expense_date: expense.expense_date,
        description: expense.description,
        is_estimated: expense.is_estimated ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateExpense(id: string, updates: Partial<ExpenseDTO>) {
    if (updates.amount !== undefined && updates.amount < 0) {
      throw new Error('Expense amount cannot be negative');
    }

    const { data, error } = await this.supabase
      .from('expenses')
      .update({
        category: updates.category,
        amount: updates.amount,
        expense_date: updates.expense_date,
        description: updates.description,
        is_estimated: updates.is_estimated,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteExpense(id: string) {
    const { error } = await this.supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
