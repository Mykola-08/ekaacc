'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, AlertTriangle, AlertCircle, Clock, Check, Trash2 } from 'lucide-react';
import { markNotificationRead, deleteNotification } from './actions';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string | null;
  metadata?: Record<string, unknown> | null;
}

const iconMap: Record<string, React.ReactNode> = {
  info: <Info className="h-6 w-6" strokeWidth={2.5} />,
  success: <CheckCircle className="h-6 w-6" strokeWidth={2.5} />,
  warning: <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />,
  error: <AlertCircle className="h-6 w-6" strokeWidth={2.5} />,
  reminder: <Clock className="h-6 w-6" strokeWidth={2.5} />,
};

const styleMap: Record<string, string> = {
  info: 'border-primary/20 bg-primary/5 text-primary',
  success: 'border-success bg-success text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  error: 'border-destructive bg-destructive/10 text-destructive',
  reminder: 'border-primary/20 bg-muted text-primary',
};

export function NotificationItem({ notification }: { notification: Notification }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!notification.is_read) {
      startTransition(() => markNotificationRead(notification.id));
    }
    const link = notification.link || (notification.metadata as Record<string, string>)?.link;
    if (link) {
      router.push(link);
    }
  };

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => markNotificationRead(notification.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => deleteNotification(notification.id));
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group border-border bg-card relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
        !notification.is_read ? 'border-primary/20 bg-primary/[0.02]' : 'shadow-sm',
        notification.link && 'cursor-pointer',
        isPending && 'opacity-60 pointer-events-none'
      )}
    >
      <div className="flex gap-4 sm:gap-5">
        <div
          className={cn(
            'flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform duration-300 group-hover:scale-105',
            styleMap[notification.type] || 'border-muted bg-muted text-muted-foreground'
          )}
        >
          {iconMap[notification.type] || <Info className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-base sm:text-lg font-semibold tracking-tight text-balance">
                {notification.title}
              </h3>
              {!notification.is_read && <span className="bg-primary h-2 w-2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />}
            </div>
            <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
              {new Date(notification.created_at).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', year: 'numeric' 
              })}
            </span>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl text-pretty">
            {notification.message}
          </p>
        </div>
        <div className="flex shrink-0 flex-col sm:flex-row items-center sm:items-start gap-1 sm:opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full"
              onClick={handleMarkRead}
              disabled={isPending}
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full"
            onClick={handleDelete}
            disabled={isPending}
            title="Delete notification"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
