import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { Hotel, HotelFilterParams } from '@/types/inventory.types';

const SEED_HOTELS: Hotel[] = [
  // GOA HOTELS
  {
    id: 'htl-goa-1',
    name: 'Santana Beach Boutique Resort',
    cityName: 'Goa',
    country: 'India',
    starRating: 4,
    userRating: 4.6,
    reviewsCount: 420,
    pricePerNight: 3200,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    address: 'Candolim Beach Road, North Goa',
    amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Bar'],
    aiMatchScore: 98,
    whyAiRecommends: '98% Match: Top-rated beachfront boutique resort directly aligned with your target budget and relaxed pace.',
    coordinates: { lat: 15.5174, lng: 73.7628 },
  },
  {
    id: 'htl-goa-2',
    name: 'Taj Fort Aguada Resort & Spa',
    cityName: 'Goa',
    country: 'India',
    starRating: 5,
    userRating: 4.9,
    reviewsCount: 890,
    pricePerNight: 12500,
    currency: 'INR',
    style: 'luxury',
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Sinquerim, Candolim, Goa',
    amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Fitness Center', 'Bar'],
    aiMatchScore: 94,
    whyAiRecommends: '94% Match: Historic 5-star cliffside resort overlooking the Arabian Sea with private beach access.',
    coordinates: { lat: 15.4925, lng: 73.7736 },
  },
  {
    id: 'htl-goa-3',
    name: 'Zostel Goa (Calangute)',
    cityName: 'Goa',
    country: 'India',
    starRating: 3,
    userRating: 4.4,
    reviewsCount: 650,
    pricePerNight: 950,
    currency: 'INR',
    style: 'backpacker',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Calangute Main Market, North Goa',
    amenities: ['WiFi', 'Air Conditioning', 'Bar', 'Free Breakfast'],
    aiMatchScore: 91,
    whyAiRecommends: '91% Match: Vibrant backpacker hostel with social common lounges and walking distance to the beach.',
    coordinates: { lat: 15.5439, lng: 73.7554 },
  },

  // JAIPUR HOTELS
  {
    id: 'htl-jaipur-1',
    name: 'Alsisar Haveli Heritage Stay',
    cityName: 'Jaipur',
    country: 'India',
    starRating: 4,
    userRating: 4.8,
    reviewsCount: 520,
    pricePerNight: 4800,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Sansar Chandra Road, Jaipur',
    amenities: ['Heritage Courtyard', 'Pool', 'Free Breakfast', 'WiFi', 'Spa'],
    aiMatchScore: 97,
    whyAiRecommends: '97% Match: Traditional Rajput architecture featuring carved archways and central swimming pool.',
    coordinates: { lat: 26.9239, lng: 75.8038 },
  },
  {
    id: 'htl-jaipur-2',
    name: 'The Rambagh Palace',
    cityName: 'Jaipur',
    country: 'India',
    starRating: 5,
    userRating: 5.0,
    reviewsCount: 1200,
    pricePerNight: 24000,
    currency: 'INR',
    style: 'luxury',
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Bhawani Singh Road, Jaipur',
    amenities: ['Heritage Courtyard', 'Pool', 'Free Breakfast', 'WiFi', 'Spa', 'Fitness Center', 'Bar'],
    aiMatchScore: 99,
    whyAiRecommends: '99% Match: The jewel of Jaipur—former royal residence of the Maharaja with peacocks in palace gardens.',
    coordinates: { lat: 26.8978, lng: 75.8076 },
  },

  // KERALA HOTELS
  {
    id: 'htl-kerala-1',
    name: 'Kumarakom Lake Luxury Resort',
    cityName: 'Kerala (Munnar & Alleppey)',
    country: 'India',
    starRating: 5,
    userRating: 4.9,
    reviewsCount: 780,
    pricePerNight: 14000,
    currency: 'INR',
    style: 'luxury',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Vembanad Lake, Kumarakom',
    amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Bar'],
    aiMatchScore: 98,
    whyAiRecommends: '98% Match: Serene backwater luxury featuring infinity pool and traditional Kerala teak villas.',
    coordinates: { lat: 9.6175, lng: 76.4299 },
  },
  {
    id: 'htl-kerala-2',
    name: 'Alleppey Heritage Houseboat Private Stay',
    cityName: 'Kerala (Munnar & Alleppey)',
    country: 'India',
    starRating: 4,
    userRating: 4.7,
    reviewsCount: 340,
    pricePerNight: 7500,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Punnamada Jetty, Alleppey',
    amenities: ['Air Conditioning', 'Free Breakfast', 'Beachfront'],
    aiMatchScore: 96,
    whyAiRecommends: '96% Match: Private traditional wooden Kettuvallam boat with personal onboard chef and lake cruise.',
    coordinates: { lat: 9.4981, lng: 76.3388 },
  },

  // VARANASI HOTELS
  {
    id: 'htl-varanasi-1',
    name: 'BrijRama Palace Heritage Stay',
    cityName: 'Varanasi',
    country: 'India',
    starRating: 4,
    userRating: 4.9,
    reviewsCount: 310,
    pricePerNight: 8500,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Assi Ghat Riverside, Varanasi',
    amenities: ['Free Breakfast', 'WiFi', 'Air Conditioning', 'Rooftop Temple View'],
    aiMatchScore: 98,
    whyAiRecommends: '98% Match: Heritage riverside palace with private Ganges views, daily morning yoga, and authentic Ganga aarti access.',
    coordinates: { lat: 25.3032, lng: 82.9910 },
  },

  // AMRITSAR HOTELS
  {
    id: 'htl-amritsar-1',
    name: 'Taj Swarna Golden Temple Suite',
    cityName: 'Amritsar',
    country: 'India',
    starRating: 4,
    userRating: 4.7,
    reviewsCount: 460,
    pricePerNight: 7200,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Golden Temple Road, Amritsar',
    amenities: ['WiFi', 'Free Breakfast', 'Air Conditioning', 'Rooftop View'],
    aiMatchScore: 97,
    whyAiRecommends: '97% Match: Premium boutique stay within walking distance of Golden Temple with Langar seva access and rooftop dining.',
    coordinates: { lat: 31.6199, lng: 74.8765 },
  },
];

/** Normalise a backend API hotel response into the Hotel shape our UI expects */
function normalizeHotel(h: any): Hotel {
  const seed = SEED_HOTELS.find(s => s.name.toLowerCase() === h.name?.toLowerCase());
  return {
    id: h.id,
    name: h.name,
    cityName: h.cityName || h.cities?.name || '',
    country: h.country || h.cities?.country || '',
    address: h.address || seed?.address || '',
    rating: h.rating || h.userRating || seed?.rating || 4.5,
    starRating: h.starRating || seed?.starRating || 4,
    userRating: h.rating || h.userRating || seed?.rating || 4.5,
    reviewsCount: h.reviewsCount || 0,
    pricePerNight: h.pricePerNight || h.price_per_night || 0,
    currency: h.currency || 'INR',
    amenities: h.amenities || seed?.amenities || [],
    coverImage: h.coverImage || (h.images && h.images[0]) || h.image_url || seed?.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: h.images || [h.image_url || seed?.coverImage || ''],
    gallery: h.gallery || h.images || [],
    description: h.description || seed?.description || '',
    aiMatchScore: h.aiMatchScore || seed?.aiMatchScore || 85,
    whyAiRecommends: h.whyAiRecommends || h.whyRecommended || seed?.whyAiRecommends || 'Highly rated by travelers',
    whyRecommended: h.whyRecommended || h.whyAiRecommends || seed?.whyRecommended || 'Highly rated by travelers',
    coordinates: h.coordinates || (h.latitude ? { lat: h.latitude, lng: h.longitude } : seed?.coordinates),
  };
}

class HotelService {
  /** Called by TripHotelsPage with cityName (not cityId) */
  async getHotelsByCity(cityNameOrId: string, filters?: HotelFilterParams): Promise<Hotel[]> {
    // First try by city name via backend
    try {
      const data = await apiClient.get<Hotel[]>(`/hotels?city_name=${encodeURIComponent(cityNameOrId)}`);
      if (data && data.length > 0) {
        const normalized = data.map(normalizeHotel);
        storageService.setItem(HOTELS_CACHE_KEY, normalized);
        return this._applyFilters(normalized, filters);
      }
    } catch {}
    // Fallback: filter seed data by city name
    const name = cityNameOrId.toLowerCase();
    const seedFiltered = SEED_HOTELS.filter(h =>
      h.cityName.toLowerCase() === name ||
      h.cityName.toLowerCase().includes(name) ||
      name.includes(h.cityName.toLowerCase())
    );
    return this._applyFilters(seedFiltered.length > 0 ? seedFiltered : SEED_HOTELS, filters);
  }

  async getHotels(filters?: HotelFilterParams): Promise<Hotel[]> {
    try {
      const data = await apiClient.get<Hotel[]>('/hotels');
      if (data && data.length > 0) return this._applyFilters(data.map(normalizeHotel), filters);
      return this._applyFilters(SEED_HOTELS, filters);
    } catch {
      return this._applyFilters(SEED_HOTELS, filters);
    }
  }

  private _applyFilters(hotels: Hotel[], filters?: HotelFilterParams): Hotel[] {
    let result = [...hotels];
    if (filters?.maxPrice) result = result.filter(h => h.pricePerNight <= filters.maxPrice!);
    if (filters?.minStarRating) result = result.filter(h => (h.starRating || h.rating || 0) >= filters.minStarRating!);
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(h => h.name?.toLowerCase().includes(q) || h.cityName?.toLowerCase().includes(q));
    }
    if (filters?.sortBy === 'priceAsc') result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (filters?.sortBy === 'priceDesc') result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (filters?.sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (filters?.sortBy === 'aiMatch') result.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
    return result;
  }

  async getHotelById(id: string): Promise<Hotel | undefined> {
    try {
      const hotels = await apiClient.get<Hotel[]>('/hotels');
      const found = hotels.find(h => h.id === id);
      if (found) return normalizeHotel(found);
    } catch {}
    return SEED_HOTELS.find(h => h.id === id);
  }

  async searchHotels(query: string, cityName?: string): Promise<Hotel[]> {
    const lowerQuery = query.toLowerCase();
    const results = SEED_HOTELS.filter(h =>
      h.name.toLowerCase().includes(lowerQuery) ||
      h.cityName.toLowerCase().includes(lowerQuery) ||
      h.address?.toLowerCase().includes(lowerQuery)
    );
    if (cityName) return results.filter(h => h.cityName.toLowerCase().includes(cityName.toLowerCase()));
    return results;
  }
}

export const hotelService = new HotelService();
