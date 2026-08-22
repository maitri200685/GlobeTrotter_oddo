import React from 'react';
import { Printer, MapPin, CalendarDays, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Trip } from '@/types/trip.types';

interface PrintableAgendaViewProps {
  trip: Trip;
  onClose: () => void;
}

export const PrintableAgendaView: React.FC<PrintableAgendaViewProps> = ({
  trip,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getEventsForDay = (dayNum: number) => {
    return trip.itinerary
      .filter((i) => i.dayNumber === dayNum)
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-elevated space-y-8 animate-fade-in max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-display">Printable Travel Agenda</h3>
          <p className="text-xs text-slate-500">High-contrast, clean format for offline travel and printing.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Timeline
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Agenda
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2 border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          {trip.title}
        </h1>
        <div className="flex items-center gap-6 text-xs text-slate-600 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold">
            <CalendarDays className="w-4 h-4" />
            {trip.startDate} – {trip.endDate} ({trip.totalDays} Days)
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <MapPin className="w-4 h-4" />
            {trip.cities.map((c) => c.cityName).join(', ')}
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <Users className="w-4 h-4" />
            {trip.travelerCount} Travelers
          </span>
        </div>
      </div>

      {/* Days Breakdown */}
      <div className="space-y-6">
        {Array.from({ length: trip.totalDays }, (_, i) => i + 1).map((dayNum) => {
          const events = getEventsForDay(dayNum);
          const dayDate = new Date(trip.startDate);
          dayDate.setDate(dayDate.getDate() + (dayNum - 1));
          const formattedDate = dayDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={dayNum} className="space-y-3 border-b border-slate-200 pb-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">
                  Day {dayNum} — <span className="text-terracotta-600">{formattedDate}</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {events.length} {events.length === 1 ? 'Event' : 'Events'}
                </span>
              </div>

              {events.length > 0 ? (
                <div className="space-y-2 pl-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl bg-sand-50/80 border border-slate-200/80 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {event.timeSlot}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{event.title}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            • {event.category}
                          </span>
                        </div>
                        {event.location && (
                          <p className="text-slate-600 pl-1">📍 {event.location}</p>
                        )}
                        {event.notes && (
                          <p className="text-slate-500 text-[11px] pl-1">{event.notes}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900">
                          {event.estimatedCost === 0 ? 'Free' : `${event.currency === 'INR' ? '₹' : '$'}${event.estimatedCost.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic pl-2">No events scheduled for this day (Free time).</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
