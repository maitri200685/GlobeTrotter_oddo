import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  X 
} from 'lucide-react';
import { clsx } from 'clsx';
import type { ToastMessage } from '@/types/common.types';

export interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 4500;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    ai: <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 bg-white',
    error: 'border-rose-200 bg-white',
    info: 'border-sky-200 bg-white',
    warning: 'border-amber-200 bg-white',
    ai: 'border-purple-200 bg-gradient-to-r from-white via-purple-50/20 to-pink-50/20',
  };

  return (
    <div
      role="alert"
      className={clsx(
        'w-full max-w-sm rounded-2xl p-4 shadow-elevated border flex items-start gap-3 transition-all duration-200 pointer-events-auto',
        borderStyles[toast.type],
        isClosing ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100 animate-fade-in'
      )}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 leading-snug">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 mt-2 underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
