import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Bell, 
  Menu, 
  Compass, 
  MapPin, 
  User as UserIcon, 
  Settings, 
  LogOut,
  ChevronDown,
  LogIn
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
  const { user, isAuthenticated, logout, switchDemoPersona, demoPersonas } = useAuth();
  const { ai } = useToast();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
              <div className="w-9 h-9 rounded-xl bg-terracotta-500 flex items-center justify-center shadow-sm group-hover:bg-terracotta-600 transition-colors overflow-visible">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[22px] h-[22px] transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                  <defs>
                    <mask id="pinHole">
                      <rect width="24" height="24" fill="white"/>
                      <circle cx="12" cy="9" r="6.5" fill="black"/>
                    </mask>
                  </defs>
                  <path d="M12 1.5c-4.14 0-7.5 3.36-7.5 7.5 0 3.87 3.83 8.72 5.93 11.26.42.51 1.03.81 1.68.81.65 0 1.26-.3 1.68-.81C15.67 17.72 19.5 12.87 19.5 9c0-4.14-3.36-7.5-7.5-7.5z" fill="white" mask="url(#pinHole)"/>
                  <circle cx="12" cy="9" r="6.5" fill="white"/>
                  <path d="M6.8 12.95c.6-1.7 2.35-4.35 4.45-4.35 1.4 0 2.7.8 3.25 2 .2.4.55.7.95.85l2.55.95" stroke="#C94331" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                  <path d="M15.75 9.32l1.97-.66a.38.38 0 0 0 .24-.48l-.34-.92a.38.38 0 0 0-.48-.24l-1.97.66-1.08-1.56a.38.38 0 0 0-.58-.1l-.59.45a.38.38 0 0 0-.1.57l.93 1.34-1.22.41a.38.38 0 0 0-.24.47l.18.53c.07.22.32.34.54.26l1.21-.4-.93 1.34a.38.38 0 0 0 .1.57l.59.45c.21.16.49.13.67-.07l1.12-1.61z" fill="#C94331" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  Globe<span className="text-terracotta-500">Trotter</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Spacer to balance layout now that search is removed */}
          <div className="hidden md:flex flex-1" />

          {/* Right: Actions, AI CTA, Notifications & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
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
      </div>
    </header>
  );
};
