import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  MapPin, 
  Bookmark, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import type { NavItem } from '@/types/navigation.types';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', iconName: 'LayoutDashboard' },
    { id: 'trips', label: 'My Trips', href: '/trips', iconName: 'Compass', badge: '4' },
    { id: 'plan', label: 'AI Planner', href: '/plan', iconName: 'Sparkles', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'explore', label: 'Explore Cities', href: '/explore', iconName: 'MapPin' },
    { id: 'saved', label: 'Saved Places', href: '/saved', iconName: 'Bookmark' },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'profile', label: 'Profile', href: '/profile', iconName: 'User' },
    { id: 'settings', label: 'Settings', href: '/settings', iconName: 'Settings' },
  ];

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'MapPin': return <MapPin className={className} />;
      case 'Bookmark': return <Bookmark className={className} />;
      case 'User': return <User className={className} />;
      case 'Settings': return <Settings className={className} />;
      default: return <Compass className={className} />;
    }
  };

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 z-30 shrink-0 select-none relative',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3.5 top-6 z-20 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-sand-50 transition-transform active:scale-95 cursor-pointer"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-thin">
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Navigation
            </p>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all group',
                    isActive
                      ? 'bg-terracotta-50 text-terracotta-600 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-sand-50',
                    isCollapsed && 'justify-center px-2'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={clsx(
                        'shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-terracotta-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    >
                      {getIcon(item.iconName, 'w-5 h-5')}
                    </span>

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={clsx(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold',
                          item.badgeColor || (isActive ? 'bg-terracotta-200 text-terracotta-800' : 'bg-slate-100 text-slate-600')
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Action Widget */}
        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-terracotta-50/70 via-sand-50 to-amber-50/50 border border-terracotta-100">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-4 h-4 text-terracotta-600" />
              <h4 className="text-xs font-bold text-slate-900">Trip Tip</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              Goa & Kerala are trending for sunset beach retreats this month.
            </p>
            <NavLink
              to="/trips/create"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Trip</span>
            </NavLink>
          </div>
        )}

        <div>
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Preferences
            </p>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all group',
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-sand-50',
                    isCollapsed && 'justify-center px-2'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={clsx(
                        'shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    >
                      {getIcon(item.iconName, 'w-5 h-5')}
                    </span>
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};
