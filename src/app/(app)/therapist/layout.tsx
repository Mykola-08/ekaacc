"use client";

import { Card } from '@/components/ui/card';
import React from 'react';
import { RoleGuard } from '@/components/eka/role-guard';
import { AppSidebar } from '@/components/navigation/ShadcnSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/eka/app-header';

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[ 'Therapist', 'Admin' ]} fallback={<div className="p-6 max-w-3xl mx-auto"><Card className="p-6"><h2 className="text-lg font-semibold">Access required</h2><p className="text-sm text-muted-foreground">You must be a therapist or admin to access this area. Redirecting...</p></Card></div>}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
}

