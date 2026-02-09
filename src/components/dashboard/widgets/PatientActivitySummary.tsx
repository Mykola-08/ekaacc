'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Minus, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { DashboardCard } from '../shared/DashboardCard';
import { useRouter } from 'next/navigation';

export function PatientActivitySummary({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      // 1. Get unique user_ids from recent bookings for this therapist
      const { data: recentPatients } = await supabase
        .from('booking')
        .select('user_id')
        .eq('staff_id', userId)
        .limit(20);

      if (!recentPatients || recentPatients.length === 0) {
        setLoading(false);
        return;
      }

      const uniqueUserIds = [...new Set(recentPatients.map((p: any) => p.user_id))];

      // 2. Fetch recent mood check-ins for these patients
      const { data: moodData } = await supabase
        .from('mood_tracking')
        .select('*, profile:user_id(first_name, last_name)')
        .in('user_id', uniqueUserIds)
        .order('created_at', { ascending: false })
        .limit(5);

      if (moodData) setActivities(moodData);
      setLoading(false);
    };

    fetchActivity();
  }, [userId]);

  return (
    <DashboardCard
      title="Recent Patient Activity"
      icon={MessageSquare}
      actionLabel="View All Logs"
      onAction={() => {}} // TODO: Navigate to logs
      className="h-full"
    >
      <div className="mt-2 flex-1 space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-secondary h-16 rounded-xl" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-muted-foreground bg-secondary border-border flex h-full flex-col items-center justify-center rounded-xl border border-dashed py-8 text-sm italic">
            No recent activity recorded.
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div
              key={idx}
              className="bg-card border-border hover:border-primary/20 hover:bg-card flex items-start gap-3 rounded-xl border p-3 shadow-sm transition-all"
            >
              <Avatar className="h-10 w-10 border border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-xs font-bold text-blue-600">
                  {activity.profile?.first_name?.[0] || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-foreground truncate text-[13px] font-bold">
                    {activity.profile?.first_name} {activity.profile?.last_name}
                  </span>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold tracking-tight uppercase',
                      activity.mood >= 7
                        ? 'bg-emerald-50 text-emerald-700'
                        : activity.mood >= 4
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-destructive'
                    )}
                  >
                    Mood: {activity.mood}/10
                    {activity.mood >= 7 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : activity.mood >= 4 ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
}
