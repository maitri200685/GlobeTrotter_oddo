import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  className,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeStyles = {
    right: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    },
    left: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    },
    bottom: {
      sm: 'max-h-[50vh]',
      md: 'max-h-[70vh]',
      lg: 'max-h-[85vh]',
      xl: 'max-h-[92vh]',
    },
  };

  const positionStyles = {
    right: 'inset-y-0 right-0 h-full border-l border-slate-200',
    left: 'inset-y-0 left-0 h-full border-r border-slate-200',
    bottom: 'inset-x-0 bottom-0 rounded-t-3xl border-t border-slate-200',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 pointer-events-none flex">
        <div
          role="dialog"
          aria-modal="true"
          className={twMerge(
            clsx(
              'pointer-events-auto fixed bg-white shadow-elevated flex flex-col w-full z-10 animate-fade-in',
              positionStyles[position],
              position === 'bottom'
                ? sizeStyles.bottom[size]
                : sizeStyles[position][size],
              className
            )
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-100 shrink-0">
              <div>
                {title && (
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
