import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default' 
    | 'terracotta' 
    | 'teal' 
    | 'amber' 
    | 'sky' 
    | 'success' 
    | 'danger' 
    | 'ai' 
    | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
  icon,
  ...props
}) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px] font-medium gap-1',
    sm: 'px-2.5 py-0.5 text-xs font-medium gap-1.5',
    md: 'px-3 py-1 text-xs font-semibold gap-1.5',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    neutral: 'bg-sand-100 text-slate-700 border border-sand-200',
    terracotta: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    sky: 'bg-sky-50 text-sky-700 border border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    ai: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 border border-purple-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full font-medium tracking-wide',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
