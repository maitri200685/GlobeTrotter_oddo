import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Calendar,
  Thermometer,
  DollarSign,
  Camera,
  Utensils,
  Footprints,
  Hotel,
  Clock,
  Globe,
  Heart,
  ArrowRight,
  TrendingUp,
  Sun,
  CloudRain,
  Plane,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

const DESTINATIONS_DB: Record<string, {
  id: string;
  name: string;
  country: string;
  flag: string;
  region: string;
  heroImage: string;
  gallery: string[];
  tagline: string;
  description: string;
  rating: number;
  reviews: number;
  avgDailyCost: string;
  bestMonths: string[];
  climate: string;
  currency: string;
  language: string;
  timezone: string;
  tags: string[];
  topActivities: { title: string; type: string; duration: string; cost: string; image: string }[];
  topHotels: { name: string; stars: number; price: string; location: string }[];
  neighborhoods: { name: string; vibe: string; desc: string }[];
  travelTips: string[];
  coordinates: { lat: number; lng: number };
}> = {
  'dest-goa': {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    flag: '🇮🇳',
    region: 'South Asia',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
    ],
    tagline: 'Sun, Sand, Spice & Soul',
    description: 'Goa — India\'s smallest state — packs a legendary punch. From pristine beaches and 16th-century Portuguese cathedrals to night markets, fresh seafood, and the best party scene in South Asia, Goa rewards every type of traveler.',
    rating: 4.8,
    reviews: 14200,
    avgDailyCost: '₹2,500 – ₹6,000',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'],
    climate: 'Tropical • Hot summers, refreshing winters',
    currency: 'Indian Rupee (₹)',
    language: 'Konkani, English, Hindi',
    timezone: 'IST (UTC+5:30)',
    tags: ['Beach', 'Nightlife', 'Heritage', 'Food', 'Adventure'],
    topActivities: [
      { title: 'Dudhsagar Waterfalls Jeep Tour', type: 'Adventure', duration: 'Full Day', cost: '₹2,200', image: 'https://images.unsplash.com/photo-1623503868563-0f00c58e3f9b?w=400&q=80' },
      { title: 'Old Goa Churches Heritage Walk', type: 'Culture', duration: '3 hours', cost: '₹300', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80' },
      { title: 'Grande Island Scuba Diving', type: 'Adventure', duration: '5 hours', cost: '₹3,200', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80' },
      { title: 'Arpora Saturday Night Market', type: 'Food & Shopping', duration: 'Evening', cost: '₹500', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    ],
    topHotels: [
      { name: 'Taj Exotica Resort', stars: 5, price: '₹12,000/night', location: 'Benaulim Beach' },
      { name: 'Santana Beach Boutique', stars: 4, price: '₹3,200/night', location: 'Candolim' },
      { name: 'Zostel Goa', stars: 3, price: '₹800/night', location: 'Vagator' },
    ],
    neighborhoods: [
      { name: 'North Goa', vibe: '🎵 Party & Beaches', desc: 'Calangute, Baga, Anjuna — vibrant nightlife and tourist beaches.' },
      { name: 'South Goa', vibe: '😌 Calm & Luxurious', desc: 'Palolem, Agonda — pristine secluded beaches and luxury resorts.' },
      { name: 'Old Goa', vibe: '🏛️ Heritage', desc: 'UNESCO churches, spice plantations, and Portuguese colonial architecture.' },
    ],
    travelTips: [
      'Visit Nov–Feb for the best weather. Avoid June–Sept (heavy monsoon).',
      'Rent a scooter (₹300/day) for exploring — much better than autos.',
      'Try the fish thali at local canteens — much better than tourist restaurants.',
      'Book North Goa stays in advance for Dec–Jan; South Goa has more availability.',
    ],
    coordinates: { lat: 15.2993, lng: 74.1240 },
  },
  'dest-kyoto': {
    id: 'dest-kyoto',
    name: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'East Asia',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
    ],
    tagline: 'Eternal Japan in Every Season',
    description: 'Kyoto was Japan\'s imperial capital for over a millennium. With 17 UNESCO World Heritage sites, over 1,600 Buddhist temples, the iconic Arashiyama bamboo groves, geisha districts and spectacular cherry blossoms — Kyoto is the soul of traditional Japan.',
    rating: 5.0,
    reviews: 32000,
    avgDailyCost: '$100 – $200',
    bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
    climate: 'Four seasons • Cherry blossoms in spring, foliage in autumn',
    currency: 'Japanese Yen (¥)',
    language: 'Japanese (English widely understood)',
    timezone: 'JST (UTC+9)',
    tags: ['Culture', 'Temples', 'Nature', 'Photography', 'Wellness'],
    topActivities: [
      { title: 'Fushimi Inari Thousand Torii Gates', type: 'Sightseeing', duration: '3 hours', cost: 'Free', image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&q=80' },
      { title: 'Arashiyama Bamboo Grove Walk', type: 'Nature', duration: '2 hours', cost: 'Free', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80' },
      { title: 'Traditional Tea Ceremony', type: 'Culture', duration: '1.5 hours', cost: '¥3,000', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80' },
      { title: 'Geisha District Evening Walk', type: 'Culture', duration: 'Evening', cost: 'Free', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80' },
    ],
    topHotels: [
      { name: 'Ritz-Carlton Kyoto', stars: 5, price: '¥70,000/night', location: 'Kamogawa Riverside' },
      { name: 'Gion Nanba Ryokan', stars: 4, price: '¥18,000/night', location: 'Gion District' },
      { name: 'Piece Hostel Kyoto', stars: 3, price: '¥3,500/night', location: 'Shijo' },
    ],
    neighborhoods: [
      { name: 'Gion', vibe: '🏮 Traditional Geisha', desc: 'Historic geisha district with machiya townhouses, tea rooms and lantern-lit streets.' },
      { name: 'Arashiyama', vibe: '🎋 Nature & Temples', desc: 'Bamboo groves, monkey park, boat rides on the Oi River and Tenryu-ji garden.' },
      { name: 'Nishiki Market', vibe: '🍜 Food & Local Life', desc: '"Kyoto\'s Kitchen" — a 400-year-old market with street food and local ingredients.' },
    ],
    travelTips: [
      'Get a 2-day Kyoto City Bus Pass (¥900) — covers most attractions efficiently.',
      'Book Fushimi Inari for early morning to beat crowds (5-7 AM is magical).',
      'Wear comfortable shoes — most of Kyoto is best explored on foot.',
      'Try a night Nishiki Market food crawl for local flavors under ¥2,000.',
    ],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
};

// Default destination for unknown IDs
const DEFAULT_DEST = DESTINATIONS_DB['dest-goa'];

const TYPE_COLORS: Record<string, string> = {
  Adventure: 'bg-terracotta-100 text-terracotta-800',
  Culture: 'bg-teal-100 text-teal-800',
  Sightseeing: 'bg-sky-100 text-sky-800',
  Nature: 'bg-emerald-100 text-emerald-800',
  'Food & Shopping': 'bg-amber-100 text-amber-800',
  Wellness: 'bg-purple-100 text-purple-800',
};

export const DestinationGuidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'hotels' | 'tips'>('overview');

  const dest = id ? (DESTINATIONS_DB[id] || DEFAULT_DEST) : DEFAULT_DEST;

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      success('Saved!', `${dest.name} added to your saved destinations.`);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-16">
      {/* HERO */}
      <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-elevated">
        <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleSave}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer shadow-md transition-colors">
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
          </button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer shadow-md transition-colors">
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{dest.flag}</span>
            <Badge variant="teal" size="xs" className="bg-white/90 text-slate-900 backdrop-blur-sm">{dest.region}</Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">{dest.name}</h1>
          <p className="text-white/70 text-sm mt-1">{dest.country} • {dest.tagline}</p>
        </div>
      </div>

      {/* PLAN TRIP CTA BAR */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-gradient-to-r from-teal-50 to-sand-50 rounded-3xl border border-teal-200">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">Ready to visit {dest.name}?</p>
          <p className="text-xs text-slate-500">Let our AI plan your perfect {dest.name} trip in minutes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => navigate('/plan')} leftIcon={<ArrowRight className="w-4 h-4" />}>
            Plan with AI
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/trips/create')} leftIcon={<Globe className="w-4 h-4" />}>
            Manual Plan
          </Button>
        </div>
      </div>

      {/* META INFO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Star, label: 'Rating', value: `${dest.rating}/5`, sub: `${(dest.reviews / 1000).toFixed(0)}K reviews` },
          { icon: DollarSign, label: 'Daily Cost', value: dest.avgDailyCost, sub: 'estimated' },
          { icon: Sun, label: 'Best Time', value: dest.bestMonths.join(', '), sub: dest.climate.split('•')[0] },
          { icon: Globe, label: 'Currency', value: dest.currency.split(' ')[0], sub: dest.language.split(',')[0] },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Card key={label} variant="default" className="p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <Icon className="w-3 h-3" />{label}
            </div>
            <p className="text-sm font-extrabold text-slate-900">{value}</p>
            <p className="text-[10px] text-slate-400">{sub}</p>
          </Card>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
        {(['overview', 'activities', 'hotels', 'tips'] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer transition-colors ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card variant="default" className="p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">About {dest.name}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{dest.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {dest.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </Card>

          {/* Neighborhoods */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Neighborhoods & Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dest.neighborhoods.map((n) => (
                <Card key={n.name} variant="flat" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{n.name}</span>
                    <span className="text-[11px] text-slate-500">{n.vibe}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Photo Gallery</h2>
            <div className="grid grid-cols-3 gap-2">
              {dest.gallery.map((img, i) => (
                <div key={i} className="h-28 rounded-2xl overflow-hidden">
                  <img src={img} alt={`${dest.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITIES TAB */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Top Activities in {dest.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dest.topActivities.map((act) => (
              <div key={act.title} className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden hover:shadow-card hover:border-teal-300 transition-all group">
                <div className="h-32 overflow-hidden">
                  <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{act.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${TYPE_COLORS[act.type] || 'bg-slate-100 text-slate-600'}`}>
                      {act.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}</span>
                    <span className="font-bold text-slate-900">{act.cost}</span>
                  </div>
                  <Button variant="outline" size="xs" fullWidth onClick={() => navigate('/trips/create')}>
                    Add to Trip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOTELS TAB */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Top Hotels in {dest.name}</h2>
          {dest.topHotels.map((h) => (
            <div key={h.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-colors">
              <div>
                <p className="text-sm font-bold text-slate-900">{h.name}</p>
                <p className="text-[11px] text-slate-500">{h.location}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: h.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-900">{h.price}</p>
                <Button variant="outline" size="xs" className="mt-1.5" onClick={() => navigate('/trips/create')}>
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIPS TAB */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Travel Tips for {dest.name}</h2>
          <div className="space-y-3">
            {dest.travelTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 text-xs font-extrabold">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          <Card variant="flat" className="p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-800">Quick Facts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">Language: </span><span className="font-semibold text-slate-800">{dest.language}</span></div>
              <div><span className="text-slate-500">Currency: </span><span className="font-semibold text-slate-800">{dest.currency}</span></div>
              <div><span className="text-slate-500">Timezone: </span><span className="font-semibold text-slate-800">{dest.timezone}</span></div>
              <div><span className="text-slate-500">Best: </span><span className="font-semibold text-slate-800">{dest.bestMonths.join(', ')}</span></div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
