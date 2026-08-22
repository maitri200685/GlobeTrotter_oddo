import type { TransportSegment } from '@/types/trip.types';

const SEED_TRANSIT_PRESETS: TransportSegment[] = [
  {
    id: 'tr-goa-1',
    fromCity: 'Ahmedabad (AMD)',
    toCity: 'Goa (GOI)',
    mode: 'flight',
    carrierName: 'IndiGo Airlines 6E-442',
    departureTime: '08:15',
    arrivalTime: '10:05',
    duration: '1h 50m',
    cost: 6400,
    currency: 'INR',
    bookingReference: '6E-GOA982',
    notes: 'Terminal 1 • Carry digital boarding pass',
  },
  {
    id: 'tr-raj-1',
    fromCity: 'Delhi (NDLS)',
    toCity: 'Jaipur (JP)',
    mode: 'train',
    carrierName: 'Vande Bharat Express (20978)',
    departureTime: '06:10',
    arrivalTime: '09:45',
    duration: '3h 35m',
    cost: 3600,
    currency: 'INR',
    bookingReference: 'PNR-88492019',
    notes: 'Executive Chair Car • Breakfast included',
  },
  {
    id: 'tr-blr-1',
    fromCity: 'Bengaluru (BLR)',
    toCity: 'Kochi (COK)',
    mode: 'flight',
    carrierName: 'IndiGo 6E-5321',
    departureTime: '09:00',
    arrivalTime: '10:10',
    duration: '1h 10m',
    cost: 4200,
    currency: 'INR',
    bookingReference: '6E-KER5321',
    notes: 'Window seats 14A/14B • Onboard snack included',
  },
];

class TransitService {
  async getPresets(): Promise<TransportSegment[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(SEED_TRANSIT_PRESETS), 50);
    });
  }
}

export const transitService = new TransitService();
