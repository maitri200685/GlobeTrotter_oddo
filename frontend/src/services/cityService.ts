import { apiClient } from '../lib/apiClient';
import type { City, CityFilterParams, Region, TravelVibe } from '@/types/geo.types';

const SEED_CITIES: City[] = [
  {
    id: 'city-goa', name: 'Goa', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e578?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e578?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    description: "India's beach paradise with golden sands, vibrant nightlife, Portuguese heritage, and fresh seafood.",
    shortTagline: 'Sun, Sand & Portuguese Soul',
    costLevel: '$$', averageDailyCost: '₹3,500/day', typicalStayDays: 5, rating: 4.7,
    vibes: ['Beaches', 'Food & Nightlife'] as TravelVibe[],
    topAttractions: ['Baga Beach', 'Old Goa Churches', 'Dudhsagar Waterfall', 'Anjuna Flea Market', 'Fort Aguada'],
    climate: { bestSeason: 'Oct–Mar', currentTemp: '28°C', condition: 'Sunny', icon: '☀️' },
    coordinates: { lat: 15.2993, lng: 74.1240 },
  },
  {
    id: 'city-jaipur', name: 'Jaipur', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'],
    description: 'The Pink City with magnificent forts, royal palaces, vibrant bazaars, and Rajasthani cuisine.',
    shortTagline: 'Royal Rajputana Splendor',
    costLevel: '$$', averageDailyCost: '₹2,800/day', typicalStayDays: 3, rating: 4.6,
    vibes: ['Heritage', 'Food & Nightlife'] as TravelVibe[],
    topAttractions: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar', 'Johari Bazaar'],
    climate: { bestSeason: 'Oct–Mar', currentTemp: '25°C', condition: 'Pleasant', icon: '🌤️' },
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  {
    id: 'city-kerala', name: 'Kerala', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'],
    description: "God's Own Country with lush backwaters, emerald tea gardens, Ayurveda retreats, and Kathakali.",
    shortTagline: "God's Own Country",
    costLevel: '$$', averageDailyCost: '₹3,200/day', typicalStayDays: 6, rating: 4.8,
    vibes: ['Nature & Wildlife', 'Beaches'] as TravelVibe[],
    topAttractions: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Periyar Tiger Reserve', 'Kovalam Beach', 'Wayanad'],
    climate: { bestSeason: 'Sep–Feb', currentTemp: '27°C', condition: 'Tropical', icon: '🌴' },
    coordinates: { lat: 10.8505, lng: 76.2711 },
  },
  {
    id: 'city-manali', name: 'Manali', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80'],
    description: 'Himalayan adventure hub with snow-capped peaks, river rafting, paragliding, and apple orchards.',
    shortTagline: 'Himalayan Adventure Capital',
    costLevel: '$$', averageDailyCost: '₹2,500/day', typicalStayDays: 4, rating: 4.5,
    vibes: ['Mountains', 'Nature & Wildlife'] as TravelVibe[],
    topAttractions: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Beas River Rafting', 'Old Manali'],
    climate: { bestSeason: 'Apr–Jun & Oct', currentTemp: '12°C', condition: 'Cool & Clear', icon: '🏔️' },
    coordinates: { lat: 32.2396, lng: 77.1887 },
  },
  {
    id: 'city-kyoto', name: 'Kyoto', country: 'Japan', region: 'East Asia' as Region,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
    description: "Japan's ancient imperial capital with thousands of Shinto shrines, geisha culture, and bamboo groves.",
    shortTagline: 'Ancient Japan in Every Corner',
    costLevel: '$$$', averageDailyCost: '¥15,000/day', typicalStayDays: 4, rating: 4.9,
    vibes: ['Heritage', 'Food & Nightlife'] as TravelVibe[],
    topAttractions: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji Temple', 'Gion District', 'Nishiki Market'],
    climate: { bestSeason: 'Mar–May & Oct–Nov', currentTemp: '18°C', condition: 'Mild', icon: '🌸' },
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    id: 'city-paris', name: 'Paris', country: 'France', region: 'Europe' as Region,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
    description: 'The City of Light and Love, home to the Eiffel Tower, world-class art, haute cuisine, and fashion.',
    shortTagline: 'The City of Light & Love',
    costLevel: '$$$$', averageDailyCost: '€180/day', typicalStayDays: 5, rating: 4.8,
    vibes: ['Heritage', 'Food & Nightlife', 'Romance'] as TravelVibe[],
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Musée d\'Orsay', 'Versailles'],
    climate: { bestSeason: 'Apr–Jun & Sep', currentTemp: '16°C', condition: 'Mild', icon: '🗼' },
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: 'city-bali', name: 'Bali', country: 'Indonesia', region: 'Southeast Asia' as Region,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
    description: 'Island of the Gods with terraced rice paddies, volcanic mountains, surf beaches, and ancient temples.',
    shortTagline: 'Island of Gods & Serenity',
    costLevel: '$$', averageDailyCost: '$65/day', typicalStayDays: 7, rating: 4.8,
    vibes: ['Beaches', 'Nature & Wildlife', 'Spiritual'] as TravelVibe[],
    topAttractions: ['Tegalalang Rice Terraces', 'Tanah Lot Temple', 'Mount Batur', 'Seminyak Beach', 'Ubud Monkey Forest'],
    climate: { bestSeason: 'May–Sep', currentTemp: '27°C', condition: 'Warm & Sunny', icon: '🌊' },
    coordinates: { lat: -8.3405, lng: 115.0920 },
  },
  {
    id: 'city-nyc', name: 'New York', country: 'USA', region: 'Americas' as Region,
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'],
    description: 'The Big Apple — where iconic landmarks, Broadway, Michelin dining, and world culture converge.',
    shortTagline: 'The City That Never Sleeps',
    costLevel: '$$$$', averageDailyCost: '$250/day', typicalStayDays: 5, rating: 4.7,
    vibes: ['Food & Nightlife', 'Heritage'] as TravelVibe[],
    topAttractions: ['Times Square', 'Central Park', 'Statue of Liberty', 'Brooklyn Bridge', 'Metropolitan Museum'],
    climate: { bestSeason: 'Apr–Jun & Sep–Nov', currentTemp: '20°C', condition: 'Variable', icon: '🗽' },
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: 'city-agra', name: 'Agra', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'],
    description: 'Home of the Taj Mahal, one of the Seven Wonders of the World, and rich Mughal heritage.',
    shortTagline: 'The Eternal Taj Mahal City',
    costLevel: '$', averageDailyCost: '₹1,800/day', typicalStayDays: 2, rating: 4.7,
    vibes: ['Heritage', 'Romance'] as TravelVibe[],
    topAttractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh', 'Itimad-ud-Daulah'],
    climate: { bestSeason: 'Oct–Mar', currentTemp: '26°C', condition: 'Clear', icon: '🕌' },
    coordinates: { lat: 27.1767, lng: 78.0081 },
  },
  {
    id: 'city-mumbai', name: 'Mumbai', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80'],
    description: "India's financial capital — Bollywood, street food, colonial architecture, and vibrant Marine Drive.",
    shortTagline: 'The City of Dreams',
    costLevel: '$$$', averageDailyCost: '₹4,000/day', typicalStayDays: 3, rating: 4.4,
    vibes: ['Food & Nightlife', 'Heritage'] as TravelVibe[],
    topAttractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Dharavi', 'Juhu Beach'],
    climate: { bestSeason: 'Nov–Feb', currentTemp: '29°C', condition: 'Humid', icon: '🌆' },
    coordinates: { lat: 19.0760, lng: 72.8777 },
  },
  {
    id: 'city-udaipur', name: 'Udaipur', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'],
    description: 'The City of Lakes with romantic lake palaces, historic havelis, and magnificent Rajput architecture.',
    shortTagline: 'Venice of the East',
    costLevel: '$$', averageDailyCost: '₹2,500/day', typicalStayDays: 3, rating: 4.8,
    vibes: ['Heritage', 'Romance'] as TravelVibe[],
    topAttractions: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Saheliyon ki Bari', 'Monsoon Palace'],
    climate: { bestSeason: 'Oct–Mar', currentTemp: '24°C', condition: 'Warm', icon: '🏯' },
    coordinates: { lat: 24.5854, lng: 73.7125 },
  },
  {
    id: 'city-varanasi', name: 'Varanasi', country: 'India', region: 'India' as Region,
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'],
    description: "One of the world's oldest living cities, the spiritual capital of India on the sacred Ganges river.",
    shortTagline: 'Where Spirituality Meets the Ganges',
    costLevel: '$', averageDailyCost: '₹1,500/day', typicalStayDays: 2, rating: 4.5,
    vibes: ['Spiritual', 'Heritage'] as TravelVibe[],
    topAttractions: ['Dashashwamedh Ghat Aarti', 'Kashi Vishwanath Temple', 'Sarnath', 'Assi Ghat', 'Boat Ride at Dawn'],
    climate: { bestSeason: 'Oct–Mar', currentTemp: '25°C', condition: 'Mild', icon: '🪔' },
    coordinates: { lat: 25.3176, lng: 82.9739 },
  },
];

class CityService {
  async getCities(filters?: CityFilterParams): Promise<City[]> {
    try {
      let url = '/cities';
      if (filters?.region && filters.region !== 'All') {
        url += `?region=${encodeURIComponent(filters.region)}`;
      }
      const data = await apiClient.get<any[]>(url);
      if (data && data.length > 0) {
        // Map backend fields to full City type
        return this._mapAndFilter(data.map(this._mapBackendCity), filters);
      }
      return this._mapAndFilter(SEED_CITIES, filters);
    } catch {
      return this._mapAndFilter(SEED_CITIES, filters);
    }
  }

  private _mapBackendCity(c: any): City {
    const seed = SEED_CITIES.find(s => s.name.toLowerCase() === c.name?.toLowerCase());
    return {
      id: c.id,
      name: c.name,
      country: c.country,
      region: (c.region || seed?.region || 'India') as Region,
      coverImage: c.coverImage || c.image_url || seed?.coverImage || '',
      galleryImages: seed?.galleryImages || [c.image_url || ''],
      description: c.description || seed?.description || '',
      shortTagline: seed?.shortTagline || c.name,
      costLevel: seed?.costLevel || '$$',
      averageDailyCost: seed?.averageDailyCost || '₹2,500/day',
      typicalStayDays: seed?.typicalStayDays || 3,
      rating: c.popularity ? c.popularity / 20 : (seed?.rating || 4.5),
      vibes: seed?.vibes || [],
      topAttractions: seed?.topAttractions || [],
      climate: seed?.climate || { bestSeason: 'Oct–Mar', currentTemp: '25°C', condition: 'Mild', icon: '🌤️' },
      coordinates: { lat: c.latitude || seed?.coordinates?.lat || 0, lng: c.longitude || seed?.coordinates?.lng || 0 },
    };
  }

  private _mapAndFilter(cities: City[], filters?: CityFilterParams): City[] {
    let result = [...cities];
    if (filters?.region && filters.region !== 'All') {
      result = result.filter(c => c.region === filters.region || c.country === filters.region);
    }
    if (filters?.vibe && filters.vibe !== 'All') {
      result = result.filter(c => c.vibes?.includes(filters.vibe as TravelVibe));
    }
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getFeaturedCities(): Promise<City[]> {
    return this.getCities();
  }

  async searchCities(query: string): Promise<City[]> {
    return this._mapAndFilter(SEED_CITIES, { searchQuery: query });
  }

  async getCitiesByRegion(region: string): Promise<City[]> {
    return this._mapAndFilter(SEED_CITIES, { region: region as any });
  }

  async getCityById(id: string): Promise<City | undefined> {
    try {
      const data = await apiClient.get<any>(`/cities/${id}`);
      if (data) return this._mapBackendCity(data);
    } catch {}
    return SEED_CITIES.find(c => c.id === id) || SEED_CITIES.find(c => c.name.toLowerCase().includes(id.toLowerCase()));
  }

  async getRecommendedCities(_userPreferences?: any): Promise<City[]> {
    return SEED_CITIES.slice(0, 6);
  }
}

// Bind method to instance so it can be used as callback
const _instance = new CityService();
export const cityService = _instance;
