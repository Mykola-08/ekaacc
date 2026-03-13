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
        return 'border-primary/20 bg-primary/5 text-primary';
      case 'success':
        return 'border-success bg-success text-success   ';
      case 'warning':
        return 'border-warning/20 bg-warning/10 text-warning   ';
      case 'error':
        return 'border-destructive bg-destructive/10 text-destructive   ';
      case 'reminder':
        return 'border-primary/20 bg-muted text-primary';
      default:
        return 'border-muted bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <div className="">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground text-sm font-medium">
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

      <div className="">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'group border-border bg-card relative overflow-hidden rounded-lg border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-sm',
              !notification.is_read && 'border-primary/20 bg-primary/2'
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
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
            <div className="bg-card mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm">
              <Bell className="text-muted-foreground/50 h-8 w-8" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">You're all caught up!</h3>
            <p className="text-muted-foreground mt-1 text-sm">No notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
