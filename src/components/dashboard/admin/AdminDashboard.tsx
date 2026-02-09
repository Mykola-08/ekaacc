'use client';

import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import {
  Users,
  FileText,
  AlertCircle,
  Folder,
  DollarSign,
  Activity,
  Settings,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminDashboard({ profile, stats }: any) {
  return (
    <DashboardLayout profile={profile}>
      <div className="animate-in fade-in space-y-8 font-sans duration-500">
        {/* 1. Admin Command Center - Dark Banner */}
        <div className="relative overflow-hidden rounded-[20px] bg-foreground p-8 text-white shadow-sm">
          {/* Close button visualization (optional) */}
          <div className="absolute top-6 right-6 cursor-pointer text-white/40 hover:text-white">
            {/* <X className="w-5 h-5" /> */}
          </div>

          <div className="relative z-10 mb-8">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg border border-blue-500/10 bg-blue-500/20 p-2 text-blue-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Admin Command Center
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Welcome to the system core. Here you can manage users, oversee all projects, monitor
              system health, and configure global settings.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-foreground/90 p-4 transition-colors hover:bg-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 transition-colors group-hover:bg-indigo-500/30">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">User & Team</div>
                <div className="text-xs text-muted-foreground">Manage roles & access</div>
              </div>
            </div>

            <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-foreground/90 p-4 transition-colors hover:bg-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 transition-colors group-hover:bg-emerald-500/30">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Finance & Pricing</div>
                <div className="text-xs text-muted-foreground">Track revenue & invoices</div>
              </div>
            </div>

            <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-foreground/90 p-4 transition-colors hover:bg-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 transition-colors group-hover:bg-amber-500/30">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">System Health</div>
                <div className="text-xs text-muted-foreground">Logs, errors & flags</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. System Overview - White Section */}
        <div className="rounded-[40px] border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="flex-1">
              <div className="mb-4 inline-block rounded-full border border-red-100/50 bg-red-50 px-3 py-1 text-[10px] font-bold tracking-wider text-red-500">
                ADMIN PORTAL
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                System <span className="text-red-500">Overview</span>
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                Welcome to the command center. You have full visibility and control over users,
                projects, and system health.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="min-w-[160px] rounded-[20px] border border-border bg-muted/50 p-5">
                <div className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  SYSTEM STATUS
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  </span>
                  <span className="text-lg font-bold text-foreground">Healthy</span>
                </div>
              </div>

              <div className="min-w-[160px] rounded-[20px] border border-border bg-muted/50 p-5">
                <div className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  ACTIVE USERS
                </div>
                <div className="text-2xl font-bold text-foreground">{stats?.users_total || 2}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            label="TOTAL USERS"
            value={stats?.users_total || '2'}
            iconColor="text-blue-500"
            bg="bg-blue-50"
          />
          <MetricCard
            icon={Folder}
            label="ACTIVE PROJECTS"
            value={stats?.active_plans || '38'}
            iconColor="text-violet-500"
            bg="bg-violet-50"
          />
          <MetricCard
            icon={FileText}
            label="NEW INQUIRIES"
            value="0"
            iconColor="text-emerald-500"
            bg="bg-emerald-50"
          />
          <MetricCard
            icon={AlertCircle}
            label="ACTIVE ERRORS"
            value="52"
            iconColor="text-red-500"
            bg="bg-red-50"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ icon: Icon, label, value, iconColor, bg }: any) {
  return (
    <div className="flex cursor-default items-center gap-5 rounded-[20px] border border-border bg-card p-6 shadow-sm transition-all hover:border-border">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', bg, iconColor)}>
        <Icon className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <div>
        <div className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </div>
        <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  );
}
