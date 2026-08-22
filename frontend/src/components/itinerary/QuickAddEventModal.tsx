import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  MapPin, 
  Wallet, 
  Utensils, 
  Compass, 
  Footprints, 
  Plane, 
  FileText,
  Check
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Trip, ItineraryItem } from '@/types/trip.types';

interface QuickAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  initialDayNumber?: number;
  onAddEvent: (item: ItineraryItem) => void;
}

export const QuickAddEventModal: React.FC<QuickAddEventModalProps> = ({
  isOpen,
  onClose,
  trip,
  initialDayNumber = 1,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItineraryItem['category']>('food');
  const [dayNumber, setDayNumber] = useState<number>(initialDayNumber);
  const [timeSlot, setTimeSlot] = useState('12:30');
  const [duration, setDuration] = useState('1.5 hours');
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(1000);
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    if (!title.trim()) return;

    const targetDate = new Date(trip.startDate);
    targetDate.setDate(targetDate.getDate() + (dayNumber - 1));
    const formattedDate = targetDate.toISOString().split('T')[0];

    const newItem: ItineraryItem = {
      id: 'it-custom-' + Math.random().toString(36).substring(2, 7),
      dayNumber,
      date: formattedDate,
      cityName: trip.cities[0]?.cityName || 'Destination',
      timeSlot,
      duration,
      title,
      category,
      location: location || trip.cities[0]?.cityName || 'Custom Location',
      estimatedCost: Number(estimatedCost) || 0,
      currency: trip.budget.currency,
      notes,
    };

    onAddEvent(newItem);
    setTitle('');
    setLocation('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Event to Itinerary"
      description={`Add custom reservations, meal stops, transit, or notes to Day ${dayNumber}.`}
    >
      <div className="space-y-4">
        <Input
          label="Event / Activity Title"
          required
          placeholder="e.g. Lunch at Fisherman's Wharf"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            options={[
              { value: 'food', label: '🍽️ Food & Dining' },
              { value: 'sightseeing', label: '🏛️ Sightseeing' },
              { value: 'adventure', label: '🏄 Adventure' },
              { value: 'culture', label: '🎭 Culture & Arts' },
              { value: 'hotel', label: '🏨 Hotel Check-in/out' },
              { value: 'transport', label: '✈️ Flight / Train Transit' },
              { value: 'note', label: '📝 Note / Free Time' },
            ]}
          />

          <Select
            label="Assign to Day"
            value={String(dayNumber)}
            onChange={(e) => setDayNumber(Number(e.target.value))}
            options={Array.from({ length: trip.totalDays }, (_, i) => ({
              value: String(i + 1),
              label: `Day ${i + 1}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Time Slot"
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Duration"
            placeholder="e.g. 2 hours"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location / Venue"
            placeholder="e.g. Calangute Main Road"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Estimated Cost"
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(Number(e.target.value))}
            leftIcon={<Wallet className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-1.5">
            Personal Notes & Booking Details
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Table booked under Aarav, outdoor seaside seating requested..."
            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Add to Itinerary
          </Button>
        </div>
      </div>
    </Modal>
  );
};
