import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Hotel as HotelIcon, 
  MapPin, 
  Filter, 
  Sparkles, 
  Star, 
  SlidersHorizontal, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HotelCard } from '@/components/hotels/HotelCard';
import { HotelComparisonDrawer } from '@/components/hotels/HotelComparisonDrawer';
import { hotelService } from '@/services/hotelService';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { Hotel, AmenityType } from '@/types/inventory.types';
import type { HotelBooking } from '@/types/trip.types';

export const TripHotelsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { success, info } = useToast();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [starFilter, setStarFilter] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityType[]>([]);
  const [sortBy, setSortBy] = useState<'aiMatch' | 'priceAsc' | 'priceDesc' | 'rating'>('aiMatch');
  
  // Comparison Drawer State
  const [comparedHotels, setComparedHotels] = useState<Hotel[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  useEffect(() => {
    if (currentTrip?.cities && currentTrip.cities.length > 0 && !selectedCityId) {
      setSelectedCityId(currentTrip.cities[0].id);
    }
  }, [currentTrip, selectedCityId]);

  const activeCityStop = currentTrip?.cities.find((c) => c.id === selectedCityId) || currentTrip?.cities[0];
  const allocatedNights = activeCityStop ? Math.max(1, activeCityStop.daysAllocated - 1) : 1;

  useEffect(() => {
    if (activeCityStop) {
      hotelService
        .getHotelsByCity(activeCityStop.cityName, {
          minStarRating: starFilter,
          amenities: selectedAmenities,
          sortBy,
        })
        .then(setHotels);
    }
  }, [activeCityStop, starFilter, selectedAmenities, sortBy]);

  if (!currentTrip) return null;

  const currentBookings = currentTrip.hotels || [];

  const handleSelectHotel = async (hotel: Hotel) => {
    const totalCost = hotel.pricePerNight * allocatedNights;

    const newBooking: HotelBooking = {
      id: 'htl-book-' + Math.random().toString(36).substring(2, 7),
      hotelName: hotel.name,
      cityId: activeCityStop?.id || 'city-1',
      cityName: activeCityStop?.cityName || hotel.cityName,
      starRating: hotel.starRating || hotel.rating || 4,
      pricePerNight: hotel.pricePerNight,
      nights: allocatedNights,
      totalCost,
      currency: hotel.currency,
      checkInDate: currentTrip.startDate,
      checkOutDate: currentTrip.endDate,
      address: hotel.address || hotel.cityName,
      image: hotel.coverImage || (hotel.images && hotel.images[0]) || '',
      amenities: hotel.amenities || [],
      whyRecommended: hotel.whyAiRecommends || hotel.whyRecommended || 'Highly recommended',
    };

    // Replace booking for this city stop or add new
    const updatedBookings = [
      ...currentBookings.filter((b) => b.cityId !== activeCityStop?.id),
      newBooking,
    ];

    // Recalculate trip accommodation budget
    const totalAccommodationCost = updatedBookings.reduce((sum, b) => sum + b.totalCost, 0);
    const existingOtherCategories = { ...currentTrip.budget.categories };
    existingOtherCategories.accommodation = totalAccommodationCost;

    const newTotalEstimated = Object.values(existingOtherCategories).reduce((a, b) => a + b, 0);

    await updateTrip(currentTrip.id, {
      hotels: updatedBookings,
      budget: {
        ...currentTrip.budget,
        totalEstimatedCost: newTotalEstimated,
        categories: existingOtherCategories,
      },
    });

    success('Stay Selected!', `${hotel.name} confirmed for ${activeCityStop?.cityName}. Total: ${hotel.currency === 'INR' ? '₹' : '$'}${totalCost.toLocaleString()}`);
  };

  const handleToggleCompare = (hotel: Hotel) => {
    if (comparedHotels.some((h) => h.id === hotel.id)) {
      setComparedHotels((prev) => prev.filter((h) => h.id !== hotel.id));
    } else {
      if (comparedHotels.length >= 3) {
        info('Comparison Limit', 'You can compare up to 3 hotels at once.');
        return;
      }
      setComparedHotels((prev) => [...prev, hotel]);
    }
  };

  const handleToggleAmenity = (amenity: AmenityType) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Hotel & Stay Discovery: {currentTrip.title}
            </h1>
            <Badge variant="teal" size="xs">
              {currentBookings.length} Booked
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-matched boutique stays, beachfront resorts, and hostels aligned with your travel budget.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/trips/${currentTrip.id}/activities`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Discover Activities
          </Button>
        </div>
      </div>

      {/* 2. MULTI-CITY SELECTOR TAB BAR */}
      {currentTrip.cities.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin p-1.5 bg-sand-100/70 rounded-2xl border border-slate-200/70">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Select Destination Stop:
          </span>
          {currentTrip.cities.map((stop) => {
            const isSelected = stop.id === selectedCityId;
            const hasBooking = currentBookings.some((b) => b.cityId === stop.id);
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => setSelectedCityId(stop.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{stop.cityName} ({stop.daysAllocated}d)</span>
                {hasBooking && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. FILTER & SORTING BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Filter Stays:
            </span>

            {/* Star Rating Filters */}
            <div className="flex items-center gap-1">
              {[0, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setStarFilter(stars)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    starFilter === stars
                      ? 'bg-terracotta-500 text-white'
                      : 'bg-sand-100 text-slate-600 hover:bg-sand-200'
                  }`}
                >
                  {stars === 0 ? 'All Stars' : `${stars}★ & up`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-sand-50 text-xs font-semibold text-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="aiMatch">Highest AI Match Score</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Guest Rating</option>
            </select>
          </div>
        </div>

        {/* Amenities Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pt-2 border-t border-slate-100">
          {(['Pool', 'Beachfront', 'Free Breakfast', 'WiFi', 'Spa', 'Bar'] as AmenityType[]).map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleToggleAmenity(amenity)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-teal-600 text-white shadow-2xs font-semibold'
                    : 'bg-sand-50 text-slate-600 hover:bg-sand-100 border border-slate-200/80'
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. HOTEL CARDS GRID */}
      {hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            const isSelected = currentBookings.some((b) => b.hotelName.toLowerCase() === hotel.name.toLowerCase());
            const isCompared = comparedHotels.some((h) => h.id === hotel.id);
            return (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                allocatedNights={allocatedNights}
                isSelected={isSelected}
                isCompared={isCompared}
                onSelect={handleSelectHotel}
                onToggleCompare={handleToggleCompare}
              />
            );
          })}
        </div>
      ) : (
        <Card variant="flat" className="text-center py-12">
          <CardContent className="space-y-2">
            <HotelIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No Accommodations Found</h4>
            <p className="text-xs text-slate-500">Try relaxing your star rating or amenity filters.</p>
          </CardContent>
        </Card>
      )}

      {/* 5. FLOATING COMPARISON BUTTON */}
      {comparedHotels.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <Button
            variant="ai-subtle"
            size="md"
            className="shadow-elevated ring-2 ring-purple-300 font-bold bg-white text-purple-900"
            onClick={() => setIsComparisonOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
          >
            Compare {comparedHotels.length} Stays Side-by-Side
          </Button>
        </div>
      )}

      {/* 6. COMPARISON DRAWER */}
      <HotelComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        hotels={comparedHotels}
        allocatedNights={allocatedNights}
        onSelectHotel={handleSelectHotel}
        onRemoveFromCompare={(id) => setComparedHotels((prev) => prev.filter((h) => h.id !== id))}
      />
    </div>
  );
};
