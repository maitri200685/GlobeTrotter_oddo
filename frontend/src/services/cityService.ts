import { apiClient } from '../lib/apiClient';
import type { City, CityFilterParams } from '@/types/geo.types';

class CityService {
  async getCities(filters?: any): Promise<City[]> {
    const url = filters?.region && filters.region !== 'All' 
      ? `/cities?region=${encodeURIComponent(filters.region)}` 
      : '/cities';
    let cities = await apiClient.get<City[]>(url);
    if (filters?.searchQuery) {
      const lowerQuery = filters.searchQuery.toLowerCase();
      cities = cities.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) || 
        c.country.toLowerCase().includes(lowerQuery)
      );
    }
    return cities;
  }

  async getFeaturedCities(): Promise<City[]> {
    return await apiClient.get<City[]>('/cities');
  }

  async searchCities(query: string): Promise<City[]> {
    // Backend doesn't support search yet, so we fetch all and filter client side
    // In a real app we'd pass ?q=query
    const cities = await apiClient.get<City[]>('/cities');
    const lowerQuery = query.toLowerCase();
    return cities.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.country.toLowerCase().includes(lowerQuery)
    );
  }

  async getCitiesByRegion(region: string): Promise<City[]> {
    return await apiClient.get<City[]>(`/cities?region=${encodeURIComponent(region)}`);
  }

  async getCityById(id: string): Promise<City | undefined> {
    try {
      return await apiClient.get<City>(`/cities/${id}`);
    } catch (e) {
      return undefined;
    }
  }

  async getRecommendedCities(userPreferences: any): Promise<City[]> {
    // For now return all, could add an endpoint later
    const cities = await apiClient.get<City[]>('/cities');
    return cities.slice(0, 6);
  }
}

export const cityService = new CityService();
