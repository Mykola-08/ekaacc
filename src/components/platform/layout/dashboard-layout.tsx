'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/platform/navigation/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/platform/eka/app-header';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '18rem',
          '--sidebar-width-mobile': '20rem',
        } as React.CSSProperties
      }
    >
      <div className="bg-background flex min-h-svh w-full gap-2 overflow-hidden p-2 md:gap-3 md:p-3">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="hidden h-[calc(100vh-1.5rem)] shrink-0 md:block"
        >
          <AppSidebar className="h-full rounded-lg border border-black/5 bg-card shadow-sm" />
        </motion.div>

        <SidebarInset className="flex h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-lg border border-black/5 bg-card shadow-sm">
          <AppHeader />
          <motion.main
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className={cn(
              'scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1 overflow-y-auto p-4 md:p-6',
              className
            )}
          >
            {children}
          </motion.main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
