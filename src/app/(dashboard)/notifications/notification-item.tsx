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
        'group border-border bg-card relative overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-0.5',
        !notification.is_read && 'border-primary/20 bg-primary/2',
        notification.link && 'cursor-pointer',
        isPending && 'opacity-60'
      )}
    >
      <div className="flex gap-5">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border',
            styleMap[notification.type] || 'border-muted bg-muted text-muted-foreground'
          )}
        >
          {iconMap[notification.type] || <Info className="h-6 w-6" strokeWidth={2.5} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-lg font-semibold">{notification.title}</h3>
            {!notification.is_read && <span className="bg-primary h-2 w-2 rounded-full" />}
            <span className="text-muted-foreground bg-secondary ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
              {new Date(notification.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed font-medium">
            {notification.message}
          </p>
        </div>
        <div className="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
            className="text-destructive hover:text-destructive h-8 w-8"
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
