import type { CurrencyCode, BudgetStyle } from './user.types';

export type ActivityCategory = 
  | 'sightseeing' 
  | 'food' 
  | 'adventure' 
  | 'culture' 
  | 'nightlife' 
  | 'nature'
  | 'shopping'
  | 'other';

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
  | 'Restaurant'
  | 'Gym'
  | 'Beach Access'
  | 'Backwaters'
  | 'Ayurveda'
  | 'Yoga'
  | 'Garden'
  | 'Sea View'
  | 'City Tours'
  | 'Golf'
  | 'Polo'
  | 'Heritage Tours'
  | 'Onsen'
  | 'Concierge'
  | 'River View'
  | 'Jungle Trekking'
  | 'Mountain View'
  | 'Taj View'
  | 'Bonfire'
  | 'Cycling'
  | 'Ganga View'
  | 'Business Center';

export interface Hotel {
  id: string;
  name: string;
  cityName: string;
  country: string;
  // Support both field name styles
  starRating?: number;
  rating?: number;
  userRating?: number;
  reviewsCount?: number;
  pricePerNight: number;
  currency: CurrencyCode;
  style?: BudgetStyle;
  // Support both image field styles  
  coverImage?: string;
  images?: string[];
  gallery?: string[];
  address: string;
  amenities: any[];
  aiMatchScore?: number;
  whyAiRecommends?: string;
  whyRecommended?: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
}

export interface Activity {
  id: string;
  title: string;
  cityName: string;
  country: string;
  category: ActivityCategory;
  // Support both duration field styles
  duration?: string;
  durationMinutes?: number;
  estimatedCost: number;
  currency: CurrencyCode;
  rating: number;
  reviewsCount?: number;
  // Support both image field styles
  coverImage?: string;
  images?: string[];
  description: string;
  recommendedTimeSlot?: 'morning' | 'afternoon' | 'evening' | 'night';
  suggestedTime?: string;
  location?: string;
  tags?: string[];
  highlights?: string[];
  latitude?: number;
  longitude?: number;
}

export interface HotelFilterParams {
  cityName?: string;
  minPrice?: number;
  maxPrice?: number;
  minStarRating?: number;
  amenities?: AmenityType[];
  style?: BudgetStyle | 'all';
  sortBy?: 'aiMatch' | 'priceAsc' | 'priceDesc' | 'rating';
  searchQuery?: string;
}

export interface ActivityFilterParams {
  cityName?: string;
  category?: 'all' | ActivityCategory;
  searchQuery?: string;
  maxCost?: number;
  timeSlot?: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
  sortBy?: 'rating' | 'costAsc' | 'costDesc' | 'duration';
}
