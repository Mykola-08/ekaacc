'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
    title: string;
    subtitle: string;
    action?: ReactNode;
    className?: string;
}

export function WelcomeBanner({ title, subtitle, action, className }: WelcomeBannerProps) {
    return (
        <div className={cn(
            "p-8 rounded-[36px] bg-card border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden",
            className
        )}>
            {/* Decorative gradient blob */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
                <h1 className="text-[32px] font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
                <p className="text-[17px] text-muted-foreground font-medium max-w-xl">
                    {subtitle}
                </p>
            </div>

            {action && (
                <div className="relative z-10">
                    {action}
                </div>
            )}
        </div>
    );
}
