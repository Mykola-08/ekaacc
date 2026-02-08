import { DashboardLayoutHeadless as DashboardLayout } from '@/components/platform/layout/dashboard-layout-headless';

export default function AppLayout({ children }: { children: React.ReactNode }) {
 return (
  <DashboardLayout>
   {children}
  </DashboardLayout>
 );
}

