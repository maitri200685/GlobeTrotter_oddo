import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Footprints, 
  Clock, 
  CalendarDays, 
  Map, 
  PieChart, 
  Sparkles, 
  Share2, 
  Users, 
  Wallet, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTrip } from '@/context/TripContext';

export const TripOverviewPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, selectTrip, activeTrip } = useTrip();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  if (!currentTrip) return null;

  const budgetRatio = currentTrip.budget.targetBudget > 0 ? (currentTrip.budget.totalEstimatedCost / currentTrip.budget.targetBudget) : 0;
  const isOver = budgetRatio > 1.0;
  const isNear = budgetRatio >= 0.85 && !isOver;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. HERO SPOTLIGHT BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-slate-200/90 bg-white">
        <div className="h-64 sm:h-80 relative overflow-hidden">
          <img
            src={currentTrip.coverImage}
            alt={currentTrip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Top Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Badge variant="teal" size="sm" className="bg-white/90 text-slate-900 font-bold backdrop-blur-md">
              {currentTrip.status === 'upcoming' ? 'Upcoming Journey' : currentTrip.status === 'past' ? 'Completed Journey' : 'Draft Itinerary'}
            </Badge>

            <Badge variant={isOver ? 'danger' : isNear ? 'amber' : 'success'} size="sm" className="bg-black/60 text-white backdrop-blur-md">
              Budget: {currentTrip.budget.currency === 'INR' ? '₹' : '$'}{currentTrip.budget.targetBudget.toLocaleString()}
            </Badge>
          </div>

          {/* Bottom Banner Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <CalendarDays className="w-4 h-4" />
              <span>{currentTrip.startDate} – {currentTrip.endDate} ({currentTrip.totalDays} Days)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight font-display">
              {currentTrip.title}
            </h1>

            {currentTrip.description && (
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl line-clamp-2 leading-relaxed">
                {currentTrip.description}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="p-4 sm:p-6 bg-sand-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-4 h-4 text-terracotta-500" />
              <span>{currentTrip.cities.length} Destination Stops</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Users className="w-4 h-4 text-sky-600" />
              <span>{currentTrip.travelerCount} Travelers ({currentTrip.travelerType})</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>{currentTrip.itinerary.length} Scheduled Events</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Hotel className="w-4 h-4 text-amber-600" />
              <span>{currentTrip.hotels.length} Hotel Bookings</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Open Itinerary Builder
            </Button>
          </div>
        </div>
      </div>

      {/* 2. MULTI-STOP ROUTE SEQUENCE */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <span>Journey Route & City Stops</span>
              </CardTitle>
              <CardDescription>Order of cities and days allocated for each stop.</CardDescription>
            </div>
            <Link to={`/trips/${currentTrip.id}/cities`}>
              <Button variant="outline" size="xs">
                Edit Route Stops
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentTrip.cities.map((stop, idx) => (
              <div key={stop.id} className="p-4 rounded-2xl bg-sand-50/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-terracotta-500 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <Badge variant="teal" size="xs">
                    {stop.daysAllocated} Days Stay
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{stop.cityName}</h4>
                <p className="text-xs text-slate-500">{stop.country}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. WORKSPACE MODULE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverable clickable onClick={() => navigate(`/trips/${currentTrip.id}/hotels`)}>
          <CardContent className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Hotels & Stays</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTrip.hotels.length > 0 ? `${currentTrip.hotels[0].hotelName}` : 'Find boutique stays & match budget'}
              </p>
            </div>
            <span className="text-xs font-semibold text-terracotta-600 inline-flex items-center gap-1">
              Explore Stays →
            </span>
          </CardContent>
        </Card>

        <Card hoverable clickable onClick={() => navigate(`/trips/${currentTrip.id}/activities`)}>
          <CardContent className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Activity Discovery</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Discover sightseeing, beaches, and dining activities.
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-700 inline-flex items-center gap-1">
              Discover Activities →
            </span>
          </CardContent>
        </Card>

        <Card hoverable clickable onClick={() => navigate(`/trips/${currentTrip.id}/map`)}>
          <CardContent className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Route Map Visualizer</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                View geographic route pins, transit paths & hotel stops.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 inline-flex items-center gap-1">
              Open Journey Map →
            </span>
          </CardContent>
        </Card>

        <Card hoverable clickable onClick={() => navigate(`/trips/${currentTrip.id}/budget`)}>
          <CardContent className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Budget Tracker</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Spent: {currentTrip.budget.currency === 'INR' ? '₹' : '$'}{currentTrip.budget.totalEstimatedCost.toLocaleString()} / {currentTrip.budget.currency === 'INR' ? '₹' : '$'}{currentTrip.budget.targetBudget.toLocaleString()}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
              Analyze Costs →
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
