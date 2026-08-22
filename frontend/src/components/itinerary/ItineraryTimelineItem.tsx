import React from 'react';
import { 
  Clock, 
  MapPin, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Utensils, 
  Compass, 
  Hotel, 
  Plane, 
  Footprints, 
  FileText,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ItineraryItem } from '@/types/trip.types';

interface ItineraryTimelineItemProps {
  item: ItineraryItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export const ItineraryTimelineItem: React.FC<ItineraryTimelineItemProps> = ({
  item,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const categoryStyles: Record<string, { badge: 'teal' | 'amber' | 'terracotta' | 'ai' | 'neutral' | 'success'; icon: any; border: string; bg: string }> = {
    food: { badge: 'amber', icon: Utensils, border: 'border-l-amber-500', bg: 'bg-amber-50/20' },
    adventure: { badge: 'terracotta', icon: Compass, border: 'border-l-terracotta-500', bg: 'bg-terracotta-50/20' },
    sightseeing: { badge: 'teal', icon: Footprints, border: 'border-l-teal-500', bg: 'bg-teal-50/20' },
    culture: { badge: 'teal', icon: Footprints, border: 'border-l-teal-500', bg: 'bg-teal-50/20' },
    hotel: { badge: 'ai', icon: Hotel, border: 'border-l-purple-500', bg: 'bg-purple-50/20' },
    transport: { badge: 'neutral', icon: Plane, border: 'border-l-sky-500', bg: 'bg-sky-50/20' },
    note: { badge: 'neutral', icon: FileText, border: 'border-l-slate-400', bg: 'bg-slate-50/40' },
  };

  const currentStyle = categoryStyles[item.category] || categoryStyles.sightseeing;
  const Icon = currentStyle.icon;

  return (
    <div className="flex items-start gap-3 sm:gap-6 group">
      
      {/* Time Slot Rail Marker */}
      <div className="flex flex-col items-center shrink-0 pt-1 min-w-[60px] sm:min-w-[70px]">
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight font-display">
          {item.timeSlot}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
        <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500 ring-4 ring-terracotta-100 mt-2 shrink-0" />
        <div className="w-[2px] bg-slate-200 flex-1 my-1 min-h-[3rem]" />
      </div>

      {/* Event Details Card */}
      <Card
        className={`flex-1 overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all duration-200 border-l-4 ${currentStyle.border} ${currentStyle.bg} mb-4`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={currentStyle.badge} size="xs" className="capitalize flex items-center gap-1">
                <Icon className="w-3 h-3" />
                <span>{item.category}</span>
              </Badge>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h4>
            </div>

            {/* Reorder & Action Controls */}
            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                disabled={isFirst}
                onClick={onMoveUp}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 disabled:opacity-20 cursor-pointer"
                title="Move earlier"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={onMoveDown}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 disabled:opacity-20 cursor-pointer"
                title="Move later"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Remove from itinerary"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Location & Notes */}
          <div className="space-y-1.5 text-xs text-slate-600">
            {item.location && (
              <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                <span>{item.location}</span>
              </p>
            )}

            {item.notes && (
              <p className="text-slate-500 text-[11px] leading-relaxed bg-white/60 p-2 rounded-xl border border-slate-100">
                {item.notes}
              </p>
            )}
          </div>

          {/* Cost Footer */}
          <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-medium">
              City: <span className="font-semibold text-slate-700">{item.cityName || 'Active Stop'}</span>
            </span>

            <span className="font-extrabold text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {item.estimatedCost === 0
                ? 'Free'
                : `${item.currency === 'INR' ? '₹' : '$'}${item.estimatedCost.toLocaleString()}`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
