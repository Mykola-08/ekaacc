'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { DashboardCard } from '../shared/DashboardCard';
import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RecentAdminActivity() {
  const [events, setEvents] = useState<any[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('booking')
        .select('*, profiles:profile_id(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <DashboardCard title="Platform Activity" icon={Activity} className="h-auto" variant="default">
      <div className="mt-2 space-y-3">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="bg-card border-border hover:bg-secondary/50 flex items-center justify-between rounded-xl border p-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="text-muted-foreground text-[13px] leading-snug">
                <span className="text-foreground font-semibold">{event.profiles?.first_name}</span>{' '}
                booked a session
              </div>
            </div>
            <div className="text-muted-foreground ml-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
              {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-muted-foreground py-8 text-center text-sm italic">
            No recent activity detected.
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
