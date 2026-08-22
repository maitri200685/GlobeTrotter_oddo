import React from 'react';
import { 
  X, 
  Sparkles, 
  Star, 
  Check, 
  Minus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Hotel } from '@/types/inventory.types';

interface HotelComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hotels: Hotel[];
  allocatedNights: number;
  onSelectHotel: (hotel: Hotel) => void;
  onRemoveFromCompare: (hotelId: string) => void;
}

export const HotelComparisonDrawer: React.FC<HotelComparisonDrawerProps> = ({
  isOpen,
  onClose,
  hotels,
  allocatedNights = 1,
  onSelectHotel,
  onRemoveFromCompare,
}) => {
  const allAmenities = ['WiFi', 'Pool', 'Free Breakfast', 'Beachfront', 'Spa', 'Bar', 'Fitness Center', 'Air Conditioning'] as const;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Compare Accommodations (${hotels.length} Selected)`}
      description={`Side-by-side feature and price comparison for ${allocatedNights} nights.`}
      size="xl"
    >
      <div className="space-y-6">
        {hotels.length === 0 ? (
          <p className="text-center py-12 text-xs text-slate-500">
            No hotels selected for comparison. Click "Compare" on any hotel card.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotels.map((hotel) => {
              const totalCost = hotel.pricePerNight * allocatedNights;
              return (
                <div
                  key={hotel.id}
                  className="p-4 rounded-2xl bg-sand-50/70 border border-slate-200/90 space-y-4 relative flex flex-col justify-between"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveFromCompare(hotel.id)}
                    className="absolute top-3 right-3 p-1 rounded-full bg-white text-slate-400 hover:text-slate-700 shadow-xs cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-3">
                    <div className="h-32 rounded-xl overflow-hidden">
                      <img
                        src={hotel.coverImage}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{hotel.userRating} ({hotel.reviewsCount} reviews)</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {hotel.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{hotel.address}</p>
                    </div>

                    {/* AI Score */}
                    <div className="p-2 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        AI Match:
                      </span>
                      <span className="font-extrabold text-purple-700">{hotel.aiMatchScore}%</span>
                    </div>

                    {/* Cost Summary */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">
                        {hotel.currency === 'INR' ? '₹' : '$'}{hotel.pricePerNight.toLocaleString()} / night
                      </p>
                      <p className="text-[11px] font-semibold text-teal-700">
                        Total: {hotel.currency === 'INR' ? '₹' : '$'}{totalCost.toLocaleString()} ({allocatedNights} nights)
                      </p>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/70 text-xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features</p>
                      {allAmenities.map((amenity) => {
                        const hasAmenity = hotel.amenities.includes(amenity as any);
                        return (
                          <div key={amenity} className="flex items-center justify-between text-slate-700">
                            <span className="text-[11px]">{amenity}</span>
                            {hasAmenity ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Minus className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <Button
                      variant="primary"
                      size="xs"
                      fullWidth
                      onClick={() => {
                        onSelectHotel(hotel);
                        onClose();
                      }}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Choose this Stay
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
};
