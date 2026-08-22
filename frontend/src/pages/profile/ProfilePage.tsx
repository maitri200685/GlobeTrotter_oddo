import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  MapPin, 
  Compass, 
  Calendar, 
  Sparkles, 
  Edit3, 
  Globe, 
  Heart, 
  Award, 
  TrendingUp,
  Settings,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, demoPersonas, switchDemoPersona, toggleSavedDestination } = useAuth();
  const { info } = useToast();

  if (!user) return null;

  const budgetStyleLabels = {
    backpacker: '🎒 Solo Backpacker & Hostel Lover',
    comfort: '✨ Boutique Comfort & Curated Stays',
    luxury: '💎 Luxury & Heritage Explorer',
    family: '👨‍👩‍👧‍👦 Family & Group Friendly',
  };

  const travelPaceLabels = {
    relaxed: '🌴 Relaxed & Leisurely (1-2 stops/day)',
    balanced: '⚖️ Balanced (2-3 stops/day)',
    packed: '⚡ Packed & High-Energy (4+ stops/day)',
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* 1. PROFILE HERO BANNER */}
      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-terracotta-500 via-amber-500 to-teal-600 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Link to="/settings">
              <Button
                variant="outline"
                size="xs"
                className="bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md border-white/50"
                leftIcon={<Settings className="w-3.5 h-3.5" />}
              >
                Edit Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-8 pb-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="xl"
                status="online"
                className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white shadow-elevated"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {user.name}
                  </h1>
                  <Badge variant="terracotta" size="xs">
                    {user.preferences.preferredCurrency} Member
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/plan')}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Plan New Trip with AI
              </Button>
            </div>
          </div>

          {user.bio && (
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed mt-2">
              {user.bio}
            </p>
          )}

          {/* Travel Style Badges */}
          <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-slate-100">
            <Badge variant="teal" size="sm">
              {budgetStyleLabels[user.preferences.budgetStyle]}
            </Badge>
            <Badge variant="amber" size="sm">
              {travelPaceLabels[user.preferences.travelPace]}
            </Badge>
            {user.preferences.dietary !== 'any' && (
              <Badge variant="neutral" size="sm">
                Diet: {user.preferences.dietary.toUpperCase()}
              </Badge>
            )}
            {user.preferences.homeAirportOrCity && (
              <Badge variant="sky" size="sm" icon={<MapPin className="w-3.5 h-3.5" />}>
                Based in {user.preferences.homeAirportOrCity}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 2. TRAVEL STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="flat" className="p-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trips Planned</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{user.stats.tripsPlanned}</p>
          <span className="text-[10px] text-teal-600 font-semibold mt-0.5 inline-block">Active Explorer</span>
        </Card>

        <Card variant="flat" className="p-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cities Visited</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{user.stats.citiesVisited}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 inline-block">Multi-City Routes</span>
        </Card>

        <Card variant="flat" className="p-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Countries</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{user.stats.countriesExplored}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 inline-block">Global Passport</span>
        </Card>

        <Card variant="flat" className="p-4 text-center bg-emerald-50/50 border-emerald-200/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Budget Saved</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">{user.stats.savedBudgetTotal}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">via AI Optimization</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. SAVED DESTINATIONS / WISHLIST */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-terracotta-500 fill-terracotta-500" />
                <span>Saved Wishlist Destinations</span>
              </h3>
              <p className="text-xs text-slate-500">Places you've bookmarked for upcoming adventures.</p>
            </div>
            <Link to="/explore" className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700">
              Browse More →
            </Link>
          </div>

          <Card variant="default">
            <CardContent className="p-4 divide-y divide-slate-100">
              {user.savedDestinations.length > 0 ? (
                user.savedDestinations.map((dest) => (
                  <div key={dest} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center text-terracotta-600 font-bold text-xs">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{dest}</h4>
                        <p className="text-[11px] text-slate-500">Ready for itinerary building</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => navigate(`/plan?destination=${encodeURIComponent(dest)}`)}
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                      >
                        Plan Trip
                      </Button>
                      <button
                        type="button"
                        onClick={() => toggleSavedDestination(dest)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from saved"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No saved destinations yet. Explore cities and bookmark your favorites!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 4. SWITCH PERSONAS WIDGET */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-purple-600" />
              <span>Switch Demo Persona</span>
            </h3>
            <p className="text-xs text-slate-500">Experience GlobeTrotter as different traveler types.</p>
          </div>

          <Card variant="default">
            <CardContent className="p-4 space-y-2.5">
              {demoPersonas.map((persona) => {
                const isActive = persona.user.email === user.email;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => switchDemoPersona(persona.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-terracotta-50/80 border-terracotta-400 ring-2 ring-terracotta-100'
                        : 'bg-white border-slate-200/80 hover:bg-sand-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={persona.avatarUrl}
                        alt={persona.personaName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {persona.personaName} {isActive && <span className="text-[10px] text-terracotta-600 font-semibold">(Current)</span>}
                        </h4>
                        <p className="text-[10px] text-slate-500">{persona.tagline}</p>
                      </div>
                    </div>

                    <Badge variant={isActive ? 'terracotta' : 'neutral'} size="xs">
                      {persona.user.preferences.preferredCurrency}
                    </Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
