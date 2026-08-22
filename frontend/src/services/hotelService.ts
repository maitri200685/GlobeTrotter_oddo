import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { Hotel, HotelFilterParams } from '@/types/inventory.types';

const HOTELS_CACHE_KEY = 'gt_hotels_cache';

const SEED_HOTELS: Hotel[] = [
  { id: 'htl-goa-1', name: 'Taj Exotica Resort & Spa', cityName: 'Goa', country: 'India', address: 'Calwaddo, Benaulim, South Goa', rating: 4.8, pricePerNight: 18000, currency: 'INR', amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar', 'WiFi', 'Gym'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], description: 'Luxury beachfront resort with private beach, infinity pool and world-class spa.' } as any,
  { id: 'htl-goa-2', name: 'The Leela Goa', cityName: 'Goa', country: 'India', address: 'Mobor, Cavelossim, South Goa', rating: 4.7, pricePerNight: 15000, currency: 'INR', amenities: ['Pool', 'Spa', 'Golf', 'Restaurant', 'WiFi', 'Beach Access'], images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning 5-star resort set amid 75 acres of beautiful Goa landscape.' } as any,
  { id: 'htl-goa-3', name: 'Alila Diwa Goa', cityName: 'Goa', country: 'India', address: 'Majorda, South Goa', rating: 4.6, pricePerNight: 12000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Cycling'], images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'], description: 'Contemporary luxury resort showcasing Goan village culture.' } as any,
  { id: 'htl-goa-4', name: 'Acron Waterfront Resort', cityName: 'Goa', country: 'India', address: 'Baga Creek, North Goa', rating: 4.2, pricePerNight: 5500, currency: 'INR', amenities: ['Pool', 'Restaurant', 'WiFi', 'River View'], images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'], description: 'Boutique riverside resort with beautiful views and Goan hospitality.' } as any,
  { id: 'htl-jai-1', name: 'Rambagh Palace', cityName: 'Jaipur', country: 'India', address: 'Bhawani Singh Rd, Jaipur', rating: 4.9, pricePerNight: 35000, currency: 'INR', amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Polo', 'WiFi', 'Heritage Tours'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'], description: 'Former royal residence of the Maharaja, a magnificent palace hotel.' } as any,
  { id: 'htl-jai-2', name: 'The Oberoi Rajvilas', cityName: 'Jaipur', country: 'India', address: 'Goner Road, Jaipur', rating: 4.8, pricePerNight: 28000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Yoga'], images: ['https://images.unsplash.com/photo-1609602988946-97fe28d73553?auto=format&fit=crop&w=800&q=80'], description: 'Luxury tented camp inspired by Mughal architecture.' } as any,
  { id: 'htl-jai-3', name: 'Hotel Pearl Palace', cityName: 'Jaipur', country: 'India', address: 'Hari Kishan Somani Marg, Hathroi Fort', rating: 4.4, pricePerNight: 3500, currency: 'INR', amenities: ['Restaurant', 'WiFi', 'Terrace', 'City Tours'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning heritage boutique hotel in old Jaipur.' } as any,
  { id: 'htl-ker-1', name: 'Kumarakom Lake Resort', cityName: 'Kerala', country: 'India', address: 'Kumarakom, Kottayam', rating: 4.8, pricePerNight: 22000, currency: 'INR', amenities: ['Pool', 'Spa', 'Backwater Cruises', 'Restaurant', 'Ayurveda', 'WiFi'], images: ['https://images.unsplash.com/photo-1582610116397-edb72b1f7cf5?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning heritage resort on the banks of Vembanad Lake.' } as any,
  { id: 'htl-ker-2', name: 'Coconut Lagoon', cityName: 'Kerala', country: 'India', address: 'Vembanad Lake, Kumarakom', rating: 4.7, pricePerNight: 18000, currency: 'INR', amenities: ['Pool', 'Backwaters', 'Ayurveda', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80'], description: 'Heritage villas on Vembanad Lake accessible only by boat.' } as any,
  { id: 'htl-man-1', name: 'Span Resort & Spa', cityName: 'Manali', country: 'India', address: 'Kullu - Manali Highway, Katrain', rating: 4.7, pricePerNight: 12000, currency: 'INR', amenities: ['Spa', 'River View', 'Restaurant', 'Bonfire', 'WiFi'], images: ['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning luxury resort on the banks of river Beas.' } as any,
  { id: 'htl-kyo-1', name: 'The Ritz-Carlton Kyoto', cityName: 'Kyoto', country: 'Japan', address: 'Kamogawa Nijo-Ohashi Hotori, Kyoto', rating: 4.9, pricePerNight: 65000, currency: 'JPY', amenities: ['Pool', 'Spa', 'River View', 'Restaurant', 'Concierge', 'WiFi'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'], description: 'Ultra-luxury hotel on the banks of the Kamogawa River.' } as any,
  { id: 'htl-par-1', name: 'The Peninsula Paris', cityName: 'Paris', country: 'France', address: '19 Avenue Kléber, 75116 Paris', rating: 4.9, pricePerNight: 85000, currency: 'EUR', amenities: ['Pool', 'Spa', 'Rooftop Restaurant', 'WiFi', 'Concierge'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'], description: 'Iconic luxury hotel near the Arc de Triomphe with Eiffel Tower views.' } as any,
  { id: 'htl-bal-1', name: 'Four Seasons Resort Bali at Sayan', cityName: 'Bali', country: 'Indonesia', address: 'Sayan, Ubud, Bali', rating: 4.9, pricePerNight: 55000, currency: 'IDR', amenities: ['Pool', 'Spa', 'Yoga', 'Restaurant', 'Jungle Trekking', 'WiFi'], images: ['https://images.unsplash.com/photo-1540541338537-1220059135de?auto=format&fit=crop&w=800&q=80'], description: 'Legendary jungle resort above the Ayung River gorge.' } as any,
  { id: 'htl-agr-1', name: 'The Oberoi Amarvilas', cityName: 'Agra', country: 'India', address: 'Taj East Gate, Agra', rating: 4.9, pricePerNight: 45000, currency: 'INR', amenities: ['Pool', 'Spa', 'Taj View', 'Restaurant', 'WiFi'], images: ['https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80'], description: 'Every room has a view of the Taj Mahal.' } as any,
  { id: 'htl-mum-1', name: 'The Taj Mahal Palace', cityName: 'Mumbai', country: 'India', address: 'Apollo Bunder, Colaba, Mumbai', rating: 4.9, pricePerNight: 28000, currency: 'INR', amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Sea View', 'WiFi', 'Concierge'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'], description: "Mumbai's most iconic hotel overlooking the Gateway of India since 1903." } as any,
  { id: 'htl-uda-1', name: 'Taj Lake Palace', cityName: 'Udaipur', country: 'India', address: 'Lake Pichola, Udaipur', rating: 4.9, pricePerNight: 32000, currency: 'INR', amenities: ['Pool', 'Spa', 'Boat Access', 'Multiple Restaurants', 'WiFi'], images: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'], description: "A marble palace seemingly floating on Lake Pichola." } as any,
  { id: 'htl-var-1', name: 'BrijRama Palace', cityName: 'Varanasi', country: 'India', address: 'Darbhanga Ghat, Varanasi', rating: 4.7, pricePerNight: 12000, currency: 'INR', amenities: ['Ganga View', 'Restaurant', 'Yoga', 'Heritage Tours', 'WiFi'], images: ['https://images.unsplash.com/photo-1561401111-701e69de30b4?auto=format&fit=crop&w=800&q=80'], description: 'A 200-year-old haveli converted into a boutique hotel on the Ganges ghats.' } as any,
  { id: 'htl-nyc-1', name: 'The Plaza Hotel', cityName: 'New York', country: 'USA', address: 'Fifth Avenue at Central Park South', rating: 4.8, pricePerNight: 95000, currency: 'USD', amenities: ['Spa', 'Restaurant', 'Bar', 'Central Park View', 'Concierge', 'WiFi'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], description: 'Iconic landmark luxury hotel overlooking Central Park since 1907.' } as any,
];

class HotelService {
  async getHotelsByCity(cityId: string, filters?: HotelFilterParams): Promise<Hotel[]> {
    try {
      const data = await apiClient.get<Hotel[]>(`/hotels?city_id=${cityId}`);
      if (data && data.length > 0) return this._applyFilters(data, filters);
      return this._applyFilters(SEED_HOTELS, filters);
    } catch {
      return this._applyFilters(SEED_HOTELS, filters);
    }
  }

  async getHotelsByCityName(cityName: string, filters?: HotelFilterParams): Promise<Hotel[]> {
    try {
      const data = await apiClient.get<Hotel[]>(`/hotels?city_name=${encodeURIComponent(cityName)}`);
      if (data && data.length > 0) return this._applyFilters(data, filters);
      return this._applyFilters(SEED_HOTELS.filter(h => h.cityName?.toLowerCase() === cityName.toLowerCase()), filters);
    } catch {
      return this._applyFilters(SEED_HOTELS.filter(h => h.cityName?.toLowerCase() === cityName.toLowerCase()), filters);
    }
  }

  async getHotels(filters?: HotelFilterParams): Promise<Hotel[]> {
    try {
      const data = await apiClient.get<Hotel[]>('/hotels');
      if (data && data.length > 0) return this._applyFilters(data, filters);
      return this._applyFilters(SEED_HOTELS, filters);
    } catch {
      return this._applyFilters(SEED_HOTELS, filters);
    }
  }

  private _applyFilters(hotels: Hotel[], filters?: HotelFilterParams): Hotel[] {
    let result = [...hotels];
    if (filters?.maxPrice) result = result.filter(h => h.pricePerNight <= filters.maxPrice!);
    if (filters?.minStarRating) result = result.filter(h => (h.starRating || (h as any).rating || 0) >= filters.minStarRating!);
    if ((filters as any)?.searchQuery?.trim()) {
      const q = (filters as any).searchQuery.toLowerCase();
      result = result.filter(h => h.name?.toLowerCase().includes(q) || h.cityName?.toLowerCase().includes(q));
    }
    return result;
  }

  async getHotelById(id: string): Promise<Hotel | undefined> {
    try {
      const hotels = await apiClient.get<Hotel[]>('/hotels');
      return hotels.find(h => h.id === id) || SEED_HOTELS.find(h => h.id === id);
    } catch {
      return SEED_HOTELS.find(h => h.id === id);
    }
  }

  async searchHotels(query: string, cityId?: string): Promise<Hotel[]> {
    try {
      const url = cityId ? `/hotels?city_id=${cityId}` : '/hotels';
      const hotels = await apiClient.get<Hotel[]>(url);
      const lowerQuery = query.toLowerCase();
      const filtered = (hotels || []).filter(h =>
        h.name?.toLowerCase().includes(lowerQuery) ||
        h.cityName?.toLowerCase().includes(lowerQuery)
      );
      if (filtered.length > 0) return filtered;
      throw new Error('empty');
    } catch {
      const lowerQuery = query.toLowerCase();
      return SEED_HOTELS.filter(h =>
        h.name?.toLowerCase().includes(lowerQuery) ||
        h.cityName?.toLowerCase().includes(lowerQuery) ||
        h.address?.toLowerCase().includes(lowerQuery)
      );
    }
  }
}

export const hotelService = new HotelService();
