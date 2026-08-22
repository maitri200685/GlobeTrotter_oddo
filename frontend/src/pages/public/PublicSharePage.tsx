import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Clock,
  Star,
  Share2,
  Copy,
  Check,
  Hotel,
  Footprints,
  Plane,
  ArrowRight,
  Globe,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import { useTrip } from '@/context/TripContext';

// Mock shared trip data — in production this would be fetched by shareId from API
const MOCK_SHARED_TRIPS: Record<string, {
  title: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  cities: string[];
  startDate: string;
  endDate: string;
  totalDays: number;
  travelers: number;
  budget: string;
  highlights: string[];
  hotels: { name: string; city: string; nights: number; stars: number }[];
  activities: { day: number; time: string; title: string; category: string; cost: string }[];
  transport: { from: string; to: string; mode: string; duration: string }[];
  clones: number;
  rating: number;
}> = {
  'gt-trip-101': {
    title: 'Goa Sun & Coastline',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    author: 'Aarav Mehta',
    authorAvatar: 'AM',
    cities: ['Goa'],
    startDate: '2026-09-10',
    endDate: '2026-09-16',
    totalDays: 6,
    travelers: 2,
    budget: '₹48,000',
    highlights: ['Candolim Beach Sunset', 'Dudhsagar Waterfalls Day Trip', 'Old Goa Heritage Churches', 'Night Market at Arpora'],
    hotels: [
      { name: 'Santana Beach Boutique Resort', city: 'Candolim, Goa', nights: 5, stars: 4 },
    ],
    activities: [
      { day: 1, time: '11:30', title: 'Check-in & Candolim Beach Relax', category: 'Hotel', cost: '—' },
      { day: 1, time: '18:00', title: 'Sunset Dinner at The Fisherman\'s Wharf', category: 'Food', cost: '₹1,200' },
      { day: 2, time: '09:00', title: 'Dudhsagar Waterfalls Jeep Tour', category: 'Adventure', cost: '₹2,200' },
      { day: 3, time: '10:00', title: 'Old Goa World Heritage Walk', category: 'Culture', cost: '₹300' },
      { day: 4, time: '08:00', title: 'Scuba Diving at Grande Island', category: 'Adventure', cost: '₹3,200' },
    ],
    transport: [
      { from: 'Ahmedabad (AMD)', to: 'Goa (GOI)', mode: '✈️ Flight', duration: '1h 50m' },
    ],
    clones: 124,
    rating: 4.9,
  },
};

// Fallback shared trip for any unknown shareId
const DEFAULT_SHARED_TRIP = MOCK_SHARED_TRIPS['gt-trip-101'];

const CATEGORY_COLORS: Record<string, string> = {
  Hotel: 'bg-purple-100 text-purple-800',
  Food: 'bg-amber-100 text-amber-800',
  Adventure: 'bg-terracotta-100 text-terracotta-800',
  Culture: 'bg-teal-100 text-teal-800',
  Sightseeing: 'bg-sky-100 text-sky-800',
  Nature: 'bg-emerald-100 text-emerald-800',
  Nightlife: 'bg-slate-100 text-slate-800',
};

export const PublicSharePage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { success } = useToast();
  const { duplicateTrip, trips } = useTrip();

  const [linkCopied, setLinkCopied] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);

  const trip = shareId ? (MOCK_SHARED_TRIPS[shareId] || DEFAULT_SHARED_TRIP) : DEFAULT_SHARED_TRIP;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCloneTrip = async () => {
    setIsCloning(true);
    await new Promise((res) => setTimeout(res, 800));

    if (trips.length > 0) {
      await duplicateTrip(trips[0].id);
    }

    setIsCloning(false);
    setCloneSuccess(true);
    success('Trip Cloned!', `"${trip.title}" has been added to your trips. Go customize it!`);
    setTimeout(() => navigate('/trips'), 1500);
  };

  const days = Array.from({ length: trip.totalDays }, (_, i) => i + 1);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-16">
      {/* HERO */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-elevated">
        <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge variant="neutral" size="xs" className="bg-white/90 text-slate-900 font-bold backdrop-blur-sm">
            🌍 Shared Itinerary
          </Badge>
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer shadow-md transition-colors"
            >
              {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Bottom hero content */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight">
            {trip.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-terracotta-500 text-white text-[11px] font-bold flex items-center justify-center">
                {trip.authorAvatar}
              </div>
              <span className="text-white/80 text-xs">by <strong className="text-white">{trip.author}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-white text-xs font-bold">{trip.rating}</span>
            </div>
            <span className="text-white/60 text-xs">{trip.clones} people cloned this</span>
          </div>
        </div>
      </div>

      {/* CLONE + SHARE ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleCloneTrip}
          disabled={isCloning || cloneSuccess}
          leftIcon={cloneSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        >
          {isCloning ? 'Cloning Trip...' : cloneSuccess ? 'Trip Cloned! Redirecting...' : 'Copy This Trip to My Account'}
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handleCopyLink}
          leftIcon={linkCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        >
          {linkCopied ? 'Link Copied!' : 'Share Link'}
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/trips/create')}
          leftIcon={<Globe className="w-4 h-4" />}
        >
          Start My Own Trip
        </Button>
      </div>

      {/* TRIP META GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Calendar, label: 'Duration', value: `${trip.totalDays} Days`, sub: `${trip.startDate}` },
          { icon: MapPin, label: 'Destinations', value: trip.cities.join(', '), sub: `${trip.cities.length} cit${trip.cities.length > 1 ? 'ies' : 'y'}` },
          { icon: Users, label: 'Travelers', value: `${trip.travelers} People`, sub: trip.travelers === 1 ? 'Solo' : trip.travelers === 2 ? 'Couple' : 'Group' },
          { icon: Wallet, label: 'Budget', value: trip.budget, sub: 'total estimated' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Card key={label} variant="default" className="p-4 text-center space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
            <p className="text-sm font-extrabold text-slate-900">{value}</p>
            <p className="text-[10px] text-slate-400">{sub}</p>
          </Card>
        ))}
      </div>

      {/* HIGHLIGHTS */}
      <Card variant="default" className="p-5 mb-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-terracotta-500" />
          Trip Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {trip.highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              {h}
            </div>
          ))}
        </div>
      </Card>

      {/* DAY-BY-DAY ITINERARY */}
      <div className="space-y-6 mb-8">
        <h2 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          Day-by-Day Itinerary
        </h2>

        {days.map((day) => {
          const dayActivities = trip.activities.filter((a) => a.day === day);
          return (
            <div key={day} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  D{day}
                </div>
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-500 font-medium">Day {day} of {trip.totalDays}</span>
              </div>

              {dayActivities.length > 0 ? (
                <div className="ml-4 space-y-2">
                  {dayActivities.map((act, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 w-12 shrink-0">{act.time}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{act.title}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${CATEGORY_COLORS[act.category] || 'bg-slate-100 text-slate-600'}`}>
                          {act.category}
                        </span>
                      </div>
                      {act.cost !== '—' && (
                        <span className="text-xs font-bold text-slate-800 shrink-0">{act.cost}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ml-4 p-3 bg-sand-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                  Free day — explore at your own pace 🌿
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* HOTELS */}
      {trip.hotels.length > 0 && (
        <Card variant="default" className="p-5 mb-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Hotel className="w-4 h-4 text-purple-600" />
            Accommodation
          </h2>
          {trip.hotels.map((h) => (
            <div key={h.name} className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-200">
              <div>
                <p className="text-sm font-bold text-slate-900">{h.name}</p>
                <p className="text-[11px] text-slate-500">{h.city} • {h.nights} nights</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: Math.floor(h.stars) }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-[10px] text-slate-500 ml-0.5">{h.stars}★</span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* TRANSPORT */}
      {trip.transport.length > 0 && (
        <Card variant="default" className="p-5 mb-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-600" />
            Getting There
          </h2>
          {trip.transport.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-200">
              <span className="text-lg">{t.mode.split(' ')[0]}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{t.from} → {t.to}</p>
                <p className="text-[11px] text-slate-500">{t.mode.split(' ').slice(1).join(' ')} • {t.duration}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* BOTTOM CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-50 to-sand-50 border border-teal-200 text-center space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 font-display">Love this itinerary?</h3>
        <p className="text-sm text-slate-600">Clone it to your account and customize it for your perfect trip.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleCloneTrip}
            disabled={isCloning || cloneSuccess}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            {cloneSuccess ? 'Cloned ✓' : 'Copy This Trip'}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/plan')}
            leftIcon={<ArrowRight className="w-4 h-4" />}
          >
            Plan My Own Trip with AI
          </Button>
        </div>
      </div>
    </div>
  );
};
