import { apiClient } from '../lib/apiClient';
import type { 
  Trip, 
  TripFilterParams, 
  CreateTripDTO, 
} from '@/types/trip.types';

class TripService {
  async getTrips(filters?: TripFilterParams): Promise<Trip[]> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    // Note: Backend might need to support sorting/searching in the future,
    // currently returning all and we can filter on client if backend lacks it,
    // but best practice is to pass it.
    
    return await apiClient.get<Trip[]>(`/trips?${params.toString()}`);
  }

  async getTripById(id: string): Promise<Trip> {
    return await apiClient.get<Trip>(`/trips/${id}`);
  }

  async createTrip(dto: CreateTripDTO, userId?: string): Promise<Trip> {
    // userId is ignored since backend extracts it from token
    return await apiClient.post<Trip>('/trips', dto);
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    return await apiClient.patch<Trip>(`/trips/${id}`, updates);
  }

  async duplicateTrip(id: string): Promise<Trip> {
    const source = await this.getTripById(id);
    const dto: CreateTripDTO = {
      title: `${source.title} (Copy)`,
      description: source.description,
      startDate: source.startDate,
      endDate: source.endDate,
      travelerCount: source.travelerCount,
      travelerType: source.travelerType,
      targetBudget: source.budget.targetBudget,
      travelStyle: source.travelStyle,
      coverImage: source.coverImage,
    };
    return await this.createTrip(dto);
  }

  async deleteTrip(id: string): Promise<void> {
    return await apiClient.delete<void>(`/trips/${id}`);
  }
}

export const tripService = new TripService();
