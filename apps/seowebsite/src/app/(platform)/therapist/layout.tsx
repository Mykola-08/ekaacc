"use client";

import { Card } from '@/components/platform/ui/card';
import React from 'react';
import { UnifiedRoleGuard } from '@/components/platform/unified-role-guard';
import { AppSidebar } from '@/components/platform/navigation/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/platform/ui/sidebar';
import { AppHeader } from '@/components/platform/eka/app-header';

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <UnifiedRoleGuard allowedRoles={[ 'Therapist', 'Admin' ]} fallback={<div className="p-6 max-w-3xl mx-auto"><Card className="p-6"><h2 className="text-lg font-semibold">Access required</h2><p className="text-sm text-muted-foreground">You must be a therapist or admin to access this area. Redirecting...</p></Card></div>}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-x-hidden p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UnifiedRoleGuard>
  );
}

