'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense, useEffect, useState, useTransition } from 'react';
import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { listChannelsAction } from '@/server/telegram/actions';
import type { TelegramChannel } from '@/server/telegram/types';

function TabSkeleton() {
  return (
    <div className="space-y-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

const ChannelManager = dynamic(
  () =>
    import('@/components/admin/telegram/ChannelManager').then((m) => ({
      default: m.ChannelManager,
    })),
  { loading: () => <TabSkeleton /> }
);

const PostComposer = dynamic(
  () =>
    import('@/components/admin/telegram/PostComposer').then((m) => ({
      default: m.PostComposer,
    })),
  { loading: () => <TabSkeleton /> }
);

const PostsList = dynamic(
  () =>
    import('@/components/admin/telegram/PostsList').then((m) => ({
      default: m.PostsList,
    })),
  { loading: () => <TabSkeleton /> }
);

const ScheduledPosts = dynamic(
  () =>
    import('@/components/admin/telegram/ScheduledPosts').then((m) => ({
      default: m.ScheduledPosts,
    })),
  { loading: () => <TabSkeleton /> }
);

const AnalyticsPanel = dynamic(
  () =>
    import('@/components/admin/telegram/AnalyticsPanel').then((m) => ({
      default: m.AnalyticsPanel,
    })),
  { loading: () => <TabSkeleton /> }
);

const MembersPanel = dynamic(
  () =>
    import('@/components/admin/telegram/MembersPanel').then((m) => ({
      default: m.MembersPanel,
    })),
  { loading: () => <TabSkeleton /> }
);

const BotSettings = dynamic(
  () =>
    import('@/components/admin/telegram/BotSettings').then((m) => ({
      default: m.BotSettings,
    })),
  { loading: () => <TabSkeleton /> }
);

function TelegramContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get('tab') || 'channels';

  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await listChannelsAction();
      if (res.success) setChannels(res.data);
    });
  }, []);

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
        title="Telegram"
        subtitle="Manage your Telegram channels, groups, and bot."
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="flex w-full max-w-3xl flex-wrap">
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="mt-6">
          <ChannelManager initialChannels={channels} />
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
          <PostComposer channels={channels} />
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          <PostsList channels={channels} />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <ScheduledPosts channels={channels} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsPanel channels={channels} />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <MembersPanel channels={channels} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <BotSettings channels={channels} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function TelegramAdminPage() {
  return (
    <Suspense fallback={<TabSkeleton />}>
      <TelegramContent />
    </Suspense>
  );
}
