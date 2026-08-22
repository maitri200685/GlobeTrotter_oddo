import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { Hotel, HotelFilterParams } from '@/types/inventory.types';

const HOTELS_CACHE_KEY = 'gt_hotels_cache_v2';

const SEED_HOTELS: Hotel[] = [
  { id: 'htl-goa-1', name: 'Taj Exotica Resort & Spa', cityName: 'Goa', country: 'India', address: 'Calwaddo, Benaulim, South Goa', rating: 4.8, starRating: 5, pricePerNight: 18000, currency: 'INR', amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar', 'WiFi', 'Gym'], coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], description: 'Luxury beachfront resort with private beach, infinity pool and world-class spa.', aiMatchScore: 98, whyAiRecommends: 'Perfect for beach lovers with world-class amenities', whyRecommended: 'Perfect for beach lovers with world-class amenities' },
  { id: 'htl-goa-2', name: 'The Leela Goa', cityName: 'Goa', country: 'India', address: 'Mobor, Cavelossim, South Goa', rating: 4.7, starRating: 5, pricePerNight: 15000, currency: 'INR', amenities: ['Pool', 'Spa', 'Golf', 'Restaurant', 'WiFi', 'Beach Access'], coverImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning 5-star resort set amid 75 acres of beautiful Goa landscape.', aiMatchScore: 95, whyAiRecommends: 'Ideal for couples seeking golf and beach combination', whyRecommended: 'Ideal for couples seeking golf and beach combination' },
  { id: 'htl-goa-3', name: 'Alila Diwa Goa', cityName: 'Goa', country: 'India', address: 'Majorda, South Goa', rating: 4.6, starRating: 5, pricePerNight: 12000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Cycling'], coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'], description: 'Contemporary luxury resort showcasing Goan village culture.', aiMatchScore: 90, whyAiRecommends: 'Great value luxury with authentic Goan experience', whyRecommended: 'Great value luxury with authentic Goan experience' },
  { id: 'htl-goa-4', name: 'Acron Waterfront Resort', cityName: 'Goa', country: 'India', address: 'Baga Creek, North Goa', rating: 4.2, starRating: 4, pricePerNight: 5500, currency: 'INR', amenities: ['Pool', 'Restaurant', 'WiFi', 'River View'], coverImage: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'], description: 'Boutique riverside resort with beautiful views and Goan hospitality.', aiMatchScore: 82, whyAiRecommends: 'Budget-friendly with great river views', whyRecommended: 'Budget-friendly with great river views' },
  { id: 'htl-jai-1', name: 'Rambagh Palace', cityName: 'Jaipur', country: 'India', address: 'Bhawani Singh Rd, Jaipur', rating: 4.9, starRating: 5, pricePerNight: 35000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'Polo', 'WiFi', 'Heritage Tours'], coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'], description: 'Former royal residence of the Maharaja, a magnificent palace hotel.', aiMatchScore: 99, whyAiRecommends: 'Ultimate royal experience in Jaipur', whyRecommended: 'Ultimate royal experience in Jaipur' },
  { id: 'htl-jai-2', name: 'The Oberoi Rajvilas', cityName: 'Jaipur', country: 'India', address: 'Goner Road, Jaipur', rating: 4.8, starRating: 5, pricePerNight: 28000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Yoga'], coverImage: 'https://images.unsplash.com/photo-1609602988946-97fe28d73553?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1609602988946-97fe28d73553?auto=format&fit=crop&w=800&q=80'], description: 'Luxury tented camp inspired by Mughal architecture.', aiMatchScore: 96, whyAiRecommends: 'Exceptional spa and yoga facilities', whyRecommended: 'Exceptional spa and yoga facilities' },
  { id: 'htl-jai-3', name: 'Hotel Pearl Palace', cityName: 'Jaipur', country: 'India', address: 'Hari Kishan Somani Marg, Hathroi Fort', rating: 4.4, starRating: 3, pricePerNight: 3500, currency: 'INR', amenities: ['Restaurant', 'WiFi', 'City Tours'], coverImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning heritage boutique hotel in old Jaipur.', aiMatchScore: 88, whyAiRecommends: 'Best budget heritage hotel in Jaipur', whyRecommended: 'Best budget heritage hotel in Jaipur' },
  { id: 'htl-ker-1', name: 'Kumarakom Lake Resort', cityName: 'Kerala', country: 'India', address: 'Kumarakom, Kottayam', rating: 4.8, starRating: 5, pricePerNight: 22000, currency: 'INR', amenities: ['Pool', 'Spa', 'Backwaters', 'Restaurant', 'Ayurveda', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1582610116397-edb72b1f7cf5?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1582610116397-edb72b1f7cf5?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning heritage resort on the banks of Vembanad Lake.', aiMatchScore: 97, whyAiRecommends: 'Iconic backwater experience in Kerala', whyRecommended: 'Iconic backwater experience in Kerala' },
  { id: 'htl-ker-2', name: 'Coconut Lagoon CGH Earth', cityName: 'Kerala', country: 'India', address: 'Vembanad Lake, Kumarakom', rating: 4.7, starRating: 5, pricePerNight: 18000, currency: 'INR', amenities: ['Pool', 'Backwaters', 'Ayurveda', 'Restaurant', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80'], description: 'Heritage villas on Vembanad Lake accessible only by boat.', aiMatchScore: 94, whyAiRecommends: 'Unique boat-access eco resort', whyRecommended: 'Unique boat-access eco resort' },
  { id: 'htl-man-1', name: 'Span Resort & Spa', cityName: 'Manali', country: 'India', address: 'Kullu-Manali Hwy, Katrain', rating: 4.7, starRating: 5, pricePerNight: 12000, currency: 'INR', amenities: ['Spa', 'River View', 'Restaurant', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80'], description: 'Award-winning luxury resort on the banks of river Beas.', aiMatchScore: 93, whyAiRecommends: 'Stunning riverside views and top spa', whyRecommended: 'Stunning riverside views and top spa' },
  { id: 'htl-man-2', name: 'The Orchard Greens Resort', cityName: 'Manali', country: 'India', address: 'Old Manali Road, Manali', rating: 4.4, starRating: 4, pricePerNight: 6500, currency: 'INR', amenities: ['Garden', 'Restaurant', 'Mountain View', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?auto=format&fit=crop&w=800&q=80'], description: 'Charming resort surrounded by apple orchards with mountain views.', aiMatchScore: 85, whyAiRecommends: 'Peaceful apple orchard setting', whyRecommended: 'Peaceful apple orchard setting' },
  { id: 'htl-kyo-1', name: 'The Ritz-Carlton Kyoto', cityName: 'Kyoto', country: 'Japan', address: 'Kamogawa Nijo-Ohashi Hotori', rating: 4.9, starRating: 5, pricePerNight: 65000, currency: 'INR', amenities: ['Pool', 'Spa', 'River View', 'Restaurant', 'Concierge', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'], description: 'Ultra-luxury hotel on the banks of the Kamogawa River.', aiMatchScore: 99, whyAiRecommends: 'Best luxury hotel in Kyoto with river views', whyRecommended: 'Best luxury hotel in Kyoto with river views' },
  { id: 'htl-kyo-2', name: 'ANA Crowne Plaza Kyoto', cityName: 'Kyoto', country: 'Japan', address: 'Horikawa-Nijo, Kyoto', rating: 4.5, starRating: 4, pricePerNight: 18000, currency: 'INR', amenities: ['Restaurant', 'WiFi', 'Business Center'], coverImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80'], description: 'Elegant hotel near Nijo Castle with traditional garden views.', aiMatchScore: 87, whyAiRecommends: 'Great mid-range option near major sights', whyRecommended: 'Great mid-range option near major sights' },
  { id: 'htl-par-1', name: 'The Peninsula Paris', cityName: 'Paris', country: 'France', address: '19 Avenue Kléber, Paris', rating: 4.9, starRating: 5, pricePerNight: 85000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Concierge'], coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'], description: 'Iconic luxury hotel near the Arc de Triomphe with Eiffel Tower views.', aiMatchScore: 98, whyAiRecommends: 'Iconic Paris address with Eiffel Tower views', whyRecommended: 'Iconic Paris address with Eiffel Tower views' },
  { id: 'htl-par-2', name: 'Hotel Le Marois', cityName: 'Paris', country: 'France', address: 'Rue de Rivoli, Paris', rating: 4.5, starRating: 4, pricePerNight: 22000, currency: 'INR', amenities: ['Restaurant', 'Bar', 'WiFi', 'Concierge'], coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'], description: 'Charming boutique hotel near the Louvre.', aiMatchScore: 88, whyAiRecommends: 'Central location near all major attractions', whyRecommended: 'Central location near all major attractions' },
  { id: 'htl-bal-1', name: 'Four Seasons Bali at Sayan', cityName: 'Bali', country: 'Indonesia', address: 'Sayan, Ubud, Bali', rating: 4.9, starRating: 5, pricePerNight: 55000, currency: 'INR', amenities: ['Pool', 'Spa', 'Yoga', 'Restaurant', 'Jungle Trekking', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1540541338537-1220059135de?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1540541338537-1220059135de?auto=format&fit=crop&w=800&q=80'], description: 'Legendary jungle resort above the Ayung River gorge.', aiMatchScore: 99, whyAiRecommends: 'World-famous jungle retreat in Ubud', whyRecommended: 'World-famous jungle retreat in Ubud' },
  { id: 'htl-bal-2', name: 'COMO Uma Ubud', cityName: 'Bali', country: 'Indonesia', address: 'Tjampuhan, Ubud, Bali', rating: 4.8, starRating: 5, pricePerNight: 35000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Yoga'], coverImage: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'], description: 'Intimate retreat in the cultural heart of Bali.', aiMatchScore: 95, whyAiRecommends: 'Intimate wellness-focused Bali experience', whyRecommended: 'Intimate wellness-focused Bali experience' },
  { id: 'htl-agr-1', name: 'The Oberoi Amarvilas', cityName: 'Agra', country: 'India', address: 'Taj East Gate, Agra', rating: 4.9, starRating: 5, pricePerNight: 45000, currency: 'INR', amenities: ['Pool', 'Spa', 'Taj View', 'Restaurant', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80'], description: 'Every room has a view of the Taj Mahal.', aiMatchScore: 100, whyAiRecommends: 'Only hotel with direct Taj Mahal view from every room', whyRecommended: 'Only hotel with direct Taj Mahal view from every room' },
  { id: 'htl-agr-2', name: 'ITC Mughal Agra', cityName: 'Agra', country: 'India', address: 'Fatehabad Road, Agra', rating: 4.7, starRating: 5, pricePerNight: 18000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Ayurveda'], coverImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'], description: 'Sprawling resort inspired by Mughal architecture with magnificent gardens.', aiMatchScore: 93, whyAiRecommends: 'Award-winning Kaya Kalp spa', whyRecommended: 'Award-winning Kaya Kalp spa' },
  { id: 'htl-mum-1', name: 'The Taj Mahal Palace Mumbai', cityName: 'Mumbai', country: 'India', address: 'Apollo Bunder, Colaba', rating: 4.9, starRating: 5, pricePerNight: 28000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'Sea View', 'WiFi', 'Concierge'], coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'], description: "Mumbai's most iconic hotel overlooking the Gateway of India.", aiMatchScore: 98, whyAiRecommends: 'Iconic Mumbai landmark with Gateway of India views', whyRecommended: 'Iconic Mumbai landmark with Gateway of India views' },
  { id: 'htl-mum-2', name: 'Trident Nariman Point', cityName: 'Mumbai', country: 'India', address: 'Nariman Point, Mumbai', rating: 4.7, starRating: 5, pricePerNight: 15000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'Sea View', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80'], description: 'Modern luxury with stunning views of the Arabian Sea.', aiMatchScore: 92, whyAiRecommends: 'Best sea views in central Mumbai', whyRecommended: 'Best sea views in central Mumbai' },
  { id: 'htl-uda-1', name: 'Taj Lake Palace', cityName: 'Udaipur', country: 'India', address: 'Lake Pichola, Udaipur', rating: 4.9, starRating: 5, pricePerNight: 32000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'], description: 'A marble palace seemingly floating on Lake Pichola.', aiMatchScore: 100, whyAiRecommends: "World's most romantic hotel location", whyRecommended: "World's most romantic hotel location" },
  { id: 'htl-uda-2', name: 'Fateh Garh Udaipur', cityName: 'Udaipur', country: 'India', address: 'Fateh Sagar, Udaipur', rating: 4.6, starRating: 5, pricePerNight: 16000, currency: 'INR', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1578898887932-dce23a595ad4?auto=format&fit=crop&w=800&q=80'], description: 'Heritage fortress hotel with Aravalli views.', aiMatchScore: 90, whyAiRecommends: 'Hillside fortress with panoramic lake views', whyRecommended: 'Hillside fortress with panoramic lake views' },
  { id: 'htl-var-1', name: 'BrijRama Palace', cityName: 'Varanasi', country: 'India', address: 'Darbhanga Ghat, Varanasi', rating: 4.7, starRating: 5, pricePerNight: 12000, currency: 'INR', amenities: ['Ganga View', 'Restaurant', 'Yoga', 'Heritage Tours', 'WiFi'], coverImage: 'https://images.unsplash.com/photo-1561401111-701e69de30b4?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1561401111-701e69de30b4?auto=format&fit=crop&w=800&q=80'], description: 'A 200-year-old haveli converted into a boutique hotel on the Ganges ghats.', aiMatchScore: 96, whyAiRecommends: 'Authentic ghat experience with Ganga views', whyRecommended: 'Authentic ghat experience with Ganga views' },
  { id: 'htl-var-2', name: 'Radisson Hotel Varanasi', cityName: 'Varanasi', country: 'India', address: 'The Mall, Varanasi', rating: 4.4, starRating: 4, pricePerNight: 6000, currency: 'INR', amenities: ['Pool', 'Restaurant', 'Spa', 'WiFi', 'Business Center'], coverImage: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=800&q=80'], description: 'Modern comfort in the spiritual capital of India.', aiMatchScore: 82, whyAiRecommends: 'Best modern amenities in Varanasi', whyRecommended: 'Best modern amenities in Varanasi' },
  { id: 'htl-nyc-1', name: 'The Plaza Hotel', cityName: 'New York', country: 'USA', address: 'Fifth Avenue at Central Park South', rating: 4.8, starRating: 5, pricePerNight: 95000, currency: 'INR', amenities: ['Spa', 'Restaurant', 'Bar', 'WiFi', 'Concierge'], coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], description: 'Iconic landmark luxury hotel overlooking Central Park since 1907.', aiMatchScore: 97, whyAiRecommends: 'The most iconic NYC hotel address', whyRecommended: 'The most iconic NYC hotel address' },
  { id: 'htl-nyc-2', name: 'The Standard High Line', cityName: 'New York', country: 'USA', address: '848 Washington Street, NYC', rating: 4.5, starRating: 4, pricePerNight: 45000, currency: 'INR', amenities: ['Restaurant', 'WiFi', 'Bar'], coverImage: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80'], description: 'Trendy hotel straddling the High Line with Hudson River views.', aiMatchScore: 88, whyAiRecommends: 'Trendy Meatpacking District location', whyRecommended: 'Trendy Meatpacking District location' },
];

/** Normalise a backend API hotel response into the Hotel shape our UI expects */
function normalizeHotel(h: any): Hotel {
  const seed = SEED_HOTELS.find(s => s.name.toLowerCase() === h.name?.toLowerCase());
  return {
    id: h.id,
    name: h.name,
    cityName: h.cityName || h.cities?.name || '',
    country: h.country || h.cities?.country || '',
    address: h.address || seed?.address || '',
    rating: h.rating || h.userRating || seed?.rating || 4.5,
    starRating: h.starRating || seed?.starRating || 4,
    userRating: h.rating || h.userRating || seed?.rating || 4.5,
    reviewsCount: h.reviewsCount || 0,
    pricePerNight: h.pricePerNight || h.price_per_night || 0,
    currency: h.currency || 'INR',
    amenities: h.amenities || seed?.amenities || [],
    coverImage: h.coverImage || (h.images && h.images[0]) || h.image_url || seed?.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: h.images || [h.image_url || seed?.coverImage || ''],
    gallery: h.gallery || h.images || [],
    description: h.description || seed?.description || '',
    aiMatchScore: h.aiMatchScore || seed?.aiMatchScore || 85,
    whyAiRecommends: h.whyAiRecommends || h.whyRecommended || seed?.whyAiRecommends || 'Highly rated by travelers',
    whyRecommended: h.whyRecommended || h.whyAiRecommends || seed?.whyRecommended || 'Highly rated by travelers',
    coordinates: h.coordinates || (h.latitude ? { lat: h.latitude, lng: h.longitude } : seed?.coordinates),
  };
}

class HotelService {
  /** Called by TripHotelsPage with cityName (not cityId) */
  async getHotelsByCity(cityNameOrId: string, filters?: HotelFilterParams): Promise<Hotel[]> {
    // First try by city name via backend
    try {
      const data = await apiClient.get<Hotel[]>(`/hotels?city_name=${encodeURIComponent(cityNameOrId)}`);
      if (data && data.length > 0) {
        const normalized = data.map(normalizeHotel);
        storageService.setItem(HOTELS_CACHE_KEY, normalized);
        return this._applyFilters(normalized, filters);
      }
    } catch {}
    // Fallback: filter seed data by city name
    const name = cityNameOrId.toLowerCase();
    const seedFiltered = SEED_HOTELS.filter(h =>
      h.cityName.toLowerCase() === name ||
      h.cityName.toLowerCase().includes(name) ||
      name.includes(h.cityName.toLowerCase())
    );
    return this._applyFilters(seedFiltered.length > 0 ? seedFiltered : SEED_HOTELS, filters);
  }

  async getHotels(filters?: HotelFilterParams): Promise<Hotel[]> {
    try {
      const data = await apiClient.get<Hotel[]>('/hotels');
      if (data && data.length > 0) return this._applyFilters(data.map(normalizeHotel), filters);
      return this._applyFilters(SEED_HOTELS, filters);
    } catch {
      return this._applyFilters(SEED_HOTELS, filters);
    }
  }

  private _applyFilters(hotels: Hotel[], filters?: HotelFilterParams): Hotel[] {
    let result = [...hotels];
    if (filters?.maxPrice) result = result.filter(h => h.pricePerNight <= filters.maxPrice!);
    if (filters?.minStarRating) result = result.filter(h => (h.starRating || h.rating || 0) >= filters.minStarRating!);
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(h => h.name?.toLowerCase().includes(q) || h.cityName?.toLowerCase().includes(q));
    }
    if (filters?.sortBy === 'priceAsc') result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (filters?.sortBy === 'priceDesc') result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (filters?.sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (filters?.sortBy === 'aiMatch') result.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
    return result;
  }

  async getHotelById(id: string): Promise<Hotel | undefined> {
    try {
      const hotels = await apiClient.get<Hotel[]>('/hotels');
      const found = hotels.find(h => h.id === id);
      if (found) return normalizeHotel(found);
    } catch {}
    return SEED_HOTELS.find(h => h.id === id);
  }

  async searchHotels(query: string, cityName?: string): Promise<Hotel[]> {
    const lowerQuery = query.toLowerCase();
    const results = SEED_HOTELS.filter(h =>
      h.name.toLowerCase().includes(lowerQuery) ||
      h.cityName.toLowerCase().includes(lowerQuery) ||
      h.address?.toLowerCase().includes(lowerQuery)
    );
    if (cityName) return results.filter(h => h.cityName.toLowerCase().includes(cityName.toLowerCase()));
    return results;
  }
}

export const hotelService = new HotelService();
