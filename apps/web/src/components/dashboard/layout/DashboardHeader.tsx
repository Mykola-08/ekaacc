'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Search, Filter } from "lucide-react";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from './NotificationDropdown';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    showDate?: boolean;
    className?: string;
}

export function DashboardHeader({ title, subtitle, children, showDate = true, className }: DashboardHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row items-baseline justify-between gap-4 pb-6 border-b border-border mb-8", className)}>
            <div className="space-y-1">
                <h2 className="text-3xl font-bold text-foreground tracking-tighter leading-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-base text-muted-foreground font-medium">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                {children}

                <div className="flex items-center gap-3">
                    <NotificationDropdown />
                    {showDate && (
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-card px-3 py-1 rounded-full">
                            {format(new Date(), 'MMMM d, yyyy')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
