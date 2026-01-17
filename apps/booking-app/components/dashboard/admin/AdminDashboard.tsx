'use client';

import { DashboardLayout } from '../DashboardLayout';
import { DashboardHeader } from '../DashboardHeader';
import { Users, Activity, TrendingUp } from "lucide-react";
import { StatsCard } from '../widgets/StatsCard';

export function AdminDashboard({ profile, stats }: any) {
    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-8 animate-in fade-in">
                <DashboardHeader title="Admin Console" subtitle="System Overview" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard icon={Users} label="Total Users" value={stats?.users_total || 0} colorClass="bg-blue-50 text-blue-600" />
                    <StatsCard icon={TrendingUp} label="Revenue MTD" value={`€${stats?.revenue_mtd || 0}`} colorClass="bg-emerald-50 text-emerald-600" />
                    <StatsCard icon={Activity} label="Active Plans" value={stats?.active_plans || 0} colorClass="bg-purple-50 text-purple-600" />
                </div>

                <div className="p-8 bg-card rounded-[32px] border border-border text-center text-muted-foreground">
                    Admin Chart Widgets Coming Soon
                </div>
            </div>
        </DashboardLayout>
    );
}
