import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Plus, 
  Printer, 
  MapPin, 
  CalendarDays, 
  Sparkles, 
  ArrowRight, 
  Footprints,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DaySelectorBar } from '@/components/itinerary/DaySelectorBar';
import { ItineraryTimelineItem } from '@/components/itinerary/ItineraryTimelineItem';
import { QuickAddEventModal } from '@/components/itinerary/QuickAddEventModal';
import { PrintableAgendaView } from '@/components/itinerary/PrintableAgendaView';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { ItineraryItem } from '@/types/trip.types';

export const TripItineraryPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { success, info } = useToast();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [activeDay, setActiveDay] = useState<number | 'all'>(1);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  if (!currentTrip) return null;

  const currentItinerary = currentTrip.itinerary || [];

  const filteredItems = activeDay === 'all'
    ? [...currentItinerary].sort((a, b) => {
        if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
        return a.timeSlot.localeCompare(b.timeSlot);
      })
    : currentItinerary
        .filter((i) => i.dayNumber === activeDay)
        .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const handleAddCustomEvent = async (newItem: ItineraryItem) => {
    const updatedItinerary = [...currentItinerary, newItem];

    // Recalculate trip activities budget
    const totalActivitiesCost = updatedItinerary
      .filter((i) => i.category !== 'hotel' && i.category !== 'transport')
      .reduce((sum, i) => sum + (i.estimatedCost || 0), 0);

    const existingOtherCategories = { ...currentTrip.budget.categories };
    existingOtherCategories.activities = totalActivitiesCost;
    const newTotalEstimated = Object.values(existingOtherCategories).reduce((a, b) => a + b, 0);

    await updateTrip(currentTrip.id, {
      itinerary: updatedItinerary,
      budget: {
        ...currentTrip.budget,
        totalEstimatedCost: newTotalEstimated,
        categories: existingOtherCategories,
      },
    });

    success('Event Added', `"${newItem.title}" added to Day ${newItem.dayNumber}.`);
  };

  const handleDeleteItem = async (itemId: string) => {
    const updatedItinerary = currentItinerary.filter((i) => i.id !== itemId);

    const totalActivitiesCost = updatedItinerary
      .filter((i) => i.category !== 'hotel' && i.category !== 'transport')
      .reduce((sum, i) => sum + (i.estimatedCost || 0), 0);

    const existingOtherCategories = { ...currentTrip.budget.categories };
    existingOtherCategories.activities = totalActivitiesCost;
    const newTotalEstimated = Object.values(existingOtherCategories).reduce((a, b) => a + b, 0);

    await updateTrip(currentTrip.id, {
      itinerary: updatedItinerary,
      budget: {
        ...currentTrip.budget,
        totalEstimatedCost: newTotalEstimated,
        categories: existingOtherCategories,
      },
    });

    info('Event Removed', 'Activity removed from itinerary.');
  };

  const handleMoveItem = async (index: number, direction: 'up' | 'down') => {
    if (activeDay === 'all') {
      info('Notice', 'Please select a specific day to reorder items within that day.');
      return;
    }

    const dayItems = currentItinerary.filter((i) => i.dayNumber === activeDay);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === dayItems.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const tempTime = dayItems[index].timeSlot;
    dayItems[index].timeSlot = dayItems[targetIndex].timeSlot;
    dayItems[targetIndex].timeSlot = tempTime;

    const nonDayItems = currentItinerary.filter((i) => i.dayNumber !== activeDay);
    const updatedItinerary = [...nonDayItems, ...dayItems];

    await updateTrip(currentTrip.id, { itinerary: updatedItinerary });
  };

  if (isPrintViewOpen) {
    return (
      <PrintableAgendaView
        trip={currentTrip}
        onClose={() => setIsPrintViewOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-16">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Day-by-Day Itinerary Builder: {currentTrip.title}
            </h1>
            <Badge variant="teal" size="xs">
              {currentItinerary.length} Events
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive vertical timeline with scheduled events, time slots, and customizable reservations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintViewOpen(true)}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Agenda
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickAddOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Quick Add Event
          </Button>

          <Button
            variant="ai-subtle"
            size="sm"
            onClick={() => navigate(`/trips/${currentTrip.id}/map`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Journey Map
          </Button>
        </div>
      </div>

      {/* 2. DAY SELECTOR BAR */}
      <DaySelectorBar
        trip={currentTrip}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
      />

      {/* 3. VERTICAL TIMELINE RAIL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {activeDay === 'all' ? 'Full Itinerary Overview' : `Day ${activeDay} Timeline`}
            </h3>
            <p className="text-xs text-slate-500">
              {activeDay === 'all'
                ? `All ${currentTrip.totalDays} days chronological agenda.`
                : `${filteredItems.length} activities scheduled for this day.`}
            </p>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsQuickAddOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Custom Event
          </Button>
        </div>

        {/* Timeline Items List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-1">
            {filteredItems.map((item, idx) => (
              <ItineraryTimelineItem
                key={item.id}
                item={item}
                index={idx}
                isFirst={idx === 0}
                isLast={idx === filteredItems.length - 1}
                onMoveUp={() => handleMoveItem(idx, 'up')}
                onMoveDown={() => handleMoveItem(idx, 'down')}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-sand-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">No Events Scheduled for Day {activeDay}</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                This day is currently open free time! You can discover curated activities or add custom reservations.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/trips/${currentTrip.id}/activities`)}
                leftIcon={<Footprints className="w-4 h-4" />}
              >
                Browse Activities
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsQuickAddOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Custom Event
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 4. QUICK ADD EVENT MODAL */}
      <QuickAddEventModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        trip={currentTrip}
        initialDayNumber={typeof activeDay === 'number' ? activeDay : 1}
        onAddEvent={handleAddCustomEvent}
      />
    </div>
  );
};
