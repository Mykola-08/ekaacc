import dynamic from 'next/dynamic';
import { Spinner } from '@/components/keep';

const MinimalPatientDashboard = dynamic(
  () => import('@/components/eka/dashboard/minimal-patient-dashboard'),
  { 
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" color="primary" className="mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return <MinimalPatientDashboard />;
}
