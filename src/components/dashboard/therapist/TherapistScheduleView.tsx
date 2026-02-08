"use client";

import { useMemo } from 'react';
import { ListTodo, Users, CheckSquare } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { useBookingRealtime } from "@/hooks/useBookingRealtime";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { StatsCard } from '../widgets/StatsCard';
import { ScheduleTable } from '../widgets/ScheduleTable';

export function TherapistScheduleView({ schedule, profile }: { schedule: any[], profile?: any }) {
    const { t } = useLanguage();
    const router = useRouter();

    // Listen for booking updates
    useBookingRealtime(() => {
        toast.info("Schedule updated");
        router.refresh();
    });

    const stats = useMemo(() => {
        const total = schedule.length;
        const confirmed = schedule.filter(s => s.status === 'confirmed').length;
        const pending = schedule.filter(s => s.status === 'pending').length;
        return { total, confirmed, pending };
    }, [schedule]);

    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-8 animate-in fade-in duration-500">

                <DashboardHeader title={t('nav.dashboard')} />

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Bookings */}
                    <StatsCard
                        icon={ListTodo}
                        label={t('therapist.total_bookings')}
                        value={stats.total}
                        colorClass="bg-blue-50 text-blue-600"
                    />

                    {/* Pending Action */}
                    <StatsCard
                        icon={CheckSquare}
                        label={t('status.pending')}
                        value={stats.pending}
                        colorClass="bg-amber-50 text-amber-600"
                        action={stats.pending > 0 ? <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase">Action Needed</span> : undefined}
                    />

                    {/* Confirmed */}
                    <StatsCard
                        icon={Users}
                        label={t('status.confirmed')}
                        value={stats.confirmed}
                        colorClass="bg-emerald-50 text-emerald-700"
                    />
                </div>

                {/* Today's Schedule */}
                <ScheduleTable
                    schedule={schedule}
                    onAddBlock={() => router.push('/availability')}
                />
            </div>
        </DashboardLayout>
    );
}


