'use client';

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun03Icon, Search01Icon, FilterIcon } from "@hugeicons/core-free-icons";
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
        <div className={cn("flex flex-col md:flex-row items-baseline justify-between gap-4 pb-8 border-b border-border/50 mb-10 transition-all", className)}>
            <div className="space-y-1.5">
                <h2 className="text-4xl font-bold text-foreground tracking-tight leading-none font-serif">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-lg text-muted-foreground font-medium opacity-80">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                {children}

                <div className="flex items-center gap-4">
                    <NotificationDropdown />
                    {showDate && (
                        <div className="flex items-center gap-2 bg-secondary/50 border border-border/40 pl-2 pr-4 py-1.5 rounded-full shadow-sm">
                            <div className="bg-amber-500/10 p-1 rounded-full">
                                <HugeiconsIcon icon={Sun03Icon} className="size-3.5 text-amber-500" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest tabular-nums">
                                {format(new Date(), 'MMMM d, yyyy')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

