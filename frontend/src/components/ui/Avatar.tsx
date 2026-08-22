import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  statusColor,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (text?: string) => {
    if (!text) return 'G';
    const firstChar = text.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : 'G';
  };

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeStyles = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const statusColorMap = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  return (
    <div className={twMerge('relative inline-flex shrink-0 select-none', className)} {...props}>
      <div
        className={twMerge(
          clsx(
            'rounded-full overflow-hidden flex items-center justify-center font-bold font-sans bg-sand-200 text-slate-700 border border-slate-200/80 shadow-2xs leading-none text-center',
            sizeStyles[size]
          )
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full leading-none">
            {getInitials(name)}
          </span>
        )}
      </div>

      {status && (
        <span
          className={twMerge(
            clsx(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
              statusSizeStyles[size],
              statusColor || statusColorMap[status]
            )
          )}
        />
      )}
    </div>
  );
};
