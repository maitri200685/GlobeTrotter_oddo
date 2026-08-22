import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tripService } from '@/services/tripService';
import type { 
  Trip, 
  TripFilterParams, 
  CreateTripDTO 
} from '@/types/trip.types';
import { useToast } from '@/context/ToastContext';

interface TripContextValue {
  trips: Trip[];
  activeTrip: Trip | null;
  isLoading: boolean;
  filters: TripFilterParams;
  setFilters: (filters: Partial<TripFilterParams>) => void;
  refreshTrips: () => Promise<void>;
  selectTrip: (id: string) => Promise<Trip>;
  createTrip: (dto: CreateTripDTO) => Promise<Trip>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<Trip>;
  duplicateTrip: (id: string) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
}

const TripContext = createContext<TripContextValue | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<TripFilterParams>({
    status: 'all',
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'asc',
  });

  const { success, info, error } = useToast();

  const loadTrips = useCallback(async (currentFilters: TripFilterParams) => {
    setIsLoading(true);
    try {
      const data = await tripService.getTrips(currentFilters);
      setTrips(data);
      if (data.length > 0 && !activeTrip) {
        setActiveTrip(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load trips:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTrip]);

  useEffect(() => {
    loadTrips(filters);
  }, [filters, loadTrips]);

  const setFilters = useCallback((newFilters: Partial<TripFilterParams>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshTrips = useCallback(async () => {
    await loadTrips(filters);
  }, [filters, loadTrips]);

  const selectTrip = useCallback(async (id: string) => {
    const trip = await tripService.getTripById(id);
    setActiveTrip(trip);
    return trip;
  }, []);

  const createTrip = useCallback(async (dto: CreateTripDTO) => {
    setIsLoading(true);
    try {
      const newTrip = await tripService.createTrip(dto);
      setTrips((prev) => [newTrip, ...prev]);
      setActiveTrip(newTrip);
      success('Trip Created!', `"${newTrip.title}" is ready for destinations & activities.`);
      return newTrip;
    } catch (err: any) {
      error('Creation Failed', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [success, error]);

  const updateTrip = useCallback(async (id: string, updates: Partial<Trip>) => {
    try {
      const updated = await tripService.updateTrip(id, updates);
      setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (activeTrip?.id === id) {
        setActiveTrip(updated);
      }
      success('Trip Updated', `Changes to "${updated.title}" saved.`);
      return updated;
    } catch (err: any) {
      error('Update Failed', err.message);
      throw err;
    }
  }, [activeTrip, success, error]);

  const duplicateTrip = useCallback(async (id: string) => {
    try {
      const cloned = await tripService.duplicateTrip(id);
      setTrips((prev) => [cloned, ...prev]);
      success('Trip Duplicated', `Created copy "${cloned.title}"`);
      return cloned;
    } catch (err: any) {
      error('Duplication Failed', err.message);
      throw err;
    }
  }, [success, error]);

  const deleteTrip = useCallback(async (id: string) => {
    try {
      await tripService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      if (activeTrip?.id === id) {
        const remaining = trips.filter((t) => t.id !== id);
        setActiveTrip(remaining[0] || null);
      }
      info('Trip Deleted', 'The itinerary has been removed from your account.');
    } catch (err: any) {
      error('Delete Failed', err.message);
      throw err;
    }
  }, [activeTrip, trips, info, error]);

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        isLoading,
        filters,
        setFilters,
        refreshTrips,
        selectTrip,
        createTrip,
        updateTrip,
        duplicateTrip,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextValue => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
