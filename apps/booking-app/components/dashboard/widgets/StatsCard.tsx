'use client';

import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    colorClass?: string; // e.g., "bg-blue-50 text-blue-600"
    className?: string;
    action?: ReactNode; // Top right icon/action
}

export function StatsCard({ icon: Icon, label, value, colorClass = "bg-surface-container text-primary", className, action }: StatsCardProps) {
    return (
        <div className={cn(
            "bg-surface p-6 rounded-[36px] border border-border shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-44",
            className
        )}>
            <div className="flex justify-between items-start">
                <div className={cn(
                    "w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                    colorClass
                )}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                {action || <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-50" />}
            </div>
            <div className="space-y-1">
                <div className="text-[11px] font-bold text-muted uppercase tracking-[0.1em]">{label}</div>
                <div className="text-3xl font-bold text-primary tracking-tight tabular-nums leading-none">{value}</div>
            </div>
        </div>
    );
}
