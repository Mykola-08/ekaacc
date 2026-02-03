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
        <div className={cn("bg-card rounded-[24px] p-4 px-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-border/40 shadow-sm gap-4", className)}>
            <div className="space-y-0.5">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {children}

                {/* Default Actions */}
                <div className="flex items-center gap-3 pl-2 border-l border-border/60">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-full" title="Toggle Theme">
                        <Sun className="w-5 h-5" strokeWidth={2.25} />
                    </button>
                    <NotificationDropdown />
                    {showDate && (
                        <>
                            <div className="h-6 w-px bg-border/60 hidden md:block"></div>
                            <span className="text-sm font-medium text-muted-foreground hidden md:block">
                                {format(new Date(), 'MMM dd, yyyy')}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
