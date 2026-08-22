import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { 
  Trip, 
  TripFilterParams, 
  CreateTripDTO, 
} from '@/types/trip.types';

const TRIPS_STORE_KEY = 'globetrotter_trips_v2';

class TripService {
  async getTrips(filters?: TripFilterParams): Promise<Trip[]> {
    try {
      // Try real backend API first
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      const trips = await apiClient.get<Trip[]>(`/trips?${params.toString()}`);
      
      // Sync to localStorage so UI works offline too
      if (trips && trips.length > 0) {
        storageService.setItem<Trip[]>(TRIPS_STORE_KEY, trips);
      }

      // Apply client-side filters (search, sort) not supported by backend
      return this._applyClientFilters(trips || [], filters);
    } catch {
      // Fallback: load from localStorage if backend is unavailable or user not authenticated
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      return this._applyClientFilters(local, filters);
    }
  }

  private _applyClientFilters(trips: Trip[], filters?: TripFilterParams): Trip[] {
    let result = [...trips];

    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.cities?.some((c) => c.cityName?.toLowerCase().includes(q))
      );
    }

    if (filters?.sortBy) {
      result.sort((a, b) => {
        if (filters.sortBy === 'date') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        if (filters.sortBy === 'budget') return a.budget.targetBudget - b.budget.targetBudget;
        if (filters.sortBy === 'duration') return a.totalDays - b.totalDays;
        if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
      if (filters.sortOrder === 'desc') result.reverse();
    }

    return result;
  }

  async getTripById(id: string): Promise<Trip> {
    try {
      return await apiClient.get<Trip>(`/trips/${id}`);
    } catch {
      // Fallback to local storage
      const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const found = trips.find((t) => t.id === id);
      if (found) return found;
      throw new Error(`Trip ${id} not found`);
    }
  }

  async createTrip(dto: CreateTripDTO, userId?: string): Promise<Trip> {
    try {
      // Try to save to the real backend (persisted in Supabase)
      const trip = await apiClient.post<Trip>('/trips', dto);
      
      // Also cache locally
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      storageService.setItem<Trip[]>(TRIPS_STORE_KEY, [trip, ...local]);
      
      return trip;
    } catch (err) {
      // Offline fallback: create locally with generated ID
      console.warn('[TripService] Backend unavailable, creating trip locally');
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);

      const newTrip: Trip = {
        id: 'local-' + Math.random().toString(36).substring(2, 9),
        userId: userId || 'local',
        title: dto.title,
        description: dto.description || '',
        coverImage: dto.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
        startDate: dto.startDate,
        endDate: dto.endDate,
        totalDays,
        travelerCount: dto.travelerCount,
        travelerType: dto.travelerType || 'couple',
        status: 'upcoming',
        travelStyle: dto.travelStyle || 'comfort',
        cities: dto.initialCity ? [{ id: 'c-' + Date.now(), cityName: dto.initialCity, country: '', daysAllocated: totalDays, order: 1 }] : [],
        hotels: [],
        transport: [],
        itinerary: [],
        budget: {
          targetBudget: dto.targetBudget,
          totalEstimatedCost: 0,
          currency: dto.currency || 'INR',
          status: 'healthy',
          categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Trip;

      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      storageService.setItem<Trip[]>(TRIPS_STORE_KEY, [newTrip, ...local]);
      return newTrip;
    }
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    try {
      const updated = await apiClient.patch<Trip>(`/trips/${id}`, updates);
      // Update in local cache too
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const idx = local.findIndex((t) => t.id === id);
      if (idx !== -1) { local[idx] = updated; storageService.setItem(TRIPS_STORE_KEY, local); }
      return updated;
    } catch {
      // Update locally
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const idx = local.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error('Trip not found');
      local[idx] = { ...local[idx], ...updates, updatedAt: new Date().toISOString() };
      storageService.setItem(TRIPS_STORE_KEY, local);
      return local[idx];
    }
  }

  async duplicateTrip(id: string): Promise<Trip> {
    const source = await this.getTripById(id);
    return this.createTrip({
      title: `${source.title} (Copy)`,
      description: source.description,
      startDate: source.startDate,
      endDate: source.endDate,
      travelerCount: source.travelerCount,
      travelerType: source.travelerType,
      targetBudget: source.budget.targetBudget,
      travelStyle: source.travelStyle,
      coverImage: source.coverImage,
    } as CreateTripDTO);
  }

  async deleteTrip(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/trips/${id}`);
    } catch {
      // Remove locally
    }
    // Always remove from local cache
    const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
    storageService.setItem(TRIPS_STORE_KEY, local.filter((t) => t.id !== id));
  }
}

export const tripService = new TripService();
