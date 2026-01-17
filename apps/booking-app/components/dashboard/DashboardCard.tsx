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
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
                "bg-card p-8 rounded-[36px] border border-border shadow-sm flex flex-col justify-between h-full relative overflow-hidden group",
                className
            )}
        >
            <div className="space-y-6">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-foreground">
                                <Icon className="w-6 h-6" strokeWidth={2.75} />
                            </div>
                        )}
                        <h3 className="text-[19px] font-semibold text-foreground">{title}</h3>
                    </div>
                </header>

                <div className="space-y-1">
                    {value && (
                        <div className="text-[40px] font-semibold text-foreground tracking-tight leading-none">
                            {value}
                        </div>
                    )}
                    {subtext && (
                        <div className="text-[17px] font-medium text-muted-foreground">
                            {subtext}
                        </div>
                    )}
                </div>

                {children}
            </div>

            {/* "Squishy" Action Button at bottom of card */}
            {(actionLabel || onAction) && (
                <div className="mt-8">
                    <button
                        onClick={onAction}
                        className={cn(
                            "w-full h-14 rounded-[20px] font-semibold text-[17px] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2",
                            variant === 'default'
                                ? "bg-secondary text-foreground hover:bg-secondary/80"
                                : variant === 'primary'
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        )}
                    >
                        {actionLabel || 'Manage'}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
