import dynamic from 'next/dynamic';

const MinimalPatientDashboard = dynamic(
  () => import('@/components/eka/dashboard/minimal-patient-dashboard'),
  { 
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return <MinimalPatientDashboard />;
}
