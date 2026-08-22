import { storageService } from './storageService';
import type { 
  Trip, 
  TripFilterParams, 
  CreateTripDTO, 
  TripBudget, 
  BudgetStatus 
} from '@/types/trip.types';

const TRIPS_STORE_KEY = 'globetrotter_trips_store';

const SEED_TRIPS: Trip[] = [
  {
    id: 'trip-101',
    userId: 'usr-aarav-101',
    title: 'Goa Sun & Coastline',
    description: 'Relaxed coastal escape featuring North Goa beaches, Portuguese heritage churches, street flea markets, and seaside sunset dining.',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&h=500&q=80',
    startDate: '2026-09-10',
    endDate: '2026-09-16',
    totalDays: 6,
    travelerCount: 2,
    travelerType: 'couple',
    status: 'upcoming',
    travelStyle: 'comfort',
    cities: [
      {
        id: 'city-goa',
        cityName: 'Goa',
        country: 'India',
        daysAllocated: 6,
        order: 1,
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&h=400&q=80',
        coordinates: { lat: 15.2993, lng: 74.1240 },
      },
    ],
    hotels: [
      {
        id: 'htl-goa-1',
        hotelName: 'Santana Beach Boutique Resort',
        cityId: 'city-goa',
        cityName: 'Candolim, Goa',
        starRating: 4.5,
        pricePerNight: 3200,
        nights: 5,
        totalCost: 16000,
        currency: 'INR',
        checkInDate: '2026-09-10',
        checkOutDate: '2026-09-15',
        address: 'Candolim Beach Road, North Goa',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&h=400&q=80',
        amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa'],
        whyRecommended: '98% Match: Top-rated beachfront boutique stay inside your allocated budget.',
      },
    ],
    transport: [
      {
        id: 'tr-goa-1',
        fromCity: 'Ahmedabad (AMD)',
        toCity: 'Goa (GOI)',
        mode: 'flight',
        carrierName: 'IndiGo 6E-442',
        departureTime: '08:15',
        arrivalTime: '10:05',
        duration: '1h 50m',
        cost: 6400,
        currency: 'INR',
        bookingReference: '6E-GOA982',
        notes: 'Terminal 1 • Carry digital boarding pass',
      },
    ],
    itinerary: [
      {
        id: 'it-1',
        dayNumber: 1,
        date: '2026-09-10',
        cityName: 'Goa',
        timeSlot: '11:30',
        duration: '2 hours',
        title: 'Check-in & Candolim Beach Relax',
        category: 'hotel',
        location: 'Candolim Beach, North Goa',
        estimatedCost: 500,
        currency: 'INR',
        notes: 'Welcome coconut drink and beachfront stroll.',
      },
      {
        id: 'it-2',
        dayNumber: 1,
        date: '2026-09-10',
        cityName: 'Goa',
        timeSlot: '18:00',
        duration: '3 hours',
        title: 'Sunset Seafood Dinner at Curlies',
        category: 'food',
        location: 'Anjuna Beach',
        estimatedCost: 1800,
        currency: 'INR',
        notes: 'Reserved seaside shack table for sunset.',
      },
      {
        id: 'it-3',
        dayNumber: 2,
        date: '2026-09-11',
        cityName: 'Goa',
        timeSlot: '09:00',
        duration: '4 hours',
        title: 'Old Goa Heritage Walk & Basilica',
        category: 'culture',
        location: 'Old Goa',
        estimatedCost: 800,
        currency: 'INR',
        notes: 'Explore Basilica of Bom Jesus and Se Cathedral.',
      },
      {
        id: 'it-4',
        dayNumber: 3,
        date: '2026-09-12',
        cityName: 'Goa',
        timeSlot: '08:00',
        duration: '5 hours',
        title: 'Grande Island Scuba & Snorkel Boat Trip',
        category: 'adventure',
        location: 'Grande Island, Goa',
        estimatedCost: 3000,
        currency: 'INR',
        notes: 'Includes light breakfast, gear, and underwater video.',
      },
    ],
    budget: {
      targetBudget: 35000,
      totalEstimatedCost: 28500,
      currency: 'INR',
      status: 'healthy',
      categories: {
        accommodation: 16000,
        transport: 6400,
        activities: 3800,
        food: 1800,
        other: 500,
      },
    },
    isShared: true,
    shareId: 'share-goa-sun-101',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-20',
  },
  {
    id: 'trip-102',
    userId: 'usr-aarav-101',
    title: 'Royal Rajasthan Heritage',
    description: 'A regal multi-city journey across the Pink City of Jaipur, the Blue City of Jodhpur, and the lakes of Udaipur.',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&h=500&q=80',
    startDate: '2026-10-04',
    endDate: '2026-10-12',
    totalDays: 8,
    travelerCount: 4,
    travelerType: 'friends',
    status: 'upcoming',
    travelStyle: 'comfort',
    cities: [
      { id: 'c-jaipur', cityName: 'Jaipur', country: 'India', daysAllocated: 3, order: 1 },
      { id: 'c-jodhpur', cityName: 'Jodhpur', country: 'India', daysAllocated: 2, order: 2 },
      { id: 'c-udaipur', cityName: 'Udaipur', country: 'India', daysAllocated: 3, order: 3 },
    ],
    hotels: [
      {
        id: 'htl-raj-1',
        hotelName: 'Alsisar Haveli Heritage Stay',
        cityId: 'c-jaipur',
        cityName: 'Jaipur, Rajasthan',
        starRating: 4.8,
        pricePerNight: 4800,
        nights: 3,
        totalCost: 14400,
        currency: 'INR',
        checkInDate: '2026-10-04',
        checkOutDate: '2026-10-07',
        address: 'Sansar Chandra Road, Jaipur',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80',
        amenities: ['Heritage Courtyard', 'Pool', 'Fine Dining', 'WiFi'],
      },
    ],
    transport: [
      {
        id: 'tr-raj-1',
        fromCity: 'Delhi',
        toCity: 'Jaipur',
        mode: 'train',
        carrierName: 'Vande Bharat Express (20978)',
        departureTime: '06:10',
        arrivalTime: '09:45',
        duration: '3h 35m',
        cost: 3600,
        currency: 'INR',
      },
    ],
    itinerary: [],
    budget: {
      targetBudget: 80000,
      totalEstimatedCost: 74200,
      currency: 'INR',
      status: 'healthy',
      categories: {
        accommodation: 38000,
        transport: 18200,
        activities: 12000,
        food: 6000,
        other: 0,
      },
    },
    createdAt: '2026-08-01',
    updatedAt: '2026-08-15',
  },
  {
    id: 'trip-103',
    userId: 'usr-aarav-101',
    title: 'Kyoto Temple & Cultural Trail',
    description: 'Immersive autumn tour through sacred bamboo forests, traditional tea ceremonies, and historical Shinto shrines.',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&h=500&q=80',
    startDate: '2026-04-12',
    endDate: '2026-04-19',
    totalDays: 7,
    travelerCount: 2,
    travelerType: 'couple',
    status: 'past',
    travelStyle: 'luxury',
    cities: [
      { id: 'c-kyoto', cityName: 'Kyoto', country: 'Japan', daysAllocated: 5, order: 1 },
      { id: 'c-nara', cityName: 'Nara', country: 'Japan', daysAllocated: 2, order: 2 },
    ],
    hotels: [],
    transport: [],
    itinerary: [],
    budget: {
      targetBudget: 2400,
      totalEstimatedCost: 2350,
      currency: 'USD',
      status: 'healthy',
      categories: {
        accommodation: 1200,
        transport: 450,
        activities: 400,
        food: 300,
        other: 0,
      },
    },
    createdAt: '2026-03-01',
    updatedAt: '2026-04-20',
  },
  {
    id: 'trip-104',
    userId: 'usr-aarav-101',
    title: 'Parisian Art & Gastronomy',
    description: 'Draft itinerary for museums, Seine dinner cruise, Montmartre walking trail, and French patisseries.',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=500&q=80',
    startDate: '2026-11-15',
    endDate: '2026-11-20',
    totalDays: 5,
    travelerCount: 2,
    travelerType: 'couple',
    status: 'draft',
    travelStyle: 'comfort',
    cities: [
      { id: 'c-paris', cityName: 'Paris', country: 'France', daysAllocated: 5, order: 1 },
    ],
    hotels: [],
    transport: [],
    itinerary: [],
    budget: {
      targetBudget: 3000,
      totalEstimatedCost: 2100,
      currency: 'USD',
      status: 'healthy',
      categories: {
        accommodation: 1200,
        transport: 400,
        activities: 300,
        food: 200,
        other: 0,
      },
    },
    createdAt: '2026-08-18',
    updatedAt: '2026-08-21',
  },
];

class TripService {
  constructor() {
    const existing = storageService.getItem<Trip[] | null>(TRIPS_STORE_KEY, null);
    if (!existing || existing.length === 0) {
      storageService.setItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);
    }
  }

  private calculateBudgetStatus(spent: number, target: number): BudgetStatus {
    if (target <= 0) return 'healthy';
    const ratio = spent / target;
    if (ratio > 1.0) return 'exceeded';
    if (ratio >= 0.85) return 'warning';
    return 'healthy';
  }

  async getTrips(filters?: TripFilterParams): Promise<Trip[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);

        if (filters?.status && filters.status !== 'all') {
          trips = trips.filter((t) => t.status === filters.status);
        }

        if (filters?.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          trips = trips.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.description?.toLowerCase().includes(q) ||
              t.cities.some((c) => c.cityName.toLowerCase().includes(q))
          );
        }

        if (filters?.sortBy) {
          trips = [...trips].sort((a, b) => {
            if (filters.sortBy === 'date') {
              return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            }
            if (filters.sortBy === 'budget') {
              return a.budget.targetBudget - b.budget.targetBudget;
            }
            if (filters.sortBy === 'duration') {
              return a.totalDays - b.totalDays;
            }
            if (filters.sortBy === 'title') {
              return a.title.localeCompare(b.title);
            }
            return 0;
          });

          if (filters.sortOrder === 'desc') {
            trips.reverse();
          }
        }

        resolve(trips);
      }, 100);
    });
  }

  async getTripById(id: string): Promise<Trip> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);
        const match = trips.find((t) => t.id === id);
        if (match) {
          resolve(match);
        } else {
          // Fallback to first trip if generic ID requested
          resolve(trips[0]);
        }
      }, 100);
    });
  }

  async createTrip(dto: CreateTripDTO, userId: string = 'usr-aarav-101'): Promise<Trip> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);

        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

        const newTrip: Trip = {
          id: 'trip-' + Math.random().toString(36).substring(2, 9),
          userId,
          title: dto.title,
          description: dto.description || `Personalized trip to ${dto.initialCity || 'destinations'}`,
          coverImage:
            dto.coverImage ||
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
          startDate: dto.startDate,
          endDate: dto.endDate,
          totalDays,
          travelerCount: dto.travelerCount,
          travelerType: dto.travelerType || 'couple',
          status: 'upcoming',
          travelStyle: dto.travelStyle || 'comfort',
          cities: dto.initialCity
            ? [
                {
                  id: 'city-' + Math.random().toString(36).substring(2, 7),
                  cityName: dto.initialCity,
                  country: 'Destination',
                  daysAllocated: totalDays,
                  order: 1,
                },
              ]
            : [],
          hotels: [],
          transport: [],
          itinerary: [],
          budget: {
            targetBudget: dto.targetBudget,
            totalEstimatedCost: 0,
            currency: dto.currency || 'INR',
            status: 'healthy',
            categories: {
              accommodation: 0,
              transport: 0,
              activities: 0,
              food: 0,
              other: 0,
            },
          },
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        const updated = [newTrip, ...trips];
        storageService.setItem<Trip[]>(TRIPS_STORE_KEY, updated);
        resolve(newTrip);
      }, 150);
    });
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);
        const index = trips.findIndex((t) => t.id === id);
        if (index === -1) {
          reject(new Error(`Trip with id "${id}" not found`));
          return;
        }

        const existing = trips[index];
        const updatedTrip: Trip = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };

        trips[index] = updatedTrip;
        storageService.setItem<Trip[]>(TRIPS_STORE_KEY, trips);
        resolve(updatedTrip);
      }, 100);
    });
  }

  async duplicateTrip(id: string): Promise<Trip> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);
        const source = trips.find((t) => t.id === id);
        if (!source) {
          reject(new Error('Trip to duplicate not found'));
          return;
        }

        const cloned: Trip = {
          ...source,
          id: 'trip-' + Math.random().toString(36).substring(2, 9),
          title: `${source.title} (Copy)`,
          status: 'draft',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        const updated = [cloned, ...trips];
        storageService.setItem<Trip[]>(TRIPS_STORE_KEY, updated);
        resolve(cloned);
      }, 150);
    });
  }

  async deleteTrip(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, SEED_TRIPS);
        const filtered = trips.filter((t) => t.id !== id);
        storageService.setItem<Trip[]>(TRIPS_STORE_KEY, filtered);
        resolve();
      }, 100);
    });
  }
}

export const tripService = new TripService();
