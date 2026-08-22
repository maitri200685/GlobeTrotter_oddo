import React from 'react';
import { 
  MapPin, 
  Star, 
  Plus, 
  Check, 
  ExternalLink, 
  Sun, 
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { City } from '@/types/geo.types';

interface CityCardProps {
  city: City;
  isAlreadyAdded?: boolean;
  onAddToTrip?: (city: City) => void;
  onViewDetails?: (city: City) => void;
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  isAlreadyAdded = false,
  onAddToTrip,
  onViewDetails,
}) => {
  return (
    <Card
      hoverable
      className="group flex flex-col justify-between overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-terracotta-300 transition-all duration-200"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={city.coverImage}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <Badge variant="teal" size="xs" className="bg-black/50 text-white backdrop-blur-md">
            {city.costLevel} • {city.climate.currentTemp}
          </Badge>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{city.rating}</span>
          </div>
        </div>

        {/* Bottom City Name */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h3 className="text-lg font-extrabold leading-tight">{city.name}</h3>
          <p className="text-xs text-slate-200">{city.country} • {city.region}</p>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {city.shortTagline}
        </p>

        {/* Vibes / Categories */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {city.vibes.slice(0, 3).map((vibe) => (
            <span
              key={vibe}
              className="px-2 py-0.5 rounded-full bg-sand-100 text-slate-600 text-[10px] font-medium"
            >
              {vibe}
            </span>
          ))}
        </div>

        {/* Highlights snippet */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
          <span className="font-semibold text-slate-700 block">Top Highlight:</span>
          <p className="truncate text-slate-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
            {city.topAttractions[0]}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => onViewDetails(city)}
            >
              Details
            </Button>
          )}

          {onAddToTrip && (
            <Button
              variant={isAlreadyAdded ? 'secondary' : 'primary'}
              size="xs"
              disabled={isAlreadyAdded}
              onClick={() => onAddToTrip(city)}
              leftIcon={isAlreadyAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {isAlreadyAdded ? 'Added' : 'Add to Trip'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
