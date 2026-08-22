import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Check, 
  Layers, 
  Filter, 
  Sun,
  Star,
  Hotel
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CityCard } from '@/components/cities/CityCard';
import { cityService } from '@/services/cityService';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { City, Region, CostLevel, TravelVibe } from '@/types/geo.types';
import type { CityStop } from '@/types/trip.types';

export const TripCitiesPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { success, info } = useToast();

  const [cities, setCities] = useState<City[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<'All' | Region>('All');
  const [selectedVibe, setSelectedVibe] = useState<'All' | TravelVibe>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailCity, setDetailCity] = useState<City | null>(null);

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  useEffect(() => {
    cityService.getCities({
      region: selectedRegion,
      vibe: selectedVibe,
      searchQuery,
    }).then(setCities);
  }, [selectedRegion, selectedVibe, searchQuery]);

  if (!currentTrip) return null;

  const currentStops = currentTrip.cities || [];

  const handleAddCity = async (city: City) => {
    const isAlready = currentStops.some((s) => s.cityName.toLowerCase() === city.name.toLowerCase());
    if (isAlready) {
      info('Already in Route', `${city.name} is already part of your itinerary.`);
      return;
    }

    const newStop: CityStop = {
      id: 'stop-' + Math.random().toString(36).substring(2, 7),
      cityName: city.name,
      country: city.country,
      daysAllocated: city.typicalStayDays || 3,
      order: currentStops.length + 1,
      coverImage: city.coverImage,
      coordinates: city.coordinates,
    };

    const updatedStops = [...currentStops, newStop];
    await updateTrip(currentTrip.id, { cities: updatedStops });
    success('City Added to Route', `${city.name} has been added to your itinerary.`);
  };

  const handleRemoveStop = async (stopId: string) => {
    const updatedStops = currentStops
      .filter((s) => s.id !== stopId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    await updateTrip(currentTrip.id, { cities: updatedStops });
    info('Stop Removed', 'City removed from your route sequence.');
  };

  const handleMoveStop = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentStops.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newStops = [...currentStops];
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    const reordered = newStops.map((s, idx) => ({ ...s, order: idx + 1 }));
    await updateTrip(currentTrip.id, { cities: reordered });
  };

  const handleUpdateDays = async (stopId: string, days: number) => {
    const updatedStops = currentStops.map((s) =>
      s.id === stopId ? { ...s, daysAllocated: Math.max(1, days) } : s
    );
    await updateTrip(currentTrip.id, { cities: updatedStops });
  };

  const totalAllocatedDays = currentStops.reduce((sum, s) => sum + s.daysAllocated, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Multi-City Route Planner: {currentTrip.title}
            </h1>
            <Badge variant="teal" size="xs">
              {currentStops.length} Stops
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Handpick destination stops, set stay durations, and arrange the sequence of your journey.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/trips/${currentTrip.id}/hotels`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Hotel Discovery
          </Button>
        </div>
      </div>

      {/* Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE ROUTE SUMMARY & SEQUENCE */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="default" className="shadow-card sticky top-24">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-terracotta-500" />
                    <span>Your Journey Sequence</span>
                  </CardTitle>
                  <CardDescription>
                    Total Route Days: <span className="font-bold text-slate-800">{totalAllocatedDays} Days</span> ({currentTrip.totalDays} Days Trip)
                  </CardDescription>
                </div>
                <Badge variant={totalAllocatedDays === currentTrip.totalDays ? 'success' : 'amber'} size="xs">
                  {totalAllocatedDays === currentTrip.totalDays ? 'Balanced' : `${totalAllocatedDays} / ${currentTrip.totalDays} Days`}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {currentStops.length > 0 ? (
                <div className="space-y-3">
                  {currentStops.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className="p-3.5 rounded-2xl bg-sand-50/80 border border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs group hover:border-terracotta-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-full bg-terracotta-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {stop.order}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {stop.cityName}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">{stop.country}</p>
                        </div>
                      </div>

                      {/* Day Allocation Counter */}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateDays(stop.id, stop.daysAllocated - 1)}
                          className="px-2 py-1 text-xs text-slate-600 hover:bg-sand-100 font-bold"
                          title="Decrease days"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-slate-900 min-w-[2.5rem] text-center">
                          {stop.daysAllocated}d
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateDays(stop.id, stop.daysAllocated + 1)}
                          className="px-2 py-1 text-xs text-slate-600 hover:bg-sand-100 font-bold"
                          title="Increase days"
                        >
                          +
                        </button>
                      </div>

                      {/* Reorder & Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveStop(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentStops.length - 1}
                          onClick={() => handleMoveStop(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(stop.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Remove city"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 space-y-2">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No cities added to your journey yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Select destinations from the catalog on the right to build your route.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="xs"
                  fullWidth
                  onClick={() => navigate(`/trips/${currentTrip.id}/map`)}
                >
                  Preview Route on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: CITY DISCOVERY & SEARCH CATALOG */}
        <div className="lg:col-span-7 space-y-5">
          {/* Search & Region Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Indian destinations (Mumbai, Jaipur, Kerala, Ladakh...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs sm:text-sm text-slate-800 rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-500 transition-all placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
              {['All', 'North India', 'South India', 'West India', 'East India', 'Himalayas', 'Islands'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRegion(r as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedRegion === r
                      ? 'bg-terracotta-500 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-sand-100 border border-slate-200/80'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Vibe Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
              {['All', 'Beaches', 'Heritage', 'Food & Nightlife', 'Mountains', 'Nature & Wildlife'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVibe(v as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedVibe === v
                      ? 'bg-teal-600 text-white shadow-2xs font-bold'
                      : 'bg-sand-100 text-slate-600 hover:bg-sand-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cities.map((city) => {
              const isAlreadyAdded = currentStops.some((s) => s.cityName.toLowerCase() === city.name.toLowerCase());
              return (
                <CityCard
                  key={city.id}
                  city={city}
                  isAlreadyAdded={isAlreadyAdded}
                  onAddToTrip={handleAddCity}
                  onViewDetails={(c) => setDetailCity(c)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* CITY DETAILS MODAL */}
      <Modal
        isOpen={Boolean(detailCity)}
        onClose={() => setDetailCity(null)}
        title={detailCity ? `${detailCity.name}, ${detailCity.country}` : 'Destination Details'}
        description={detailCity?.shortTagline}
        size="lg"
      >
        {detailCity && (
          <div className="space-y-5">
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xs">
              <img
                src={detailCity.coverImage}
                alt={detailCity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="teal" size="sm" className="bg-black/50 text-white backdrop-blur-md">
                  {detailCity.climate.currentTemp} • {detailCity.climate.condition}
                </Badge>
                <Badge variant="amber" size="sm" className="bg-black/50 text-white backdrop-blur-md">
                  Cost: {detailCity.averageDailyCost}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Destination</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {detailCity.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-sand-50 border border-slate-200/70 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-900">Top Attractions & Activities</h5>
                <ul className="text-xs text-slate-600 space-y-1">
                  {detailCity.topAttractions.map((att, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-sand-50 border border-slate-200/70 space-y-2">
                <h5 className="text-xs font-bold text-slate-900">Trip Insights</h5>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Best Season:</span> {detailCity.climate.bestSeason}
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Suggested Stay:</span> {detailCity.typicalStayDays} Days
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Travel Rating:</span> ★ {detailCity.rating} / 5.0
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setDetailCity(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleAddCity(detailCity);
                  setDetailCity(null);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add {detailCity.name} to Itinerary
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
