import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  ArrowRight,
  DollarSign,
  Hotel,
  Plane,
  Utensils,
  Footprints,
  ShoppingBag,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTrip } from '@/context/TripContext';

export const TripBudgetPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, selectTrip, activeTrip } = useTrip();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  if (!currentTrip) return null;

  const budget = currentTrip.budget;
  const totalEstimated = budget.totalEstimatedCost || 0;
  const totalTarget = budget.targetBudget || 1;
  const currency = budget.currency === 'INR' ? '₹' : '$';
  const usagePercent = Math.min(100, Math.round((totalEstimated / totalTarget) * 100));
  const isHealthy = usagePercent <= 80;
  const isWarning = usagePercent > 80 && usagePercent <= 100;
  const isExceeded = usagePercent > 100;
  const remaining = totalTarget - totalEstimated;

  const categories = [
    {
      key: 'accommodation',
      label: 'Hotel Stays',
      icon: Hotel,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      amount: budget.categories?.accommodation || 0,
    },
    {
      key: 'transport',
      label: 'Flights & Transit',
      icon: Plane,
      color: 'bg-sky-500',
      lightColor: 'bg-sky-100',
      textColor: 'text-sky-700',
      amount: budget.categories?.transport || 0,
    },
    {
      key: 'food',
      label: 'Food & Dining',
      icon: Utensils,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      amount: budget.categories?.food || 0,
    },
    {
      key: 'activities',
      label: 'Tours & Activities',
      icon: Footprints,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-100',
      textColor: 'text-teal-700',
      amount: budget.categories?.activities || 0,
    },
    {
      key: 'other',
      label: 'Other & Extras',
      icon: ShoppingBag,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-100',
      textColor: 'text-rose-700',
      amount: budget.categories?.other || 0,
    },
  ].filter((c) => c.amount > 0 || c.key === 'accommodation' || c.key === 'transport');

  const totalCategorized = categories.reduce((sum, c) => sum + c.amount, 0);
  const perPersonCost = currentTrip.travelerCount > 0
    ? Math.round(totalEstimated / currentTrip.travelerCount)
    : totalEstimated;

  // Daily expense data (estimated per day)
  const dailyExpenses = Array.from({ length: currentTrip.totalDays }, (_, i) => {
    const day = i + 1;
    const dayItems = currentTrip.itinerary.filter((item) => item.dayNumber === day);
    const dayTotal = dayItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    return { day, amount: dayTotal };
  });

  const maxDayExpense = Math.max(...dailyExpenses.map((d) => d.amount), 1);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">

      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Budget & Cost Breakdown
            </h1>
            <Badge
              variant={isHealthy ? 'success' : isWarning ? 'amber' : 'terracotta'}
              size="xs"
            >
              {isHealthy ? '✅ Healthy' : isWarning ? '⚠️ Near Limit' : '🚨 Over Budget'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Target vs Estimated costs with per-person split and daily expense breakdown.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/trips/${currentTrip.id}/assistant`)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Ask AI to Optimize Budget
        </Button>
      </div>

      {/* 2. BUDGET HEALTH GAUGE ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Budget */}
        <Card variant="default" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Budget</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {currency}{totalTarget.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">Total travel budget</p>
        </Card>

        {/* Estimated Cost */}
        <Card variant="default" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Cost</span>
            <TrendingUp className={`w-4 h-4 ${isExceeded ? 'text-rose-500' : 'text-teal-500'}`} />
          </div>
          <p className={`text-2xl font-extrabold font-display ${isExceeded ? 'text-rose-600' : 'text-slate-900'}`}>
            {currency}{totalEstimated.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">{usagePercent}% of budget used</p>
        </Card>

        {/* Remaining */}
        <Card variant="default" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {remaining >= 0 ? 'Remaining' : 'Over Budget'}
            </span>
            {remaining >= 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <p className={`text-2xl font-extrabold font-display ${remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {remaining >= 0 ? '+' : ''}{currency}{Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            {remaining >= 0 ? 'Available buffer left' : 'Exceeds target'}
          </p>
        </Card>

        {/* Per Person */}
        <Card variant="default" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Per Person</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {currency}{perPersonCost.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">Split across {currentTrip.travelerCount} travelers</p>
        </Card>
      </div>

      {/* 3. MASTER BUDGET PROGRESS BAR */}
      <Card variant="default" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Budget Health Meter</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Estimated spend vs target budget across all categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isHealthy && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {isExceeded && <XCircle className="w-5 h-5 text-rose-500" />}
            <span className={`text-sm font-extrabold ${isHealthy ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-rose-600'}`}>
              {usagePercent}%
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isHealthy ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
              isWarning ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
              'bg-gradient-to-r from-rose-500 to-rose-600'
            }`}
            style={{ width: `${Math.min(100, usagePercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{currency}0</span>
          <span className="font-semibold">Budget Limit: {currency}{totalTarget.toLocaleString()}</span>
        </div>
      </Card>

      {/* 4. SPLIT LAYOUT: DONUT CHART + CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* SVG Donut Chart */}
        <Card variant="default" className="lg:col-span-2 p-6 flex flex-col items-center space-y-4">
          <h3 className="text-sm font-bold text-slate-900 self-start">Spend Breakdown</h3>

          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {(() => {
                let offset = 0;
                return categories.map((cat, idx) => {
                  const percent = totalCategorized > 0 ? (cat.amount / totalCategorized) * 100 : 0;
                  const colors = ['#9333EA', '#0EA5E9', '#F59E0B', '#14B8A6', '#F43F5E', '#94A3B8'];
                  const dashArray = `${percent} ${100 - percent}`;
                  const dashOffset = 100 - offset;
                  offset += percent;

                  return (
                    <circle
                      key={cat.key}
                      cx="50" cy="50" r="15.9"
                      fill="none"
                      stroke={colors[idx % colors.length]}
                      strokeWidth="8"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      style={{ transition: 'stroke-dasharray 0.5s ease' }}
                    />
                  );
                });
              })()}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-slate-900 font-display">
                {currency}{Math.round(totalCategorized / 1000)}K
              </span>
              <span className="text-[10px] text-slate-500">Total Spend</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2">
            {categories.map((cat) => {
              const pct = totalCategorized > 0 ? Math.round((cat.amount / totalCategorized) * 100) : 0;
              return (
                <div key={cat.key} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                    <span className="text-slate-700 font-medium">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{pct}%</span>
                    <span className="font-bold text-slate-900">{currency}{cat.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Category Progress Bars */}
        <Card variant="default" className="lg:col-span-3 p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900">Category Cost Tracker</h3>

          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const pct = totalTarget > 0 ? Math.min(100, Math.round((cat.amount / totalTarget) * 100)) : 0;

            return (
              <div key={cat.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-xl ${cat.lightColor} ${cat.textColor} flex items-center justify-center`}>
                      <CatIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{cat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">
                      {currency}{cat.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">({pct}% of budget)</span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* 5. DAILY EXPENSE BAR CHART */}
      <Card variant="default" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daily Activity Expense Chart</h3>
            <p className="text-[11px] text-slate-500">Cost of scheduled activities per day (excl. hotel & transit).</p>
          </div>
          <Badge variant="neutral" size="xs">{currentTrip.totalDays} Days</Badge>
        </div>

        <div className="flex items-end gap-2 h-36 pt-2">
          {dailyExpenses.map(({ day, amount }) => {
            const heightPct = maxDayExpense > 0 ? Math.max(4, (amount / maxDayExpense) * 100) : 4;
            const isHigh = amount === Math.max(...dailyExpenses.map((d) => d.amount));

            return (
              <div key={day} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-600">
                  {amount > 0 ? `${currency}${(amount / 1000).toFixed(1)}K` : '–'}
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isHigh ? 'bg-terracotta-500' : 'bg-teal-400'
                  }`}
                  style={{ height: `${heightPct}%` }}
                  title={`Day ${day}: ${currency}${amount.toLocaleString()}`}
                />
                <span className="text-[10px] text-slate-500 font-medium">D{day}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 6. PER PERSON COST SPLIT */}
      <Card variant="default" className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          <span>Per Person Cost Split ({currentTrip.travelerCount} Travelers)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const perPerson = currentTrip.travelerCount > 0
              ? Math.round(cat.amount / currentTrip.travelerCount)
              : cat.amount;

            return (
              <div
                key={cat.key}
                className={`p-3 rounded-2xl border border-slate-200 ${cat.lightColor} text-center space-y-1.5`}
              >
                <div className={`w-8 h-8 rounded-xl ${cat.color} text-white flex items-center justify-center mx-auto`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-semibold text-slate-600 leading-tight">{cat.label}</p>
                <p className={`text-sm font-extrabold ${cat.textColor}`}>
                  {currency}{perPerson.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">per person</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-sand-50 border border-teal-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-700">Total Per Person (All Categories)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{currentTrip.totalDays} days • {currentTrip.travelerCount} travelers</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-slate-900 font-display">
              {currency}{perPersonCost.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">per person total</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
