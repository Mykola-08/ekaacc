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
            <div className="flex-1 space-y-3 mt-2">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                         {[1,2,3].map(i => <div key={i} className="h-16 bg-[#F9F9F8] rounded-[20px]" />)}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#999999] text-sm italic py-8 bg-[#F9F9F8] rounded-[24px] border border-dashed border-[#EEEEEE]">
                        No recent activity recorded.
                    </div>
                ) : (
                    activities.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-[20px] bg-[#F9F9F8] border border-[#EEEEEE] hover:border-blue-100 hover:bg-white transition-all shadow-sm">
                            <Avatar className="w-10 h-10 border border-white shadow-sm">
                                <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 font-bold text-xs">
                                    {activity.profile?.first_name?.[0] || 'P'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-[13px] text-[#222222] truncate">
                                        {activity.profile?.first_name} {activity.profile?.last_name}
                                    </span>
                                    <span className="text-[10px] text-[#999999] whitespace-nowrap">
                                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-[10px] uppercase tracking-tight",
                                        activity.mood >= 7 ? "bg-[#EEFBF3] text-[#148046]" : 
                                        activity.mood >= 4 ? "bg-[#FFF8EB] text-[#B95000]" : "bg-[#FEF2F2] text-[#D92D20]"
                                    )}>
                                        Mood: {activity.mood}/10
                                        {activity.mood >= 7 ? <TrendingUp className="w-3 h-3" /> : 
                                         activity.mood >= 4 ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
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
