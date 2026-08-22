/**
 * budgetService.ts
 * Frontend budget service abstraction.
 * Calculates costs, validates budget health, and manages budget mutations.
 * 
 * Backend integration point: GET/PATCH /api/trips/:id/budget
 */

import type { TripBudget } from '@/types/trip.types';

export type BudgetStatus = 'healthy' | 'warning' | 'exceeded';

export interface BudgetAnalysis {
  totalTarget: number;
  totalEstimated: number;
  remaining: number;
  usagePercent: number;
  status: BudgetStatus;
  perPersonCost: number;
  dailyAverage: number;
  savings: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
}

export interface BudgetAlert {
  type: 'over_budget' | 'near_limit' | 'savings_opportunity';
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestedAction?: string;
}

class BudgetService {
  /**
   * Analyze trip budget and return comprehensive metrics.
   */
  analyzeBudget(budget: TripBudget, travelers: number, totalDays: number): BudgetAnalysis {
    const totalTarget = budget.targetBudget || 1;
    const totalEstimated = budget.totalEstimatedCost || 0;
    const remaining = totalTarget - totalEstimated;
    const usagePercent = Math.min(200, Math.round((totalEstimated / totalTarget) * 100));

    const status: BudgetStatus =
      usagePercent <= 80 ? 'healthy' : usagePercent <= 100 ? 'warning' : 'exceeded';

    const perPersonCost = travelers > 0 ? Math.round(totalEstimated / travelers) : totalEstimated;
    const dailyAverage = totalDays > 0 ? Math.round(totalEstimated / totalDays) : totalEstimated;

    const cats = budget.categories || { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 };
    const totalCategorized = Object.values(cats).reduce((a, b) => a + b, 0) || 1;

    const categoryBreakdown = [
      { category: 'Accommodation', amount: cats.accommodation, color: '#9333EA' },
      { category: 'Transport', amount: cats.transport, color: '#0EA5E9' },
      { category: 'Activities', amount: cats.activities, color: '#14B8A6' },
      { category: 'Food', amount: cats.food, color: '#F59E0B' },
      { category: 'Other', amount: cats.other, color: '#F43F5E' },
    ].map((c) => ({
      ...c,
      percentage: Math.round((c.amount / totalCategorized) * 100),
    }));

    return {
      totalTarget,
      totalEstimated,
      remaining,
      usagePercent,
      status,
      perPersonCost,
      dailyAverage,
      savings: Math.max(0, remaining),
      categoryBreakdown,
    };
  }

  /**
   * Generate budget alerts for a trip.
   */
  getAlerts(analysis: BudgetAnalysis): BudgetAlert[] {
    const alerts: BudgetAlert[] = [];

    if (analysis.status === 'exceeded') {
      alerts.push({
        type: 'over_budget',
        message: `You're ${Math.abs(analysis.remaining).toLocaleString()} over your target budget.`,
        severity: 'error',
        suggestedAction: 'Ask AI to suggest cost-cutting alternatives.',
      });
    } else if (analysis.status === 'warning') {
      alerts.push({
        type: 'near_limit',
        message: `You've used ${analysis.usagePercent}% of your budget. Consider reviewing expenses.`,
        severity: 'warning',
        suggestedAction: 'Check if any category can be reduced.',
      });
    }

    if (analysis.savings > 0 && analysis.usagePercent < 70) {
      alerts.push({
        type: 'savings_opportunity',
        message: `You have ${analysis.savings.toLocaleString()} of budget remaining — consider upgrading your hotel or adding an experience!`,
        severity: 'info',
        suggestedAction: 'Ask AI for upgrade suggestions within your budget.',
      });
    }

    return alerts;
  }

  /**
   * Recalculate totals from category breakdown.
   */
  recalculateTotal(categories: TripBudget['categories']): number {
    return Object.values(categories).reduce((a, b) => a + b, 0);
  }

  /**
   * Format currency amount.
   */
  formatAmount(amount: number, currency: string): string {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;
    return `${symbol}${amount.toLocaleString()}`;
  }
}

export const budgetService = new BudgetService();
