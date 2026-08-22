import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Hotel, 
  Footprints, 
  CalendarDays, 
  Map, 
  PieChart, 
  Share2, 
  Compass, 
  Check, 
  AlertCircle, 
  Plus, 
  SlidersHorizontal,
  ArrowRight,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/context/ToastContext';

export const DesignSystemShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, success, error, warning, info, ai } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [inputValue, setInputValue] = useState('Goa, India');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const tabItems = [
    { id: 'overview', label: 'All Primitives', icon: <Layers className="w-4 h-4" /> },
    { id: 'buttons', label: 'Buttons & Badges', badge: '12' },
    { id: 'forms', label: 'Form Controls' },
    { id: 'dialogs', label: 'Modals & Drawers' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-amber-600 text-white shadow-card overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 1 Milestone Complete</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            GlobeTrotter Design System & Core Shell
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Welcome to the frontend architecture foundation. The light-first travel design tokens, responsive layouts, UI primitives, and React Router navigation map are live and ready for feature milestones.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/plan')}
              leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
            >
              Explore AI Planner Route
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              onClick={() => navigate('/trips/trip-101/builder')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Active Trip Shell
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-200/80 pb-4">
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="segmented"
        />

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="sm">
            Tailwind 4 Ready
          </Badge>
          <Badge variant="terracotta" size="sm">
            TypeScript Strict
          </Badge>
        </div>
      </div>

      {/* SECTION 1: Buttons, Badges & Travel Color Tokens */}
      {(activeTab === 'overview' || activeTab === 'buttons') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Buttons & Travel Theme Palette</h2>
              <p className="text-xs text-slate-500">Curated warm travel colors (Terracotta, Sea Teal, Amber Gold, Sky Blue, Sand Base).</p>
            </div>
          </div>

          <Card variant="default">
            <CardContent className="p-6 space-y-6">
              {/* Button Variants */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Button Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary (Terracotta)</Button>
                  <Button variant="secondary">Secondary (Sand)</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="teal">Teal (Nature)</Button>
                  <Button variant="amber">Amber (Hotels)</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ai-subtle" leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}>
                    AI Subtle
                  </Button>
                  <Button variant="primary" isLoading>
                    Loading
                  </Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Button Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Extra Small (xs)</Button>
                  <Button size="sm">Small (sm)</Button>
                  <Button size="md">Medium (md)</Button>
                  <Button size="lg">Large (lg)</Button>
                </div>
              </div>

              {/* Travel Category Badges */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Category Badges</h4>
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="terracotta" icon={<MapPin className="w-3.5 h-3.5" />}>Destinations & Cities</Badge>
                  <Badge variant="teal" icon={<Footprints className="w-3.5 h-3.5" />}>Nature & Activities</Badge>
                  <Badge variant="amber" icon={<Hotel className="w-3.5 h-3.5" />}>Hotels & Stays</Badge>
                  <Badge variant="sky" icon={<Compass className="w-3.5 h-3.5" />}>Transit & Flights</Badge>
                  <Badge variant="success" icon={<Check className="w-3.5 h-3.5" />}>Budget: Under Limit (₹35k)</Badge>
                  <Badge variant="danger" icon={<AlertCircle className="w-3.5 h-3.5" />}>Budget: Exceeded by ₹4k</Badge>
                  <Badge variant="ai" icon={<Sparkles className="w-3.5 h-3.5" />}>98% AI Match</Badge>
                  <Badge variant="neutral">Draft Status</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 2: Form Controls (Input & Select) */}
      {(activeTab === 'overview' || activeTab === 'forms') && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">2. Accessible Form Controls</h2>
            <p className="text-xs text-slate-500">Styled inputs, selects, error states, helper texts, and icon slots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Input Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Destination City"
                  placeholder="e.g. Goa, Paris, Kyoto"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  helperText="Enter your dream destination"
                />

                <Input
                  label="Estimated Budget"
                  placeholder="₹35,000"
                  leftIcon={<span className="text-xs font-bold">₹</span>}
                />

                <Input
                  label="Validation Error State"
                  defaultValue="Invalid dates"
                  error="End date cannot be earlier than start date"
                />
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Select Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Preferred Currency"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  options={[
                    { value: 'INR', label: '₹ INR — Indian Rupee' },
                    { value: 'USD', label: '$ USD — US Dollar' },
                    { value: 'EUR', label: '€ EUR — Euro' },
                    { value: 'GBP', label: '£ GBP — British Pound' },
                  ]}
                  helperText="Default currency for trip budgeting"
                />

                <Select
                  label="Travel Style"
                  options={[
                    { value: 'backpacker', label: '🎒 Backpacker / Hostels' },
                    { value: 'comfort', label: '✨ Boutique Comfort' },
                    { value: 'luxury', label: '💎 Luxury & Heritage' },
                    { value: 'family', label: '👨‍👩‍👧‍👦 Family Friendly' },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SECTION 3: Dialogs, Drawers & Interactive Toasts */}
      {(activeTab === 'overview' || activeTab === 'dialogs') && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">3. Modals, Drawers & Notification System</h2>
            <p className="text-xs text-slate-500">Accessible popups with backdrop blur and smooth entrance animations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Modals & Drawers</CardTitle>
                <CardDescription>Click below to test dialog components.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Open Trip Modal
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsDrawerOpen(true)}
                  leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                >
                  Open Filter Drawer
                </Button>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Toast Notifications</CardTitle>
                <CardDescription>Trigger animated travel alerts in the viewport.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => success('Trip Saved!', 'Your 7-day Goa itinerary has been updated.')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => error('Budget Alert', 'Accommodations exceed target by ₹3,200.')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => warning('Flight Alert', 'Only 2 seats remaining at current price.')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="ai-subtle"
                  size="sm"
                  onClick={() => ai('AI Optimization Ready', 'We found a way to save ₹2,400 on hotel stays.')}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                >
                  AI Toast
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SECTION 4: Skeletons & Avatars */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">4. Loading Skeletons & Avatars</h2>
            <p className="text-xs text-slate-500">Smooth shimmer placeholders and user avatars with status rings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Avatar States</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4 flex-wrap">
                <Avatar
                  name="Aarav Mehta"
                  size="xl"
                  status="online"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                />
                <Avatar name="Priya Sharma" size="lg" status="online" />
                <Avatar name="Rohan V" size="md" status="away" />
                <Avatar name="Elena R" size="sm" status="busy" />
                <Avatar name="GT" size="xs" />
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Skeleton Placeholders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={60} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Interactive Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Trip Stop"
        description="Add a city destination to your active journey."
      >
        <div className="space-y-4">
          <Input
            label="City Name"
            placeholder="e.g. South Goa Beach Haven"
            defaultValue="Goa, India"
            leftIcon={<MapPin className="w-4 h-4" />}
          />
          <Select
            label="Stay Duration"
            options={[
              { value: '2', label: '2 Days / 1 Night' },
              { value: '3', label: '3 Days / 2 Nights' },
              { value: '5', label: '5 Days / 4 Nights' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                success('City Added', 'Goa has been added to your route!');
                setIsModalOpen(false);
              }}
            >
              Add City to Trip
            </Button>
          </div>
        </div>
      </Modal>

      {/* Interactive Drawer Component */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filter Destinations"
        description="Narrow down places by region, budget, and travel vibe."
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Region</h4>
            <div className="flex flex-wrap gap-2">
              {['All Regions', 'India', 'Southeast Asia', 'Europe', 'Japan'].map((region, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-sand-50 hover:bg-terracotta-50 hover:text-terracotta-700 border border-slate-200 transition-colors"
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Vibe / Category</h4>
            <div className="flex flex-wrap gap-2">
              {['🏖️ Beaches', '🏔️ Mountains', '🏛️ Heritage', '🍜 Food & Nightlife', '🌿 Nature'].map((vibe, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-sand-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 transition-colors"
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                info('Filters Applied', 'Showing 14 matched destinations.');
                setIsDrawerOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
