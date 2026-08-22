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

// Phase 7 Pages
import { TripCalendarPage } from '@/pages/trips/TripCalendarPage';
import { TripMapPage } from '@/pages/trips/TripMapPage';

// Phase 8 Pages
import { TripBudgetPage } from '@/pages/trips/TripBudgetPage';

// Phase 9 Pages
import { AIPlannerPage } from '@/pages/planner/AIPlannerPage';

// Phase 10 Pages
import { TripAssistantPage } from '@/pages/trips/TripAssistantPage';

// Phase 11 Pages
import { ExplorePage } from '@/pages/explore/ExplorePage';
import { TripSharePage } from '@/pages/trips/TripSharePage';

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

        {/* Phase 7: Multi-Day Calendar Schedule & Interactive Journey Map */}
        <Route
          path="/trips/:tripId/calendar"
          element={
            <ProtectedRoute>
              <TripCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId/map"
          element={
            <ProtectedRoute>
              <TripMapPage />
            </ProtectedRoute>
          }
        />

        {/* Flagship AI Travel Planner Workspace (Phase 9) */}
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <AIPlannerPage />
            </ProtectedRoute>
          }
        />

        {/* Phase 8: Budget Tracker & Cost Breakdown Analytics */}
        <Route
          path="/trips/:tripId/budget"
          element={
            <ProtectedRoute>
              <TripBudgetPage />
            </ProtectedRoute>
          }
        />
        {/* Phase 10: In-Trip AI Co-Pilot */}
        <Route
          path="/trips/:tripId/assistant"
          element={
            <ProtectedRoute>
              <TripAssistantPage />
            </ProtectedRoute>
          }
        />
        {/* Phase 11: Trip Share & Privacy */}
        <Route
          path="/trips/:tripId/share"
          element={
            <ProtectedRoute>
              <TripSharePage />
            </ProtectedRoute>
          }
        />

        {/* Phase 11: Explore Hub */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
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
