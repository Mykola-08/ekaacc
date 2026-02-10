'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BarChart3 } from 'lucide-react';
import { Suspense } from 'react';

const JournalTab = dynamic(
  () => import('./tabs/JournalTab').then((m) => ({ default: m.JournalTab })),
  { loading: () => <TabSkeleton /> }
);

const ProgressTab = dynamic(
  () => import('./tabs/ProgressTab').then((m) => ({ default: m.ProgressTab })),
  { loading: () => <TabSkeleton /> }
);

function TabSkeleton() {
  return (
    <div className="space-y-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
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
    <div className="space-y-6 px-4 py-8 md:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Wellness</h1>
        <p className="mt-1 text-muted-foreground">
          Track your journey, reflect, and see your progress over time.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="journal" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="mt-6">
          <JournalTab />
        </TabsContent>
        <TabsContent value="progress" className="mt-6">
          <ProgressTab />
        </TabsContent>
      </Tabs>
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
