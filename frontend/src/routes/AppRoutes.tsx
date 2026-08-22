import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Public & Auth Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/profile/SettingsPage';
import { DesignSystemShowcase } from '@/pages/DesignSystemShowcase';

// Phase 3 Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { MyTripsPage } from '@/pages/trips/MyTripsPage';

// Phase 4 Pages
import { CreateTripPage } from '@/pages/trips/CreateTripPage';
import { TripOverviewPage } from '@/pages/trips/TripOverviewPage';
import { TripCitiesPage } from '@/pages/trips/TripCitiesPage';

// Phase 5 Pages
import { TripHotelsPage } from '@/pages/trips/TripHotelsPage';
import { TripActivitiesPage } from '@/pages/trips/TripActivitiesPage';

// Phase 6 Pages
import { TripItineraryPage } from '@/pages/trips/TripItineraryPage';

// Placeholders for subsequent phases
import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { 
  Sparkles, 
  MapPin, 
  Hotel, 
  Footprints, 
  Clock, 
  CalendarDays, 
  Map, 
  PieChart, 
  Share2 
} from 'lucide-react';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Landing & Showcase */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/design-system" element={<DesignSystemShowcase />} />

        {/* Public Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected User Profile & Settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard & Trips Hub (Phase 3) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MyTripsPage />
            </ProtectedRoute>
          }
        />

        {/* Phase 4: Trip Creation & Multi-City Manager */}
        <Route
          path="/trips/create"
          element={
            <ProtectedRoute>
              <CreateTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId"
          element={
            <ProtectedRoute>
              <TripOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId/cities"
          element={
            <ProtectedRoute>
              <TripCitiesPage />
            </ProtectedRoute>
          }
        />

        {/* Phase 5: Hotel Discovery & Activity Scheduler */}
        <Route
          path="/trips/:tripId/hotels"
          element={
            <ProtectedRoute>
              <TripHotelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId/activities"
          element={
            <ProtectedRoute>
              <TripActivitiesPage />
            </ProtectedRoute>
          }
        />

        {/* Phase 6: Day-by-Day Timeline Itinerary Builder */}
        <Route
          path="/trips/:tripId/builder"
          element={
            <ProtectedRoute>
              <TripItineraryPage />
            </ProtectedRoute>
          }
        />

        {/* Flagship AI Travel Planner Workspace */}
        <Route
          path="/plan"
          element={
            <PlaceholderPage
              title="AI Travel Planner Workspace"
              subtitle="Conversational intelligent travel agent with real-time reactive trip brief."
              phaseNumber={9}
              phaseName="Embedded AI Travel Planner"
              icon={<Sparkles className="w-6 h-6 text-purple-600" />}
              featuresList={[
                'Split-screen layout (Conversational chat on left, Live brief on right)',
                'Interactive chips for budget, duration, and travel vibes',
                '7-Step travel planning progress visualizer',
                'Instant editable generated trip preview card',
              ]}
              primaryActionLabel="View Sample Trip Shell"
              primaryActionPath="/trips/trip-101"
            />
          }
        />

        {/* Active Trip Workspace Views (Phases 7-10) */}
        <Route
          path="/trips/:tripId/calendar"
          element={
            <PlaceholderPage
              title="Multi-Day Calendar Schedule"
              subtitle="Multi-day grid color-coded by category (Transport, Hotel, Activity, Food)."
              phaseNumber={7}
              phaseName="Calendar, Transit & Journey Map"
              icon={<CalendarDays className="w-6 h-6" />}
              featuresList={[
                'Week & Multi-Day interactive time grid',
                'Category filters and color-coded event blocks',
                'Click-to-edit scheduled activities',
              ]}
            />
          }
        />
        <Route
          path="/trips/:tripId/map"
          element={
            <PlaceholderPage
              title="Interactive Journey Map"
              subtitle="Geographic route visualizer plotting cities, hotels, activities, and transit."
              phaseNumber={7}
              phaseName="Calendar, Transit & Journey Map"
              icon={<Map className="w-6 h-6" />}
              featuresList={[
                'Interactive map with custom pins for hotels, activities, and cities',
                'Inter-city connecting transit polylines',
                'Clickable popup cards with itinerary shortcuts',
              ]}
            />
          }
        />
        <Route
          path="/trips/:tripId/budget"
          element={
            <PlaceholderPage
              title="Trip Budget & Cost Breakdown"
              subtitle="Target Budget vs Estimated Costs with donut breakdown and budget alerts."
              phaseNumber={8}
              phaseName="Budget & Cost Analysis"
              icon={<PieChart className="w-6 h-6" />}
              featuresList={[
                'Budget health gauge (Healthy, Warning, Exceeded)',
                'Categorized Donut chart (Stays, Transport, Food, Activities)',
                'Daily expense bar chart',
                'Per-person cost split calculator',
              ]}
            />
          }
        />
        <Route
          path="/trips/:tripId/assistant"
          element={
            <PlaceholderPage
              title="In-Trip AI Assistant & Co-Pilot"
              subtitle="Ask AI to optimize budget, swap hotels, and adjust day schedules."
              phaseNumber={10}
              phaseName="In-Trip AI Assistant"
              icon={<Sparkles className="w-6 h-6 text-purple-600" />}
              featuresList={[
                'Suggested prompt chips ("Make cheaper", "Add beaches", "Relax Day 3")',
                'Structured diff review cards with cost impact',
                'One-click "Apply Changes to Trip" integration',
              ]}
            />
          }
        />
        <Route
          path="/trips/:tripId/share"
          element={
            <PlaceholderPage
              title="Share Trip & Privacy"
              subtitle="Generate public shareable links, view QR code, and manage permissions."
              phaseNumber={11}
              phaseName="Explore, Sharing & Forking"
              icon={<Share2 className="w-6 h-6" />}
              featuresList={[
                'Public link copy with one-click toast feedback',
                'Privacy toggle (Public, Unlisted, Private)',
                'QR code preview for mobile scanning',
              ]}
            />
          }
        />

        {/* Explore & Public Itineraries */}
        <Route
          path="/explore"
          element={
            <PlaceholderPage
              title="Explore Destinations & Community Trips"
              subtitle="Browse trending itineraries, travel guides, and curated trips from fellow travelers."
              phaseNumber={11}
              phaseName="Explore, Sharing & Forking"
              icon={<MapPin className="w-6 h-6" />}
              featuresList={[
                'Trending community itineraries carousel with clone counters',
                'City destination guides catalog with weather and costs',
                'Filter by budget style, region, and travel vibe',
              ]}
            />
          }
        />
        <Route
          path="/destinations/:id"
          element={
            <PlaceholderPage
              title="Destination Deep Dive Guide"
              subtitle="Complete city guide, top attractions, recommended stays, and typical daily costs."
              phaseNumber={11}
              phaseName="Explore, Sharing & Forking"
              icon={<MapPin className="w-6 h-6" />}
              featuresList={[
                'Photo gallery & best season to visit',
                'Top rated activities and neighborhood guide',
                '"Plan Trip to this City" 1-click CTA',
              ]}
            />
          }
        />
        <Route
          path="/share/:shareId"
          element={
            <PlaceholderPage
              title="Public Shared Itinerary"
              subtitle="Read-only public view with one-click 'Copy Trip to My Account' feature."
              phaseNumber={11}
              phaseName="Explore, Sharing & Forking"
              icon={<Share2 className="w-6 h-6" />}
              featuresList={[
                'High-aesthetic public presentation layout',
                'Day-by-day timeline, hotel cards, and map',
                '1-Click "Copy / Fork Trip" to clone into user account',
              ]}
            />
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
