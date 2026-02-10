'use client';

import {
  Users,
  Folder,
  DollarSign,
  Activity,
  Shield,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  profile: any;
  stats: {
    users_total?: number;
    active_plans?: number;
    revenue?: any;
    sessions_today?: number;
    [key: string]: any;
  };
}

export function AdminDashboard({ profile, stats }: AdminDashboardProps) {
  return (
    <motion.div
      className="space-y-6 px-2 py-6 font-sans sm:px-4 md:px-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Hero */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                Admin Console
              </span>
            </div>
            <h2 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
              System Overview
            </h2>
            <p className="max-w-lg text-sm text-muted-foreground">
              Full visibility and control over users, services, and system health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-foreground">Healthy</span>
            </div>
            <Badge variant="outline" className="rounded-lg px-3 py-1.5 text-xs font-medium">
              {stats?.users_total || 0} Users
            </Badge>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetric icon={Users} label="Total Users" value={stats?.users_total || 0} />
        <AdminMetric icon={Folder} label="Active Plans" value={stats?.active_plans || 0} />
        <AdminMetric icon={DollarSign} label="Revenue" value={stats?.revenue || '€0'} />
        <AdminMetric icon={Activity} label="Sessions Today" value={stats?.sessions_today || 0} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <AdminQuickLink href="/console/users" icon={Users} label="User & Team" desc="Manage roles & access" />
        <AdminQuickLink href="/console/services" icon={Folder} label="Services" desc="Configure offerings" />
        <AdminQuickLink href="/console/payments" icon={DollarSign} label="Finance" desc="Track revenue & invoices" />
      </div>

      {/* Secondary Management Links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <AdminQuickLink href="/status" icon={Activity} label="System Health" desc="Logs, errors & monitoring" />
        <AdminQuickLink href="/console/cms" icon={MessageSquare} label="Content" desc="Manage pages & copy" />
        <AdminQuickLink href="/settings" icon={Settings} label="Settings" desc="Global configuration" />
      </div>
    </motion.div>
  );
}

function AdminMetric({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <Card className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</div>
        <div className="text-xl font-semibold tracking-tight text-foreground">{value}</div>
      </div>
    </Card>
  );
}

function AdminQuickLink({ href, icon: Icon, label, desc }: { href: string; icon: any; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
    </Link>
  );
}
