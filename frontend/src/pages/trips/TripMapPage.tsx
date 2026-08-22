import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Map as MapIcon, 
  MapPin, 
  Hotel, 
  Footprints, 
  Compass, 
  Clock, 
  Plane, 
  ArrowRight, 
  Sparkles, 
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Utensils
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTrip } from '@/context/TripContext';
import type { ItineraryItem, CityStop } from '@/types/trip.types';

interface MapWaypoint {
  id: string;
  title: string;
  type: 'city' | 'hotel' | 'activity' | 'food';
  dayNumber?: number;
  timeSlot?: string;
  cost?: number;
  currency?: string;
  image?: string;
  notes?: string;
  x: number; // percentage in SVG coordinate canvas
  y: number; // percentage in SVG coordinate canvas
}

export const TripMapPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, selectTrip, activeTrip } = useTrip();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [selectedWaypoint, setSelectedWaypoint] = useState<MapWaypoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  if (!currentTrip) return null;

  // Build Waypoints for the active trip
  const waypoints: MapWaypoint[] = [
    // City Nodes
    ...currentTrip.cities.map((city, idx) => ({
      id: `wp-city-${city.id}`,
      title: `${city.cityName} (Stop ${idx + 1})`,
      type: 'city' as const,
      notes: `${city.daysAllocated} Days Stay allocated`,
      x: 20 + idx * 28,
      y: 35 + (idx % 2 === 0 ? -8 : 8),
    })),
    // Hotel Pins
    ...currentTrip.hotels.map((h, idx) => ({
      id: `wp-htl-${h.id}`,
      title: h.hotelName,
      type: 'hotel' as const,
      notes: h.address,
      image: h.image,
      cost: h.totalCost,
      currency: h.currency,
      x: 25 + idx * 26,
      y: 48,
    })),
    // Itinerary Activity Waypoints
    ...currentTrip.itinerary.map((item, idx) => ({
      id: `wp-act-${item.id}`,
      title: item.title,
      type: (item.category === 'food' ? 'food' : item.category === 'hotel' ? 'hotel' : 'activity') as any,
      dayNumber: item.dayNumber,
      timeSlot: item.timeSlot,
      cost: item.estimatedCost,
      currency: item.currency,
      image: item.image,
      notes: item.location,
      x: 18 + (item.dayNumber * 12) + ((idx % 3) * 6),
      y: 25 + ((idx * 16) % 50),
    })),
  ];

  const filteredWaypoints = activeDayFilter === 'all'
    ? waypoints
    : waypoints.filter((w) => w.type === 'city' || w.dayNumber === activeDayFilter);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Interactive Journey Map: {currentTrip.title}
            </h1>
            <Badge variant="teal" size="xs">
              {filteredWaypoints.length} Geocoded Pins
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic visualizer plotting route polylines, hotel check-ins, and scheduled activity coordinates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
            leftIcon={<Clock className="w-4 h-4" />}
          >
            Open Timeline Builder
          </Button>
        </div>
      </div>

      {/* 2. DAY FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin p-1.5 bg-sand-100/80 rounded-2xl border border-slate-200/70">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
          Filter Route Days:
        </span>
        <button
          type="button"
          onClick={() => setActiveDayFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeDayFilter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          All Route Pins
        </button>

        {Array.from({ length: currentTrip.totalDays }, (_, i) => i + 1).map((dayNum) => (
          <button
            key={dayNum}
            type="button"
            onClick={() => setActiveDayFilter(dayNum)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeDayFilter === dayNum
                ? 'bg-terracotta-500 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Day {dayNum}
          </button>
        ))}
      </div>

      {/* 3. SPLIT WORKSPACE: MAP CANVAS + ROUTE SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MAP CANVAS (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-elevated border-2 border-slate-200 bg-slate-950">
            
            {/* Map Canvas Background Grid */}
            <div 
              className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"
            />

            {/* Custom SVG Route Lines & Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E05A47" />
                  <stop offset="50%" stopColor="#0D9488" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>

              {/* Connecting Transit Polylines between stops */}
              <path
                d="M 20% 35% Q 40% 15%, 55% 42% T 85% 30%"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>

            {/* Render Map Waypoint Pins */}
            {filteredWaypoints.map((wp) => {
              const isSelected = selectedWaypoint?.id === wp.id;
              const isCity = wp.type === 'city';
              const isHotel = wp.type === 'hotel';
              const isFood = wp.type === 'food';

              const pinColor = isCity
                ? 'bg-terracotta-500 text-white ring-terracotta-200'
                : isHotel
                ? 'bg-purple-600 text-white ring-purple-200'
                : isFood
                ? 'bg-amber-500 text-white ring-amber-200'
                : 'bg-teal-500 text-white ring-teal-200';

              const Icon = isCity ? MapPin : isHotel ? Hotel : isFood ? Utensils : Footprints;

              return (
                <div
                  key={wp.id}
                  style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                  onClick={() => setSelectedWaypoint(wp)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-elevated ring-4 transition-all duration-200 group-hover:scale-125 ${pinColor} ${
                      isSelected ? 'scale-125 ring-white' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold whitespace-nowrap backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {wp.title}
                  </span>
                </div>
              );
            })}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="w-8 h-8 rounded-xl bg-white/90 text-slate-800 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="w-8 h-8 rounded-xl bg-white/90 text-slate-800 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Map Overlay Legend */}
            <div className="absolute bottom-4 left-4 z-30 p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white text-[11px] flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
                <span>City Stops</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Hotel Stays</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Activities</span>
              </span>
            </div>
          </div>
        </div>

        {/* WAYPOINT DETAIL & STOPS SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedWaypoint ? (
            <Card variant="default" className="shadow-card border-terracotta-200 animate-fade-in">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="xs" className="capitalize">
                    {selectedWaypoint.type}
                  </Badge>
                  {selectedWaypoint.timeSlot && (
                    <span className="text-xs font-bold text-slate-700">
                      Day {selectedWaypoint.dayNumber} • {selectedWaypoint.timeSlot}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base mt-2">{selectedWaypoint.title}</CardTitle>
                {selectedWaypoint.notes && (
                  <CardDescription>{selectedWaypoint.notes}</CardDescription>
                )}
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {selectedWaypoint.image && (
                  <div className="h-32 rounded-xl overflow-hidden">
                    <img
                      src={selectedWaypoint.image}
                      alt={selectedWaypoint.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {selectedWaypoint.cost !== undefined && (
                  <div className="p-2.5 rounded-xl bg-sand-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Estimated Cost:</span>
                    <span className="font-bold text-slate-900">
                      {selectedWaypoint.cost === 0
                        ? 'Free'
                        : `${selectedWaypoint.currency === 'INR' ? '₹' : '$'}${selectedWaypoint.cost.toLocaleString()}`}
                    </span>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="xs"
                  fullWidth
                  onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
                >
                  View in Itinerary Builder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card variant="flat" className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand-100 text-slate-400 flex items-center justify-center mx-auto">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Select a Map Pin</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any marker on the route map to inspect destination stops, hotels, or activity details.
                </p>
              </div>
            </Card>
          )}

          {/* Route Milestones List */}
          <Card variant="default">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Trip Route Milestones</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {currentTrip.cities.map((city, idx) => (
                <div key={city.id} className="flex items-center justify-between p-2 rounded-xl bg-sand-50/80 border border-slate-200/60">
                  <span className="font-bold text-slate-900">
                    {idx + 1}. {city.cityName}
                  </span>
                  <Badge variant="neutral" size="xs">
                    {city.daysAllocated} Days
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
