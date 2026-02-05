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
        <DashboardCard
            title="Platform Activity"
            icon={Activity}
            className="h-auto"
            variant="default"
        >
            <div className="space-y-3 mt-2">
                {events.map((event, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-[20px] bg-[#F9F9F8] border border-[#EEEEEE] hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <div className="text-[13px] text-[#444444] leading-snug">
                                <span className="font-bold text-[#222222]">{event.profiles?.first_name}</span> booked a session
                            </div>
                        </div>
                        <div className="text-[10px] text-[#999999] uppercase font-bold tracking-wider whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                     <div className="text-center py-8 text-muted-foreground text-sm italic">
                        No recent activity detected.
                     </div>
                )}
            </div>
        </DashboardCard>
    );
}
