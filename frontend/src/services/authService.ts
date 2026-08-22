import { storageService } from './storageService';
import type { 
  User, 
  DemoPersona, 
  LoginCredentials, 
  SignupPayload, 
  TravelPreferences 
} from '@/types/user.types';

const AUTH_USER_KEY = 'globetrotter_active_user';
const USERS_STORE_KEY = 'globetrotter_users_store';

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
  constructor() {
    // Initialize default seed if not set
    const currentUser = storageService.getItem<User | null>(AUTH_USER_KEY, null);
    if (!currentUser) {
      storageService.setItem<User>(AUTH_USER_KEY, SEED_PERSONAS[0].user);
    }
  }

  getDemoPersonas(): DemoPersona[] {
    return SEED_PERSONAS;
  }

  async getCurrentUser(): Promise<User | null> {
    // Simulating light async resolution
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = storageService.getItem<User | null>(AUTH_USER_KEY, SEED_PERSONAS[0].user);
        resolve(user);
      }, 50);
    });
  }

  async login(credentials: LoginCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!credentials.email) {
          reject(new Error('Please enter a valid email address'));
          return;
        }

        // Match existing persona or synthesize user
        const matchedPersona = SEED_PERSONAS.find(
          (p) => p.user.email.toLowerCase() === credentials.email.toLowerCase()
        );

        const authenticatedUser: User = matchedPersona
          ? matchedPersona.user
          : {
              id: 'usr-' + Math.random().toString(36).substring(2, 9),
              name: credentials.email.split('@')[0],
              email: credentials.email,
              role: 'user',
              preferences: {
                budgetStyle: 'comfort',
                travelPace: 'balanced',
                preferredCurrency: 'INR',
                dietary: 'any',
                favoriteInterests: ['Sightseeing', 'Food', 'Culture'],
                emailNotifications: true,
                tripAlerts: true,
                marketingEmails: false,
              },
              stats: {
                tripsPlanned: 1,
                citiesVisited: 2,
                countriesExplored: 1,
                savedBudgetTotal: '₹12,000',
              },
              savedDestinations: ['Goa', 'Jaipur'],
              createdAt: new Date().toISOString().split('T')[0],
            };

        storageService.setItem<User>(AUTH_USER_KEY, authenticatedUser);
        resolve(authenticatedUser);
      }, 250);
    });
  }

  async loginAsDemoUser(personaId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const persona = SEED_PERSONAS.find((p) => p.id === personaId);
        if (!persona) {
          reject(new Error('Demo persona not found'));
          return;
        }
        storageService.setItem<User>(AUTH_USER_KEY, persona.user);
        resolve(persona.user);
      }, 150);
    });
  }

  async signup(payload: SignupPayload): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          name: payload.name || 'Traveler',
          email: payload.email,
          role: 'user',
          preferences: {
            budgetStyle: payload.budgetStyle || 'comfort',
            travelPace: 'balanced',
            preferredCurrency: payload.preferredCurrency || 'INR',
            dietary: 'any',
            favoriteInterests: ['Sightseeing', 'Beaches', 'Food'],
            emailNotifications: true,
            tripAlerts: true,
            marketingEmails: false,
          },
          stats: {
            tripsPlanned: 0,
            citiesVisited: 0,
            countriesExplored: 0,
            savedBudgetTotal: '₹0',
          },
          savedDestinations: [],
          createdAt: new Date().toISOString().split('T')[0],
        };

        storageService.setItem<User>(AUTH_USER_KEY, newUser);
        resolve(newUser);
      }, 300);
    });
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = storageService.getItem<User | null>(AUTH_USER_KEY, SEED_PERSONAS[0].user);
        if (!current) {
          reject(new Error('No active user to update'));
          return;
        }

        const updated: User = {
          ...current,
          ...updates,
          preferences: {
            ...current.preferences,
            ...(updates.preferences || {}),
          },
        };

        storageService.setItem<User>(AUTH_USER_KEY, updated);
        resolve(updated);
      }, 150);
    });
  }

  async updatePreferences(newPrefs: Partial<TravelPreferences>): Promise<User> {
    const current = storageService.getItem<User | null>(AUTH_USER_KEY, SEED_PERSONAS[0].user);
    if (!current) throw new Error('User not authenticated');

    const updated: User = {
      ...current,
      preferences: {
        ...current.preferences,
        ...newPrefs,
      },
    };

    storageService.setItem<User>(AUTH_USER_KEY, updated);
    return updated;
  }

  async toggleSavedDestination(cityName: string): Promise<User> {
    const current = storageService.getItem<User | null>(AUTH_USER_KEY, SEED_PERSONAS[0].user);
    if (!current) throw new Error('User not authenticated');

    const isSaved = current.savedDestinations.includes(cityName);
    const updatedDestinations = isSaved
      ? current.savedDestinations.filter((d) => d !== cityName)
      : [...current.savedDestinations, cityName];

    const updated: User = {
      ...current,
      savedDestinations: updatedDestinations,
    };

    storageService.setItem<User>(AUTH_USER_KEY, updated);
    return updated;
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        storageService.removeItem(AUTH_USER_KEY);
        resolve();
      }, 100);
    });
  }
}

export const authService = new AuthService();
