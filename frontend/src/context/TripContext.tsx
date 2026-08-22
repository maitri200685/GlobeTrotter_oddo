import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
    sortOrder: 'desc', // newest first
  });

  // Use refs to avoid stale closures in callbacks
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const activeTripRef = useRef(activeTrip);
  activeTripRef.current = activeTrip;

  const { success, info, error } = useToast();

  // loadTrips does NOT depend on activeTrip — removing it from deps to prevent loops
  const loadTrips = useCallback(async (currentFilters: TripFilterParams) => {
    setIsLoading(true);
    try {
      const data = await tripService.getTrips(currentFilters);
      setTrips(data);
      // Only set active trip if none is set yet
      if (data.length > 0 && !activeTripRef.current) {
        setActiveTrip(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load trips:', err);
      // Keep existing trips in state, don't wipe them on error
    } finally {
      setIsLoading(false);
    }
  }, []); // No deps — stable function reference

  useEffect(() => {
    loadTrips(filters);
  }, [filters, loadTrips]);

  const setFilters = useCallback((newFilters: Partial<TripFilterParams>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshTrips = useCallback(async () => {
    await loadTrips(filtersRef.current);
  }, [loadTrips]);

  const selectTrip = useCallback(async (id: string) => {
    // First check if we already have it in state
    const existing = trips.find(t => t.id === id);
    if (existing) {
      setActiveTrip(existing);
      return existing;
    }
    try {
      const trip = await tripService.getTripById(id);
      setActiveTrip(trip);
      return trip;
    } catch (err) {
      // If not found in backend, try local trips
      const localTrip = trips.find(t => t.id === id);
      if (localTrip) {
        setActiveTrip(localTrip);
        return localTrip;
      }
      throw err;
    }
  }, [trips]);

  const createTrip = useCallback(async (dto: CreateTripDTO) => {
    setIsLoading(true);
    try {
      const newTrip = await tripService.createTrip(dto);
      // Optimistically add to state immediately — user sees it right away
      setTrips((prev) => [newTrip, ...prev.filter(t => t.id !== newTrip.id)]);
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
      // Merge updates into existing trip to preserve all fields
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, ...updated } : t));
      setActiveTrip(prev => prev?.id === id ? { ...prev, ...updated } : prev);
      return updated;
    } catch (err: any) {
      error('Update Failed', err.message);
      throw err;
    }
  }, [error]);

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
      setActiveTrip(prev => {
        if (prev?.id === id) {
          // Set to first remaining trip
          return null; // Will be set on next render
        }
        return prev;
      });
      info('Trip Deleted', 'The itinerary has been removed from your account.');
    } catch (err: any) {
      error('Delete Failed', err.message);
      throw err;
    }
  }, [info, error]);

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
