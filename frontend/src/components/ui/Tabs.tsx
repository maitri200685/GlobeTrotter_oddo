import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  variant = 'pills',
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  if (variant === 'segmented') {
    return (
      <div
        className={twMerge(
          'inline-flex p-1 bg-sand-100 rounded-xl border border-slate-200/80 gap-1',
          className
        )}
        role="tablist"
      >
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={twMerge(
                clsx(
                  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 gap-2 cursor-pointer',
                  sizeStyles[size],
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50',
                  tab.disabled && 'opacity-40 cursor-not-allowed'
                )
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                    isActive ? 'bg-terracotta-100 text-terracotta-700' : 'bg-slate-200 text-slate-700'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div
        className={twMerge(
          'flex border-b border-slate-200 gap-6 overflow-x-auto scrollbar-thin',
          className
        )}
        role="tablist"
      >
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={twMerge(
                clsx(
                  'inline-flex items-center gap-2 pb-3 font-medium transition-all duration-150 border-b-2 -mb-px whitespace-nowrap cursor-pointer',
                  sizeStyles[size],
                  isActive
                    ? 'border-terracotta-500 text-terracotta-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300',
                  tab.disabled && 'opacity-40 cursor-not-allowed'
                )
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                    isActive ? 'bg-terracotta-100 text-terracotta-700' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default pills
  return (
    <div
      className={twMerge('flex flex-wrap gap-2', className)}
      role="tablist"
    >
      {items.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={twMerge(
              clsx(
                'inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-150 cursor-pointer',
                sizeStyles[size],
                isActive
                  ? 'bg-terracotta-500 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-sand-100 border border-slate-200/80',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
