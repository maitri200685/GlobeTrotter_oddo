import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'flat' | 'elevated' | 'ai';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  hoverable = false,
  clickable = false,
  variant = 'default',
  ...props
}, ref) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-soft',
    flat: 'bg-sand-50/60 border border-slate-200/60',
    elevated: 'bg-white border border-slate-200 shadow-elevated',
    ai: 'bg-gradient-to-br from-white via-purple-50/30 to-amber-50/30 border border-purple-200/70 shadow-soft',
  };

  return (
    <div
      ref={ref}
      className={twMerge(
        clsx(
          'rounded-2xl overflow-hidden transition-all duration-200',
          variantStyles[variant],
          hoverable && 'hover:shadow-card hover:-translate-y-0.5 hover:border-slate-300',
          clickable && 'cursor-pointer active:scale-[0.99]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div ref={ref} className={twMerge(clsx('p-5 pb-3', className))} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  ...props
}, ref) => (
  <h3 ref={ref} className={twMerge(clsx('text-lg font-bold text-slate-900 tracking-tight', className))} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  ...props
}, ref) => (
  <p ref={ref} className={twMerge(clsx('text-sm text-slate-500 mt-1', className))} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div ref={ref} className={twMerge(clsx('p-5 pt-0', className))} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div ref={ref} className={twMerge(clsx('p-5 pt-3 border-t border-slate-100 flex items-center', className))} {...props} />
));
CardFooter.displayName = 'CardFooter';
