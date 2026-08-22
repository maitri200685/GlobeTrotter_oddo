import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  PieChart, 
  Map, 
  ArrowRight, 
  PlusCircle, 
  Compass, 
  TrendingUp, 
  Wallet,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips } = useTrip();
  const { info, ai } = useToast();

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const heroTrip = upcomingTrips[0] || trips[0];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const recommendedDestinations = [
    {
      id: 'rec-kerala',
      title: 'Kerala Backwaters & Tea Retreat',
      duration: '5 Days / 4 Nights',
      cost: '₹24,500',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&h=400&q=80',
      vibe: 'Nature & Serenity',
      tag: 'Teal',
    },
    {
      id: 'rec-jaipur',
      title: 'Royal Jaipur & Forts Circuit',
      duration: '4 Days / 3 Nights',
      cost: '₹19,000',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&h=400&q=80',
      vibe: 'Palaces & Culture',
      tag: 'Amber',
    },
    {
      id: 'rec-bali',
      title: 'Bali Island Hopping & Sunsets',
      duration: '7 Days / 6 Nights',
      cost: '$1,100',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=400&q=80',
      vibe: 'Beaches & Temples',
      tag: 'Terracotta',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* 1. WELCOME HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Welcome back, {user?.name || 'Traveler'}!
            </h1>
            <Badge variant="teal" size="xs">
              {user?.preferences.budgetStyle ? `${user.preferences.budgetStyle} Explorer` : 'Explorer'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentDate} • You have <span className="font-bold text-terracotta-600">{upcomingTrips.length} upcoming trips</span> planned.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="ai-subtle"
            size="sm"
            onClick={() => {
              ai('AI Travel Planner', 'Describe your dream trip in plain words!');
              navigate('/plan');
            }}
            leftIcon={<Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />}
          >
            AI Trip Planner
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/trips/create')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Trip
          </Button>
        </div>
      </div>

      {/* 2. UPCOMING TRIP SPOTLIGHT HERO CARD */}
      {heroTrip && (
        <section className="relative rounded-3xl overflow-hidden shadow-elevated border border-slate-200/90 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Cover Photo Spotlight */}
            <div className="lg:col-span-5 h-64 lg:h-auto relative overflow-hidden">
              <img
                src={heroTrip.coverImage}
                alt={heroTrip.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <Badge variant="teal" size="sm" className="backdrop-blur-md bg-white/90 text-slate-900 font-bold">
                  Next Journey
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Starts in 14 days ({heroTrip.startDate})
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight mt-0.5">
                  {heroTrip.title}
                </h3>
              </div>
            </div>

            {/* Right Details & Action Hub */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-terracotta-500" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {heroTrip.cities.map((c) => c.cityName).join(' → ') || 'Multi-City Stop'}
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    Est: {heroTrip.budget.currency === 'INR' ? '₹' : '$'}{heroTrip.budget.totalEstimatedCost.toLocaleString()} (Within Budget)
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {heroTrip.description || 'Complete day-by-day itinerary with scheduled activities, stays, and budget.'}
                </p>

                {/* Progress / Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-xl bg-sand-50/80 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                    <span className="text-xs font-bold text-slate-900">{heroTrip.totalDays} Days</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sand-50/80 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-semibold block">Travelers</span>
                    <span className="text-xs font-bold text-slate-900">{heroTrip.travelerCount} Persons</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sand-50/80 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-semibold block">Scheduled Items</span>
                    <span className="text-xs font-bold text-teal-700">{heroTrip.itinerary.length} Events</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sand-50/80 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-semibold block">Stays Matched</span>
                    <span className="text-xs font-bold text-amber-700">{heroTrip.hotels.length} Hotel</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/trips/${heroTrip.id}/builder`)}
                    leftIcon={<Clock className="w-4 h-4" />}
                  >
                    Open Itinerary Builder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/trips/${heroTrip.id}/map`)}
                    leftIcon={<Map className="w-4 h-4" />}
                  >
                    View Map
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/trips/${heroTrip.id}`)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Trip Hub
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. AI PLANNING PROMO BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 border border-purple-800/40">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>AI Assistant Workspace</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            Have a new getaway in mind?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Tell our AI co-pilot: "I want a 7-day trip to Goa with 2 friends under ₹35,000 for beaches & food". Get a structured itinerary in seconds.
          </p>
        </div>

        <Button
          variant="ai-subtle"
          size="md"
          className="shrink-0 shadow-md font-bold"
          onClick={() => navigate('/plan')}
          leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
        >
          <span>Plan with AI in 60s</span>
        </Button>
      </div>

      {/* 4. TRAVEL STATS GAUGES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="flat" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Trips</span>
            <Compass className="w-4 h-4 text-terracotta-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{trips.length}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 inline-block">Active & Saved Plans</span>
        </Card>

        <Card variant="flat" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cities Visited</span>
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">14</p>
          <span className="text-[10px] text-teal-600 font-semibold mt-0.5 inline-block">+3 this season</span>
        </Card>

        <Card variant="flat" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Days on Road</span>
            <CalendarDays className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">26 Days</p>
          <span className="text-[10px] text-slate-500 mt-0.5 inline-block">Memories Created</span>
        </Card>

        <Card variant="flat" className="p-4 bg-emerald-50/50 border-emerald-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Budget Saved</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-800 mt-2">₹42,500</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">via AI Optimization</span>
        </Card>
      </div>

      {/* 5. RECOMMENDED JOURNEYS INSPIRATION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
              Recommended for Your Travel Style
            </h2>
            <p className="text-xs text-slate-500">Curated itineraries ready to be customized.</p>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700">
            View All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {recommendedDestinations.map((rec) => (
            <Card key={rec.id} hoverable className="group flex flex-col overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="teal" size="xs" className="bg-black/40 text-white backdrop-blur-md">
                    {rec.vibe}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-terracotta-600 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rec.duration}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Est: {rec.cost}</span>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => navigate(`/plan?destination=${encodeURIComponent(rec.title.split(' ')[0])}`)}
                  >
                    Plan Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
