import type { Activity, ActivityFilterParams } from '@/types/inventory.types';

const SEED_ACTIVITIES: Activity[] = [
  // GOA ACTIVITIES
  {
    id: 'act-goa-1',
    title: 'Grande Island Scuba Diving & Dolphin Cruise',
    cityName: 'Goa',
    country: 'India',
    category: 'adventure',
    duration: '5 hours',
    estimatedCost: 3000,
    currency: 'INR',
    rating: 4.9,
    reviewsCount: 380,
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Boat cruise to Grande Island featuring underwater scuba diving with certified PADI instructors, dolphin sighting, and buffet lunch.',
    recommendedTimeSlot: 'morning',
    suggestedTime: '08:30',
    location: 'Grande Island, South Goa',
    tags: ['Scuba', 'Dolphins', 'Island Boat'],
    highlights: ['Includes diving gear & video', 'Sight dolphins in wild', 'Fresh BBQ lunch'],
  },
  {
    id: 'act-goa-2',
    title: 'Old Goa Portuguese Heritage Basilica Walk',
    cityName: 'Goa',
    country: 'India',
    category: 'culture',
    duration: '3 hours',
    estimatedCost: 600,
    currency: 'INR',
    rating: 4.8,
    reviewsCount: 290,
    coverImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Guided historical walk through UNESCO World Heritage sites including Basilica of Bom Jesus, Se Cathedral, and colonial Latin Quarters.',
    recommendedTimeSlot: 'morning',
    suggestedTime: '09:30',
    location: 'Old Goa & Fontainhas',
    tags: ['UNESCO', 'Churches', 'Architecture'],
    highlights: ['Visit St. Francis Xavier tomb', 'Fontainhas colorful streets', 'Expert local historian'],
  },
  {
    id: 'act-goa-3',
    title: 'Curlies Anjuna Sunset Seafood Dinner',
    cityName: 'Goa',
    country: 'India',
    category: 'food',
    duration: '2.5 hours',
    estimatedCost: 1800,
    currency: 'INR',
    rating: 4.7,
    reviewsCount: 510,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Iconic beach shack dining with fresh catch of the day (tiger prawns, Goan fish curry), sunset sea views, and chill beach music.',
    recommendedTimeSlot: 'evening',
    suggestedTime: '18:00',
    location: 'Anjuna Beach, North Goa',
    tags: ['Seafood', 'Sunset View', 'Beach Shack'],
    highlights: ['Prime beachfront table', 'Authentic Goan curry', 'Live acoustic music'],
  },
  {
    id: 'act-goa-4',
    title: 'Dudhsagar Jungle Jeep Safari & Falls',
    cityName: 'Goa',
    country: 'India',
    category: 'nature',
    duration: '6 hours',
    estimatedCost: 2200,
    currency: 'INR',
    rating: 4.9,
    reviewsCount: 420,
    coverImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Exhilarating 4x4 open-top jeep safari through Mollem National Park trails leading to the 4-tiered cascading Dudhsagar Waterfalls.',
    recommendedTimeSlot: 'morning',
    suggestedTime: '07:30',
    location: 'Mollem National Park',
    tags: ['Jeep Safari', 'Waterfalls', 'Wildlife'],
    highlights: ['Swim in natural freshwater pools', 'Spotted deer sightings', 'Spice plantation tour'],
  },

  // JAIPUR ACTIVITIES
  {
    id: 'act-jaipur-1',
    title: 'Amber Fort Hilltop Palace & Guided Tour',
    cityName: 'Jaipur',
    country: 'India',
    category: 'culture',
    duration: '3.5 hours',
    estimatedCost: 1500,
    currency: 'INR',
    rating: 4.9,
    reviewsCount: 620,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Explore the grand Sheesh Mahal (Mirror Palace), majestic courtyards, and panoramic vistas over Maota Lake with an accredited guide.',
    recommendedTimeSlot: 'morning',
    suggestedTime: '09:00',
    location: 'Amer, Jaipur',
    tags: ['Fort', 'Mirror Palace', 'Heritage'],
    highlights: ['Sheesh Mahal optical illusion', 'Jeep ride up hill fort', 'Royal museum access'],
  },
  {
    id: 'act-jaipur-2',
    title: 'Chokhi Dhani Ethnic Rajasthani Village & Feast',
    cityName: 'Jaipur',
    country: 'India',
    category: 'food',
    duration: '4 hours',
    estimatedCost: 1200,
    currency: 'INR',
    rating: 4.8,
    reviewsCount: 880,
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Cultural village fair with folk dancers, fire performers, camel rides, and unlimited royal Dal Baati Churma dining.',
    recommendedTimeSlot: 'evening',
    suggestedTime: '18:30',
    location: 'Tonk Road, Jaipur',
    tags: ['Folk Dance', 'Thali Feast', 'Village Culture'],
    highlights: ['Authentic Dal Baati Churma', 'Puppet & fire shows', 'Pottery workshops'],
  },

  // KERALA ACTIVITIES
  {
    id: 'act-kerala-1',
    title: 'Alleppey Sunset Canoe Backwater Tour',
    cityName: 'Kerala (Munnar & Alleppey)',
    country: 'India',
    category: 'nature',
    duration: '3 hours',
    estimatedCost: 1500,
    currency: 'INR',
    rating: 4.9,
    reviewsCount: 310,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Gentle hand-paddled wooden canoe glide through narrow village canals lined with palm trees, lotus ponds, and village life.',
    recommendedTimeSlot: 'evening',
    suggestedTime: '16:00',
    location: 'Alleppey Canals',
    tags: ['Canoe', 'Canals', 'Sunsets'],
    highlights: ['Access narrow shallow canals', 'Fresh tender coconut drink', 'Village lifestyle glimpse'],
  },

  // KYOTO ACTIVITIES
  {
    id: 'act-kyoto-1',
    title: 'Fushimi Inari 10,000 Torii Gates Trail Hike',
    cityName: 'Kyoto',
    country: 'Japan',
    category: 'culture',
    duration: '2.5 hours',
    estimatedCost: 0,
    currency: 'USD',
    rating: 5.0,
    reviewsCount: 950,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Scenic hike beneath thousands of vivid vermilion Torii gates winding up the sacred Mount Inari forest.',
    recommendedTimeSlot: 'morning',
    suggestedTime: '07:00',
    location: 'Fushimi Ward, Kyoto',
    tags: ['Torii Gates', 'Sacred Shrines', 'Forest Hike'],
    highlights: ['Iconic photo spots', 'Fox shrine statues', 'Free entrance'],
  },

  // PARIS ACTIVITIES
  {
    id: 'act-paris-1',
    title: 'Seine Sunset Champagne River Cruise',
    cityName: 'Paris',
    country: 'France',
    category: 'food',
    duration: '1.5 hours',
    estimatedCost: 45,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 680,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=500&q=80',
    description: 'Glass-canopy boat cruise passing Eiffel Tower, Notre-Dame, and Musée d\'Orsay illuminated at dusk with French champagne.',
    recommendedTimeSlot: 'evening',
    suggestedTime: '19:30',
    location: 'Port de la Bourdonnais, Paris',
    tags: ['Boat Cruise', 'Champagne', 'Eiffel Tower View'],
    highlights: ['Sparkling Eiffel Tower timing', 'Glass of champagne included', 'Audio commentary'],
  },
];

class ActivityService {
  async getActivitiesByCity(cityName?: string, filters?: ActivityFilterParams): Promise<Activity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...SEED_ACTIVITIES];

        if (cityName && cityName.trim()) {
          const q = cityName.toLowerCase().trim();
          results = results.filter(
            (a) =>
              a.cityName.toLowerCase().includes(q) ||
              q.includes(a.cityName.toLowerCase())
          );
        }

        if (filters?.category && filters.category !== 'all') {
          results = results.filter((a) => a.category === filters.category);
        }

        if (filters?.timeSlot && filters.timeSlot !== 'all') {
          results = results.filter((a) => a.recommendedTimeSlot === filters.timeSlot);
        }

        if (filters?.maxCost) {
          results = results.filter((a) => a.estimatedCost <= (filters.maxCost || Infinity));
        }

        if (filters?.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q) ||
              a.location.toLowerCase().includes(q) ||
              a.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        // Sorting
        if (filters?.sortBy === 'costAsc') {
          results.sort((a, b) => a.estimatedCost - b.estimatedCost);
        } else if (filters?.sortBy === 'costDesc') {
          results.sort((a, b) => b.estimatedCost - a.estimatedCost);
        } else {
          // Default by rating
          results.sort((a, b) => b.rating - a.rating);
        }

        resolve(results);
      }, 100);
    });
  }

  async getActivityById(id: string): Promise<Activity | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = SEED_ACTIVITIES.find((a) => a.id === id);
        resolve(found || null);
      }, 50);
    });
  }
}

export const activityService = new ActivityService();
