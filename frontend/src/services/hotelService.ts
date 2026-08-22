import { apiClient } from '../lib/apiClient';
import type { Hotel, HotelFilterParams } from '@/types/inventory.types';

class HotelService {
  async getHotelsByCity(cityId: string, filters?: HotelFilterParams): Promise<Hotel[]> {
    return await apiClient.get<Hotel[]>(`/hotels?city_id=${cityId}`);
  }

  async getHotelById(id: string): Promise<Hotel | undefined> {
    try {
      // Backend doesn't have a specific getHotelById endpoint, but we can query by id or just fetch all and find it
      // Let's assume a get /hotels/:id is available or just fetch all for now
      // If no endpoint, we can fallback to fetching hotels and filtering.
      // But we wrote hotel.controller.ts and only put `router.get('/', getHotels);`
      // So we have to fetch all and find it.
      const hotels = await apiClient.get<Hotel[]>('/hotels');
      return hotels.find(h => h.id === id);
    } catch (e) {
      return undefined;
    }
  }

  async searchHotels(query: string, cityId?: string): Promise<Hotel[]> {
    const url = cityId ? `/hotels?city_id=${cityId}` : '/hotels';
    const hotels = await apiClient.get<Hotel[]>(url);
    const lowerQuery = query.toLowerCase();
    return hotels.filter(h => 
      h.name.toLowerCase().includes(lowerQuery) || 
      h.address.toLowerCase().includes(lowerQuery)
    );
  }
}

export const hotelService = new HotelService();
