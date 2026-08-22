import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Clock, 
  Plane, 
  Hotel, 
  Footprints, 
  Utensils, 
  Plus, 
  ArrowRight, 
  Sparkles,
  MapPin,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TransitCard } from '@/components/transit/TransitCard';
import { AddTransitModal } from '@/components/transit/AddTransitModal';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { TransportSegment, ItineraryItem } from '@/types/trip.types';

export const TripCalendarPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { success, info } = useToast();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [isAddTransitOpen, setIsAddTransitOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ItineraryItem | null>(null);

  // Category Filter Toggles
  const [showStays, setShowStays] = useState(true);
  const [showTransit, setShowTransit] = useState(true);
  const [showDining, setShowDining] = useState(true);
  const [showActivities, setShowActivities] = useState(true);

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  if (!currentTrip) return null;

  const currentItinerary = currentTrip.itinerary || [];
  const currentTransit = currentTrip.transport || [];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00', '21:00'
  ];

  const handleAddTransit = async (newSegment: TransportSegment) => {
    const updatedTransport = [...currentTransit, newSegment];
    const totalTransportCost = updatedTransport.reduce((sum, t) => sum + t.cost, 0);

    const categories = { ...currentTrip.budget.categories, transport: totalTransportCost };
    const newTotal = Object.values(categories).reduce((a, b) => a + b, 0);

    await updateTrip(currentTrip.id, {
      transport: updatedTransport,
      budget: {
        ...currentTrip.budget,
        totalEstimatedCost: newTotal,
        categories,
      },
    });

    success('Transit Added', `${newSegment.carrierName} added to trip transport.`);
  };

  const handleDeleteTransit = async (segmentId: string) => {
    const updatedTransport = currentTransit.filter((t) => t.id !== segmentId);
    const totalTransportCost = updatedTransport.reduce((sum, t) => sum + t.cost, 0);

    const categories = { ...currentTrip.budget.categories, transport: totalTransportCost };
    const newTotal = Object.values(categories).reduce((a, b) => a + b, 0);

    await updateTrip(currentTrip.id, {
      transport: updatedTransport,
      budget: {
        ...currentTrip.budget,
        totalEstimatedCost: newTotal,
        categories,
      },
    });

    info('Transit Removed', 'Transport booking removed from trip.');
  };

  const getEventsForDayAndHour = (dayNum: number, hourStr: string) => {
    const hourNum = parseInt(hourStr.split(':')[0], 10);
    return currentItinerary.filter((i) => {
      if (i.dayNumber !== dayNum) return false;
      const itemHour = parseInt(i.timeSlot.split(':')[0], 10);
      if (itemHour !== hourNum) return false;

      if (i.category === 'food' && !showDining) return false;
      if (i.category === 'hotel' && !showStays) return false;
      if (i.category === 'transport' && !showTransit) return false;
      if ((i.category === 'sightseeing' || i.category === 'adventure' || i.category === 'culture' || i.category === 'nature') && !showActivities) return false;

      return true;
    });
  };

  const formatDayDate = (dayNum: number) => {
    const s = new Date(currentTrip.startDate);
    s.setDate(s.getDate() + (dayNum - 1));
    return s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Multi-Day Calendar & Schedule: {currentTrip.title}
            </h1>
            <Badge variant="teal" size="xs">
              {currentTrip.totalDays} Days Grid
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized multi-day time grid visualizer for stays, flights, dining, and sightseeing events.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddTransitOpen(true)}
            leftIcon={<Plane className="w-4 h-4" />}
          >
            Add Transit Booking
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/trips/${currentTrip.id}/map`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Open Journey Map
          </Button>
        </div>
      </div>

      {/* 2. CATEGORY VISIBILITY TOGGLE PILLS */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Filter Calendar Views:
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowDining(!showDining)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showDining ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-sand-100 text-slate-400'
            }`}
          >
            <Utensils className="w-3 h-3" />
            <span>Dining & Food</span>
          </button>

          <button
            type="button"
            onClick={() => setShowActivities(!showActivities)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showActivities ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-sand-100 text-slate-400'
            }`}
          >
            <Footprints className="w-3 h-3" />
            <span>Tours & Activities</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStays(!showStays)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showStays ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-sand-100 text-slate-400'
            }`}
          >
            <Hotel className="w-3 h-3" />
            <span>Stays & Check-in</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTransit(!showTransit)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showTransit ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-sand-100 text-slate-400'
            }`}
          >
            <Plane className="w-3 h-3" />
            <span>Flights & Transit</span>
          </button>
        </div>
      </div>

      {/* 3. MULTI-DAY TIME GRID SCHEDULE */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-card overflow-x-auto">
        <div className="min-w-[800px]">
          
          {/* Day Columns Header */}
          <div className="grid grid-cols-12 gap-2 pb-3 border-b-2 border-slate-100 text-center">
            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left pl-2">
              Time
            </div>
            {Array.from({ length: currentTrip.totalDays }, (_, i) => i + 1).map((dayNum) => {
              return (
                <div
                  key={dayNum}
                  style={{ gridColumn: `span ${Math.floor(11 / currentTrip.totalDays) || 1}` }}
                  className="text-left px-2 py-1 bg-sand-50 rounded-xl border border-slate-200/60"
                >
                  <p className="text-xs font-extrabold text-slate-900">Day {dayNum}</p>
                  <p className="text-[10px] text-slate-500 truncate">{formatDayDate(dayNum)}</p>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map((timeStr) => (
              <div key={timeStr} className="grid grid-cols-12 gap-2 py-2.5 items-start">
                <div className="col-span-1 text-xs font-bold text-slate-400 font-display pl-2 pt-1">
                  {timeStr}
                </div>

                {Array.from({ length: currentTrip.totalDays }, (_, i) => i + 1).map((dayNum) => {
                  const events = getEventsForDayAndHour(dayNum, timeStr);
                  return (
                    <div
                      key={dayNum}
                      style={{ gridColumn: `span ${Math.floor(11 / currentTrip.totalDays) || 1}` }}
                      className="min-h-[44px] rounded-xl px-1.5 py-1 space-y-1.5 hover:bg-sand-50/50 transition-colors"
                    >
                      {events.map((event) => {
                        const isFood = event.category === 'food';
                        const isHotel = event.category === 'hotel';
                        const isAdventure = event.category === 'adventure';
                        const bgClass = isFood
                          ? 'bg-amber-100/90 text-amber-950 border-amber-300'
                          : isHotel
                          ? 'bg-purple-100/90 text-purple-950 border-purple-300'
                          : isAdventure
                          ? 'bg-terracotta-100/90 text-terracotta-950 border-terracotta-300'
                          : 'bg-teal-100/90 text-teal-950 border-teal-300';

                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-1.5 rounded-lg border text-[11px] leading-tight font-semibold shadow-2xs cursor-pointer hover:scale-[1.02] transition-transform ${bgClass}`}
                          >
                            <p className="truncate font-bold">{event.title}</p>
                            <span className="text-[9px] opacity-75">{event.timeSlot} • {event.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TRANSIT BOOKINGS HUB */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-600" />
                <span>Inter-City Transport Bookings ({currentTransit.length})</span>
              </CardTitle>
              <CardDescription>Flights, trains, and transfers booked for this journey.</CardDescription>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsAddTransitOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Transfer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentTransit.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTransit.map((seg) => (
                <TransitCard
                  key={seg.id}
                  segment={seg}
                  onDelete={handleDeleteTransit}
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-xs text-slate-500">
              No inter-city transit segments added yet. Click "Add Transfer" to link flights or trains.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 5. ADD TRANSIT MODAL */}
      <AddTransitModal
        isOpen={isAddTransitOpen}
        onClose={() => setIsAddTransitOpen(false)}
        trip={currentTrip}
        onAddTransit={handleAddTransit}
      />
    </div>
  );
};
