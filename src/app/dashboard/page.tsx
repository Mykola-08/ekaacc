import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MinimalPatientDashboard = dynamic(
  () => import('@/components/eka/dashboard/minimal-patient-dashboard'),
  { 
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return <MinimalPatientDashboard />;
}
