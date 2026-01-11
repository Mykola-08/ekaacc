// Ensure this component is dynamic as it fetches per-request data
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { AdminDashboard } from '@/components/platform/admin/admin-dashboard';
import { getAdminKPIStats } from '@/app/actions/admin';
import { Loader2 } from 'lucide-react';

async function DashboardContent() {
  try {
    const kpiStats = await getAdminKPIStats();
    return <AdminDashboard kpiStats={kpiStats} />;
  } catch (error) {
    console.error('Failed to load admin stats:', error);
    // Return dashboard with default/empty stats rather than crashing
    return <AdminDashboard />;
  }
}

export default function AdminPage() {
  return (
    <div className="container mx-auto py-6">
       <Suspense fallback={
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading Admin Dashboard...</span>
          </div>
       }>
         <DashboardContent />
       </Suspense>
    </div>
  );
}
