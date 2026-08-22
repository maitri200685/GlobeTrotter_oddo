import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  MapPin,
  Star,
  Trash2,
  Plus,
  Search,
  ArrowRight,
  Globe,
  Clock,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface SavedDestination {
  id: string;
  cityName: string;
  country: string;
  flag: string;
  image: string;
  description: string;
  rating: number;
  avgDailyCost: string;
  bestSeason: string;
  savedAt: string;
  tags: string[];
}

const MOCK_SAVED_DESTINATIONS: SavedDestination[] = [
  {
    id: 'dest-goa',
    cityName: 'Goa',
    country: 'India',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    description: 'Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and the finest seafood in India.',
    rating: 4.8,
    avgDailyCost: '₹2,500',
    bestSeason: 'Nov – Feb',
    savedAt: '2026-08-10',
    tags: ['Beach', 'Nightlife', 'Food', 'Heritage'],
  },
  {
    id: 'dest-kyoto',
    cityName: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
    description: 'Ancient temples, serene bamboo groves, traditional tea ceremonies and cherry blossom trails.',
    rating: 5.0,
    avgDailyCost: '$120',
    bestSeason: 'Mar – Apr, Oct – Nov',
    savedAt: '2026-08-08',
    tags: ['Culture', 'Temples', 'Nature', 'Solo'],
  },
  {
    id: 'dest-bali',
    cityName: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    description: 'Tropical paradise with rice terraces, surf spots, spiritual ceremonies, and laid-back café culture.',
    rating: 4.9,
    avgDailyCost: '$65',
    bestSeason: 'Apr – Oct',
    savedAt: '2026-08-05',
    tags: ['Beach', 'Wellness', 'Nature', 'Surf'],
  },
  {
    id: 'dest-paris',
    cityName: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    description: 'The city of light offers world-class art museums, Michelin-starred cuisine, and iconic romance.',
    rating: 4.7,
    avgDailyCost: '€180',
    bestSeason: 'Apr – Jun, Sep – Oct',
    savedAt: '2026-07-28',
    tags: ['Art', 'Food', 'Romance', 'Culture'],
  },
];

export const SavedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, info } = useToast();

  const [saved, setSaved] = useState<SavedDestination[]>(MOCK_SAVED_DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = saved.filter(
    (d) =>
      !searchQuery ||
      d.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRemove = (id: string, name: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setSaved((prev) => prev.filter((d) => d.id !== id));
      setRemovingId(null);
      info('Removed', `${name} removed from your saved destinations.`);
    }, 300);
  };

  const handlePlanTrip = (dest: SavedDestination) => {
    navigate('/trips/create');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Saved Destinations
            </h1>
            <Badge variant="teal" size="xs">{saved.length} Places</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your wishlist of dream destinations. Plan a trip or explore guides.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/explore')}
          rightIcon={<Globe className="w-4 h-4" />}
        >
          Explore More Places
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search saved destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500"
        />
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {searchQuery ? 'No destinations match your search' : 'No saved destinations yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery ? 'Try a different search term.' : 'Start exploring and save places you want to visit!'}
            </p>
          </div>
          {!searchQuery && (
            <Button variant="primary" size="sm" onClick={() => navigate('/explore')}>
              Browse Destinations
            </Button>
          )}
        </div>
      )}

      {/* Saved Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className={`bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-card hover:border-teal-300 transition-all overflow-hidden group ${
                removingId === dest.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{ transition: 'opacity 0.3s, transform 0.3s' }}
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.cityName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => handleRemove(dest.id, dest.cityName)}
                    className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                  </button>
                </div>
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1">
                  <span className="text-xl">{dest.flag}</span>
                  <span className="text-white text-xs font-bold">{dest.cityName}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">{dest.country}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5 line-clamp-2">{dest.description}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {dest.rating}
                  </span>
                  <span>💰 {dest.avgDailyCost}/day</span>
                  <span>🌤️ {dest.bestSeason}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {dest.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-[10px] font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="xs"
                    fullWidth
                    onClick={() => handlePlanTrip(dest)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Plan Trip
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => navigate(`/destinations/${dest.id}`)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Guide
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {saved.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900 font-display">{saved.length}</p>
            <p className="text-[11px] text-slate-500">Saved Places</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900 font-display">
              {[...new Set(saved.map((d) => d.country))].length}
            </p>
            <p className="text-[11px] text-slate-500">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900 font-display">
              {[...new Set(saved.flatMap((d) => d.tags))].length}+
            </p>
            <p className="text-[11px] text-slate-500">Travel Vibes</p>
          </div>
        </div>
      )}
    </div>
  );
};
