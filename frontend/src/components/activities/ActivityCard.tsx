import React from 'react';
import { 
  Clock, 
  Star, 
  MapPin, 
  Plus, 
  Check, 
  Sparkles, 
  Compass 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Activity, ActivityCategory } from '@/types/inventory.types';

interface ActivityCardProps {
  activity: Activity;
  isAlreadyScheduled?: boolean;
  onSchedule?: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isAlreadyScheduled = false,
  onSchedule,
}) => {
  const categoryBadgeVariants: Record<ActivityCategory, 'teal' | 'amber' | 'terracotta' | 'success' | 'ai' | 'neutral'> = {
    sightseeing: 'teal',
    food: 'amber',
    adventure: 'terracotta',
    culture: 'neutral',
    nightlife: 'ai',
    nature: 'success',
  };

  return (
    <Card
      hoverable
      className="group flex flex-col justify-between overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-terracotta-300 transition-all duration-200"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={activity.coverImage}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <Badge variant={categoryBadgeVariants[activity.category]} size="xs" className="capitalize">
            {activity.category}
          </Badge>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{activity.rating}</span>
          </div>
        </div>

        {/* Bottom Time & Location */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{activity.duration} • Best in {activity.recommendedTimeSlot}</span>
          </p>
          <h3 className="text-sm sm:text-base font-extrabold leading-tight truncate">
            {activity.title}
          </h3>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {activity.description}
        </p>

        {/* Highlights */}
        <div className="space-y-1 text-[11px] text-slate-500 pt-1">
          {activity.highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              <span className="truncate">{h}</span>
            </div>
          ))}
        </div>

        {/* Cost & Scheduling Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-sm font-extrabold text-slate-900">
              {activity.estimatedCost === 0
                ? 'Free'
                : `${activity.currency === 'INR' ? '₹' : '$'}${activity.estimatedCost.toLocaleString()}`}
            </span>
            <span className="text-[10px] text-slate-400 block">estimated / person</span>
          </div>

          {onSchedule && (
            <Button
              variant={isAlreadyScheduled ? 'secondary' : 'primary'}
              size="xs"
              onClick={() => onSchedule(activity)}
              leftIcon={isAlreadyScheduled ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {isAlreadyScheduled ? 'Scheduled' : 'Add to Day'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
