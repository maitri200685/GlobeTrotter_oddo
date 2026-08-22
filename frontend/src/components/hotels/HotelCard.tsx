import React from 'react';
import { 
  Star, 
  Sparkles, 
  MapPin, 
  Check, 
  Plus, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Hotel } from '@/types/inventory.types';

interface HotelCardProps {
  hotel: Hotel;
  allocatedNights: number;
  isSelected?: boolean;
  isCompared?: boolean;
  onSelect?: (hotel: Hotel) => void;
  onToggleCompare?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  allocatedNights = 1,
  isSelected = false,
  isCompared = false,
  onSelect,
  onToggleCompare,
}) => {
  const totalStayCost = hotel.pricePerNight * allocatedNights;

  return (
    <Card
      hoverable
      className={`group flex flex-col justify-between overflow-hidden border transition-all duration-200 ${
        isSelected
          ? 'border-teal-500 ring-2 ring-teal-200 shadow-card bg-teal-50/20'
          : 'border-slate-200/90 shadow-2xs hover:border-terracotta-300'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.coverImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <Badge variant="ai" size="xs" className="bg-purple-900/80 text-purple-200 backdrop-blur-md font-bold">
            <Sparkles className="w-3 h-3 text-purple-400 mr-1" />
            {hotel.aiMatchScore}% AI Match
          </Badge>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{hotel.userRating} ({hotel.reviewsCount})</span>
          </div>
        </div>

        {/* Bottom City & Hotel Name */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h3 className="text-base font-extrabold leading-tight">{hotel.name}</h3>
          <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-terracotta-400" />
            <span className="truncate">{hotel.address}</span>
          </p>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Why AI Recommends snippet */}
        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-950 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
          <p className="leading-snug">{hotel.whyAiRecommends}</p>
        </div>

        {/* Amenities chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-0.5 rounded-full bg-sand-100 text-slate-600 text-[10px] font-medium"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="text-[10px] text-slate-400">+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        {/* Pricing & Selection Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-sm font-extrabold text-slate-900">
              {hotel.currency === 'INR' ? '₹' : '$'}{hotel.pricePerNight.toLocaleString()}
              <span className="text-[10px] text-slate-500 font-normal"> / night</span>
            </span>
            <p className="text-[10px] text-teal-700 font-bold">
              Total: {hotel.currency === 'INR' ? '₹' : '$'}{totalStayCost.toLocaleString()} ({allocatedNights} nights)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(hotel)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-sand-50'
                }`}
              >
                {isCompared ? 'Comparing' : 'Compare'}
              </button>
            )}

            {onSelect && (
              <Button
                variant={isSelected ? 'secondary' : 'primary'}
                size="xs"
                onClick={() => onSelect(hotel)}
                leftIcon={isSelected ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
              >
                {isSelected ? 'Stay Selected' : 'Select Stay'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
