import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';
import type { 
  User, 
  DemoPersona, 
  LoginCredentials, 
  SignupPayload, 
  TravelPreferences 
} from '@/types/user.types';

// Demo Personas left only for UI rendering purposes if needed by Demo selectors.
const SEED_PERSONAS: DemoPersona[] = [
  {
    id: 'demo-aarav',
    personaName: 'Aarav Mehta',
    tagline: 'Solo Backpacker & Street Foodie',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    user: { id: 'demo1', name: 'Aarav', email: 'aarav@demo.local', role: 'user', preferences: {} as any, stats: {} as any, savedDestinations: [], createdAt: '' }
  },
];

class AuthService {
  getDemoPersonas(): DemoPersona[] {
    return SEED_PERSONAS;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    // In a real app we would fetch the full profile from /api/v1/auth/me or similar,
    // which joins the profiles table. For now, construct a base user object.
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Traveler',
      role: 'user',
      preferences: {
        budgetStyle: 'comfort',
        travelPace: 'balanced',
        preferredCurrency: 'USD',
        dietary: 'any',
        favoriteInterests: [],
        emailNotifications: true,
        tripAlerts: true,
        marketingEmails: false,
      },
      stats: { tripsPlanned: 0, citiesVisited: 0, countriesExplored: 0, savedBudgetTotal: '0' },
      savedDestinations: [],
      createdAt: session.user.created_at,
    };
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password || 'password123', // Demo fallback if UI doesn't send password
    });
    
    if (error) throw error;
    
    return this.getCurrentUser() as Promise<User>;
  }

  async loginAsDemoUser(personaId: string): Promise<User> {
    // We cannot securely "login as demo user" in a real backend without knowing their password.
    // For this integration, we will require the user to signup/login via real Supabase Auth.
    throw new Error('Demo login is disabled in production mode. Please use real Sign Up / Login.');
  }

  async signup(payload: SignupPayload): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password || 'password123',
      options: {
        data: {
          full_name: payload.name,
        }
      }
    });
    
    if (error) throw error;
    
    return this.getCurrentUser() as Promise<User>;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    // Would normally call PATCH /api/v1/profiles/me
    console.warn('updateProfile not implemented in backend yet');
    return this.getCurrentUser() as Promise<User>;
  }

  async updatePreferences(newPrefs: Partial<TravelPreferences>): Promise<User> {
    // Would normally call PATCH /api/v1/profiles/me/preferences
    console.warn('updatePreferences not implemented in backend yet');
    return this.getCurrentUser() as Promise<User>;
  }

  async toggleSavedDestination(cityName: string): Promise<User> {
    console.warn('toggleSavedDestination not implemented in backend yet');
    return this.getCurrentUser() as Promise<User>;
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}

export const authService = new AuthService();
