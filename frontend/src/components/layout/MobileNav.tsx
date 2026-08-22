import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, MapPin, User } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Trips', href: '/trips', icon: Compass },
    { label: 'AI Plan', href: '/plan', icon: Sparkles, isPrimary: true },
    { label: 'Explore', href: '/explore', icon: MapPin },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-elevated safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.isPrimary) {
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center">
                    <div
                      className={clsx(
                        'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-card transition-all duration-200 group-hover:scale-105 active:scale-95',
                        isActive
                          ? 'bg-gradient-to-tr from-purple-600 to-terracotta-500 ring-4 ring-purple-100'
                          : 'bg-gradient-to-tr from-terracotta-500 to-amber-500'
                      )}
                    >
                      <Icon className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-0.5">
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all',
                  isActive
                    ? 'text-terracotta-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                  <span className="text-[10px] mt-1 font-medium tracking-tight">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
