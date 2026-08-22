import { apiClient } from '../lib/apiClient';
import type { Activity, ActivityFilterParams } from '@/types/inventory.types';

class ActivityService {
  async getActivitiesByCity(cityId: string, filters?: ActivityFilterParams): Promise<Activity[]> {
    return await apiClient.get<Activity[]>(`/activities?city_id=${cityId}`);
  }

  async getActivityById(id: string): Promise<Activity | undefined> {
    try {
      const activities = await apiClient.get<Activity[]>('/activities');
      return activities.find(a => a.id === id);
    } catch (e) {
      return undefined;
    }
  }

  async searchActivities(query: string, cityId?: string): Promise<Activity[]> {
    const url = cityId ? `/activities?city_id=${cityId}` : '/activities';
    const activities = await apiClient.get<Activity[]>(url);
    const lowerQuery = query.toLowerCase();
    return activities.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export const activityService = new ActivityService();
