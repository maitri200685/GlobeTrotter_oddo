export type BudgetStyle = 'backpacker' | 'comfort' | 'luxury' | 'family';
export type TravelPace = 'relaxed' | 'balanced' | 'packed';
export type DietaryPreference = 'any' | 'vegetarian' | 'vegan' | 'halal' | 'jain' | 'gluten-free';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface TravelPreferences {
  budgetStyle: BudgetStyle;
  travelPace: TravelPace;
  preferredCurrency: CurrencyCode;
  dietary: DietaryPreference;
  favoriteInterests: string[];
  homeAirportOrCity?: string;
  emailNotifications: boolean;
  tripAlerts: boolean;
  marketingEmails: boolean;
}

export interface UserStats {
  tripsPlanned: number;
  citiesVisited: number;
  countriesExplored: number;
  savedBudgetTotal: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: 'user' | 'admin';
  preferences: TravelPreferences;
  stats: UserStats;
  savedDestinations: string[];
  createdAt: string;
}

export interface DemoPersona {
  id: string;
  personaName: string;
  tagline: string;
  avatarUrl: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password?: string;
  budgetStyle?: BudgetStyle;
  preferredCurrency?: CurrencyCode;
}
