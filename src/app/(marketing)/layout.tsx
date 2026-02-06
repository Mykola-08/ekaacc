'use client';

import * as React from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NavSidebar } from '@/components/marketing/NavSidebar';
import { Header } from '@/components/marketing/Header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "19rem",
        "--sidebar-width-mobile": "18rem",
      } as React.CSSProperties}
    >
      <TooltipProvider>
        <NavSidebar variant="floating" />
        <SidebarInset className="app-shell app-shell-inset transition-all duration-500">
          <div className="app-shell-card">
            <Header />
            <main className="app-shell-main">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
