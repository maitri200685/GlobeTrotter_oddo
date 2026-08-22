import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai-subtle' | 'teal' | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold gap-2',
    lg: 'px-5 py-2.5 text-base font-semibold gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm hover:shadow focus-visible:ring-terracotta-500 border border-transparent',
    secondary: 'bg-sand-100 hover:bg-sand-200 text-slate-800 focus-visible:ring-slate-400 border border-slate-200/80',
    outline: 'bg-white hover:bg-sand-50 text-slate-700 border border-slate-300 focus-visible:ring-slate-400 shadow-2xs hover:border-slate-400',
    ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-700 focus-visible:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-red-500 border border-transparent',
    'ai-subtle': 'bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 hover:from-purple-100 hover:to-amber-100 text-purple-900 border border-purple-200/80 shadow-2xs focus-visible:ring-purple-400',
    teal: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm focus-visible:ring-teal-500 border border-transparent',
    amber: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm focus-visible:ring-amber-500 border border-transparent',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
