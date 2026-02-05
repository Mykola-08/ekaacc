
'use client';

import * as React from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
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
      } as React.CSSProperties}
    >
      <NavSidebar variant="floating" />
      <SidebarInset className="bg-background min-h-screen flex flex-col p-2 md:p-4 transition-all duration-500">
        <div className="bg-card rounded-[36px] border border-border/50 shadow-sm flex-1 flex flex-col overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

