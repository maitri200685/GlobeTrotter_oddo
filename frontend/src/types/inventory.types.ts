import type { CurrencyCode, BudgetStyle } from './user.types';

export type ActivityCategory = 
  | 'sightseeing' 
  | 'food' 
  | 'adventure' 
  | 'culture' 
  | 'nightlife' 
  | 'nature';

export type AmenityType = 
  | 'WiFi' 
  | 'Pool' 
  | 'Free Breakfast' 
  | 'Beachfront' 
  | 'Spa' 
  | 'Airport Shuttle' 
  | 'Bar' 
  | 'Fitness Center' 
  | 'Air Conditioning'
  | 'Heritage Courtyard'
  | 'Rooftop View'
  | 'Rooftop Temple View';

export interface Hotel {
  id: string;
  name: string;
  cityName: string;
  country: string;
  starRating: number;
  userRating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: CurrencyCode;
  style: BudgetStyle;
  coverImage: string;
  gallery: string[];
  address: string;
  amenities: AmenityType[];
  aiMatchScore: number; // e.g. 98
  whyAiRecommends: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Activity {
  id: string;
  title: string;
  cityName: string;
  country: string;
  category: ActivityCategory;
  duration: string; // e.g. "3.5 hours"
  estimatedCost: number;
  currency: CurrencyCode;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  description: string;
  recommendedTimeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  suggestedTime: string; // e.g. "09:00"
  location: string;
  tags: string[];
  highlights: string[];
}

export interface HotelFilterParams {
  cityName?: string;
  minPrice?: number;
  maxPrice?: number;
  minStarRating?: number;
  amenities?: AmenityType[];
  style?: BudgetStyle | 'all';
  sortBy?: 'aiMatch' | 'priceAsc' | 'priceDesc' | 'rating';
}

export interface ActivityFilterParams {
  cityName?: string;
  category?: 'all' | ActivityCategory;
  searchQuery?: string;
  maxCost?: number;
  timeSlot?: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
  sortBy?: 'rating' | 'costAsc' | 'costDesc' | 'duration';
}
