'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BarChart3, Library } from 'lucide-react';
import { Suspense } from 'react';
import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';

const JournalTab = dynamic(
  () => import('./tabs/JournalTab').then((m) => ({ default: m.JournalTab })),
  { loading: () => <TabSkeleton /> }
);

const ProgressTab = dynamic(
  () => import('./tabs/ProgressTab').then((m) => ({ default: m.ProgressTab })),
  { loading: () => <TabSkeleton /> }
);

const ResourcesTab = dynamic(
  () => import('./tabs/ResourcesTab').then((m) => ({ default: m.ResourcesTab })),
  { loading: () => <TabSkeleton /> }
);

function TabSkeleton() {
  return (
    <div className="space-y-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function WellnessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get('tab') || 'journal';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.div 
      className="space-y-8 px-4 py-8 md:px-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <DashboardHeader
        title="Wellness"
        subtitle="Track your journey, explore resources, and see your progress."
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="journal" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Library className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="mt-6">
          <JournalTab />
        </TabsContent>
        <TabsContent value="progress" className="mt-6">
          <ProgressTab />
        </TabsContent>
        <TabsContent value="resources" className="mt-6">
          <ResourcesTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function WellnessPage() {
  return (
    <Suspense fallback={<TabSkeleton />}>
      <WellnessContent />
    </Suspense>
  );
}
