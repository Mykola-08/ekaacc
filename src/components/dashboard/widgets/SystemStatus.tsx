'use client';

import React from 'react';
import { Database, ShieldCheck, Zap, Globe } from 'lucide-react';
import { DashboardCard } from '../shared/DashboardCard';

const statuses = [
  {
    label: 'Database',
    status: 'Healthy',
    icon: Database,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Auth Service',
    status: 'Active',
    icon: ShieldCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    label: 'Edge Runtime',
    status: 'Optimal',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    label: 'API Gateway',
    status: 'Online',
    icon: Globe,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
];

export function SystemStatus() {
  return (
    <DashboardCard title="Infrastructure Status" icon={Zap} className="h-auto">
      <div className="mt-2 grid grid-cols-2 gap-4">
        {statuses.map((s, idx) => (
          <div
            key={idx}
            className="bg-secondary border-border flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-gray-200"
          >
            <div className={`rounded-lg p-2.5 ${s.bg} flex-shrink-0`}>
              <s.icon className={`${s.color} h-4 w-4`} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="text-muted-foreground mb-0.5 text-xs font-bold tracking-wider uppercase">
                {s.label}
              </div>
              <div className="text-foreground truncate text-[13px] leading-none font-bold">
                {s.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
