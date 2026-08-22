import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import type { NavItem } from '@/types/navigation.types';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

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

      {/* User Profile Footer */}
      {user && (
        <div className="relative border-t border-slate-200/80 overflow-hidden bg-gradient-to-br from-terracotta-50/60 via-sand-50/80 to-amber-50/50">
          <div className="relative p-3 sm:p-4">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-full"
                  title={user.name}
                >
                  <Avatar
                    src={user.avatarUrl}
                    name={user.name}
                    size="md"
                    status="online"
                    className="ring-2 ring-white shadow-sm"
                  />
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-full"
                  title="View Profile"
                >
                  <Avatar
                    src={user.avatarUrl}
                    name={user.name}
                    size="md"
                    status="online"
                    className="ring-2 ring-white shadow-sm"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <Link
                    to="/profile"
                    className="block focus:outline-none group"
                  >
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-terracotta-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </p>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
