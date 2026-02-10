'use client';

import {
  Users,
  Folder,
  DollarSign,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
        <MetricCard icon={Users} label="Total Users" value={stats?.users_total || 0} accent="blue" />
        <MetricCard icon={Folder} label="Active Plans" value={stats?.active_plans || 0} accent="violet" />
        <MetricCard icon={DollarSign} label="Revenue" value={stats?.revenue || '€0'} accent="emerald" />
        <MetricCard icon={Activity} label="Sessions Today" value={stats?.sessions_today || 0} accent="amber" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickLink href="/console/users" icon={Users} label="Manage Users" desc="View & edit user accounts" accent="blue" />
        <QuickLink href="/console/services" icon={Folder} label="Services" desc="Configure offerings" accent="violet" />
        <QuickLink href="/console/payments" icon={DollarSign} label="Payments" desc="Review transactions" accent="emerald" />
      </div>
    </div>
  );
}

const accentColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
};

function MetricCard({ icon: Icon, label, value, accent }: any) {
  const c = accentColors[accent] || accentColors.blue;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', c.bg, c.text)}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="text-xl font-bold tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label, desc, accent }: any) {
  const c = accentColors[accent] || accentColors.blue;
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-border/80 hover:shadow-sm"
    >
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', c.bg, c.text)}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}
