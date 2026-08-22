import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Globe, 
  Search, 
  Sparkles, 
  Bell, 
  Menu, 
  X, 
  Compass, 
  MapPin, 
  User as UserIcon, 
  Settings, 
  LogOut,
  ChevronDown,
  LogIn,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface AppNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, switchDemoPersona, demoPersonas } = useAuth();
  const { info, ai } = useToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    info('Searching GlobeTrotter', `Looking for destinations matching "${searchQuery}"`);
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  const handleAIMagicClick = () => {
    ai('AI Travel Planner Ready', 'Describe your dream trip in plain words!');
    navigate('/plan');
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Left: Sidebar Toggle + Brand Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                aria-label="Toggle sidebar navigation"
                className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-sand-100 transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-terracotta-500 flex items-center justify-center text-white shadow-sm group-hover:bg-terracotta-600 transition-colors">
                <Globe className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  Globe<span className="text-terracotta-500">Trotter</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase leading-tight mt-0.5 hidden sm:inline-block">
                  Personalized Travel
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search destinations (Goa, Paris, Kyoto...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-sand-50/80 hover:bg-sand-100/70 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-full pl-9 pr-4 py-2 border border-slate-200/80 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-200/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </form>
          </div>

          {/* Right: Actions, AI CTA, Notifications & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-sand-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* AI Travel Planner CTA */}
            <Button
              variant="ai-subtle"
              size="sm"
              onClick={handleAIMagicClick}
              leftIcon={<Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />}
              className="hidden sm:inline-flex"
            >
              <span>AI Planner</span>
            </Button>

            {/* Quick Plan New Trip Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/trips/create')}
              className="hidden lg:inline-flex"
            >
              <span>+ Plan Trip</span>
            </Button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsUserMenuOpen(false);
                }}
                aria-label="Notifications"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-sand-100 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta-500 ring-2 ring-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-slate-200 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</h4>
                    <span className="text-[10px] font-semibold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full">2 New</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-sand-50/80 hover:bg-sand-100/60 transition-colors cursor-pointer text-left">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <p className="text-xs font-semibold text-slate-900">AI Trip Recommendation</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Goa flight prices dropped by 15% for your dates!</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sand-50/80 hover:bg-sand-100/60 transition-colors cursor-pointer text-left">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <p className="text-xs font-semibold text-slate-900">Upcoming Itinerary</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">"Royal Rajasthan" begins in 14 days.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Menu or Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-sand-100 transition-colors cursor-pointer"
                  aria-label="User account menu"
                >
                  <Avatar 
                    name={user.name} 
                    size="sm" 
                    status="online"
                    src={user.avatarUrl}
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elevated border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full capitalize">
                          {user.preferences.budgetStyle}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-sand-100 px-2 py-0.5 rounded-full">
                          {user.preferences.preferredCurrency} (₹/$)
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sand-50 hover:text-slate-900"
                      >
                        <Compass className="w-4 h-4 text-slate-400" />
                        <span>Traveler Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sand-50 hover:text-slate-900"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile & Wishlist</span>
                      </Link>
                      <Link
                        to="/trips"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sand-50 hover:text-slate-900"
                      >
                        <Compass className="w-4 h-4 text-slate-400" />
                        <span>My Trips ({user.stats.tripsPlanned})</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sand-50 hover:text-slate-900"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Fast Persona Switcher inside Menu */}
                    <div className="pt-2 pb-1 border-t border-slate-100 px-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Switch Demo Persona
                      </p>
                      <div className="space-y-1">
                        {demoPersonas.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              switchDemoPersona(p.id);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded-lg text-[11px] font-medium flex items-center justify-between transition-colors ${
                              p.user.email === user.email
                                ? 'bg-terracotta-50 text-terracotta-700 font-bold'
                                : 'text-slate-600 hover:bg-sand-100'
                            }`}
                          >
                            <span>{p.personaName}</span>
                            <span className="text-[9px] text-slate-400">{p.user.preferences.preferredCurrency}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="py-3 border-t border-slate-100 md:hidden animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-sand-50 text-sm text-slate-800 rounded-xl pl-10 pr-10 py-2 border border-slate-200 focus:outline-none focus:border-terracotta-500"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
