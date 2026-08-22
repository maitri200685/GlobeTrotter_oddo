import React from 'react';
import { NavLink, useParams, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Footprints, 
  CalendarDays, 
  Map, 
  PieChart, 
  Sparkles, 
  Share2, 
  ChevronLeft, 
  Clock,
  Users,
  Wallet
} from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TripSubNavProps {
  tripTitle?: string;
  destinationSummary?: string;
  dateRange?: string;
  travelerCount?: number;
  budgetStatus?: 'healthy' | 'warning' | 'exceeded';
  budgetFormatted?: string;
}

export const TripSubNav: React.FC<TripSubNavProps> = ({
  tripTitle = 'Goa Sun & Coastline',
  destinationSummary = 'Goa, India',
  dateRange = 'Sep 10 – Sep 16, 2026',
  travelerCount = 2,
  budgetStatus = 'healthy',
  budgetFormatted = '₹35,000',
}) => {
  const { tripId = 'trip-101' } = useParams<{ tripId: string }>();

  const tabs = [
    { id: 'overview', label: 'Overview', path: `/trips/${tripId}`, icon: Compass, exact: true },
    { id: 'cities', label: 'Cities', path: `/trips/${tripId}/cities`, icon: MapPin },
    { id: 'hotels', label: 'Hotels', path: `/trips/${tripId}/hotels`, icon: Hotel },
    { id: 'activities', label: 'Activities', path: `/trips/${tripId}/activities`, icon: Footprints },
    { id: 'builder', label: 'Itinerary', path: `/trips/${tripId}/builder`, icon: Clock },
    { id: 'calendar', label: 'Calendar', path: `/trips/${tripId}/calendar`, icon: CalendarDays },
    { id: 'map', label: 'Map', path: `/trips/${tripId}/map`, icon: Map },
    { id: 'budget', label: 'Budget', path: `/trips/${tripId}/budget`, icon: PieChart, badge: budgetFormatted },
    { id: 'assistant', label: 'AI Assistant', path: `/trips/${tripId}/assistant`, icon: Sparkles, highlight: true },
    { id: 'share', label: 'Share', path: `/trips/${tripId}/share`, icon: Share2 },
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Top Banner: Trip Header & Quick Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/trips"
            aria-label="Back to all trips"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sand-100 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {tripTitle}
              </h2>
              <Badge variant="teal" size="xs">
                {destinationSummary}
              </Badge>
              <Badge
                variant={budgetStatus === 'healthy' ? 'success' : budgetStatus === 'warning' ? 'amber' : 'danger'}
                size="xs"
              >
                Budget: {budgetFormatted}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                {dateRange}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {travelerCount} Travelers
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                Est: ₹28,500
              </span>
            </div>
          </div>
        </div>

        {/* Right side Quick Action buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Link to={`/trips/${tripId}/assistant`}>
            <Button
              variant="ai-subtle"
              size="xs"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />}
            >
              Ask AI Co-Pilot
            </Button>
          </Link>
          <Link to={`/trips/${tripId}/share`}>
            <Button
              variant="outline"
              size="xs"
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              Share Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-thin py-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                end={tab.exact}
                className={({ isActive }) =>
                  clsx(
                    'inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer',
                    isActive
                      ? 'bg-terracotta-50 text-terracotta-600 font-semibold border-b-2 border-terracotta-500'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-sand-50',
                    tab.highlight && !isActive && 'text-purple-700 bg-purple-50/50 hover:bg-purple-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={clsx(
                        'w-4 h-4 shrink-0',
                        isActive
                          ? 'text-terracotta-600'
                          : tab.highlight
                          ? 'text-purple-600'
                          : 'text-slate-400'
                      )}
                    />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        {tab.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
