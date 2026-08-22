import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Car, 
  Bus, 
  Ship, 
  Clock, 
  MapPin, 
  Wallet, 
  Ticket,
  Check
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Trip, TransportSegment } from '@/types/trip.types';

interface AddTransitModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onAddTransit: (segment: TransportSegment) => void;
}

export const AddTransitModal: React.FC<AddTransitModalProps> = ({
  isOpen,
  onClose,
  trip,
  onAddTransit,
}) => {
  const [mode, setMode] = useState<TransportSegment['mode']>('flight');
  const [carrierName, setCarrierName] = useState('');
  const [fromCity, setFromCity] = useState(trip.cities[0]?.cityName || 'Home City');
  const [toCity, setToCity] = useState(trip.cities[1]?.cityName || trip.cities[0]?.cityName || 'Destination');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [arrivalTime, setArrivalTime] = useState('10:30');
  const [duration, setDuration] = useState('2h 30m');
  const [cost, setCost] = useState(4500);
  const [bookingReference, setBookingReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    if (!carrierName.trim()) return;

    const newSegment: TransportSegment = {
      id: 'tr-' + Math.random().toString(36).substring(2, 7),
      fromCity,
      toCity,
      mode,
      carrierName,
      departureTime,
      arrivalTime,
      duration,
      cost: Number(cost) || 0,
      currency: trip.budget.currency,
      bookingReference,
      notes,
    };

    onAddTransit(newSegment);
    setCarrierName('');
    setBookingReference('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Inter-City Transport Booking"
      description={`Add a flight, train, bus, or private cab transfer for ${trip.title}.`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Transport Mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            options={[
              { value: 'flight', label: '✈️ Flight' },
              { value: 'train', label: '🚆 Train / Express' },
              { value: 'cab', label: '🚗 Private Cab / Transfer' },
              { value: 'bus', label: '🚌 Intercity Bus' },
              { value: 'ferry', label: '🚢 Boat / Ferry' },
            ]}
          />

          <Input
            label="Carrier / Service Name"
            required
            placeholder="e.g. IndiGo 6E-442 or Vande Bharat"
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Departure City / Station"
            placeholder="e.g. Mumbai (BOM)"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Arrival City / Station"
            placeholder="e.g. Goa (GOI)"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Departure Time"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Arrival Time"
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Duration"
            placeholder="e.g. 2h 15m"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            leftIcon={<Wallet className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="PNR / Booking Reference"
            placeholder="e.g. 6E-99824X"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            leftIcon={<Ticket className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <Input
          label="Travel Notes (Optional)"
          placeholder="e.g. Terminal 2, baggage allowance 15kg..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

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
            Add Transport Segment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
