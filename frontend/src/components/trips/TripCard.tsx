import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Users, 
  MapPin, 
  MoreVertical, 
  Copy, 
  Share2, 
  Trash2, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Wallet,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Trip } from '@/types/trip.types';

interface TripCardProps {
  trip: Trip;
  viewMode?: 'grid' | 'list';
  onDuplicate?: (id: string) => void;
  onDeleteRequest?: (trip: Trip) => void;
  onShare?: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  viewMode = 'grid',
  onDuplicate,
  onDeleteRequest,
  onShare,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusBadgeVariants = {
    upcoming: 'teal' as const,
    past: 'neutral' as const,
    draft: 'amber' as const,
  };

  const statusLabels = {
    upcoming: 'Upcoming',
    past: 'Completed',
    draft: 'Draft Plan',
  };

  const budgetRatio = trip.budget.targetBudget > 0 ? (trip.budget.totalEstimatedCost / trip.budget.targetBudget) : 0;
  const isOverBudget = budgetRatio > 1.0;
  const isNearBudget = budgetRatio >= 0.85 && !isOverBudget;

  const budgetVariant = isOverBudget ? 'danger' : isNearBudget ? 'amber' : 'success';

  const citiesList = trip.cities.map((c) => c.cityName).join(', ') || 'Custom Destinations';

  if (viewMode === 'list') {
    return (
      <Card
        hoverable
        className="w-full transition-all duration-200 cursor-pointer overflow-hidden border border-slate-200/90 shadow-2xs hover:border-terracotta-300"
        onClick={() => navigate(`/trips/${trip.id}`)}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 relative">
              <img
                src={trip.coverImage}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 left-1.5">
                <Badge variant={statusBadgeVariants[trip.status]} size="xs">
                  {statusLabels[trip.status]}
                </Badge>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-base font-bold text-slate-900 truncate hover:text-terracotta-600 transition-colors">
                {trip.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                <span className="truncate">{citiesList}</span>
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  {trip.startDate} ({trip.totalDays} Days)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {trip.travelerCount} Travelers
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-left sm:text-right">
              <Badge variant={budgetVariant} size="sm">
                Est: {trip.budget.currency === 'INR' ? '₹' : '$'}{trip.budget.totalEstimatedCost.toLocaleString()}
              </Badge>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Budget: {trip.budget.currency === 'INR' ? '₹' : '$'}{trip.budget.targetBudget.toLocaleString()}
              </p>
            </div>

            <Button
              variant="primary"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/trips/${trip.id}/builder`);
              }}
            >
              Open Builder
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Grid Mode (Default)
  return (
    <Card
      hoverable
      className="group flex flex-col justify-between overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-terracotta-300 transition-all duration-200"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div className="relative h-48 overflow-hidden cursor-pointer">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant={statusBadgeVariants[trip.status]} size="xs">
            {statusLabels[trip.status]}
          </Badge>

          {/* Action Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md transition-colors shadow-xs cursor-pointer"
              aria-label="Trip actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-elevated border border-slate-200 py-1.5 z-30 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/trips/${trip.id}`);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-sand-50 flex items-center gap-2 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/trips/${trip.id}/builder`);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-sand-50 flex items-center gap-2 text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Itinerary Builder</span>
                </button>
                {onDuplicate && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDuplicate(trip.id);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-sand-50 flex items-center gap-2 text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duplicate Trip</span>
                  </button>
                )}
                {onShare && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onShare(trip);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-sand-50 flex items-center gap-2 text-left"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Share Trip</span>
                  </button>
                )}
                {onDeleteRequest && (
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDeleteRequest(trip);
                      }}
                      className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delete Trip</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Image Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs text-slate-200 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
            <span className="truncate">{citiesList}</span>
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-terracotta-600 transition-colors line-clamp-1">
            {trip.title}
          </h3>
          {trip.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span>{trip.startDate}</span>
            </span>
            <span className="font-semibold text-slate-700 bg-sand-100 px-2 py-0.5 rounded-full text-[10px]">
              {trip.totalDays} Days
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{trip.travelerCount} Travelers</span>
            </span>
            <Badge variant={budgetVariant} size="xs">
              Est: {trip.budget.currency === 'INR' ? '₹' : '$'}{trip.budget.totalEstimatedCost.toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}`);
            }}
          >
            Overview
          </Button>

          <Button
            variant="primary"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}/builder`);
            }}
          >
            Open Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
