import React from 'react';
import { 
  Plane, 
  Train, 
  Car, 
  Bus, 
  Ship, 
  Clock, 
  ArrowRight, 
  Trash2,
  Ticket,
  MapPin
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TransportSegment } from '@/types/trip.types';

interface TransitCardProps {
  segment: TransportSegment;
  onDelete?: (id: string) => void;
}

export const TransitCard: React.FC<TransitCardProps> = ({
  segment,
  onDelete,
}) => {
  const modeIcons = {
    flight: Plane,
    train: Train,
    cab: Car,
    bus: Bus,
    ferry: Ship,
  };

  const Icon = modeIcons[segment.mode] || Plane;

  return (
    <Card className="overflow-hidden border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {segment.carrierName}
              </h4>
              <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                {segment.mode}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-slate-900">
              {segment.currency === 'INR' ? '₹' : '$'}{segment.cost.toLocaleString()}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(segment.id)}
                className="block text-slate-400 hover:text-rose-600 p-1 ml-auto cursor-pointer"
                title="Remove transit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Departure to Arrival Flow */}
        <div className="p-3 rounded-xl bg-sand-50/70 border border-slate-200/70 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Departure</span>
            <p className="font-bold text-slate-900">{segment.departureTime}</p>
            <p className="text-[11px] text-slate-600 truncate">{segment.fromCity}</p>
          </div>

          <div className="flex flex-col items-center px-3">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {segment.duration}
            </span>
            <div className="w-16 h-[2px] bg-slate-300 relative my-1">
              <ArrowRight className="w-3 h-3 text-slate-400 absolute right-0 -top-1.5" />
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">Arrival</span>
            <p className="font-bold text-slate-900">{segment.arrivalTime}</p>
            <p className="text-[11px] text-slate-600 truncate">{segment.toCity}</p>
          </div>
        </div>

        {segment.bookingReference && (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Ref: <strong className="text-slate-800 font-mono">{segment.bookingReference}</strong></span>
            {segment.notes && <span className="truncate text-slate-400">• {segment.notes}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
