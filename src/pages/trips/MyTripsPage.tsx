import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  Compass, 
  Sparkles, 
  Calendar, 
  Trash2, 
  AlertTriangle,
  MapPin,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { TripCard } from '@/components/trips/TripCard';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { Trip, TripStatus } from '@/types/trip.types';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { trips, filters, setFilters, duplicateTrip, deleteTrip, isLoading } = useTrip();
  const { info, success } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counts for each tab
  const allCount = trips.length;
  const upcomingCount = trips.filter((t) => t.status === 'upcoming').length;
  const pastCount = trips.filter((t) => t.status === 'past').length;
  const draftCount = trips.filter((t) => t.status === 'draft').length;

  const handleTabChange = (status: 'all' | TripStatus) => {
    setFilters({ status });
  };

  const handleDuplicate = async (id: string) => {
    await duplicateTrip(id);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete.id);
      setTripToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = (trip: Trip) => {
    info('Share Itinerary', `Copied public link for "${trip.title}" to clipboard!`);
    navigator.clipboard?.writeText(`${window.location.origin}/share/${trip.shareId || 'trip-share'}`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              My Trips Hub
            </h1>
            <Badge variant="teal" size="sm">
              {allCount} Plans
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize upcoming vacations, view completed journeys, and customize draft itineraries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="ai-subtle"
            size="sm"
            onClick={() => navigate('/plan')}
            leftIcon={<Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />}
          >
            AI Plan
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/trips/create')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create Trip
          </Button>
        </div>
      </div>

      {/* 2. FILTER TABS & CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-sand-100/80 rounded-xl border border-slate-200/70 overflow-x-auto scrollbar-thin">
          {[
            { id: 'all', label: 'All Trips', count: allCount },
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'past', label: 'Completed', count: pastCount },
            { id: 'draft', label: 'Drafts', count: draftCount },
          ].map((tab) => {
            const isActive = (filters.status || 'all') === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-terracotta-100 text-terracotta-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort, and Grid/List Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by city or title..."
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="w-full bg-white text-xs text-slate-800 rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sortBy || 'date'}
              onChange={(e) => setFilters({ sortBy: e.target.value as any })}
              className="bg-white text-xs font-medium text-slate-700 rounded-xl px-3 py-2 border border-slate-200 focus:outline-none cursor-pointer pr-8 appearance-none"
            >
              <option value="date">Sort by Date</option>
              <option value="budget">Sort by Budget</option>
              <option value="duration">Sort by Duration</option>
              <option value="title">Sort by Title</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-sand-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-sand-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. TRIPS GRID / LIST */}
      {trips.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              viewMode={viewMode}
              onDuplicate={handleDuplicate}
              onDeleteRequest={(t) => setTripToDelete(t)}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        /* 4. EMPTY STATE */
        <Card variant="flat" className="text-center py-16 px-4">
          <CardContent className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-500 mx-auto shadow-2xs">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No Trips Found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {filters.searchQuery
                  ? `No itineraries matching "${filters.searchQuery}". Try clearing search filters.`
                  : 'You do not have any trips in this category yet. Start your first journey now!'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              {filters.searchQuery ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ searchQuery: '', status: 'all' })}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/trips/create')}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Plan Your First Trip
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(tripToDelete)}
        onClose={() => setTripToDelete(null)}
        title="Delete Itinerary"
        description="Are you sure you want to delete this trip?"
      >
        {tripToDelete && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold">Permanent Action</p>
                <p className="mt-0.5">
                  Deleting <span className="font-semibold text-slate-900">"{tripToDelete.title}"</span> will remove all scheduled activities, hotels, and budget records for this itinerary.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTripToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
