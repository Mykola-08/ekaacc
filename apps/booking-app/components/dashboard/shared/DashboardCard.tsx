'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface DashboardCardProps {
    title?: string;
    value?: string | number;
    subtext?: string;
    icon?: React.ElementType;
    actionLabel?: string;
    onAction?: () => void;
    children?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'danger';
}

export function DashboardCard({
    title,
    value,
    subtext,
    icon: Icon,
    actionLabel,
    onAction,
    children,
    className,
    variant = 'default'
}: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1],
            }}
            className={cn(
                "bg-[#FEFFFE] p-8 rounded-[36px] border border-[#F5F5F5] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full relative overflow-hidden group",
                className
            )}
        >
            <div className="space-y-6 relative z-10 w-full">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className="h-12 w-12 rounded-[16px] bg-[#F7F8F9] flex items-center justify-center text-[#222222]">
                                <Icon className="w-6 h-6" strokeWidth={2} />
                            </div>
                        )}
                        <h3 className="text-[17px] font-semibold text-[#222222]">{title}</h3>
                    </div>
                </header>

                <div className="space-y-1">
                    {value && (
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                            {value}
                        </div>
                    )}
                    {subtext && (
                        <div className="text-lg font-semibold text-muted-foreground">
                            {subtext}
                        </div>
                    )}
                </div>

                {children}
            </div>

            {/* "Squishy" Action Button at bottom of card */}
            {(actionLabel || onAction) && (
                <div className="mt-8 relative z-10">
                    <button
                        onClick={onAction}
                        className={cn(
                            "w-full h-14 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95 hover:scale-105 flex items-center justify-center gap-2 shadow-lg",
                            variant === 'default'
                                ? "bg-gradient-to-r from-secondary to-secondary/80 text-foreground hover:from-secondary/90 hover:to-secondary/70"
                                : variant === 'primary'
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30"
                                    : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/40 dark:to-rose-900/40 text-red-700 dark:text-red-400 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/60 dark:hover:to-rose-900/60"
                        )}
                    >
                        {actionLabel || 'Manage'}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
