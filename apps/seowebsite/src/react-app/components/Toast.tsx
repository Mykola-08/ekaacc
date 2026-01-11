
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'keep-react';

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
    return () => {}; // Empty cleanup function
  }, [toast.duration, handleClose]);

  const getKeepColor = () => {
    switch (toast.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden max-w-md w-full
        transition-all duration-200 ease-out transform
        ${isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : isExiting
            ? 'translate-x-full opacity-0 scale-95'
            : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <Alert
        color={getKeepColor()}
        withBg
        className="shadow-lg backdrop-blur-sm relative"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium">
              {toast.title}
            </h3>
            {toast.message && (
              <p className="mt-1 text-sm opacity-90">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium underline hover:no-underline transition-all"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-xl leading-none hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>

        {/* Progress bar for duration */}
        {toast.duration && toast.duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div
              className="h-full bg-current opacity-30 transition-all ease-linear"
              style={{
                animation: `shrink ${toast.duration}ms linear forwards`,
                width: '100%'
              }}
            />
          </div>
        )}
      </Alert>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
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
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
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
    <div className="fixed top-4 right-4 z-[100] space-y-4 pointer-events-none">
      <div className="space-y-3">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
}

