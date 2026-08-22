import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  MapPin,
  Clock,
  Users,
  Star,
  TrendingUp,
  Globe,
  Copy,
  Bookmark,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useTrip } from '@/context/TripContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const COMMUNITY_ITINERARIES = [
  {
    id: 'ci-1',
    title: '7 Days of Pure Goa Magic',
    author: 'Aarav Mehta',
    authorAvatar: 'AM',
    days: 7,
    budget: '₹28,000',
    cities: ['Goa'],
    vibe: 'Beaches & Parties',
    rating: 4.9,
    clones: 342,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    tags: ['Beach', 'Budget', 'Solo'],
  },
  {
    id: 'ci-2',
    title: 'Royal Rajasthan Heritage Circuit',
    author: 'Priya Sharma',
    authorAvatar: 'PS',
    days: 10,
    budget: '₹65,000',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur'],
    vibe: 'Heritage & Culture',
    rating: 4.8,
    clones: 215,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    tags: ['Heritage', 'Couple', 'Luxury'],
  },
  {
    id: 'ci-3',
    title: 'Kyoto Sakura Temple Walk',
    author: 'Elena Rostova',
    authorAvatar: 'ER',
    days: 6,
    budget: '$1,400',
    cities: ['Kyoto', 'Osaka'],
    vibe: 'Culture & Zen',
    rating: 5.0,
    clones: 589,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
    tags: ['Culture', 'Solo', 'Photography'],
  },
  {
    id: 'ci-4',
    title: 'Parisian Art & Gastronomy Week',
    author: 'Lucas Bernard',
    authorAvatar: 'LB',
    days: 7,
    budget: '€1,800',
    cities: ['Paris'],
    vibe: 'Art & Food',
    rating: 4.7,
    clones: 178,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    tags: ['Art', 'Food', 'Couple'],
  },
  {
    id: 'ci-5',
    title: 'Kerala Backwaters Bliss',
    author: 'Meena Nair',
    authorAvatar: 'MN',
    days: 5,
    budget: '₹22,000',
    cities: ['Alleppey', 'Munnar'],
    vibe: 'Nature & Wellness',
    rating: 4.9,
    clones: 410,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tags: ['Nature', 'Family', 'Wellness'],
  },
  {
    id: 'ci-6',
    title: 'Bali Digital Nomad Month',
    author: 'Jake Reynolds',
    authorAvatar: 'JR',
    days: 30,
    budget: '$2,200',
    cities: ['Bali', 'Canggu', 'Ubud'],
    vibe: 'Work & Explore',
    rating: 4.6,
    clones: 267,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    tags: ['Nomad', 'Solo', 'Long Stay'],
  },
];

const DESTINATION_HIGHLIGHTS = [
  { name: 'Goa', country: 'India', flag: '🇮🇳', temp: '28°C', dailyCost: '₹2,500', type: '🏖️ Beaches', guides: 24 },
  { name: 'Jaipur', country: 'India', flag: '🇮🇳', temp: '22°C', dailyCost: '₹3,200', type: '🏰 Heritage', guides: 18 },
  { name: 'Kyoto', country: 'Japan', flag: '🇯🇵', temp: '15°C', dailyCost: '$120', type: '⛩️ Culture', guides: 31 },
  { name: 'Paris', country: 'France', flag: '🇫🇷', temp: '12°C', dailyCost: '€180', type: '🎨 Arts', guides: 42 },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩', temp: '30°C', dailyCost: '$60', type: '🌿 Nature', guides: 28 },
];

const VIBE_FILTERS = ['All', 'Beaches', 'Heritage', 'Mountains', 'Food', 'Adventure', 'Wellness', 'Budget'];
const TAG_FILTERS = ['All Trips', 'Solo', 'Couple', 'Family', 'Budget', 'Luxury', 'Long Stay'];

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVibe, setActiveVibe] = useState('All');
  const [activeTag, setActiveTag] = useState('All Trips');

  const filteredItineraries = COMMUNITY_ITINERARIES.filter((itin) => {
    const matchesSearch = !searchQuery ||
      itin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itin.cities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVibe = activeVibe === 'All' || itin.vibe.toLowerCase().includes(activeVibe.toLowerCase());
    const matchesTag = activeTag === 'All Trips' || itin.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    return matchesSearch && matchesVibe && matchesTag;
  });

  const handleCloneTrip = (itin: typeof COMMUNITY_ITINERARIES[0]) => {
    success('Trip Cloned!', `"${itin.title}" has been added to your trips. Customize it however you like!`);
    setTimeout(() => navigate('/trips'), 1200);
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-16">

      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 max-w-xl">
          <Badge variant="ai" size="xs" className="mb-3">Community Itineraries</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display mb-3 leading-tight">
            Discover & Clone<br />Real Travel Plans 🌍
          </h1>
          <p className="text-teal-100 text-sm leading-relaxed mb-6">
            Browse curated itineraries from fellow travelers. Fork any plan to your account and customize it for your perfect trip.
          </p>
          <div className="flex items-center gap-4 text-xs text-teal-200">
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />1,200+ Community Itineraries</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" />Updated Daily</span>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search destinations, vibes, or trip titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 shadow-2xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {VIBE_FILTERS.map((vibe) => (
            <button key={vibe} type="button" onClick={() => setActiveVibe(vibe)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeVibe === vibe ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'
              }`}>
              {vibe}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {TAG_FILTERS.map((tag) => (
            <button key={tag} type="button" onClick={() => setActiveTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTag === tag ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* COMMUNITY ITINERARIES GRID */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-900 font-display">
            Trending Community Itineraries ({filteredItineraries.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItineraries.map((itin) => (
            <div key={itin.id} className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-card hover:border-teal-300 transition-all group overflow-hidden">
              {/* Cover */}
              <div className="relative h-40 overflow-hidden">
                <img src={itin.coverImage} alt={itin.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-white text-xs font-semibold">{itin.vibe}</p>
                    <p className="text-white/60 text-[10px]">{itin.cities.join(' → ')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-white text-xs font-bold">{itin.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{itin.title}</h3>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{itin.days} Days</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{itin.clones} Clones</span>
                  <span className="font-bold text-slate-800">{itin.budget}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {itin.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-sand-100 text-slate-600 text-[10px] font-semibold">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-terracotta-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {itin.authorAvatar}
                  </div>
                  <span className="text-[11px] text-slate-500">by <strong className="text-slate-700">{itin.author}</strong></span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="xs"
                    fullWidth
                    onClick={() => handleCloneTrip(itin)}
                    leftIcon={<Copy className="w-3.5 h-3.5" />}
                  >
                    Clone Trip
                  </Button>
                  <Button variant="outline" size="xs" leftIcon={<Bookmark className="w-3.5 h-3.5" />}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESTINATION HIGHLIGHTS */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 font-display mb-5">
          Destination Quick-Guides
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {DESTINATION_HIGHLIGHTS.map((dest) => (
            <div key={dest.name}
              onClick={() => navigate('/trips/create')}
              className="p-4 rounded-3xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-card cursor-pointer transition-all group text-center space-y-2">
              <span className="text-3xl">{dest.flag}</span>
              <p className="text-sm font-extrabold text-slate-900 font-display">{dest.name}</p>
              <p className="text-[11px] text-slate-500">{dest.type}</p>
              <div className="space-y-0.5 text-[10px] text-slate-500">
                <p>🌡️ {dest.temp}</p>
                <p>💰 {dest.dailyCost}/day</p>
                <p>{dest.guides} guides</p>
              </div>
              <Button variant="outline" size="xs" fullWidth className="group-hover:border-teal-400 group-hover:text-teal-700">
                Plan Trip →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
