import { apiClient } from '../lib/apiClient';
import type { City, CityFilterParams } from '@/types/geo.types';

const SEED_CITIES: City[] = [
  { id: 'city-goa', name: 'Goa', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 15.2993, longitude: 74.1240, description: "India's beach paradise with golden sands, vibrant nightlife, and Portuguese heritage.", coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e578?auto=format&fit=crop&w=800&q=80', popularity: 95, costIndex: 3 } as any,
  { id: 'city-jaipur', name: 'Jaipur', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 26.9124, longitude: 75.7873, description: 'The Pink City with magnificent forts, palaces, and Rajasthani culture.', coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', popularity: 90, costIndex: 2 } as any,
  { id: 'city-kerala', name: 'Kerala', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 10.8505, longitude: 76.2711, description: "God's Own Country with lush backwaters, tea gardens, and Ayurveda.", coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', popularity: 88, costIndex: 2 } as any,
  { id: 'city-manali', name: 'Manali', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 32.2396, longitude: 77.1887, description: 'Himalayan adventure hub with snow peaks, river rafting, and ski slopes.', coverImage: 'https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80', popularity: 85, costIndex: 2 } as any,
  { id: 'city-kyoto', name: 'Kyoto', country: 'Japan', countryCode: 'JP', region: 'East Asia', latitude: 35.0116, longitude: 135.7681, description: "Japan's ancient capital with thousands of temples, geisha culture, and bamboo groves.", coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', popularity: 92, costIndex: 4 } as any,
  { id: 'city-paris', name: 'Paris', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 48.8566, longitude: 2.3522, description: 'City of Love with the Eiffel Tower, world-class cuisine, and art museums.', coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', popularity: 98, costIndex: 5 } as any,
  { id: 'city-bali', name: 'Bali', country: 'Indonesia', countryCode: 'ID', region: 'Southeast Asia', latitude: -8.3405, longitude: 115.0920, description: 'Island of Gods with spiritual temples, rice terraces, and surf beaches.', coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', popularity: 94, costIndex: 2 } as any,
  { id: 'city-nyc', name: 'New York', country: 'USA', countryCode: 'US', region: 'North America', latitude: 40.7128, longitude: -74.0060, description: "The Big Apple with Times Square, Central Park, and world-famous skyline.", coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', popularity: 97, costIndex: 5 } as any,
  { id: 'city-agra', name: 'Agra', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 27.1767, longitude: 78.0081, description: 'Home of the Taj Mahal, a symbol of eternal love and Mughal heritage.', coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', popularity: 89, costIndex: 2 } as any,
  { id: 'city-mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 19.0760, longitude: 72.8777, description: "India's financial capital with Bollywood, street food, and colonial architecture.", coverImage: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80', popularity: 91, costIndex: 3 } as any,
  { id: 'city-udaipur', name: 'Udaipur', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 24.5854, longitude: 73.7125, description: 'City of Lakes with romantic lake palaces, havelis, and Rajput grandeur.', coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', popularity: 84, costIndex: 2 } as any,
  { id: 'city-varanasi', name: 'Varanasi', country: 'India', countryCode: 'IN', region: 'South Asia', latitude: 25.3176, longitude: 82.9739, description: 'The spiritual capital of India on the banks of the Ganges.', coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', popularity: 82, costIndex: 1 } as any,
];

class CityService {
  async getCities(filters?: any): Promise<City[]> {
    try {
      let url = '/cities';
      if (filters?.region && filters.region !== 'All') url += `?region=${encodeURIComponent(filters.region)}`;
      const cities = await apiClient.get<City[]>(url);
      if (cities && cities.length > 0) return this._applyFilters(cities, filters);
      return this._applyFilters(SEED_CITIES, filters);
    } catch {
      return this._applyFilters(SEED_CITIES, filters);
    }
  }

  private _applyFilters(cities: City[], filters?: any): City[] {
    let result = [...cities];
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(c => c.name?.toLowerCase().includes(q) || c.country?.toLowerCase().includes(q));
    }
    return result;
  }

  async getFeaturedCities(): Promise<City[]> {
    try {
      const cities = await apiClient.get<City[]>('/cities');
      if (cities && cities.length > 0) return cities;
      return SEED_CITIES;
    } catch {
      return SEED_CITIES;
    }
  }

  async searchCities(query: string): Promise<City[]> {
    try {
      const cities = await apiClient.get<City[]>('/cities');
      const lowerQuery = query.toLowerCase();
      const filtered = (cities || []).filter(c =>
        c.name?.toLowerCase().includes(lowerQuery) || c.country?.toLowerCase().includes(lowerQuery)
      );
      if (filtered.length > 0) return filtered;
      throw new Error('empty');
    } catch {
      const lowerQuery = query.toLowerCase();
      return SEED_CITIES.filter(c =>
        c.name?.toLowerCase().includes(lowerQuery) || c.country?.toLowerCase().includes(lowerQuery)
      );
    }
  }

  async getCitiesByRegion(region: string): Promise<City[]> {
    try {
      const cities = await apiClient.get<City[]>(`/cities?region=${encodeURIComponent(region)}`);
      if (cities && cities.length > 0) return cities;
      return SEED_CITIES.filter(c => c.region === region);
    } catch {
      return SEED_CITIES.filter(c => c.region === region);
    }
  }

  async getCityById(id: string): Promise<City | undefined> {
    try {
      return await apiClient.get<City>(`/cities/${id}`);
    } catch {
      return SEED_CITIES.find(c => c.id === id);
    }
  }

  async getRecommendedCities(userPreferences?: any): Promise<City[]> {
    try {
      const cities = await apiClient.get<City[]>('/cities');
      if (cities && cities.length > 0) return cities.slice(0, 6);
      return SEED_CITIES.slice(0, 6);
    } catch {
      return SEED_CITIES.slice(0, 6);
    }
  }
}

export const cityService = new CityService();
