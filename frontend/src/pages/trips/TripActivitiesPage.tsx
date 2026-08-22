import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Footprints, 
  Search, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Plus, 
  CalendarDays, 
  Check, 
  DollarSign,
  Sparkles,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ActivityCard } from '@/components/activities/ActivityCard';
import { activityService } from '@/services/activityService';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { Activity, ActivityCategory } from '@/types/inventory.types';
import type { ItineraryItem } from '@/types/trip.types';

export const TripActivitiesPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { success, info } = useToast();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ActivityCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scheduling Modal State
  const [schedulingActivity, setSchedulingActivity] = useState<Activity | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00');
  const [customNote, setCustomNote] = useState<string>('');

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  useEffect(() => {
    if (currentTrip?.cities && currentTrip.cities.length > 0 && !selectedCityId) {
      setSelectedCityId(currentTrip.cities[0].id);
    }
  }, [currentTrip, selectedCityId]);

  const activeCityStop = currentTrip?.cities.find((c) => c.id === selectedCityId) || currentTrip?.cities[0];

  useEffect(() => {
    if (activeCityStop) {
      activityService
        .getActivitiesByCity(activeCityStop.cityName, {
          category: selectedCategory,
          searchQuery,
        })
        .then(setActivities);
    }
  }, [activeCityStop, selectedCategory, searchQuery]);

  if (!currentTrip) return null;

  const currentItinerary = currentTrip.itinerary || [];

  const handleOpenScheduleModal = (activity: Activity) => {
    setSchedulingActivity(activity);
    setSelectedTimeSlot(activity.suggestedTime || '09:00');
    setCustomNote('');
    setSelectedDayNumber(1);
  };

  const handleConfirmSchedule = async () => {
    if (!schedulingActivity) return;

    const targetDate = new Date(currentTrip.startDate);
    targetDate.setDate(targetDate.getDate() + (selectedDayNumber - 1));
    const formattedDate = targetDate.toISOString().split('T')[0];

    const newItem: ItineraryItem = {
      id: 'it-' + Math.random().toString(36).substring(2, 7),
      dayNumber: selectedDayNumber,
      date: formattedDate,
      cityName: activeCityStop?.cityName || schedulingActivity.cityName,
      timeSlot: selectedTimeSlot,
      duration: schedulingActivity.duration || `${Math.round((schedulingActivity.durationMinutes || 120) / 60)} hours`,
      title: schedulingActivity.title,
      category: schedulingActivity.category as any,
      location: schedulingActivity.location || schedulingActivity.cityName,
      estimatedCost: schedulingActivity.estimatedCost,
      currency: schedulingActivity.currency,
      notes: customNote || (schedulingActivity.highlights || []).join(' • '),
      image: schedulingActivity.coverImage || (schedulingActivity.images && schedulingActivity.images[0]) || '',
      rating: schedulingActivity.rating,
    };

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

    setSchedulingActivity(null);
    success(
      'Activity Scheduled!',
      `"${schedulingActivity.title}" added to Day ${selectedDayNumber} at ${selectedTimeSlot}.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Activity Discovery & Scheduling: {currentTrip.title}
            </h1>
            <Badge variant="teal" size="xs">
              {currentItinerary.length} Events Scheduled
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover and schedule sightseeing, island scuba, dining, and cultural tours directly onto your trip days.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Itinerary Builder
          </Button>
        </div>
      </div>

      {/* 2. MULTI-CITY SELECTOR TAB BAR */}
      {currentTrip.cities.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin p-1.5 bg-sand-100/70 rounded-2xl border border-slate-200/70">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Select Destination Stop:
          </span>
          {currentTrip.cities.map((stop) => {
            const isSelected = stop.id === selectedCityId;
            const stopEventsCount = currentItinerary.filter(
              (i) => i.cityName?.toLowerCase() === stop.cityName.toLowerCase()
            ).length;

            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => setSelectedCityId(stop.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{stop.cityName}</span>
                {stopEventsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px]">
                    {stopEventsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. CATEGORY FILTER PILLS & SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'sightseeing', label: 'Sightseeing' },
              { id: 'food', label: 'Food & Dining' },
              { id: 'adventure', label: 'Adventure' },
              { id: 'culture', label: 'Culture & Heritage' },
              { id: 'nature', label: 'Nature' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-terracotta-500 text-white shadow-2xs'
                    : 'bg-sand-50 text-slate-600 hover:bg-sand-100 border border-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand-50 text-xs text-slate-800 rounded-xl pl-9 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta-200"
            />
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY CARDS GRID */}
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const isAlreadyScheduled = currentItinerary.some(
              (i) => i.title.toLowerCase() === activity.title.toLowerCase()
            );

            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isAlreadyScheduled={isAlreadyScheduled}
                onSchedule={handleOpenScheduleModal}
              />
            );
          })}
        </div>
      ) : (
        <Card variant="flat" className="text-center py-12">
          <CardContent className="space-y-2">
            <Footprints className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No Activities Found</h4>
            <p className="text-xs text-slate-500">Try choosing a different category or clearing search.</p>
          </CardContent>
        </Card>
      )}

      {/* 5. ADD ACTIVITY TO DAY MODAL */}
      <Modal
        isOpen={Boolean(schedulingActivity)}
        onClose={() => setSchedulingActivity(null)}
        title={schedulingActivity ? `Schedule: ${schedulingActivity.title}` : 'Add Activity to Itinerary'}
        description={`Allocate a day and time slot in your ${currentTrip.title} itinerary.`}
      >
        {schedulingActivity && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-sand-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Estimated Cost:</span>
              <span className="font-bold text-slate-900">
                {schedulingActivity.estimatedCost === 0 ? 'Free' : `${schedulingActivity.currency === 'INR' ? '₹' : '$'}${schedulingActivity.estimatedCost.toLocaleString()}`}
              </span>
            </div>

            {/* Select Day */}
            <div>
              <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-1.5">
                Assign to Day:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Array.from({ length: currentTrip.totalDays }, (_, i) => i + 1).map((dayNum) => (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDayNumber(dayNum)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDayNumber === dayNum
                        ? 'bg-terracotta-500 text-white shadow-2xs ring-2 ring-terracotta-200'
                        : 'bg-sand-50 text-slate-700 hover:bg-sand-100 border border-slate-200'
                    }`}
                  >
                    Day {dayNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Time Slot */}
            <div>
              <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-1.5">
                Preferred Time Slot:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Morning (09:00)', value: '09:00' },
                  { label: 'Afternoon (14:00)', value: '14:00' },
                  { label: 'Evening (18:00)', value: '18:00' },
                  { label: 'Night (21:00)', value: '21:00' },
                ].map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot.value)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedTimeSlot === slot.value
                        ? 'bg-teal-600 text-white shadow-2xs font-bold'
                        : 'bg-sand-50 text-slate-700 hover:bg-sand-100 border border-slate-200'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <Input
              label="Personal Notes (Optional)"
              placeholder="e.g. Bring camera and sunscreen..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setSchedulingActivity(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSchedule}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Confirm & Add to Day {selectedDayNumber}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
