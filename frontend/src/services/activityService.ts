import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { Activity, ActivityFilterParams } from '@/types/inventory.types';

const ACTIVITIES_CACHE_KEY = 'gt_activities_cache';

const SEED_ACTIVITIES: Activity[] = [
  { id: 'act-goa-1', title: 'Grande Island Scuba Diving', cityName: 'Goa', country: 'India', category: 'adventure', estimatedCost: 3500, currency: 'INR', durationMinutes: 240, description: 'Dive into crystal clear waters around Grande Island. Spot corals, tropical fish, and sea turtles.', images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'], rating: 4.8 } as any,
  { id: 'act-goa-2', title: 'Dudhsagar Waterfall Trek', cityName: 'Goa', country: 'India', category: 'adventure', estimatedCost: 1200, currency: 'INR', durationMinutes: 480, description: 'Epic 4-tier waterfall trek through the Western Ghats.', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'], rating: 4.7 } as any,
  { id: 'act-goa-3', title: 'Old Goa Churches Tour', cityName: 'Goa', country: 'India', category: 'culture', estimatedCost: 500, currency: 'INR', durationMinutes: 180, description: 'UNESCO World Heritage churches including Basilica of Bom Jesus.', images: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'], rating: 4.6 } as any,
  { id: 'act-goa-4', title: 'Calangute Beach Parasailing', cityName: 'Goa', country: 'India', category: 'adventure', estimatedCost: 1500, currency: 'INR', durationMinutes: 60, description: 'Soar above Goa\'s most popular beach with thrilling parasailing.', images: ['https://images.unsplash.com/photo-1542397284385-6010376c5337?auto=format&fit=crop&w=800&q=80'], rating: 4.5 } as any,
  { id: 'act-goa-5', title: 'Goan Fish Curry Cooking Class', cityName: 'Goa', country: 'India', category: 'food', estimatedCost: 2000, currency: 'INR', durationMinutes: 180, description: 'Learn to cook authentic Goan seafood in a local home kitchen.', images: ['https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-jai-1', title: 'Amber Fort Tour', cityName: 'Jaipur', country: 'India', category: 'sightseeing', estimatedCost: 1200, currency: 'INR', durationMinutes: 240, description: 'Explore the stunning hilltop Amber Fort with elephant ride and light show.', images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'], rating: 4.8 } as any,
  { id: 'act-jai-2', title: 'Hot Air Balloon Sunrise', cityName: 'Jaipur', country: 'India', category: 'adventure', estimatedCost: 8500, currency: 'INR', durationMinutes: 120, description: 'Float above Jaipur\'s majestic forts and palaces at dawn.', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-ker-1', title: 'Alleppey Houseboat Cruise', cityName: 'Kerala', country: 'India', category: 'nature', estimatedCost: 12000, currency: 'INR', durationMinutes: 1440, description: 'Overnight stay in a traditional Kerala houseboat through scenic backwaters.', images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-ker-2', title: 'Periyar Tiger Reserve Safari', cityName: 'Kerala', country: 'India', category: 'nature', estimatedCost: 2500, currency: 'INR', durationMinutes: 240, description: 'Boat safari through Periyar Wildlife Sanctuary. Spot elephants and tigers.', images: ['https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80'], rating: 4.7 } as any,
  { id: 'act-man-1', title: 'Solang Valley Snow Activities', cityName: 'Manali', country: 'India', category: 'adventure', estimatedCost: 2000, currency: 'INR', durationMinutes: 240, description: 'Skiing, snow zorbing, and snowboarding in the iconic Solang Valley.', images: ['https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80'], rating: 4.8 } as any,
  { id: 'act-man-2', title: 'Beas River White Water Rafting', cityName: 'Manali', country: 'India', category: 'adventure', estimatedCost: 1500, currency: 'INR', durationMinutes: 180, description: 'Thrilling Grade 3-4 rafting through stunning Kullu Valley.', images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'], rating: 4.7 } as any,
  { id: 'act-kyo-1', title: 'Fushimi Inari Shrine Walk', cityName: 'Kyoto', country: 'Japan', category: 'sightseeing', estimatedCost: 0, currency: 'JPY', durationMinutes: 180, description: 'Walk through thousands of vibrant torii gates up Mount Inari at dawn.', images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-kyo-2', title: 'Traditional Tea Ceremony', cityName: 'Kyoto', country: 'Japan', category: 'culture', estimatedCost: 3500, currency: 'JPY', durationMinutes: 90, description: 'Experience an authentic Japanese tea ceremony in a historic machiya.', images: ['https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=800&q=80'], rating: 4.8 } as any,
  { id: 'act-par-1', title: 'Eiffel Tower Skip-the-Line', cityName: 'Paris', country: 'France', category: 'sightseeing', estimatedCost: 4500, currency: 'EUR', durationMinutes: 120, description: 'Priority access to all three floors of the iconic Eiffel Tower.', images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'], rating: 4.8 } as any,
  { id: 'act-bal-1', title: 'Mount Batur Sunrise Trek', cityName: 'Bali', country: 'Indonesia', category: 'adventure', estimatedCost: 3500, currency: 'IDR', durationMinutes: 360, description: 'Pre-dawn hike to the summit of active volcano for breathtaking sunrise.', images: ['https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-agr-1', title: 'Taj Mahal Sunrise Visit', cityName: 'Agra', country: 'India', category: 'sightseeing', estimatedCost: 1500, currency: 'INR', durationMinutes: 180, description: 'Witness the Taj Mahal in the magical light of sunrise.', images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-mum-1', title: 'Mumbai Street Food Tour', cityName: 'Mumbai', country: 'India', category: 'food', estimatedCost: 1500, currency: 'INR', durationMinutes: 240, description: 'Taste vada pav, pav bhaji, and chaat with a local food expert guide.', images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'], rating: 4.8 } as any,
  { id: 'act-uda-1', title: 'Lake Pichola Sunset Boat Ride', cityName: 'Udaipur', country: 'India', category: 'sightseeing', estimatedCost: 700, currency: 'INR', durationMinutes: 60, description: 'Romantic boat ride on Lake Pichola with views of City Palace and Lake Palace.', images: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
  { id: 'act-var-1', title: 'Ganga Aarti Ceremony', cityName: 'Varanasi', country: 'India', category: 'culture', estimatedCost: 200, currency: 'INR', durationMinutes: 60, description: 'Witness the spectacular nightly fire ritual on the banks of the sacred Ganges.', images: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'], rating: 4.9 } as any,
];

class ActivityService {
  async getActivitiesByCity(cityId: string, filters?: ActivityFilterParams): Promise<Activity[]> {
    try {
      const data = await apiClient.get<Activity[]>(`/activities?city_id=${cityId}`);
      if (data && data.length > 0) {
        storageService.setItem(ACTIVITIES_CACHE_KEY, data);
        return data;
      }
      return SEED_ACTIVITIES;
    } catch {
      return SEED_ACTIVITIES;
    }
  }

  async getActivitiesByCityName(cityName: string, filters?: ActivityFilterParams): Promise<Activity[]> {
    try {
      const data = await apiClient.get<Activity[]>(`/activities?city_name=${encodeURIComponent(cityName)}`);
      if (data && data.length > 0) return this._applyFilters(data, filters);
      return this._applyFilters(SEED_ACTIVITIES.filter(a => a.cityName?.toLowerCase() === cityName.toLowerCase()), filters);
    } catch {
      return this._applyFilters(SEED_ACTIVITIES.filter(a => a.cityName?.toLowerCase() === cityName.toLowerCase()), filters);
    }
  }

  async getActivities(filters?: ActivityFilterParams): Promise<Activity[]> {
    try {
      const data = await apiClient.get<Activity[]>('/activities');
      if (data && data.length > 0) return this._applyFilters(data, filters);
      return this._applyFilters(SEED_ACTIVITIES, filters);
    } catch {
      return this._applyFilters(SEED_ACTIVITIES, filters);
    }
  }

  private _applyFilters(activities: Activity[], filters?: ActivityFilterParams): Activity[] {
    let result = [...activities];
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(a => a.title?.toLowerCase().includes(q) || a.cityName?.toLowerCase().includes(q));
    }
    return result;
  }

  async getActivityById(id: string): Promise<Activity | undefined> {
    try {
      const activities = await apiClient.get<Activity[]>('/activities');
      return activities.find(a => a.id === id) || SEED_ACTIVITIES.find(a => a.id === id);
    } catch {
      return SEED_ACTIVITIES.find(a => a.id === id);
    }
  }

  async searchActivities(query: string, cityId?: string): Promise<Activity[]> {
    try {
      const url = cityId ? `/activities?city_id=${cityId}` : '/activities';
      const activities = await apiClient.get<Activity[]>(url);
      const lowerQuery = query.toLowerCase();
      const filtered = (activities || []).filter(a =>
        a.title?.toLowerCase().includes(lowerQuery) ||
        a.category?.toLowerCase().includes(lowerQuery)
      );
      if (filtered.length > 0) return filtered;
      throw new Error('empty');
    } catch {
      const lowerQuery = query.toLowerCase();
      return SEED_ACTIVITIES.filter(a =>
        a.title?.toLowerCase().includes(lowerQuery) ||
        a.category?.toLowerCase().includes(lowerQuery) ||
        a.cityName?.toLowerCase().includes(lowerQuery)
      );
    }
  }
}

export const activityService = new ActivityService();
