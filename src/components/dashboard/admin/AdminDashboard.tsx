'use client';

import {
  Users,
  Folder,
  DollarSign,
  Activity,
} from 'lucide-react';
import { MetricCard, QuickLink } from '@/components/dashboard/shared';

export function AdminDashboard({ profile, stats }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 px-4 py-8 duration-500 md:px-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Admin Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          System status and key metrics at a glance.
        </p>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
          <span className="relative h-2 w-2 rounded-full bg-emerald-500">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          </span>
          <span className="text-sm font-medium text-foreground">System Healthy</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Active Users: </span>
          <span className="font-semibold text-foreground">{stats?.users_total || 0}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Users} label="Total Users" value={stats?.users_total || 0} />
        <MetricCard icon={Folder} label="Active Plans" value={stats?.active_plans || 0} />
        <MetricCard icon={DollarSign} label="Revenue" value={stats?.revenue || '€0'} />
        <MetricCard icon={Activity} label="Sessions Today" value={stats?.sessions_today || 0} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickLink href="/console/users" icon={Users} label="Manage Users" desc="View & edit user accounts" />
        <QuickLink href="/console/services" icon={Folder} label="Services" desc="Configure offerings" />
        <QuickLink href="/console/payments" icon={DollarSign} label="Payments" desc="Review transactions" />
      </div>
    </div>
  );
}
