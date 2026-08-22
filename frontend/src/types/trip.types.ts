import type { CurrencyCode, BudgetStyle } from './user.types';

export type TripStatus = 'upcoming' | 'past' | 'draft';
export type BudgetStatus = 'healthy' | 'warning' | 'exceeded';

export interface CityStop {
  id: string;
  cityName: string;
  country: string;
  daysAllocated: number;
  order: number;
  coverImage?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface HotelBooking {
  id: string;
  hotelName: string;
  cityId: string;
  cityName: string;
  starRating: number;
  pricePerNight: number;
  nights: number;
  totalCost: number;
  currency: CurrencyCode;
  checkInDate: string;
  checkOutDate: string;
  address: string;
  image: string;
  amenities: string[];
  whyRecommended?: string;
}

export interface TransportSegment {
  id: string;
  fromCity: string;
  toCity: string;
  mode: 'flight' | 'train' | 'cab' | 'bus' | 'ferry';
  carrierName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  cost: number;
  currency: CurrencyCode;
  bookingReference?: string;
  notes?: string;
}

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  date: string;
  cityId?: string;
  cityName?: string;
  timeSlot: string; // e.g. "09:30"
  duration: string; // e.g. "2 hours"
  title: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'nightlife' | 'nature' | 'hotel' | 'transport' | 'note';
  location: string;
  estimatedCost: number;
  currency: CurrencyCode;
  notes?: string;
  image?: string;
  rating?: number;
  isBooked?: boolean;
}

export interface TripBudget {
  targetBudget: number;
  totalEstimatedCost: number;
  currency: CurrencyCode;
  status: BudgetStatus;
  categories: {
    accommodation: number;
    transport: number;
    activities: number;
    food: number;
    other: number;
  };
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelerCount: number;
  travelerType: 'solo' | 'couple' | 'friends' | 'family';
  status: TripStatus;
  cities: CityStop[];
  hotels: HotelBooking[];
  transport: TransportSegment[];
  itinerary: ItineraryItem[];
  budget: TripBudget;
  travelStyle: BudgetStyle;
  isShared?: boolean;
  shareId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripFilterParams {
  status?: 'all' | TripStatus;
  searchQuery?: string;
  sortBy?: 'date' | 'budget' | 'duration' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTripDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  travelerType?: 'solo' | 'couple' | 'friends' | 'family';
  targetBudget: number;
  currency?: CurrencyCode;
  coverImage?: string;
  travelStyle?: BudgetStyle;
  initialCity?: string;
}
