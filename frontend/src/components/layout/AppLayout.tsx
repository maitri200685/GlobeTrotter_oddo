import React, { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { MobileNav } from './MobileNav';
import { TripSubNav } from './TripSubNav';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const params = useParams();

  // Determine if we are inside an active trip workspace (e.g. /trips/trip-101/...)
  const isTripRoute = 
    location.pathname.startsWith('/trips/') && 
    location.pathname !== '/trips/create' && 
    location.pathname !== '/trips';

  // Certain full-page public routes don't show the sidebar (e.g. public landing or full-screen plan mode)
  const isPublicLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  const isPublicShare = location.pathname.startsWith('/share/');
  const hideSidebar = isPublicLanding || isAuthPage || isPublicShare;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col antialiased selection:bg-terracotta-100 selection:text-terracotta-900">
      {/* Top Main Navbar */}
      <AppNavbar 
        onToggleSidebar={!hideSidebar ? () => setIsSidebarCollapsed(!isSidebarCollapsed) : undefined}
        isSidebarOpen={!isSidebarCollapsed}
      />

      <div className="flex-1 flex w-full relative">
        {/* Desktop Sidebar (hidden on public/auth/share views) */}
        {!hideSidebar && (
          <AppSidebar 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          {/* Trip Sub-Navigation Header (Active Trip Viewports) */}
          {isTripRoute && (
            <TripSubNav />
          )}

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {!isAuthPage && <MobileNav />}
    </div>
  );
};
