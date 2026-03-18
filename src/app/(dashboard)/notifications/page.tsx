import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  InboxIcon,
  Notification01Icon,
} from '@hugeicons/core-free-icons';
import { NotificationItem } from './notification-item';
import { markNotificationsRead } from './actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .limit(50);

  const allNotifications = notifications ?? [];
  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-4 lg:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <HugeiconsIcon icon={Notification01Icon} className="size-5 text-muted-foreground" />
            Notifications
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>

        {unreadCount > 0 && (
          <form action={markNotificationsRead}>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
              Mark all read
            </Button>
          </form>
        )}
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6">
        {allNotifications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <HugeiconsIcon icon={InboxIcon} className="size-7 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold">No notifications yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                When you have upcoming sessions, new assignments, or platform
                updates, they will appear here.
              </p>
            </div>
            <Link href="/bookings">
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                View Bookings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {unreadCount > 0 && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Unread
              </p>
            )}
            {allNotifications
              .filter((n) => !n.is_read)
              .map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={{
                    id: n.id,
                    title: n.title,
                    message: n.body ?? '',
                    type: n.type ?? 'info',
                    is_read: n.is_read,
                    created_at: n.created_at,
                    link: n.action_url,
                    metadata: n.metadata,
                  }}
                />
              ))}
            {allNotifications.some((n) => n.is_read) && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Earlier
              </p>
            )}
            {allNotifications
              .filter((n) => n.is_read)
              .map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={{
                    id: n.id,
                    title: n.title,
                    message: n.body ?? '',
                    type: n.type ?? 'info',
                    is_read: n.is_read,
                    created_at: n.created_at,
                    link: n.action_url,
                    metadata: n.metadata,
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
