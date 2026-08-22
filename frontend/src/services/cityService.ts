import type { City, CityFilterParams } from '@/types/geo.types';

const SEED_CITIES: City[] = [
  {
    id: 'city-goa',
    name: 'Goa',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'India\'s premier coastal paradise, blending Portuguese heritage, sun-drenched beaches, spice plantations, and vibrant nightlife.',
    shortTagline: 'Golden coastlines, seafood shacks & nightlife',
    costLevel: '$$',
    averageDailyCost: '₹3,500 / day',
    typicalStayDays: 5,
    rating: 4.9,
    vibes: ['Beaches', 'Food & Nightlife', 'Heritage'],
    topAttractions: ['Candolim & Calangute Beaches', 'Basilica of Bom Jesus', 'Grande Island Scuba', 'Anjuna Flea Market'],
    climate: { bestSeason: 'Nov – Feb', currentTemp: '28°C', condition: 'Sunny Coastal' },
    coordinates: { lat: 15.2993, lng: 74.1240 },
  },
  {
    id: 'city-jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'The Pink City of Rajasthan, famed for majestic hill forts, ornate royal palaces, bustling handicraft bazaars, and traditional hospitality.',
    shortTagline: 'Royal palaces, hill forts & vibrant bazaars',
    costLevel: '$$',
    averageDailyCost: '₹4,000 / day',
    typicalStayDays: 4,
    rating: 4.8,
    vibes: ['Heritage', 'Food & Nightlife', 'Romance'],
    topAttractions: ['Hawa Mahal Palace', 'Amber Fort Heritage Tour', 'City Palace', 'Nahargarh Fort Sunset'],
    climate: { bestSeason: 'Oct – Mar', currentTemp: '25°C', condition: 'Pleasant & Dry' },
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  {
    id: 'city-mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'The vibrant financial and entertainment capital of India, home to colonial architecture, Marine Drive promenades, and world-class culinary scenes.',
    shortTagline: 'Gateway of India, Marine Drive & street food',
    costLevel: '$$$',
    averageDailyCost: '₹5,500 / day',
    typicalStayDays: 3,
    rating: 4.7,
    vibes: ['Food & Nightlife', 'Heritage', 'Romance'],
    topAttractions: ['Gateway of India', 'Marine Drive Sunset Walk', 'Elephanta Caves', 'Bandra Cafe Trail'],
    climate: { bestSeason: 'Nov – Feb', currentTemp: '30°C', condition: 'Tropical Coastal' },
    coordinates: { lat: 18.9220, lng: 72.8347 },
  },
  {
    id: 'city-kerala',
    name: 'Kerala (Munnar & Alleppey)',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'God\'s Own Country, offering tranquil backwater houseboats, emerald green tea estates, ayurvedic rejuvenation, and spice trails.',
    shortTagline: 'Backwater houseboats, tea hills & ayurveda',
    costLevel: '$$',
    averageDailyCost: '₹4,500 / day',
    typicalStayDays: 6,
    rating: 4.9,
    vibes: ['Nature & Wildlife', 'Romance', 'Spiritual'],
    topAttractions: ['Alleppey Houseboat Cruise', 'Munnar Tea Gardens', 'Periyar Wildlife Sanctuary', 'Varkala Cliff Beach'],
    climate: { bestSeason: 'Sep – Mar', currentTemp: '24°C', condition: 'Misty & Lush' },
    coordinates: { lat: 9.9312, lng: 76.2673 },
  },
  {
    id: 'city-manali',
    name: 'Manali',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'A Himalayan mountain haven nestled along the Beas River, offering snow sports, alpine pine forests, cozy riverside cafes, and high passes.',
    shortTagline: 'Himalayan snow peaks, river rafting & pine trails',
    costLevel: '$$',
    averageDailyCost: '₹3,200 / day',
    typicalStayDays: 4,
    rating: 4.8,
    vibes: ['Mountains', 'Nature & Wildlife', 'Beaches'],
    topAttractions: ['Solang Valley Snow Sports', 'Rohtang Pass Tour', 'Old Manali Bohemian Cafes', 'Hadimba Temple'],
    climate: { bestSeason: 'Oct – Jun', currentTemp: '12°C', condition: 'Crisp Mountain' },
    coordinates: { lat: 32.2432, lng: 77.1892 },
  },
  {
    id: 'city-udaipur',
    name: 'Udaipur',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'The City of Lakes and Venice of the East, famous for romantic marble palaces floating on shimmering lakes and rooftop sunset dining.',
    shortTagline: 'Romantic lake palaces & heritage boat rides',
    costLevel: '$$$',
    averageDailyCost: '₹5,000 / day',
    typicalStayDays: 3,
    rating: 4.9,
    vibes: ['Romance', 'Heritage', 'Food & Nightlife'],
    topAttractions: ['Lake Pichola Boat Cruise', 'City Palace Museum', 'Jagmandir Island', 'Saheliyon-ki-Bari'],
    climate: { bestSeason: 'Oct – Mar', currentTemp: '26°C', condition: 'Warm & Serene' },
    coordinates: { lat: 24.5854, lng: 73.7125 },
  },
  {
    id: 'city-varanasi',
    name: 'Varanasi',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'India\'s spiritual capital on the banks of the sacred Ganges, famed for ancient ghats, mesmerizing evening aarti ceremonies, and classical music.',
    shortTagline: 'Sacred ghats, Ganga aarti & spiritual heritage',
    costLevel: '$$',
    averageDailyCost: '₹2,800 / day',
    typicalStayDays: 3,
    rating: 4.9,
    vibes: ['Heritage', 'Spiritual', 'Food & Nightlife'],
    topAttractions: ['Dashashwamedh Ghat Aarti', 'Sarnath Buddhist Tour', 'Boat Ride at Sunrise', 'Kashi Vishwanath Temple'],
    climate: { bestSeason: 'Oct – Mar', currentTemp: '23°C', condition: 'Pleasant & Dry' },
    coordinates: { lat: 25.3176, lng: 82.9739 },
  },
  {
    id: 'city-rishikesh',
    name: 'Rishikesh',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'The yoga capital of the world nestled in the Himalayan foothills, offering Ganga rafting, spiritual retreats, and scenic suspension bridges.',
    shortTagline: 'Yoga ashrams, river rafting & Ganga ghats',
    costLevel: '$',
    averageDailyCost: '₹2,200 / day',
    typicalStayDays: 4,
    rating: 4.7,
    vibes: ['Mountains', 'Nature & Wildlife', 'Spiritual'],
    topAttractions: ['White Water Rafting', 'Laxman Jhula Walk', 'Parmarth Niketan Aarti', 'Neer Garh Waterfall'],
    climate: { bestSeason: 'Sep – Jun', currentTemp: '18°C', condition: 'Crisp Riverside' },
    coordinates: { lat: 30.0869, lng: 78.2676 },
  },
  {
    id: 'city-kashmir',
    name: 'Kashmir (Srinagar)',
    country: 'India',
    region: 'India',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&h=500&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    description: 'Paradise on Earth with the shimmering Dal Lake, snow-capped Himalayan peaks, Mughal gardens, and traditional wooden houseboats.',
    shortTagline: 'Dal Lake houseboats, Mughal gardens & snow peaks',
    costLevel: '$$$',
    averageDailyCost: '₹6,000 / day',
    typicalStayDays: 6,
    rating: 5.0,
    vibes: ['Nature & Wildlife', 'Romance', 'Mountains'],
    topAttractions: ['Dal Lake Shikara Ride', 'Gulmarg Gondola', 'Mughal Garden Tour', 'Sonamarg Valley Trek'],
    climate: { bestSeason: 'Apr – Oct', currentTemp: '14°C', condition: 'Cool Alpine' },
    coordinates: { lat: 34.0836, lng: 74.7973 },
  },
];

class CityService {
  async getCities(filters?: CityFilterParams): Promise<City[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...SEED_CITIES];

        if (filters?.region && filters.region !== 'All') {
          results = results.filter((c) => c.region === filters.region);
        }

        if (filters?.costLevel && filters.costLevel !== 'All') {
          results = results.filter((c) => c.costLevel === filters.costLevel);
        }

        if (filters?.vibe && filters.vibe !== 'All') {
          results = results.filter((c) => c.vibes.includes(filters.vibe as any));
        }

        if (filters?.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.country.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              c.topAttractions.some((a) => a.toLowerCase().includes(q))
          );
        }

        resolve(results);
      }, 100);
    });
  }

  async getCityById(id: string): Promise<City | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = SEED_CITIES.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
        resolve(found || null);
      }, 50);
    });
  }

  async getFeaturedCities(): Promise<City[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SEED_CITIES.slice(0, 6));
      }, 50);
    });
  }
}

export const cityService = new CityService();
