import { toast } from '@/components/ui/morphing-toaster';

export interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  return {
    success: (title: string, message?: string, options?: ToastOptions) => {
      toast.success(title, {
        description: message,
        duration: options?.duration,
      });
    },
    error: (title: string, message?: string, options?: ToastOptions) => {
      toast.error(title, {
        description: message,
        duration: options?.duration,
      });
    },
    info: (title: string, message?: string, options?: ToastOptions) => {
      toast.info(title, {
        description: message,
        duration: options?.duration,
      });
    },
    warning: (title: string, message?: string, options?: ToastOptions) => {
      toast.warning(title, {
        description: message,
        duration: options?.duration,
      });
    },
  };
}
