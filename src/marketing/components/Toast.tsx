'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    toast: {
      success: (title: string, message?: string, options?: Partial<Toast>) => void;
      error: (title: string, message?: string, options?: Partial<Toast>) => void;
      info: (title: string, message?: string, options?: Partial<Toast>) => void;
      warning: (title: string, message?: string, options?: Partial<Toast>) => void;
    };
  }
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastComponent({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  }, [toast.id, onClose]);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => handleClose(), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  const getVariantStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const progressBarColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'info':
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full max-w-md transform items-start gap-3 overflow-hidden rounded-lg border p-4 backdrop-blur-sm transition duration-300 ease-out',
        getVariantStyles(),
        isVisible && !isExiting
          ? 'translate-x-0 scale-100 opacity-100'
          : 'translate-x-full scale-95 opacity-0'
      )}
    >
      <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>

      <div className="min-w-0 flex-1">
        <h3 className="pr-6 text-sm font-medium">{toast.title}</h3>
        {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
        {toast.action && (
          <div className="mt-3">
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline transition hover:no-underline"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleClose}
        className="absolute top-4 right-4 rounded-full p-0.5 text-current opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar for duration */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/5">
          <div
            className={cn('h-full transition ease-out', progressBarColor())}
            style={{
              width: isVisible && !isExiting ? '0%' : '100%',
              transitionDuration: `${toast.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Global toast function
  useEffect(() => {
    window.toast = {
      success: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'success', title, message, ...options }),
      error: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'error', title, message, ...options }),
      info: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'info', title, message, ...options }),
      warning: (title: string, message?: string, options?: Partial<Toast>) =>
        addToast({ type: 'warning', title, message, ...options }),
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100]">
      <div className="">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
}
