'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    colorClass?: string; // e.g., "bg-blue-50 text-blue-600"
    className?: string;
    action?: ReactNode; // Top right icon/action
}

export function StatsCard({ icon: Icon, label, value, colorClass = "bg-primary/10 text-primary", className, action }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className={cn(
                "bg-card p-6 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-40",
                className
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform",
                    colorClass
                )}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                {action}
            </div>
            <div>
                <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
            </div>
        </motion.div>
    );
}
