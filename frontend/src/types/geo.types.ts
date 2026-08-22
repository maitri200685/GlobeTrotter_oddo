export type Region = 'India' | 'Southeast Asia' | 'East Asia' | 'Europe' | 'Middle East' | 'Americas';
export type CostLevel = '$' | '$$' | '$$$' | '$$$$';
export type TravelVibe = 'Beaches' | 'Mountains' | 'Heritage' | 'Food & Nightlife' | 'Nature & Wildlife' | 'Romance' | 'Spiritual';

export interface ClimateInfo {
  bestSeason: string;
  currentTemp: string;
  condition: string;
  icon?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: Region;
  coverImage: string;
  galleryImages: string[];
  description: string;
  shortTagline: string;
  costLevel: CostLevel;
  averageDailyCost: string;
  typicalStayDays: number;
  rating: number;
  vibes: TravelVibe[];
  topAttractions: string[];
  climate: ClimateInfo;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface CityFilterParams {
  region?: 'All' | Region;
  costLevel?: 'All' | CostLevel;
  vibe?: 'All' | TravelVibe;
  searchQuery?: string;
}
