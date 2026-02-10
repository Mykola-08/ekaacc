'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  InformationCircleIcon,
  Alert02Icon,
  Loading03Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

/**
 * MorphingToaster — A global notification system that shows morphing
 * status bars instead of popup toasts. Drop-in replacement for Sonner Toaster.
 *
 * Usage: Place <MorphingToaster /> in root layout. Then use:
 *   import { morphToast } from '@/components/ui/morphing-toaster';
 *   morphToast.success('Saved!');
 *   morphToast.error('Something went wrong');
 */

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface MorphNotification {
  id: string;
  type: NotificationType;
  message: string;
  description?: string;
  duration: number;
  createdAt: number;
}

const TYPE_CONFIG: Record<NotificationType, {
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  progressColor: string;
}> = {
  success: {
    icon: CheckmarkCircle02Icon,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-50/95 dark:bg-emerald-950/90',
    borderColor: 'border-emerald-200/60 dark:border-emerald-800/40',
    progressColor: 'bg-emerald-500/30',
  },
  error: {
    icon: AlertCircleIcon,
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-50/95 dark:bg-red-950/90',
    borderColor: 'border-red-200/60 dark:border-red-800/40',
    progressColor: 'bg-red-500/30',
  },
  warning: {
    icon: Alert02Icon,
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-50/95 dark:bg-amber-950/90',
    borderColor: 'border-amber-200/60 dark:border-amber-800/40',
    progressColor: 'bg-amber-500/30',
  },
  info: {
    icon: InformationCircleIcon,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50/95 dark:bg-blue-950/90',
    borderColor: 'border-blue-200/60 dark:border-blue-800/40',
    progressColor: 'bg-blue-500/30',
  },
  loading: {
    icon: Loading03Icon,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/95',
    borderColor: 'border-border',
    progressColor: 'bg-primary/20',
  },
};

// --- Global state manager ---
type Listener = () => void;
let notifications: MorphNotification[] = [];
let listeners: Set<Listener> = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function addNotification(type: NotificationType, message: string, options?: { description?: string; duration?: number }) {
  const id = `morph-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const duration = options?.duration ?? (type === 'error' ? 5000 : type === 'loading' ? 0 : 3000);
  
  const notification: MorphNotification = {
    id,
    type,
    message,
    description: options?.description,
    duration,
    createdAt: Date.now(),
  };

  // Max 3 visible at once, remove oldest
  if (notifications.length >= 3) {
    notifications = notifications.slice(-2);
  }
  
  notifications = [...notifications, notification];
  emit();

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
}

function removeNotification(id: string) {
  notifications = notifications.filter((n) => n.id !== id);
  emit();
}

function dismissAll() {
  notifications = [];
  emit();
}

// Public API — drop-in replacement for `toast` from sonner
export const morphToast = {
  success: (message: string, options?: { description?: string; duration?: number }) =>
    addNotification('success', message, options),
  error: (message: string, options?: { description?: string; duration?: number }) =>
    addNotification('error', message, options),
  warning: (message: string, options?: { description?: string; duration?: number }) =>
    addNotification('warning', message, options),
  info: (message: string, options?: { description?: string; duration?: number }) =>
    addNotification('info', message, options),
  loading: (message: string, options?: { description?: string; duration?: number }) =>
    addNotification('loading', message, { ...options, duration: options?.duration ?? 0 }),
  dismiss: (id?: string) => {
    if (id) removeNotification(id);
    else dismissAll();
  },
  // Compatibility with sonner toast() call pattern
  message: (message: string, options?: { description?: string; duration?: number }) =>
    addNotification('info', message, options),
};

// Also export as default function for `toast('message')` style
export function toast(message: string, options?: { description?: string; duration?: number }) {
  return addNotification('info', message, options);
}
toast.success = morphToast.success;
toast.error = morphToast.error;
toast.warning = morphToast.warning;
toast.info = morphToast.info;
toast.loading = morphToast.loading;
toast.dismiss = morphToast.dismiss;
toast.message = morphToast.message;

function useNotifications() {
  const [, rerender] = React.useState(0);

  React.useEffect(() => {
    const listener = () => rerender((c) => c + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return notifications;
}

// --- Component ---
function MorphNotificationItem({ notification, onDismiss }: { notification: MorphNotification; onDismiss: () => void }) {
  const config = TYPE_CONFIG[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
        config.bgColor,
        config.borderColor,
      )}
      style={{ maxWidth: 380 }}
    >
      {/* Progress bar for timed notifications */}
      {notification.duration > 0 && (
        <motion.div
          className={cn('absolute bottom-0 left-0 h-0.5', config.progressColor)}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: notification.duration / 1000, ease: 'linear' }}
        />
      )}

      <HugeiconsIcon
        icon={config.icon}
        className={cn(
          'mt-0.5 size-[18px] shrink-0',
          config.color,
          notification.type === 'loading' && 'animate-spin'
        )}
      />

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium leading-snug', config.color)}>
          {notification.message}
        </p>
        {notification.description && (
          <p className={cn('mt-0.5 text-xs opacity-80', config.color)}>
            {notification.description}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className={cn(
          'shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100',
          config.color
        )}
      >
        <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
      </button>
    </motion.div>
  );
}

/**
 * MorphingToaster — Render once in root layout.
 * Shows morphing notifications as a stack at the bottom-right.
 */
export function MorphingToaster() {
  const items = useNotifications();

  return (
    <div
      className="pointer-events-none fixed right-0 bottom-0 z-[100] flex flex-col items-end gap-2 p-4 sm:p-6"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {items.map((n) => (
          <MorphNotificationItem
            key={n.id}
            notification={n}
            onDismiss={() => removeNotification(n.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
