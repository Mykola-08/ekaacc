export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  // Mock notifications for now
  const notifications = [
    {
      id: 1,
      title: 'Welcome to EKA Balance',
      message: "We're glad to have you here. Start by exploring our wellness services.",
      type: 'info',
      date: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Profile Updated',
      message: 'Your profile information was successfully updated.',
      type: 'success',
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <DashboardLayout profile={profile}>
      <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-700">
        <DashboardHeader
          title="Notifications"
          subtitle="Stay updated with your account activity."
        />

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="group relative overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex gap-5">
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border',
                    notification.type === 'info' && 'border-blue-100 bg-blue-50 text-blue-600',
                    notification.type === 'success' &&
                      'border-green-100 bg-green-50 text-green-600',
                    notification.type === 'warning' && 'border-amber-100 bg-amber-50 text-amber-600'
                  )}
                >
                  {notification.type === 'info' && <Info className="h-6 w-6" strokeWidth={2.5} />}
                  {notification.type === 'success' && (
                    <CheckCircle className="h-6 w-6" strokeWidth={2.5} />
                  )}
                  {notification.type === 'warning' && (
                    <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-foreground text-lg font-semibold">{notification.title}</h3>
                    <span className="text-muted-foreground bg-secondary rounded-full px-2 py-0.5 text-xs font-medium">
                      {new Date(notification.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#EAEAEA] bg-[#F9F9F8] py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Bell className="text-muted-foreground/50 h-8 w-8" />
              </div>
              <p className="text-muted-foreground font-medium">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
