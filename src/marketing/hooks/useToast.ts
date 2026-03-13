import type { Toast } from '@/marketing/components/Toast';

type ToastApi = {
  success?: (title: string, message?: string, options?: Partial<Toast>) => void;
  error?: (title: string, message?: string, options?: Partial<Toast>) => void;
  info?: (title: string, message?: string, options?: Partial<Toast>) => void;
  warning?: (title: string, message?: string, options?: Partial<Toast>) => void;
};

type ToastWindow = Window & { toast?: ToastApi };

export function useToast() {
  const toastApi = typeof window !== 'undefined' ? (window as ToastWindow).toast : undefined;

  return {
    success: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi?.success?.(title, message, options),
    error: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi?.error?.(title, message, options),
    info: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi?.info?.(title, message, options),
    warning: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi?.warning?.(title, message, options),
  };
}
