'use client';

import React from 'react';
import { Database, ShieldCheck, Zap, Globe } from 'lucide-react';
import { DashboardCard } from '../shared/DashboardCard';

const statuses = [
    { label: 'Database', status: 'Healthy', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Auth Service', status: 'Active', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Edge Runtime', status: 'Optimal', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'API Gateway', status: 'Online', icon: Globe, color: 'text-violet-500', bg: 'bg-violet-50' },
];

export function SystemStatus() {
    return (
        <DashboardCard
            title="Infrastructure Status"
            icon={Zap}
            className="h-auto"
        >
            <div className="grid grid-cols-2 gap-4 mt-2">
                {statuses.map((s, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-secondary border border-border flex items-center gap-3 transition-colors hover:border-gray-200">
                        <div className={`p-2.5 rounded-lg ${s.bg} flex-shrink-0`}>
                            <s.icon className={`${s.color} w-4 h-4`} strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{s.label}</div>
                            <div className="text-[13px] font-bold text-foreground truncate leading-none">{s.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
}

