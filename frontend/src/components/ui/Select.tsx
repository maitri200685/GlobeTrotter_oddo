import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { SelectOption } from '@/types/common.types';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helperText,
  error,
  options,
  className,
  containerClassName,
  id,
  leftIcon,
  disabled,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className={twMerge('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-slate-700 tracking-wide uppercase"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={twMerge(
            clsx(
              'w-full appearance-none bg-white border text-slate-800 text-sm rounded-xl py-2.5 pr-10 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300/90 hover:border-slate-400 focus:border-terracotta-500 focus:ring-terracotta-200/60',
              className
            )
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="text-xs font-medium text-red-600 mt-0.5 animate-fade-in">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${selectId}-helper`} className="text-xs text-slate-500 mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
