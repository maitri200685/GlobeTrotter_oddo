import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { 
  Trip, 
  TripFilterParams, 
  CreateTripDTO, 
} from '@/types/trip.types';

const TRIPS_STORE_KEY = 'globetrotter_trips_v3';

/** Ensure a trip from the backend has all required frontend fields */
function normalizeTrip(t: any): Trip {
  return {
    id: t.id,
    userId: t.userId || t.owner_id || '',
    title: t.title || 'Untitled Trip',
    description: t.description || '',
    coverImage: t.coverImage || t.cover_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
    startDate: t.startDate || t.start_date || '',
    endDate: t.endDate || t.end_date || '',
    totalDays: t.totalDays || (t.startDate && t.endDate
      ? Math.max(1, Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000) + 1)
      : 0),
    travelerCount: t.travelerCount || 2,
    travelerType: t.travelerType || 'couple',
    status: t.status || 'upcoming',
    travelStyle: t.travelStyle || 'comfort',
    cities: t.cities || [],
    hotels: t.hotels || [],
    transport: t.transport || [],
    itinerary: t.itinerary || [],
    budget: t.budget || {
      targetBudget: t.total_budget || 0,
      totalEstimatedCost: 0,
      currency: 'INR',
      status: 'healthy',
      categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 },
    },
    isShared: t.isShared ?? true,
    shareId: t.shareId ?? null,
    createdAt: t.createdAt || t.created_at || new Date().toISOString(),
    updatedAt: t.updatedAt || t.updated_at || new Date().toISOString(),
  };
}

class TripService {
  async getTrips(filters?: TripFilterParams): Promise<Trip[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      const trips = await apiClient.get<Trip[]>(`/trips?${params.toString()}`);
      const normalized = (trips || []).map(normalizeTrip);
      
      // Sync to localStorage
      storageService.setItem<Trip[]>(TRIPS_STORE_KEY, normalized);
      return this._applyClientFilters(normalized, filters);
    } catch {
      // Fallback: localStorage
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      return this._applyClientFilters(local, filters);
    }
  }

  private _applyClientFilters(trips: Trip[], filters?: TripFilterParams): Trip[] {
    let result = [...trips];

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.cities?.some((c) => c.cityName?.toLowerCase().includes(q))
      );
    }

    if (filters?.sortBy) {
      result.sort((a, b) => {
        if (filters.sortBy === 'date') {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateA - dateB;
        }
        if (filters.sortBy === 'budget') return (a.budget?.targetBudget || 0) - (b.budget?.targetBudget || 0);
        if (filters.sortBy === 'duration') return (a.totalDays || 0) - (b.totalDays || 0);
        if (filters.sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
      if (filters.sortOrder === 'desc') result.reverse();
    }

    return result;
  }

  async getTripById(id: string): Promise<Trip> {
    // For local IDs, skip backend
    if (id.startsWith('local-')) {
      const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const found = trips.find((t) => t.id === id);
      if (found) return found;
      throw new Error(`Local trip ${id} not found`);
    }

    try {
      const trip = await apiClient.get<Trip>(`/trips/${id}`);
      const normalized = normalizeTrip(trip);
      // Update in localStorage cache
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const idx = local.findIndex(t => t.id === id);
      if (idx !== -1) local[idx] = normalized;
      else local.push(normalized);
      storageService.setItem(TRIPS_STORE_KEY, local);
      return normalized;
    } catch {
      const trips = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const found = trips.find((t) => t.id === id);
      if (found) return found;
      throw new Error(`Trip ${id} not found`);
    }
  }

  async createTrip(dto: CreateTripDTO, _userId?: string): Promise<Trip> {
    // Always try backend first
    try {
      const trip = await apiClient.post<Trip>('/trips', dto);
      const normalized = normalizeTrip(trip);
      
      // Cache locally
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      storageService.setItem<Trip[]>(TRIPS_STORE_KEY, [normalized, ...local.filter(t => t.id !== normalized.id)]);
      
      return normalized;
    } catch (err) {
      // Offline fallback — create locally
      console.warn('[TripService] Backend unavailable, creating trip locally');
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      const totalDays = isNaN(start.getTime()) || isNaN(end.getTime())
        ? 7
        : Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);

      const newTrip: Trip = {
        id: 'local-' + Math.random().toString(36).substring(2, 9),
        userId: 'local',
        title: dto.title,
        description: dto.description || '',
        coverImage: dto.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80',
        startDate: dto.startDate,
        endDate: dto.endDate,
        totalDays,
        travelerCount: dto.travelerCount || 2,
        travelerType: dto.travelerType || 'couple',
        status: 'upcoming',
        travelStyle: dto.travelStyle || 'comfort',
        cities: dto.initialCity ? [{ 
          id: 'c-' + Date.now(), 
          cityName: dto.initialCity, 
          country: '', 
          daysAllocated: totalDays, 
          order: 1 
        }] : [],
        hotels: [],
        transport: [],
        itinerary: [],
        budget: {
          targetBudget: dto.targetBudget || 0,
          totalEstimatedCost: 0,
          currency: dto.currency || 'INR',
          status: 'healthy',
          categories: { accommodation: 0, transport: 0, activities: 0, food: 0, other: 0 },
        },
        shareId: null as unknown as string | undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Trip;

      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      storageService.setItem<Trip[]>(TRIPS_STORE_KEY, [newTrip, ...local]);
      return newTrip;
    }
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    // For local trips, only update in localStorage
    if (id.startsWith('local-')) {
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const idx = local.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error('Trip not found');
      local[idx] = { ...local[idx], ...updates, updatedAt: new Date().toISOString() };
      storageService.setItem(TRIPS_STORE_KEY, local);
      return local[idx];
    }

    try {
      const updated = await apiClient.patch<Trip>(`/trips/${id}`, updates);
      // Merge response with updates to preserve all fields
      const merged = normalizeTrip({ ...updates, ...updated, id });
      
      const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
      const idx = local.findIndex((t) => t.id === id);
      if (idx !== -1) {
        local[idx] = { ...local[idx], ...merged };
        storageService.setItem(TRIPS_STORE_KEY, local);
      }
      return merged;
    } catch {
      // Update locally only
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
      targetBudget: source.budget?.targetBudget || 0,
      travelStyle: source.travelStyle,
      coverImage: source.coverImage,
      currency: source.budget?.currency,
    } as CreateTripDTO);
  }

  async deleteTrip(id: string): Promise<void> {
    if (!id.startsWith('local-')) {
      try {
        await apiClient.delete<void>(`/trips/${id}`);
      } catch (err) {
        console.warn('[TripService] Delete from backend failed, removing locally only');
      }
    }
    const local = storageService.getItem<Trip[]>(TRIPS_STORE_KEY, []);
    storageService.setItem(TRIPS_STORE_KEY, local.filter((t) => t.id !== id));
  }
}

export const tripService = new TripService();
