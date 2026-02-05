'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface WelcomeBannerProps {
    title: string;
    firstName: string;
    subtitle: string;
    action?: ReactNode;
    className?: string;
}

export function WelcomeBanner({ title, firstName, subtitle, action, className }: WelcomeBannerProps) {
    return (
        <div className={cn(
            "p-10 md:p-14 rounded-2xl bg-surface border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden group",
            className
        )}>
            {/* Soft Blue Accent */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-110" />

            <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="text-4xl md:text-5xl font-bold tracking-tighter text-primary leading-[0.9]"
                    >
                        {title}
                        <motion.span
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="block text-primary"
                        >
                            {firstName}.
                        </motion.span>
                    </motion.h1>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
                    {subtitle}
                </p>
            </div>

            {action && (
                <div className="relative z-10 shrink-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {action}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
