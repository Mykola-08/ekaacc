'use client';

// Morphing toast adapter — replaces the old Radix-based toast system
// with morphing notifications. All callers get animated morphing feedback
// instead of popup toasts.
import { toast as morphToast } from '@/components/ui/morphing-toaster';
import * as React from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactNode;
  duration?: number;
}

type ToastActionElement = React.ReactElement;

function toast(props: ToastProps & { id?: string }) {
  const { title, description, variant, duration } = props;
  const message = title || description || '';
  const desc = title && description ? description : undefined;

  if (variant === 'destructive') {
    return morphToast.error(message, { description: desc, duration });
  }

  return morphToast.success(message, { description: desc, duration });
}

function useToast() {
  return {
    toast,
    toasts: [] as any[],
    dismiss: (id?: string) => morphToast.dismiss(id),
  };
}

export { useToast, toast };
export type { ToastProps, ToastActionElement };
