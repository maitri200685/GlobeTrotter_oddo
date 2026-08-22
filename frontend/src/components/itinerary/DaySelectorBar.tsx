import React from 'react';
import { CalendarDays, MapPin, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Trip } from '@/types/trip.types';

interface DaySelectorBarProps {
  trip: Trip;
  activeDay: number | 'all';
  onSelectDay: (day: number | 'all') => void;
}

export const DaySelectorBar: React.FC<DaySelectorBarProps> = ({
  trip,
  activeDay,
  onSelectDay,
}) => {
  const formatDayDate = (dayNum: number) => {
    const s = new Date(trip.startDate);
    s.setDate(s.getDate() + (dayNum - 1));
    return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Associate city to each day
  const getCityForDay = (dayNum: number) => {
    let accumulated = 0;
    for (const city of trip.cities) {
      accumulated += city.daysAllocated;
      if (dayNum <= accumulated) {
        return city.cityName;
      }
    }
    return trip.cities[0]?.cityName || 'Destination';
  };

  const getEventsCountForDay = (dayNum: number) => {
    return trip.itinerary.filter((i) => i.dayNumber === dayNum).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin p-1.5 bg-sand-100/80 rounded-2xl border border-slate-200/80">
      {/* "All Days" View Tab */}
      <button
        type="button"
        onClick={() => onSelectDay('all')}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
          activeDay === 'all'
            ? 'bg-slate-900 text-white shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>All Days ({trip.totalDays}d)</span>
        <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-200 text-[10px]">
          {trip.itinerary.length}
        </span>
      </button>

      <div className="h-5 w-[1px] bg-slate-300 mx-1 shrink-0" />

      {/* Individual Day Tabs */}
      {Array.from({ length: trip.totalDays }, (_, i) => i + 1).map((dayNum) => {
        const isSelected = activeDay === dayNum;
        const eventsCount = getEventsCountForDay(dayNum);
        const cityName = getCityForDay(dayNum);

        return (
          <button
            key={dayNum}
            type="button"
            onClick={() => onSelectDay(dayNum)}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex flex-col items-start min-w-[110px] text-left border ${
              isSelected
                ? 'bg-white border-terracotta-400 ring-2 ring-terracotta-200 shadow-2xs text-slate-900'
                : 'bg-sand-50/70 border-slate-200/70 text-slate-600 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-xs font-bold">
                Day {dayNum}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  eventsCount > 0
                    ? isSelected ? 'bg-terracotta-100 text-terracotta-700' : 'bg-sand-200 text-slate-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
              </span>
            </div>

            <div className="flex items-center justify-between w-full text-[10px] text-slate-400 mt-0.5">
              <span>{formatDayDate(dayNum)}</span>
              <span className="font-semibold text-teal-700 truncate max-w-[60px]">
                {cityName}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
