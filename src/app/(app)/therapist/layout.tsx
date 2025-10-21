"use client";

import React from 'react';
import { RoleGuard } from '@/components/eka/role-guard';
import { Card } from '@/components/ui/card';

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[ 'Therapist', 'Admin' ]} fallback={<div className="p-6 max-w-3xl mx-auto"><Card className="p-6"><h2 className="text-lg font-semibold">Access required</h2><p className="text-sm text-muted-foreground">You must be a therapist or admin to access this area. Redirecting...</p></Card></div>}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8">
          {children}
        </div>
      </div>
    </RoleGuard>
  );
}

