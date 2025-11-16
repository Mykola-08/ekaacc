import dynamic from 'next/dynamic';

const EnhancedPatientDashboard = dynamic(
  () => import('@/components/eka/dashboard/enhanced-patient-dashboard'),
  { 
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedPatientDashboard />
    </div>
  );
}
