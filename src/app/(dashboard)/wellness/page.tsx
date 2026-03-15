'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BookOpen02Icon, BarChartIcon, LibraryIcon } from '@hugeicons/core-free-icons';


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
    <div className="py-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
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
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="journal" className="gap-2">
              <HugeiconsIcon icon={BookOpen02Icon} className="size-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <HugeiconsIcon icon={BarChartIcon} className="size-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <HugeiconsIcon icon={LibraryIcon} className="size-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="mt-4">
            <JournalTab />
          </TabsContent>
          <TabsContent value="progress" className="mt-4">
            <ProgressTab />
          </TabsContent>
          <TabsContent value="resources" className="mt-4">
            <ResourcesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function WellnessPage() {
  return (
    <Suspense fallback={<TabSkeleton />}>
      <WellnessContent />
    </Suspense>
  );
}
