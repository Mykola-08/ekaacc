'use client';

import dynamic from 'next/dynamic';

const AnalyticsDashboardHeadless = dynamic(
  () =>
    import('@/components/platform/admin/analytics-dashboard-headless').then(
      (m) => m.AnalyticsDashboardHeadless
    ),
  {
    ssr: false,
    loading: () => <div className="bg-muted h-96 w-full animate-pulse rounded-xl" />,
  }
);

export default function AnalyticsPage() {
  return <AnalyticsDashboardHeadless />;
}
