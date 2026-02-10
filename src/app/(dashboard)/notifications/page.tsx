export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Bell, Info, CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { markNotificationsRead } from './actions';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch real notifications from Supabase
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const items = notifications || [];
  const unreadCount = items.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-6 w-6" strokeWidth={2.5} />;
      case 'success':
        return <CheckCircle className="h-6 w-6" strokeWidth={2.5} />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />;
      case 'error':
        return <AlertCircle className="h-6 w-6" strokeWidth={2.5} />;
      case 'reminder':
        return <Clock className="h-6 w-6" strokeWidth={2.5} />;
      default:
        return <Info className="h-6 w-6" strokeWidth={2.5} />;
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-400';
      case 'success':
        return 'border-green-100 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-400';
      case 'warning':
        return 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-400';
      case 'error':
        return 'border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400';
      case 'reminder':
        return 'border-purple-100 bg-purple-50 text-purple-600 dark:border-purple-900/50 dark:bg-purple-950/50 dark:text-purple-400';
      default:
        return 'border-muted bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 px-4 py-8 duration-700 md:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h2>
          <p className="text-sm font-medium text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`
              : 'Stay updated with your account activity.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markNotificationsRead}>
            <Button type="submit" variant="outline" size="sm" className="rounded-full">
              Mark all read
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg',
              !notification.is_read && 'border-primary/20 bg-primary/[0.02]'
            )}
          >
            <div className="flex gap-5">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border',
                  getIconStyles(notification.type)
                )}
              >
                {getIcon(notification.type)}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-foreground text-lg font-semibold">{notification.title}</h3>
                  {!notification.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  <span className="text-muted-foreground bg-secondary ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm">
              <Bell className="text-muted-foreground/50 h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">You're all caught up!</h3>
            <p className="mt-1 text-sm text-muted-foreground">No notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
