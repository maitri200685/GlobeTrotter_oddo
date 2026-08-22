import { apiClient } from '../lib/apiClient';
import { storageService } from './storageService';
import type { Activity, ActivityFilterParams, ActivityCategory } from '@/types/inventory.types';

const ACTIVITIES_CACHE_KEY = 'gt_activities_cache_v2';

const SEED_ACTIVITIES: Activity[] = [
  // GOA
  { id: 'act-goa-1', title: 'Grande Island Scuba Diving', cityName: 'Goa', country: 'India', category: 'adventure', estimatedCost: 3500, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Dive into crystal clear waters around Grande Island. Spot corals, tropical fish, and sea turtles.', coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '08:00', recommendedTimeSlot: 'morning', location: 'Grande Island, Goa', tags: ['water', 'adventure', 'marine'], highlights: ['Coral reef diving', 'Dolphin spotting', 'Underwater photography'] },
  { id: 'act-goa-2', title: 'Dudhsagar Waterfall Trek', cityName: 'Goa', country: 'India', category: 'adventure', estimatedCost: 1200, currency: 'INR', durationMinutes: 480, duration: '8 hours', description: 'Epic 4-tier waterfall trek through the Western Ghats. Best during monsoon season.', coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '07:00', recommendedTimeSlot: 'morning', location: 'Mollem, Goa', tags: ['nature', 'trek', 'waterfall'], highlights: ['600m high waterfall', 'Railway bridge crossing', 'Jungle wildlife'] },
  { id: 'act-goa-3', title: 'Old Goa Churches Tour', cityName: 'Goa', country: 'India', category: 'culture', estimatedCost: 500, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'UNESCO World Heritage churches including Basilica of Bom Jesus with St. Xavier\'s remains.', coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'], rating: 4.6, suggestedTime: '10:00', recommendedTimeSlot: 'morning', location: 'Old Goa', tags: ['heritage', 'history', 'UNESCO'], highlights: ['Basilica of Bom Jesus', 'Se Cathedral', 'Portuguese architecture'] },
  { id: 'act-goa-4', title: 'Calangute Beach Parasailing', cityName: 'Goa', country: 'India', category: 'adventure', estimatedCost: 1500, currency: 'INR', durationMinutes: 60, duration: '1 hour', description: 'Soar above Goa\'s most popular beach with thrilling parasailing experience.', coverImage: 'https://images.unsplash.com/photo-1542397284385-6010376c5337?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1542397284385-6010376c5337?auto=format&fit=crop&w=800&q=80'], rating: 4.5, suggestedTime: '15:00', recommendedTimeSlot: 'afternoon', location: 'Calangute Beach, Goa', tags: ['beach', 'watersport', 'thrill'], highlights: ['Aerial views', 'Beach panorama', 'Safe harness system'] },
  { id: 'act-goa-5', title: 'Goan Fish Curry Cooking Class', cityName: 'Goa', country: 'India', category: 'food', estimatedCost: 2000, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Learn to cook authentic Goan seafood dishes in a local home kitchen with market visit.', coverImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '10:00', recommendedTimeSlot: 'morning', location: 'Panaji, Goa', tags: ['food', 'cooking', 'culture'], highlights: ['Market tour', 'Fish curry recipe', 'Vindaloo preparation'] },
  { id: 'act-goa-6', title: 'Goa Spice Plantation Tour', cityName: 'Goa', country: 'India', category: 'nature', estimatedCost: 800, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Guided tour through tropical spice plantations with traditional Goan lunch included.', coverImage: 'https://images.unsplash.com/photo-1596301184360-dbb5e0fd8b90?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1596301184360-dbb5e0fd8b90?auto=format&fit=crop&w=800&q=80'], rating: 4.5, suggestedTime: '10:00', recommendedTimeSlot: 'morning', location: 'Ponda, Goa', tags: ['nature', 'spices', 'food'], highlights: ['Cardamom trees', 'Vanilla pods', 'Elephant interaction'] },
  // JAIPUR
  { id: 'act-jai-1', title: 'Amber Fort & Elephant Ride', cityName: 'Jaipur', country: 'India', category: 'sightseeing', estimatedCost: 1200, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Explore the stunning hilltop Amber Fort with traditional elephant ride and mesmerizing light show.', coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '09:00', recommendedTimeSlot: 'morning', location: 'Amber Fort, Jaipur', tags: ['heritage', 'fort', 'elephant'], highlights: ['Sheesh Mahal mirror palace', 'Elephant ride', 'Evening light show'] },
  { id: 'act-jai-2', title: 'Hot Air Balloon Sunrise', cityName: 'Jaipur', country: 'India', category: 'adventure', estimatedCost: 8500, currency: 'INR', durationMinutes: 120, duration: '2 hours', description: 'Float above Jaipur\'s majestic forts and palaces at the golden hour of dawn.', coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '05:30', recommendedTimeSlot: 'morning', location: 'Jaipur', tags: ['adventure', 'aerial', 'sunrise'], highlights: ['Sunrise over forts', 'Champagne breakfast', 'Aerial photography'] },
  { id: 'act-jai-3', title: 'Rajasthani Cooking Class', cityName: 'Jaipur', country: 'India', category: 'food', estimatedCost: 2500, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Master the art of dal baati churma and laal maas in a traditional Rajput kitchen.', coverImage: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '11:00', recommendedTimeSlot: 'morning', location: 'Old City, Jaipur', tags: ['food', 'cooking', 'culture'], highlights: ['Dal baati churma', 'Laal maas', 'Ker sangri'] },
  { id: 'act-jai-4', title: 'Johari Bazaar Gem Shopping', cityName: 'Jaipur', country: 'India', category: 'shopping', estimatedCost: 500, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Hunt for precious gems, traditional jewelry, and block-print textiles in the famous bazaar.', coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'], rating: 4.5, suggestedTime: '15:00', recommendedTimeSlot: 'afternoon', location: 'Johari Bazaar, Jaipur', tags: ['shopping', 'gems', 'textiles'], highlights: ['Precious gemstones', 'Block-print fabric', 'Silver jewelry'] },
  // KERALA
  { id: 'act-ker-1', title: 'Alleppey Houseboat Cruise', cityName: 'Kerala', country: 'India', category: 'nature', estimatedCost: 12000, currency: 'INR', durationMinutes: 1440, duration: '24 hours', description: 'Overnight stay in a traditional Kerala kettuvallam houseboat through scenic backwaters.', coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '12:00', recommendedTimeSlot: 'afternoon', location: 'Alleppey, Kerala', tags: ['backwaters', 'houseboat', 'nature'], highlights: ['Backwater village life', 'Kerala cuisine onboard', 'Sunrise on the water'] },
  { id: 'act-ker-2', title: 'Periyar Tiger Reserve Safari', cityName: 'Kerala', country: 'India', category: 'nature', estimatedCost: 2500, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Boat safari through Periyar Wildlife Sanctuary. Spot elephants, deer, and rare birds.', coverImage: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '07:00', recommendedTimeSlot: 'morning', location: 'Thekkady, Kerala', tags: ['wildlife', 'safari', 'nature'], highlights: ['Wild elephant herds', 'Rare bird spotting', 'Dense rainforest'] },
  { id: 'act-ker-3', title: 'Kathakali Dance Performance', cityName: 'Kerala', country: 'India', category: 'culture', estimatedCost: 500, currency: 'INR', durationMinutes: 90, duration: '1.5 hours', description: 'Watch the mesmerizing classical dance-drama of Kerala with its elaborate makeup and costumes.', coverImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80'], rating: 4.6, suggestedTime: '18:00', recommendedTimeSlot: 'evening', location: 'Kochi, Kerala', tags: ['culture', 'dance', 'traditional'], highlights: ['Elaborate makeup ritual', 'Ancient storytelling', 'Traditional orchestra'] },
  // MANALI
  { id: 'act-man-1', title: 'Solang Valley Snow Activities', cityName: 'Manali', country: 'India', category: 'adventure', estimatedCost: 2000, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Skiing, snow zorbing, and snowboarding in the iconic Solang Valley with Himalayan backdrop.', coverImage: 'https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1585136917228-2dece9c2c8be?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '09:00', recommendedTimeSlot: 'morning', location: 'Solang Valley, Manali', tags: ['snow', 'skiing', 'adventure'], highlights: ['Ski slopes', 'Snow zorbing', 'Cable car rides'] },
  { id: 'act-man-2', title: 'Beas River White Water Rafting', cityName: 'Manali', country: 'India', category: 'adventure', estimatedCost: 1500, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Thrilling Grade 3-4 white water rafting through the stunning Kullu Valley rapids.', coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '10:00', recommendedTimeSlot: 'morning', location: 'Kullu, Himachal Pradesh', tags: ['rafting', 'adventure', 'river'], highlights: ['Grade 4 rapids', 'Mountain scenery', 'Professional guides'] },
  { id: 'act-man-3', title: 'Hadimba Temple & Old Manali', cityName: 'Manali', country: 'India', category: 'culture', estimatedCost: 400, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Visit the unique cave temple and explore the old Manali village bazaar.', coverImage: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80'], rating: 4.5, suggestedTime: '14:00', recommendedTimeSlot: 'afternoon', location: 'Old Manali', tags: ['temple', 'culture', 'heritage'], highlights: ['4-storey pagoda temple', 'Village market', 'Deodar cedar forest'] },
  // KYOTO
  { id: 'act-kyo-1', title: 'Fushimi Inari Shrine Walk', cityName: 'Kyoto', country: 'Japan', category: 'sightseeing', estimatedCost: 0, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Walk through thousands of vibrant vermilion torii gates up sacred Mount Inari at dawn.', coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '06:00', recommendedTimeSlot: 'morning', location: 'Fushimi, Kyoto', tags: ['shrine', 'torii', 'hiking'], highlights: ['10,000 torii gates', 'Summit views', 'Fox shrine'] },
  { id: 'act-kyo-2', title: 'Traditional Tea Ceremony', cityName: 'Kyoto', country: 'Japan', category: 'culture', estimatedCost: 3500, currency: 'INR', durationMinutes: 90, duration: '1.5 hours', description: 'Experience an authentic Japanese tea ceremony in a historic machiya with a certified tea master.', coverImage: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '14:00', recommendedTimeSlot: 'afternoon', location: 'Higashiyama, Kyoto', tags: ['tea', 'culture', 'tradition'], highlights: ['Matcha preparation', 'Wagashi sweets', 'Tatami room'] },
  { id: 'act-kyo-3', title: 'Arashiyama Bamboo Grove', cityName: 'Kyoto', country: 'Japan', category: 'nature', estimatedCost: 500, currency: 'INR', durationMinutes: 120, duration: '2 hours', description: 'Walk through the iconic towering bamboo grove and visit the Tenryu-ji zen garden.', coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '08:00', recommendedTimeSlot: 'morning', location: 'Arashiyama, Kyoto', tags: ['bamboo', 'nature', 'zen'], highlights: ['Bamboo canopy', 'Monkey park', 'Tenryu-ji garden'] },
  // PARIS
  { id: 'act-par-1', title: 'Eiffel Tower Skip-the-Line', cityName: 'Paris', country: 'France', category: 'sightseeing', estimatedCost: 4500, currency: 'INR', durationMinutes: 120, duration: '2 hours', description: 'Priority access to all three floors of the iconic Eiffel Tower with panoramic city views.', coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '10:00', recommendedTimeSlot: 'morning', location: 'Champ de Mars, Paris', tags: ['landmark', 'views', 'iconic'], highlights: ['All 3 floors', 'Glass floor on level 1', 'Champagne at summit'] },
  { id: 'act-par-2', title: 'Louvre Museum Guided Tour', cityName: 'Paris', country: 'France', category: 'culture', estimatedCost: 6000, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: "Expert guide tour of the world's largest art museum. See the Mona Lisa and Venus de Milo.", coverImage: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '09:00', recommendedTimeSlot: 'morning', location: 'Louvre, Paris', tags: ['art', 'museum', 'history'], highlights: ['Mona Lisa', 'Venus de Milo', 'Glass Pyramid'] },
  { id: 'act-par-3', title: 'Seine River Dinner Cruise', cityName: 'Paris', country: 'France', category: 'food', estimatedCost: 12000, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Romantic gourmet 3-course dinner cruise under Paris\'s illuminated bridges at night.', coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '20:00', recommendedTimeSlot: 'evening', location: 'Seine River, Paris', tags: ['romantic', 'dinner', 'cruise'], highlights: ['Gourmet French cuisine', 'Eiffel Tower lit at night', 'Live music'] },
  // BALI
  { id: 'act-bal-1', title: 'Mount Batur Sunrise Trek', cityName: 'Bali', country: 'Indonesia', category: 'adventure', estimatedCost: 3500, currency: 'INR', durationMinutes: 360, duration: '6 hours', description: 'Pre-dawn hike to the summit of the active Batur volcano for breathtaking sunrise views.', coverImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '02:00', recommendedTimeSlot: 'morning', location: 'Kintamani, Bali', tags: ['volcano', 'sunrise', 'trek'], highlights: ['Active volcano crater', 'Lake Batur views', 'Egg cooked in steam vents'] },
  { id: 'act-bal-2', title: 'Tegalalang Rice Terrace Trek', cityName: 'Bali', country: 'Indonesia', category: 'nature', estimatedCost: 800, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Hike through stunning emerald-green UNESCO rice terraces with local Subak irrigation guide.', coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '08:00', recommendedTimeSlot: 'morning', location: 'Tegalalang, Ubud', tags: ['rice terraces', 'UNESCO', 'nature'], highlights: ['UNESCO landscape', 'Subak irrigation system', 'Sunrise photography'] },
  // AGRA
  { id: 'act-agr-1', title: 'Taj Mahal Sunrise Visit', cityName: 'Agra', country: 'India', category: 'sightseeing', estimatedCost: 1500, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Witness the Taj Mahal in the magical pink light of sunrise. Book well in advance.', coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '05:30', recommendedTimeSlot: 'morning', location: 'Taj Mahal, Agra', tags: ['wonder', 'sunrise', 'iconic'], highlights: ['UNESCO World Heritage', 'Marble inlay work', 'Reflection pool'] },
  { id: 'act-agr-2', title: 'Agra Fort & Mehtab Bagh', cityName: 'Agra', country: 'India', category: 'sightseeing', estimatedCost: 800, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Explore magnificent Mughal Agra Fort and sunset views of Taj Mahal from Mehtab Bagh.', coverImage: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '14:00', recommendedTimeSlot: 'afternoon', location: 'Agra Fort, Agra', tags: ['fort', 'Mughal', 'sunset'], highlights: ['Diwan-i-Am hall', 'Musamman Burj', 'Taj view at sunset'] },
  // MUMBAI
  { id: 'act-mum-1', title: 'Gateway of India & Elephanta Caves', cityName: 'Mumbai', country: 'India', category: 'sightseeing', estimatedCost: 800, currency: 'INR', durationMinutes: 300, duration: '5 hours', description: 'Ferry from Gateway to Elephanta Island with UNESCO-listed ancient cave temples of Lord Shiva.', coverImage: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80'], rating: 4.6, suggestedTime: '09:00', recommendedTimeSlot: 'morning', location: 'Colaba, Mumbai', tags: ['heritage', 'UNESCO', 'ferry'], highlights: ['6th century cave temples', 'Trimurti sculpture', 'Ferry boat ride'] },
  { id: 'act-mum-2', title: 'Mumbai Street Food Tour', cityName: 'Mumbai', country: 'India', category: 'food', estimatedCost: 1500, currency: 'INR', durationMinutes: 240, duration: '4 hours', description: 'Taste vada pav, pav bhaji, bhel puri, and Irani chai with a local food expert guide.', coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '18:00', recommendedTimeSlot: 'evening', location: 'Chowpatty, Mumbai', tags: ['food', 'street food', 'local'], highlights: ['Vada pav', 'Bhel puri at Chowpatty', 'Irani chai'] },
  // UDAIPUR
  { id: 'act-uda-1', title: 'Lake Pichola Sunset Boat Ride', cityName: 'Udaipur', country: 'India', category: 'sightseeing', estimatedCost: 700, currency: 'INR', durationMinutes: 60, duration: '1 hour', description: 'Romantic boat ride on Lake Pichola with breathtaking views of City Palace and Lake Palace.', coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '17:30', recommendedTimeSlot: 'evening', location: 'Lake Pichola, Udaipur', tags: ['romantic', 'boat', 'sunset'], highlights: ['Lake Palace view', 'Golden sunset', 'City Palace panorama'] },
  { id: 'act-uda-2', title: 'City Palace Museum Tour', cityName: 'Udaipur', country: 'India', category: 'culture', estimatedCost: 600, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Explore the magnificent 400-year-old City Palace with lake views and royal art collections.', coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '10:00', recommendedTimeSlot: 'morning', location: 'City Palace, Udaipur', tags: ['palace', 'heritage', 'art'], highlights: ['Manak Mahal', 'Peacock courtyard', 'Lake Pichola views'] },
  // VARANASI
  { id: 'act-var-1', title: 'Ganga Aarti Ceremony', cityName: 'Varanasi', country: 'India', category: 'culture', estimatedCost: 200, currency: 'INR', durationMinutes: 60, duration: '1 hour', description: 'Witness the spectacular nightly fire ritual on the ghats of the sacred Ganges at Dashashwamedh.', coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'], rating: 4.9, suggestedTime: '18:30', recommendedTimeSlot: 'evening', location: 'Dashashwamedh Ghat, Varanasi', tags: ['spiritual', 'fire', 'Ganges'], highlights: ['Fire ritual', 'Bell ringing', 'Flower offerings'] },
  { id: 'act-var-2', title: 'Dawn Boat Ride on the Ganges', cityName: 'Varanasi', country: 'India', category: 'sightseeing', estimatedCost: 500, currency: 'INR', durationMinutes: 90, duration: '1.5 hours', description: 'Early morning row boat ride past the burning ghats and bathing pilgrims at sunrise.', coverImage: 'https://images.unsplash.com/photo-1561323013-4d8ed9f9fd5e?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1561323013-4d8ed9f9fd5e?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '05:00', recommendedTimeSlot: 'morning', location: 'Assi Ghat, Varanasi', tags: ['spiritual', 'boat', 'sunrise'], highlights: ['Burning ghats', 'Morning rituals', 'Silk weavers colony'] },
  // NEW YORK
  { id: 'act-nyc-1', title: 'Central Park Guided Bike Tour', cityName: 'New York', country: 'USA', category: 'sightseeing', estimatedCost: 4500, currency: 'INR', durationMinutes: 180, duration: '3 hours', description: 'Explore all of Central Park\'s iconic spots with an expert local guide on a comfortable bike.', coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'], rating: 4.7, suggestedTime: '09:00', recommendedTimeSlot: 'morning', location: 'Central Park, New York', tags: ['bike', 'park', 'nature'], highlights: ['Bethesda Fountain', 'Strawberry Fields', 'The Great Lawn'] },
  { id: 'act-nyc-2', title: 'Broadway Show Experience', cityName: 'New York', country: 'USA', category: 'nightlife', estimatedCost: 12000, currency: 'INR', durationMinutes: 150, duration: '2.5 hours', description: 'Experience the magic of live Broadway theater in the heart of Times Square Manhattan.', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'], rating: 4.8, suggestedTime: '20:00', recommendedTimeSlot: 'night', location: 'Broadway, New York', tags: ['theater', 'entertainment', 'Broadway'], highlights: ['World-class performances', 'Times Square', 'Pre-show dinner'] },
];

/** Normalise a backend activity to the Activity shape our UI expects */
function normalizeActivity(a: any): Activity {
  const seed = SEED_ACTIVITIES.find(s => s.title.toLowerCase() === a.name?.toLowerCase() || s.id === a.id);
  return {
    id: a.id,
    title: a.title || a.name,
    cityName: a.cityName || a.cities?.name || '',
    country: a.country || a.cities?.country || '',
    category: (a.category || 'other') as ActivityCategory,
    estimatedCost: a.estimatedCost || a.estimated_cost || 0,
    currency: a.currency || 'INR',
    durationMinutes: a.durationMinutes || a.duration_minutes || 120,
    duration: a.duration || (a.duration_minutes ? `${Math.round(a.duration_minutes / 60)} hours` : '2 hours'),
    description: a.description || '',
    coverImage: a.coverImage || (a.images && a.images[0]) || a.image_url || seed?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    images: a.images || [a.image_url || ''],
    rating: a.rating || seed?.rating || 4.5,
    reviewsCount: a.reviewsCount || 0,
    suggestedTime: a.suggestedTime || seed?.suggestedTime || '09:00',
    recommendedTimeSlot: a.recommendedTimeSlot || seed?.recommendedTimeSlot || 'morning',
    location: a.location || seed?.location || a.cityName || '',
    tags: a.tags || seed?.tags || [],
    highlights: a.highlights || seed?.highlights || [],
  };
}

class ActivityService {
  /** Called by TripActivitiesPage with cityName (not cityId) */
  async getActivitiesByCity(cityNameOrId: string, filters?: ActivityFilterParams): Promise<Activity[]> {
    try {
      const data = await apiClient.get<Activity[]>(`/activities?city_name=${encodeURIComponent(cityNameOrId)}`);
      if (data && data.length > 0) {
        const normalized = data.map(normalizeActivity);
        return this._applyFilters(normalized, filters);
      }
    } catch {}
    // Fallback to seed data filtered by city name
    const name = cityNameOrId.toLowerCase();
    const seedFiltered = SEED_ACTIVITIES.filter(a =>
      a.cityName.toLowerCase() === name ||
      a.cityName.toLowerCase().includes(name) ||
      name.includes(a.cityName.toLowerCase())
    );
    return this._applyFilters(seedFiltered.length > 0 ? seedFiltered : SEED_ACTIVITIES, filters);
  }

  async getActivities(filters?: ActivityFilterParams): Promise<Activity[]> {
    try {
      const data = await apiClient.get<Activity[]>('/activities');
      if (data && data.length > 0) return this._applyFilters(data.map(normalizeActivity), filters);
      return this._applyFilters(SEED_ACTIVITIES, filters);
    } catch {
      return this._applyFilters(SEED_ACTIVITIES, filters);
    }
  }

  private _applyFilters(activities: Activity[], filters?: ActivityFilterParams): Activity[] {
    let result = [...activities];
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters?.maxCost) result = result.filter(a => a.estimatedCost <= filters.maxCost!);
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.cityName?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
      );
    }
    if (filters?.sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (filters?.sortBy === 'costAsc') result.sort((a, b) => a.estimatedCost - b.estimatedCost);
    if (filters?.sortBy === 'costDesc') result.sort((a, b) => b.estimatedCost - a.estimatedCost);
    return result;
  }

  async getActivityById(id: string): Promise<Activity | undefined> {
    try {
      const activities = await apiClient.get<Activity[]>('/activities');
      const found = activities.find(a => a.id === id);
      if (found) return normalizeActivity(found);
    } catch {}
    return SEED_ACTIVITIES.find(a => a.id === id);
  }

  async searchActivities(query: string, cityName?: string): Promise<Activity[]> {
    const lowerQuery = query.toLowerCase();
    let results = SEED_ACTIVITIES.filter(a =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery) ||
      a.cityName.toLowerCase().includes(lowerQuery)
    );
    if (cityName) results = results.filter(a => a.cityName.toLowerCase().includes(cityName.toLowerCase()));
    return results;
  }
}

export const activityService = new ActivityService();
