import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Compass, 
  Clock, 
  PieChart, 
  ShieldCheck, 
  Star, 
  Share2, 
  Heart, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, toggleSavedDestination, user } = useAuth();
  const { info, ai } = useToast();

  const [destinationQuery, setDestinationQuery] = useState('Goa, India');
  const [datesQuery, setDatesQuery] = useState('Oct 10 - Oct 17');
  const [travelersCount, setTravelersCount] = useState('2 Travelers');

  const featuredDestinations = [
    {
      id: 'dest-goa',
      name: 'Goa',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&h=400&q=80',
      tagline: 'Sunsets, golden beaches, colonial heritage & nightlife',
      estCost: '₹18,500',
      rating: 4.9,
      tags: ['Beaches', 'Nightlife', 'Food'],
      costIndex: 'Moderate',
    },
    {
      id: 'dest-jaipur',
      name: 'Jaipur',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&h=400&q=80',
      tagline: 'Majestic royal palaces, vibrant bazaars & grand forts',
      estCost: '₹22,000',
      rating: 4.8,
      tags: ['Heritage', 'Culture', 'Shopping'],
      costIndex: 'Moderate',
    },
    {
      id: 'dest-kerala',
      name: 'Kerala',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&h=400&q=80',
      tagline: 'Lush tea plantations, serene backwaters & houseboats',
      estCost: '₹24,500',
      rating: 4.9,
      tags: ['Nature', 'Relaxation', 'Ayurveda'],
      costIndex: 'Moderate',
    },
    {
      id: 'dest-kyoto',
      name: 'Kyoto',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&h=400&q=80',
      tagline: 'Ancient Shinto shrines, bamboo groves & traditional tea',
      estCost: '$1,850',
      rating: 5.0,
      tags: ['Culture', 'Temples', 'Culinary'],
      costIndex: 'Premium',
    },
    {
      id: 'dest-paris',
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&h=400&q=80',
      tagline: 'World-renowned art, historic boulevards & gastronomy',
      estCost: '$2,200',
      rating: 4.9,
      tags: ['Art', 'Romance', 'Dining'],
      costIndex: 'Luxury',
    },
    {
      id: 'dest-bali',
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=400&q=80',
      tagline: 'Spiritual temples, emerald rice terraces & surf coastlines',
      estCost: '$950',
      rating: 4.8,
      tags: ['Beaches', 'Wellness', 'Surfing'],
      costIndex: 'Budget',
    },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationQuery) return;
    info('Opening Trip Planner', `Planning journey to ${destinationQuery} for ${travelersCount}`);
    navigate(`/plan?destination=${encodeURIComponent(destinationQuery)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 animate-fade-in -mt-2 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-8 sm:pb-16 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-terracotta-200/30 via-amber-200/20 to-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 text-xs font-bold text-terracotta-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
            <span>Next-Gen Travel Planning Powered by AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-display">
            Turn Travel Dreams into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-amber-600 bg-clip-text text-transparent">
              Flawless Journeys
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            GlobeTrotter unifies conversational AI travel planning, tactile day-by-day timeline builders, multi-city routing, and real-time budget tracking into one seamless workspace.
          </p>

          {/* Interactive Hero Search Form */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl sm:rounded-full p-2.5 sm:p-2 border border-slate-200/90 shadow-elevated flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              {/* Destination Input */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50/80 rounded-full transition-colors">
                <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Where to?</p>
                  <input
                    type="text"
                    value={destinationQuery}
                    onChange={(e) => setDestinationQuery(e.target.value)}
                    placeholder="e.g. Goa, Paris, Kyoto"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200" />

              {/* Dates Input */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50/80 rounded-full transition-colors">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">When?</p>
                  <input
                    type="text"
                    value={datesQuery}
                    onChange={(e) => setDatesQuery(e.target.value)}
                    placeholder="Dates / Duration"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200" />

              {/* Travelers Input */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50/80 rounded-full transition-colors">
                <Users className="w-4 h-4 text-sky-600 shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Travelers</p>
                  <select
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="1 Traveler">1 Solo Traveler</option>
                    <option value="2 Travelers">2 Couple / Friends</option>
                    <option value="3 Travelers">3 Friends</option>
                    <option value="4+ Travelers">4+ Family Group</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="rounded-full px-6 py-3 shrink-0 shadow-md"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                <span>Plan with AI</span>
              </Button>
            </form>
          </div>

          {/* Quick Popular Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Popular ideas:</span>
            {['Goa Beach Escape', 'Royal Jaipur Heritage', 'Kerala Backwaters', 'Tokyo & Kyoto Trail'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setDestinationQuery(chip.split(' ')[0]);
                  info('Suggestion Selected', `Updated destination to ${chip.split(' ')[0]}`);
                }}
                className="px-2.5 py-1 rounded-full bg-sand-100/90 hover:bg-sand-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE AI AGENT PREVIEW TEASER */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-elevated relative overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-xs font-semibold text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>The Flagship Difference</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-display">
                Not Just a Chatbot. <br />
                A Dedicated Travel Co-Pilot.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Tell GlobeTrotter your travel vibe in plain words. In seconds, our agent parses stops, curates handpicked stays, schedules timed activities, and balances your budget into a tactile, editable itinerary.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="ai-subtle"
                  size="sm"
                  onClick={() => navigate('/plan')}
                  leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
                >
                  Try AI Travel Planner
                </Button>
                <Link to="/trips/trip-101/builder" className="text-xs font-semibold text-slate-300 hover:text-white underline">
                  Explore Sample Trip →
                </Link>
              </div>
            </div>

            {/* Mock Live Brief Widget Preview */}
            <div className="lg:col-span-6 bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-terracotta-500 flex items-center justify-center text-white text-xs font-bold">
                    GT
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Live Travel Brief</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Trip Plan Generated
                    </p>
                  </div>
                </div>
                <Badge variant="success" size="xs">
                  Est: ₹33,800 / ₹35,000
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Destination</span>
                  <span className="font-bold text-white">Goa (North & South)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Duration</span>
                  <span className="font-bold text-white">7 Days / 3 Travelers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Matched Stays</span>
                  <span className="font-bold text-amber-400">Boutique Beach Villa</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block">Activities</span>
                  <span className="font-bold text-teal-400">12 Curated Spots</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs text-purple-200">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI In-Trip Command: "Make Day 4 more relaxed"</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Built for Modern Travelers
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Everything you need to discover, organize, schedule, and enjoy your journeys without the spreadsheet chaos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card hoverable className="h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Travel Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guiding conversational assistant that builds complete multi-stop itineraries tailored to your pace, preferences, and budget.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card hoverable className="h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-600 shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Day-by-Day Timeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag-and-drop agenda builder with scheduled time slots, custom events, transit legs, and buffer time calculators.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card hoverable className="h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Real-Time Budget Meter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Categorized expense donuts, daily cost breakdown, group splitting, and intelligent overrun threshold warnings.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card hoverable className="h-full flex flex-col justify-between">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interactive Journey Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Geographic visualization of all your destinations, booked hotels, scheduled activities, and inter-city transit paths.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS SHOWCASE */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Trending Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Curated locations with realistic cost estimates, climate tips, and activities.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/explore')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Explore All Cities
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => {
            const isSaved = user?.savedDestinations.includes(dest.name);
            return (
              <Card key={dest.id} hoverable className="group flex flex-col overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedDestination(dest.name);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-terracotta-500 backdrop-blur-md transition-colors shadow-sm cursor-pointer"
                    aria-label={`Save ${dest.name} to wishlist`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <h3 className="text-lg font-extrabold">{dest.name}</h3>
                      <p className="text-xs text-slate-200">{dest.country}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {dest.tagline}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {dest.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-sand-100 text-slate-600 text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Typical Budget</span>
                      <p className="text-sm font-bold text-slate-900">{dest.estCost} <span className="text-[11px] font-normal text-slate-500">/ person</span></p>
                    </div>

                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => navigate(`/plan?destination=${encodeURIComponent(dest.name)}`)}
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      Plan Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. TRAVELER PERSONAS / TESTIMONIALS */}
      <section className="max-w-5xl mx-auto bg-sand-100/70 rounded-3xl p-6 sm:p-10 border border-sand-200/80 space-y-6">
        <div className="text-center space-y-1">
          <Badge variant="teal" size="sm">
            Community Stories
          </Badge>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            Loved by Solo Backpackers, Couples & Explorers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Aarav"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Aarav Mehta</h4>
                <p className="text-[10px] text-slate-500">Solo Traveler • Ahmedabad</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              "The budget optimization feature saved me ₹4,200 on my Goa hostel bookings while keeping me close to the best street food spots."
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Priya and Rohan"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Priya & Rohan</h4>
                <p className="text-[10px] text-slate-500">Couples Retreat • Mumbai</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              "We planned a 5-day Kerala houseboat and tea plantation vacation in 2 minutes. The day-by-day timeline view is brilliant."
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Elena"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Elena Rostova</h4>
                <p className="text-[10px] text-slate-500">Culture Explorer • London</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              "The ability to view my Kyoto trip across a timeline, calendar, and geographic route map gave me total confidence in my plans."
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-4xl mx-auto text-center bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-card space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Ready to Plan Your Next Adventure?
        </h2>
        <p className="text-white/90 text-xs sm:text-sm max-w-lg mx-auto">
          Start for free, test instant demo personas, and experience seamless AI-assisted travel planning.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/signup')}
          >
            Create Free Account
          </Button>
          <Button
            variant="outline"
            size="md"
            className="bg-white/10 hover:bg-white/20 text-white border-white/40"
            onClick={() => navigate('/login')}
          >
            1-Click Demo Login
          </Button>
        </div>
      </section>
    </div>
  );
};
