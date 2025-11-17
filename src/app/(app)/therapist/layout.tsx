"use client";

import { Card } from '@/components/ui/card';
import React from 'react';
import { RoleGuard } from '@/components/eka/role-guard';
;
import { TherapistSidebar } from '@/components/eka/therapist-sidebar';

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[ 'Therapist', 'Admin' ]} fallback={<div className="p-6 max-w-3xl mx-auto"><Card className="p-6"><h2 className="text-lg font-semibold">Access required</h2><p className="text-sm text-muted-foreground">You must be a therapist or admin to access this area. Redirecting...</p></Card></div>}>
      <div className="flex min-h-screen bg-background">
        <TherapistSidebar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}

