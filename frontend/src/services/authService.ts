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
    user: {
      id: 'usr-aarav-101',
      name: 'Aarav Mehta',
      email: 'aarav.travels@globe.io',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Backpacker, photographer, and chai enthusiast exploring off-beat trails across India.',
      role: 'user',
      preferences: {
        budgetStyle: 'backpacker',
        travelPace: 'balanced',
        preferredCurrency: 'INR',
        dietary: 'any',
        favoriteInterests: ['Trekking', 'Street Food', 'Hostels', 'Photography', 'Nightlife'],
        homeAirportOrCity: 'Ahmedabad (AMD)',
        emailNotifications: true,
        tripAlerts: true,
        marketingEmails: false,
      },
      stats: {
        tripsPlanned: 6,
        citiesVisited: 14,
        countriesExplored: 1,
        savedBudgetTotal: '₹42,500',
      },
      savedDestinations: ['Goa', 'Manali', 'Varanasi', 'Hampi', 'Rishikesh'],
      createdAt: '2025-01-15',
    },
  },
  {
    id: 'demo-priya-rohan',
    personaName: 'Priya & Rohan',
    tagline: 'Couple Travelers • Boutique Stays',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
    user: {
      id: 'usr-priya-rohan-102',
      name: 'Priya & Rohan',
      email: 'rohan.priya@journeys.io',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Couple seeking scenic sunsets, coastal boutique resorts, cozy cafes, and vibrant evening culture.',
      role: 'user',
      preferences: {
        budgetStyle: 'comfort',
        travelPace: 'relaxed',
        preferredCurrency: 'INR',
        dietary: 'vegetarian',
        favoriteInterests: ['Beaches', 'Fine Dining', 'Sunsets', 'Heritage Stays', 'Spa & Wellness'],
        homeAirportOrCity: 'Mumbai (BOM)',
        emailNotifications: true,
        tripAlerts: true,
        marketingEmails: true,
      },
      stats: {
        tripsPlanned: 4,
        citiesVisited: 9,
        countriesExplored: 1,
        savedBudgetTotal: '₹28,400',
      },
      savedDestinations: ['Goa', 'Udaipur', 'Kerala', 'Andaman', 'Jaisalmer'],
      createdAt: '2025-03-20',
    },
  },
  {
    id: 'demo-elena',
    personaName: 'Ananya Kapoor',
    tagline: 'Luxury Cultural Explorer • Heritage',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    user: {
      id: 'usr-elena-103',
      name: 'Ananya Kapoor',
      email: 'ananya.kapoor@globetrotter.org',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Architect and art historian planning immersive cultural journeys, fine dining, and luxury heritage hotels across India.',
      role: 'user',
      preferences: {
        budgetStyle: 'luxury',
        travelPace: 'packed',
        preferredCurrency: 'INR',
        dietary: 'gluten-free',
        favoriteInterests: ['Architecture', 'Art Galleries', 'Heritage Forts', 'Michelin Dining', 'Museums'],
        homeAirportOrCity: 'Delhi (DEL)',
        emailNotifications: true,
        tripAlerts: true,
        marketingEmails: false,
      },
      stats: {
        tripsPlanned: 11,
        citiesVisited: 28,
        countriesExplored: 1,
        savedBudgetTotal: '₹2,15,000',
      },
      savedDestinations: ['Varanasi', 'Udaipur', 'Jaipur', 'Jodhpur', 'Kashmir', 'Ladakh'],
      createdAt: '2024-11-10',
    },
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
    // Left as mock if backend doesn't have it yet, or add endpoint. 
    console.warn('updateProfile not implemented in backend yet');
    return this.getCurrentUser() as Promise<User>;
  }

  async updatePreferences(newPrefs: Partial<TravelPreferences>): Promise<User> {
    await apiClient.patch<void>('/users/me/preferences', newPrefs);
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
