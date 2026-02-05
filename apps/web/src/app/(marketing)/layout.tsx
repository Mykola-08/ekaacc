
'use client';

import * as React from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { NavSidebar } from '@/app/components/NavSidebar';
import { Header } from '@/app/components/Header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
      } as React.CSSProperties}
    >
      <NavSidebar variant="inset" />
      <SidebarInset className="bg-background/50">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

