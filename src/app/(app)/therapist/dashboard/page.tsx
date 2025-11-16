"use client";

import dynamic from 'next/dynamic';

const EnhancedTherapistDashboard = dynamic(
  () => import('@/components/eka/dashboard/enhanced-therapist-dashboard'),
  { 
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your therapist dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function TherapistDashboardPage() {
  return <EnhancedTherapistDashboard />;
}

