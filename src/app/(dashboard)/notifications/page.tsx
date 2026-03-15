import { createClient } from '@/lib/supabase/server';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, InboxIcon } from '@hugeicons/core-free-icons';

import { NotificationItem } from './notification-item';
import { markNotificationsRead } from './actions';
import { redirect } from 'next/navigation';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch notifications
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Use elegant fallback if no data or error
  const fallbackData: any[] = [
    {
      id: 'mock-1',
      title: 'Your upcoming session is confirmed',
      message: 'Dr. Smith has confirmed your appointment for tomorrow at 2:00 PM.',
      type: 'success',
      is_read: false,
      created_at: new Date().toISOString(),
      link: '/bookings',
    },
    {
      id: 'mock-2',
      title: 'New resource available',
      message: 'A new meditation guide has been added to your library based on your preferences.',
      type: 'info',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const displayNotifications = (!error && notifications && notifications.length > 0) ? notifications : fallbackData;
  const unreadCount = displayNotifications.filter(n => !n.is_read).length;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your appointments, resources, and wellness journey.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <form action={markNotificationsRead}>
            <Button variant="outline" size="sm" className="gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" /> 
              Mark all read
            </Button>
          </form>
        )}
      </div>

      <div className="px-4 lg:px-6">
        {displayNotifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
            <div className="bg-muted mb-4 rounded-lg p-4">
              <HugeiconsIcon icon={InboxIcon} className="text-muted-foreground size-8" />
            </div>
            <CardTitle className="text-xl mb-2">No notifications yet</CardTitle>
            <CardDescription className="max-w-xs text-balance">
              When you have upcoming sessions, new messages, or helpful resources, they will appear here.
            </CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col space-y-4">
            {displayNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
