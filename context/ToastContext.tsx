'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastData, ToastType } from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (
    type: ToastType,
    message: string,
    description?: string,
    duration?: number
  ) => void;
  success: (message: string, description?: string, duration?: number) => void;
  error: (message: string, description?: string, duration?: number) => void;
  warning: (message: string, description?: string, duration?: number) => void;
  info: (message: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      description?: string,
      duration: number = 5000
    ) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: ToastData = {
        id,
        type,
        message,
        description,
        duration,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('success', message, description, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('error', message, description, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('warning', message, description, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('info', message, description, duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
