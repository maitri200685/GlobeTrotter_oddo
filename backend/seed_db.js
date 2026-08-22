const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://aflmtzzctqfermxsfwnp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbG10enpjdHFmZXJteHNmd25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM3MDA1OCwiZXhwIjoyMTAyOTQ2MDU4fQ.5bv3S0uCMQrz8dUlh6ZE8a1dysnm3wLGfxk9mufq3gQ';

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const CITIES = [
  { name: 'Goa', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 15.2993, longitude: 74.1240, description: 'India\'s beach paradise with golden sands, vibrant nightlife, and Portuguese heritage.', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e578?auto=format&fit=crop&w=800&q=80', popularity: 95, cost_index: 3 },
  { name: 'Jaipur', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 26.9124, longitude: 75.7873, description: 'The Pink City with magnificent forts, palaces, and Rajasthani culture.', image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', popularity: 90, cost_index: 2 },
  { name: 'Kerala', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 10.8505, longitude: 76.2711, description: 'God\'s Own Country with lush backwaters, tea gardens, and Ayurveda.', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', popularity: 88, cost_index: 2 },
  { name: 'Manali', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 32.2396, longitude: 77.1887, description: 'Himalayan adventure hub with snow peaks, river rafting, and ski slopes.', image_url: 'https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80', popularity: 85, cost_index: 2 },
  { name: 'Kyoto', country: 'Japan', country_code: 'JP', region: 'East Asia', latitude: 35.0116, longitude: 135.7681, description: 'Japan\'s ancient capital with thousands of temples, geisha culture, and bamboo groves.', image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', popularity: 92, cost_index: 4 },
  { name: 'Paris', country: 'France', country_code: 'FR', region: 'Europe', latitude: 48.8566, longitude: 2.3522, description: 'City of Love with the Eiffel Tower, world-class cuisine, and art museums.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', popularity: 98, cost_index: 5 },
  { name: 'Bali', country: 'Indonesia', country_code: 'ID', region: 'Southeast Asia', latitude: -8.3405, longitude: 115.0920, description: 'Island of Gods with spiritual temples, rice terraces, and surf beaches.', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', popularity: 94, cost_index: 2 },
  { name: 'New York', country: 'USA', country_code: 'US', region: 'North America', latitude: 40.7128, longitude: -74.0060, description: 'The Big Apple with Times Square, Central Park, and world-famous skyline.', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', popularity: 97, cost_index: 5 },
  { name: 'Agra', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 27.1767, longitude: 78.0081, description: 'Home of the Taj Mahal, a symbol of eternal love and Mughal heritage.', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', popularity: 89, cost_index: 2 },
  { name: 'Mumbai', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 19.0760, longitude: 72.8777, description: 'India\'s financial capital with Bollywood, street food, and colonial architecture.', image_url: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80', popularity: 91, cost_index: 3 },
  { name: 'Udaipur', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 24.5854, longitude: 73.7125, description: 'City of Lakes with romantic lake palaces, havelis, and Rajput grandeur.', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', popularity: 84, cost_index: 2 },
  { name: 'Varanasi', country: 'India', country_code: 'IN', region: 'South Asia', latitude: 25.3176, longitude: 82.9739, description: 'The spiritual capital of India on the banks of the Ganges.', image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', popularity: 82, cost_index: 1 },
];

const HOTELS_BY_CITY = {
  'Goa': [
    { name: 'Taj Exotica Resort & Spa', description: 'Luxury beachfront resort with private beach, infinity pool and world-class spa.', rating: 4.8, price_per_night: 18000, amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar', 'WiFi', 'Gym'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Leela Goa', description: 'Award-winning 5-star resort set amid 75 acres of beautiful Goa landscape.', rating: 4.7, price_per_night: 15000, amenities: ['Pool', 'Spa', 'Golf', 'Restaurant', 'WiFi', 'Beach Access'], image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Alila Diwa Goa', description: 'Contemporary luxury resort showcasing Goan village culture and heritage.', rating: 4.6, price_per_night: 12000, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Cycling'], image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Acron Waterfront Resort', description: 'Boutique riverside resort with beautiful views and Goan hospitality.', rating: 4.2, price_per_night: 5500, amenities: ['Pool', 'Restaurant', 'WiFi', 'River View'], image_url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80' },
  ],
  'Jaipur': [
    { name: 'Rambagh Palace', description: 'Former royal residence of the Maharaja, a magnificent palace hotel.', rating: 4.9, price_per_night: 35000, amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Polo', 'WiFi', 'Heritage Tours'], image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Jai Mahal Palace', description: 'Elegant 19th-century palace set in 18 acres of Mughal gardens.', rating: 4.7, price_per_night: 20000, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Garden'], image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Oberoi Rajvilas', description: 'Luxury tented camp inspired by Mughal architecture.', rating: 4.8, price_per_night: 28000, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Yoga'], image_url: 'https://images.unsplash.com/photo-1609602988946-97fe28d73553?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hotel Pearl Palace', description: 'Award-winning heritage boutique hotel in old Jaipur.', rating: 4.4, price_per_night: 3500, amenities: ['Restaurant', 'WiFi', 'Terrace', 'City Tours'], image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80' },
  ],
  'Kerala': [
    { name: 'Kumarakom Lake Resort', description: 'Award-winning heritage resort on the banks of Vembanad Lake.', rating: 4.8, price_per_night: 22000, amenities: ['Pool', 'Spa', 'Backwater Cruises', 'Restaurant', 'Ayurveda', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1582610116397-edb72b1f7cf5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Spice Village CGH Earth', description: 'Eco-resort nestled in a 21-acre pepper and cardamom estate.', rating: 4.6, price_per_night: 15000, amenities: ['Pool', 'Spa', 'Spice Garden Tours', 'Restaurant', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80' },
    { name: 'Coconut Lagoon', description: 'Heritage villas on the Vembanad Lake accessible only by boat.', rating: 4.7, price_per_night: 18000, amenities: ['Pool', 'Backwaters', 'Ayurveda', 'Restaurant', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80' },
  ],
  'Kyoto': [
    { name: 'The Ritz-Carlton Kyoto', description: 'Ultra-luxury hotel on the banks of the Kamogawa River.', rating: 4.9, price_per_night: 65000, amenities: ['Pool', 'Spa', 'River View', 'Restaurant', 'Concierge', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
    { name: 'Nishiyama Onsen Keiunkan', description: 'Oldest hotel in the world with traditional Japanese hot spring baths.', rating: 4.8, price_per_night: 45000, amenities: ['Onsen', 'Kaiseki Dining', 'Garden', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { name: 'ANA Crowne Plaza Kyoto', description: 'Elegant hotel near Nijo Castle with traditional garden views.', rating: 4.5, price_per_night: 18000, amenities: ['Restaurant', 'Garden View', 'Business Center', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80' },
  ],
  'Paris': [
    { name: 'The Peninsula Paris', description: 'Iconic luxury hotel near the Arc de Triomphe with Eiffel Tower views.', rating: 4.9, price_per_night: 85000, amenities: ['Pool', 'Spa', 'Rooftop Restaurant', 'WiFi', 'Concierge'], image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hotel Le Marois', description: 'Charming boutique hotel in the heart of Paris near the Louvre.', rating: 4.6, price_per_night: 22000, amenities: ['Restaurant', 'Bar', 'WiFi', 'Concierge'], image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80' },
  ],
  'Bali': [
    { name: 'Four Seasons Resort Bali at Sayan', description: 'Legendary jungle resort above the Ayung River gorge.', rating: 4.9, price_per_night: 55000, amenities: ['Pool', 'Spa', 'Yoga', 'Restaurant', 'Jungle Trekking', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1540541338537-1220059135de?auto=format&fit=crop&w=800&q=80' },
    { name: 'COMO Uma Ubud', description: 'Intimate retreat in the cultural heart of Bali with rice terraces.', rating: 4.8, price_per_night: 35000, amenities: ['Pool', 'Spa', 'Cooking Classes', 'Restaurant', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80' },
  ],
  'Manali': [
    { name: 'Span Resort & Spa', description: 'Award-winning luxury resort on the banks of river Beas.', rating: 4.7, price_per_night: 12000, amenities: ['Spa', 'River View', 'Restaurant', 'Bonfire', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Orchard Greens Resort', description: 'Charming resort surrounded by apple orchards with mountain views.', rating: 4.4, price_per_night: 6500, amenities: ['Garden', 'Restaurant', 'Mountain View', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?auto=format&fit=crop&w=800&q=80' },
  ],
  'Mumbai': [
    { name: 'The Taj Mahal Palace', description: 'Mumbai\'s most iconic hotel overlooking the Gateway of India since 1903.', rating: 4.9, price_per_night: 28000, amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Sea View', 'WiFi', 'Concierge'], image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Trident Nariman Point', description: 'Modern luxury with stunning views of the Arabian Sea.', rating: 4.7, price_per_night: 15000, amenities: ['Pool', 'Spa', 'Restaurant', 'Sea View', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80' },
  ],
  'Udaipur': [
    { name: 'Taj Lake Palace', description: 'A marble palace seemingly floating on Lake Pichola - one of the world\'s most romantic hotels.', rating: 4.9, price_per_night: 32000, amenities: ['Pool', 'Spa', 'Boat Access', 'Multiple Restaurants', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fateh Garh', description: 'Heritage fortress hotel perched on a hill overlooking the Aravalli Range.', rating: 4.6, price_per_night: 16000, amenities: ['Pool', 'Spa', 'Restaurant', 'Lake View', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?auto=format&fit=crop&w=800&q=80' },
  ],
  'Agra': [
    { name: 'The Oberoi Amarvilas', description: 'Every room has a view of the Taj Mahal - India\'s most exclusive hotel location.', rating: 4.9, price_per_night: 45000, amenities: ['Pool', 'Spa', 'Taj View', 'Restaurant', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80' },
    { name: 'ITC Mughal Agra', description: 'Sprawling resort inspired by Mughal architecture with magnificent gardens.', rating: 4.7, price_per_night: 18000, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Ayurveda'], image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80' },
  ],
  'Varanasi': [
    { name: 'BrijRama Palace', description: 'A 200-year-old haveli converted into a boutique hotel on the Ganges ghats.', rating: 4.7, price_per_night: 12000, amenities: ['Ganga View', 'Restaurant', 'Yoga', 'Heritage Tours', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80' },
    { name: 'Radisson Hotel Varanasi', description: 'Modern comfort in the spiritual capital of India.', rating: 4.4, price_per_night: 6000, amenities: ['Pool', 'Restaurant', 'Spa', 'WiFi', 'Business Center'], image_url: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=800&q=80' },
  ],
  'New York': [
    { name: 'The Plaza Hotel', description: 'Iconic landmark luxury hotel overlooking Central Park since 1907.', rating: 4.8, price_per_night: 95000, amenities: ['Spa', 'Restaurant', 'Bar', 'Central Park View', 'Concierge', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Standard High Line', description: 'Trendy hotel straddling the High Line with Hudson River views.', rating: 4.5, price_per_night: 45000, amenities: ['Rooftop Bar', 'Restaurant', 'River View', 'WiFi'], image_url: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80' },
  ],
};

const ACTIVITIES_BY_CITY = {
  'Goa': [
    { name: 'Grande Island Scuba Diving', description: 'Dive into crystal clear waters around Grande Island. Spot corals, tropical fish, and sea turtles.', category: 'adventure', estimated_cost: 3500, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dudhsagar Waterfall Trek', description: 'Epic 4-tier waterfall trek through the Western Ghats. Best during monsoon.', category: 'adventure', estimated_cost: 1200, duration_minutes: 480, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Old Goa Churches Tour', description: 'UNESCO World Heritage churches including Basilica of Bom Jesus with St. Xavier\'s remains.', category: 'culture', estimated_cost: 500, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' },
    { name: 'Goa Spice Plantation Tour', description: 'Guided tour through tropical spice plantations with traditional Goan lunch.', category: 'nature', estimated_cost: 800, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1596301184360-dbb5e0fd8b90?auto=format&fit=crop&w=800&q=80' },
    { name: 'Calangute Beach Parasailing', description: 'Soar above Goa\'s most popular beach with thrilling parasailing.', category: 'adventure', estimated_cost: 1500, duration_minutes: 60, image_url: 'https://images.unsplash.com/photo-1542397284385-6010376c5337?auto=format&fit=crop&w=800&q=80' },
    { name: 'Goan Fish Curry Cooking Class', description: 'Learn to cook authentic Goan seafood in a local home kitchen.', category: 'food', estimated_cost: 2000, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80' },
  ],
  'Jaipur': [
    { name: 'Amber Fort Tour', description: 'Explore the stunning hilltop Amber Fort with elephant ride and light show.', category: 'sightseeing', estimated_cost: 1200, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80' },
    { name: 'City Palace & Hawa Mahal', description: 'Visit the royal City Palace museum and iconic Hawa Mahal wind palace.', category: 'culture', estimated_cost: 600, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1477511801984-4ad318ed9846?auto=format&fit=crop&w=800&q=80' },
    { name: 'Rajasthani Cooking Class', description: 'Master the art of dal baati churma and laal maas in a traditional kitchen.', category: 'food', estimated_cost: 2500, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hot Air Balloon Sunrise', description: 'Float above Jaipur\'s majestic forts and palaces at dawn.', category: 'adventure', estimated_cost: 8500, duration_minutes: 120, image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Johari Bazaar Shopping Tour', description: 'Hunt for precious gems, traditional jewelry, and block-print textiles.', category: 'shopping', estimated_cost: 500, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  ],
  'Kerala': [
    { name: 'Alleppey Houseboat Cruise', description: 'Overnight stay in a traditional Kerala houseboat through scenic backwaters.', category: 'nature', estimated_cost: 12000, duration_minutes: 1440, image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
    { name: 'Periyar Tiger Reserve Safari', description: 'Boat safari through Periyar Wildlife Sanctuary. Spot elephants and tigers.', category: 'nature', estimated_cost: 2500, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Kathakali Dance Performance', description: 'Watch the mesmerizing classical dance-drama of Kerala with elaborate makeup.', category: 'culture', estimated_cost: 500, duration_minutes: 90, image_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Ayurveda Rejuvenation Package', description: 'Traditional Kerala Panchakarma therapy for complete mind-body wellness.', category: 'other', estimated_cost: 5000, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' },
  ],
  'Kyoto': [
    { name: 'Fushimi Inari Shrine Walk', description: 'Walk through thousands of vibrant torii gates up Mount Inari at dawn.', category: 'sightseeing', estimated_cost: 0, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Arashiyama Bamboo Grove', description: 'Walk through the iconic bamboo forest and visit Tenryu-ji temple.', category: 'nature', estimated_cost: 500, duration_minutes: 120, image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80' },
    { name: 'Traditional Tea Ceremony', description: 'Experience an authentic Japanese tea ceremony in a historic machiya.', category: 'culture', estimated_cost: 3500, duration_minutes: 90, image_url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Geisha District Night Walk', description: 'Guided evening walk through Gion with chance to spot geishas.', category: 'nightlife', estimated_cost: 2000, duration_minutes: 120, image_url: 'https://images.unsplash.com/photo-1528028025847-a36e5a3083d1?auto=format&fit=crop&w=800&q=80' },
  ],
  'Paris': [
    { name: 'Eiffel Tower Skip-the-Line', description: 'Priority access to all three floors of the iconic Eiffel Tower.', category: 'sightseeing', estimated_cost: 4500, duration_minutes: 120, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'Louvre Museum Guided Tour', description: 'Expert guide tour of the world\'s largest art museum, see the Mona Lisa.', category: 'culture', estimated_cost: 6000, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80' },
    { name: 'Seine River Dinner Cruise', description: 'Romantic gourmet dinner cruise under Paris\'s glittering bridges.', category: 'food', estimated_cost: 12000, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80' },
  ],
  'Bali': [
    { name: 'Tegalalang Rice Terrace Trek', description: 'Hike through stunning emerald-green rice terraces with local guide.', category: 'nature', estimated_cost: 800, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mount Batur Sunrise Trek', description: 'Pre-dawn hike to the summit of active volcano for breathtaking sunrise.', category: 'adventure', estimated_cost: 3500, duration_minutes: 360, image_url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80' },
    { name: 'Traditional Balinese Cooking', description: 'Morning market visit and hands-on cooking class with Balinese family.', category: 'food', estimated_cost: 4500, duration_minutes: 300, image_url: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80' },
  ],
  'Manali': [
    { name: 'Solang Valley Snow Activities', description: 'Skiing, snow zorbing, and snowboarding in the iconic Solang Valley.', category: 'adventure', estimated_cost: 2000, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80' },
    { name: 'Beas River White Water Rafting', description: 'Thrilling Grade 3-4 rafting through stunning Kullu Valley.', category: 'adventure', estimated_cost: 1500, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hadimba Temple & Old Manali Walk', description: 'Visit the unique cave temple and explore the old Manali village bazaar.', category: 'culture', estimated_cost: 400, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80' },
  ],
  'Mumbai': [
    { name: 'Gateway of India & Elephanta Caves', description: 'Ferry to Elephanta Island with UNESCO World Heritage cave temples.', category: 'sightseeing', estimated_cost: 800, duration_minutes: 300, image_url: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dharavi Slum Walking Tour', description: 'Insightful tour of Asia\'s largest urban township and its thriving industries.', category: 'culture', estimated_cost: 1200, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1566237284773-f8d37b9a0f6f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mumbai Street Food Tour', description: 'Taste vada pav, pav bhaji, and chaat with a local food expert guide.', category: 'food', estimated_cost: 1500, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  ],
  'Udaipur': [
    { name: 'Lake Pichola Sunset Boat Ride', description: 'Romantic boat ride on Lake Pichola with views of City Palace and Lake Palace.', category: 'sightseeing', estimated_cost: 700, duration_minutes: 60, image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
    { name: 'City Palace Museum Tour', description: 'Explore the magnificent 400-year-old City Palace with stunning lake views.', category: 'culture', estimated_cost: 600, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
  ],
  'Agra': [
    { name: 'Taj Mahal Sunrise Visit', description: 'Witness the Taj Mahal in the magical light of sunrise. Book well in advance.', category: 'sightseeing', estimated_cost: 1500, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80' },
    { name: 'Agra Fort & Mehtab Bagh', description: 'Explore the magnificent Mughal Agra Fort and sunset views from Mehtab Bagh.', category: 'sightseeing', estimated_cost: 800, duration_minutes: 240, image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80' },
  ],
  'Varanasi': [
    { name: 'Ganga Aarti Ceremony', description: 'Witness the spectacular nightly fire ritual on the banks of the sacred Ganges.', category: 'culture', estimated_cost: 200, duration_minutes: 60, image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dawn Boat Ride on the Ganges', description: 'Early morning row boat ride past the burning ghats and bathing pilgrims.', category: 'sightseeing', estimated_cost: 500, duration_minutes: 90, image_url: 'https://images.unsplash.com/photo-1561323013-4d8ed9f9fd5e?auto=format&fit=crop&w=800&q=80' },
  ],
  'New York': [
    { name: 'Central Park Guided Bike Tour', description: 'Explore all of Central Park\'s iconic spots with an expert local guide.', category: 'sightseeing', estimated_cost: 4500, duration_minutes: 180, image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Brooklyn Bridge Walk & DUMBO', description: 'Walk across the iconic bridge and explore the trendy DUMBO neighborhood.', category: 'sightseeing', estimated_cost: 0, duration_minutes: 120, image_url: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80' },
    { name: 'Broadway Show', description: 'Experience the magic of live Broadway theater in the heart of Manhattan.', category: 'nightlife', estimated_cost: 12000, duration_minutes: 150, image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' },
  ],
};

async function seed() {
  console.log('Seeding cities...');
  const { data: insertedCities, error: cityError } = await admin.from('cities').insert(CITIES).select();
  if (cityError) { console.error('City error:', cityError.message); return; }
  console.log('Cities inserted:', insertedCities.length);

  const cityMap = {};
  insertedCities.forEach(c => cityMap[c.name] = c.id);

  console.log('Seeding hotels...');
  const hotels = [];
  for (const [cityName, cityHotels] of Object.entries(HOTELS_BY_CITY)) {
    const cityId = cityMap[cityName];
    if (!cityId) { console.log('City not found:', cityName); continue; }
    cityHotels.forEach(h => hotels.push({ ...h, city_id: cityId }));
  }
  const { data: insertedHotels, error: hotelError } = await admin.from('hotels').insert(hotels).select();
  if (hotelError) { console.error('Hotel error:', hotelError.message, hotels[0]); return; }
  console.log('Hotels inserted:', insertedHotels.length);

  console.log('Seeding activities...');
  const activities = [];
  for (const [cityName, cityActivities] of Object.entries(ACTIVITIES_BY_CITY)) {
    const cityId = cityMap[cityName];
    if (!cityId) { console.log('City not found:', cityName); continue; }
    cityActivities.forEach(a => activities.push({ ...a, city_id: cityId }));
  }
  const { data: insertedActivities, error: activityError } = await admin.from('activities').insert(activities).select();
  if (activityError) { console.error('Activity error:', activityError.message, activities[0]); return; }
  console.log('Activities inserted:', insertedActivities.length);

  console.log('\n=== SEED COMPLETE ===');
  console.log('Cities:', insertedCities.length);
  console.log('Hotels:', insertedHotels.length);
  console.log('Activities:', insertedActivities.length);
}

seed().catch(console.error);
