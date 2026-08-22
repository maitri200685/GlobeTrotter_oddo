import type { Hotel, HotelFilterParams } from '@/types/inventory.types';

const SEED_HOTELS: Hotel[] = [
  // GOA HOTELS
  {
    id: 'htl-goa-1',
    name: 'Santana Beach Boutique Resort',
    cityName: 'Goa',
    country: 'India',
    starRating: 4,
    userRating: 4.6,
    reviewsCount: 420,
    pricePerNight: 3200,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80',
    ],
    address: 'Candolim Beach Road, North Goa',
    amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Bar'],
    aiMatchScore: 98,
    whyAiRecommends: '98% Match: Top-rated beachfront boutique resort directly aligned with your target budget and relaxed pace.',
    coordinates: { lat: 15.5174, lng: 73.7628 },
  },
  {
    id: 'htl-goa-2',
    name: 'Taj Fort Aguada Resort & Spa',
    cityName: 'Goa',
    country: 'India',
    starRating: 5,
    userRating: 4.9,
    reviewsCount: 890,
    pricePerNight: 12500,
    currency: 'INR',
    style: 'luxury',
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Sinquerim, Candolim, Goa',
    amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Fitness Center', 'Bar'],
    aiMatchScore: 94,
    whyAiRecommends: '94% Match: Historic 5-star cliffside resort overlooking the Arabian Sea with private beach access.',
    coordinates: { lat: 15.4925, lng: 73.7736 },
  },
  {
    id: 'htl-goa-3',
    name: 'Zostel Goa (Calangute)',
    cityName: 'Goa',
    country: 'India',
    starRating: 3,
    userRating: 4.4,
    reviewsCount: 650,
    pricePerNight: 950,
    currency: 'INR',
    style: 'backpacker',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Calangute Main Market, North Goa',
    amenities: ['WiFi', 'Air Conditioning', 'Bar', 'Free Breakfast'],
    aiMatchScore: 91,
    whyAiRecommends: '91% Match: Vibrant backpacker hostel with social common lounges and walking distance to the beach.',
    coordinates: { lat: 15.5439, lng: 73.7554 },
  },

  // JAIPUR HOTELS
  {
    id: 'htl-jaipur-1',
    name: 'Alsisar Haveli Heritage Stay',
    cityName: 'Jaipur',
    country: 'India',
    starRating: 4,
    userRating: 4.8,
    reviewsCount: 520,
    pricePerNight: 4800,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Sansar Chandra Road, Jaipur',
    amenities: ['Heritage Courtyard', 'Pool', 'Free Breakfast', 'WiFi', 'Spa'],
    aiMatchScore: 97,
    whyAiRecommends: '97% Match: Traditional Rajput architecture featuring carved archways and central swimming pool.',
    coordinates: { lat: 26.9239, lng: 75.8038 },
  },
  {
    id: 'htl-jaipur-2',
    name: 'The Rambagh Palace',
    cityName: 'Jaipur',
    country: 'India',
    starRating: 5,
    userRating: 5.0,
    reviewsCount: 1200,
    pricePerNight: 24000,
    currency: 'INR',
    style: 'luxury',
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Bhawani Singh Road, Jaipur',
    amenities: ['Heritage Courtyard', 'Pool', 'Free Breakfast', 'WiFi', 'Spa', 'Fitness Center', 'Bar'],
    aiMatchScore: 99,
    whyAiRecommends: '99% Match: The jewel of Jaipur—former royal residence of the Maharaja with peacocks in palace gardens.',
    coordinates: { lat: 26.8978, lng: 75.8076 },
  },

  // KERALA HOTELS
  {
    id: 'htl-kerala-1',
    name: 'Kumarakom Lake Luxury Resort',
    cityName: 'Kerala (Munnar & Alleppey)',
    country: 'India',
    starRating: 5,
    userRating: 4.9,
    reviewsCount: 780,
    pricePerNight: 14000,
    currency: 'INR',
    style: 'luxury',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Vembanad Lake, Kumarakom',
    amenities: ['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Bar'],
    aiMatchScore: 98,
    whyAiRecommends: '98% Match: Serene backwater luxury featuring infinity pool and traditional Kerala teak villas.',
    coordinates: { lat: 9.6175, lng: 76.4299 },
  },
  {
    id: 'htl-kerala-2',
    name: 'Alleppey Heritage Houseboat Private Stay',
    cityName: 'Kerala (Munnar & Alleppey)',
    country: 'India',
    starRating: 4,
    userRating: 4.7,
    reviewsCount: 340,
    pricePerNight: 7500,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Punnamada Jetty, Alleppey',
    amenities: ['Air Conditioning', 'Free Breakfast', 'Beachfront'],
    aiMatchScore: 96,
    whyAiRecommends: '96% Match: Private traditional wooden Kettuvallam boat with personal onboard chef and lake cruise.',
    coordinates: { lat: 9.4981, lng: 76.3388 },
  },

  // VARANASI HOTELS
  {
    id: 'htl-varanasi-1',
    name: 'BrijRama Palace Heritage Stay',
    cityName: 'Varanasi',
    country: 'India',
    starRating: 4,
    userRating: 4.9,
    reviewsCount: 310,
    pricePerNight: 8500,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Assi Ghat Riverside, Varanasi',
    amenities: ['Free Breakfast', 'WiFi', 'Air Conditioning', 'Rooftop Ghat View'],
    aiMatchScore: 98,
    whyAiRecommends: '98% Match: Heritage riverside palace with private Ganges views, daily morning yoga, and authentic Ganga aarti access.',
    coordinates: { lat: 25.3032, lng: 82.9910 },
  },

  // AMRITSAR HOTELS
  {
    id: 'htl-amritsar-1',
    name: 'Taj Swarna Golden Temple Suite',
    cityName: 'Amritsar',
    country: 'India',
    starRating: 4,
    userRating: 4.7,
    reviewsCount: 460,
    pricePerNight: 7200,
    currency: 'INR',
    style: 'comfort',
    coverImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&h=500&q=80',
    gallery: ['https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&h=400&q=80'],
    address: 'Golden Temple Road, Amritsar',
    amenities: ['WiFi', 'Free Breakfast', 'Air Conditioning', 'Rooftop Temple View'],
    aiMatchScore: 97,
    whyAiRecommends: '97% Match: Premium boutique stay within walking distance of Golden Temple with Langar seva access and rooftop dining.',
    coordinates: { lat: 31.6199, lng: 74.8765 },
  },
];

class HotelService {
  async getHotelsByCity(cityName?: string, filters?: HotelFilterParams): Promise<Hotel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...SEED_HOTELS];

        if (cityName && cityName.trim()) {
          const q = cityName.toLowerCase().trim();
          results = results.filter(
            (h) =>
              h.cityName.toLowerCase().includes(q) ||
              q.includes(h.cityName.toLowerCase())
          );
        }

        if (filters?.minStarRating) {
          results = results.filter((h) => h.starRating >= (filters.minStarRating || 0));
        }

        if (filters?.maxPrice) {
          results = results.filter((h) => h.pricePerNight <= (filters.maxPrice || Infinity));
        }

        if (filters?.style && filters.style !== 'all') {
          results = results.filter((h) => h.style === filters.style);
        }

        if (filters?.amenities && filters.amenities.length > 0) {
          results = results.filter((h) =>
            filters.amenities!.every((a) => h.amenities.includes(a))
          );
        }

        // Sorting
        if (filters?.sortBy === 'priceAsc') {
          results.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (filters?.sortBy === 'priceDesc') {
          results.sort((a, b) => b.pricePerNight - a.pricePerNight);
        } else if (filters?.sortBy === 'rating') {
          results.sort((a, b) => b.userRating - a.userRating);
        } else {
          // Default: AI Match score desc
          results.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
        }

        resolve(results);
      }, 100);
    });
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = SEED_HOTELS.find((h) => h.id === id);
        resolve(found || null);
      }, 50);
    });
  }
}

export const hotelService = new HotelService();
