/**
 * aiService.ts
 * Frontend AI service abstraction.
 * All AI calls are currently mocked for demo.
 * Replace each method with real API calls when backend is ready.
 * 
 * Backend integration point: POST /api/ai/plan, /api/ai/assist, /api/ai/optimize
 */

import type { Trip, ItineraryItem } from '@/types/trip.types';

export interface AIPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  vibes: string[];
  travelStyle?: string;
}

export interface AIGeneratedTrip {
  title: string;
  description: string;
  cities: string[];
  totalDays: number;
  estimatedBudget: number;
  currency: string;
  highlights: string[];
  itinerarySummary: { day: number; focus: string; activities: string[] }[];
  hotelSuggestions: { name: string; stars: number; pricePerNight: number }[];
  status: 'generated';
}

export interface AISuggestion {
  id: string;
  type: 'swap_hotel' | 'remove_activity' | 'add_activity' | 'reschedule' | 'budget_cut' | 'upgrade';
  title: string;
  description: string;
  budgetImpact: number;
  currency: string;
  category: 'savings' | 'enhancement' | 'optimization';
  priority: 'high' | 'medium' | 'low';
}

export interface AIAssistRequest {
  tripId: string;
  query: string;
  context?: {
    currentBudget: number;
    totalDays: number;
    cities: string[];
  };
}

export interface AIAssistResponse {
  message: string;
  suggestions: AISuggestion[];
  confidence: number;
}

import { apiClient } from '../lib/apiClient';

class AIService {
  /**
   * Generate a complete trip plan from user preferences.
   * Backend: POST /api/ai/plan
   */
  async generateTripPlan(request: AIPlanRequest): Promise<AIGeneratedTrip> {
    const response = await apiClient.post<{ message: string; suggestions?: AISuggestion[] }>('/agent/chat', {
      message: `Plan a trip to ${request.destination} from ${request.startDate} to ${request.endDate} for ${request.travelers} travelers with a budget of ${request.currency} ${request.budget}. Vibes: ${request.vibes.join(', ')}`,
    });
    
    // In a full implementation, the backend would return a structured JSON plan 
    // or persist it directly and we return the ID. For now, we adapt the response.
    return {
      title: `${request.destination} Trip`,
      description: response.message,
      cities: [request.destination],
      totalDays: Math.round((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 86400000),
      estimatedBudget: request.budget,
      currency: request.currency,
      highlights: ['AI Generated Itinerary'],
      itinerarySummary: [],
      hotelSuggestions: [],
      status: 'generated',
    };
  }

  /**
   * Get AI suggestions for optimizing an existing trip.
   * Backend: POST /api/ai/assist
   */
  async getAssistantSuggestions(request: AIAssistRequest): Promise<AIAssistResponse> {
    // Backend assistant endpoint expects 'message' field, not 'query'
    const response = await apiClient.post<{ message: string; status?: string; intent?: string; suggestions?: AISuggestion[] }>(`/trips/${request.tripId}/assistant`, {
      message: request.query,
    });

    return {
      message: response.message,
      suggestions: response.suggestions || [],
      confidence: 0.95,
    };
  }

  /**
   * Get budget optimization recommendations.
   * Backend: POST /api/ai/optimize-budget
   */
  async optimizeBudget(tripId: string, currentBudget: number): Promise<AISuggestion[]> {
    const response = await this.getAssistantSuggestions({
      tripId,
      query: 'How can I optimize my budget?',
    });
    return response.suggestions;
  }
}

export const aiService = new AIService();
