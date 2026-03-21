'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Suspense, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookOpen02Icon,
  BarChartIcon,
  LibraryIcon,
  HeartCheckIcon,
} from '@hugeicons/core-free-icons';
import { createClient } from '@/lib/supabase/client';

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
        <div key={i} className="bg-muted h-24 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
      ))}
    </div>
  );
}

function moodTone(mood: number | null) {
  if (mood == null) return { label: 'Not tracked yet', dot: 'bg-muted-foreground' };
  if (mood >= 8) return { label: 'Great', dot: 'bg-success' };
  if (mood >= 6) return { label: 'Good', dot: 'bg-primary' };
  if (mood >= 4) return { label: 'Okay', dot: 'bg-warning' };
  return { label: 'Needs care', dot: 'bg-destructive' };
}

function WellnessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get('tab') || 'journal';
  const [todaysMood, setTodaysMood] = useState<number | null>(null);

  useEffect(() => {
    const loadTodaysMood = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from('journal_entries')
        .select('mood, created_at')
        .eq('user_id', user.id)
        .not('mood', 'is', null)
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setTodaysMood(Number(data[0].mood));
      }
    };

    loadTodaysMood();
  }, []);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const mood = moodTone(todaysMood);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">Wellness</h1>
            <p className="text-muted-foreground text-sm">
              Track your progress, journal, and wellness resources.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <span className={`size-2 rounded-full ${mood.dot}`} />
            <HugeiconsIcon icon={HeartCheckIcon} className="size-3.5" />
            Today's mood: {todaysMood == null ? mood.label : `${todaysMood}/10 · ${mood.label}`}
          </Badge>
        </div>

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
