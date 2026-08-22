import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ToastMessage, ToastType } from '@/types/common.types';
import { Toast } from '@/components/ui/Toast';


interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastType, options?: Partial<ToastMessage>) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  ai: (title: string, description?: string) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: ToastType = 'info',
      options?: Partial<ToastMessage>
    ) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = {
        id,
        title,
        description,
        type,
        duration: options?.duration || 4500,
        action: options?.action,
        ...options,
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep at most 5 visible
      return id;
    },
    []
  );

  const success = useCallback(
    (title: string, description?: string) => showToast(title, description, 'success'),
    [showToast]
  );
  const error = useCallback(
    (title: string, description?: string) => showToast(title, description, 'error'),
    [showToast]
  );
  const info = useCallback(
    (title: string, description?: string) => showToast(title, description, 'info'),
    [showToast]
  );
  const warning = useCallback(
    (title: string, description?: string) => showToast(title, description, 'warning'),
    [showToast]
  );
  const ai = useCallback(
    (title: string, description?: string) => showToast(title, description, 'ai'),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        info,
        warning,
        ai,
        dismissToast,
        clearAllToasts,
      }}
    >
      {children}

      {/* Floating Toast Viewport */}
      <div
        aria-live="assertive"
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
