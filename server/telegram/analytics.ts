// ─── Telegram Analytics Service ──────────────────────────────
// Collects, stores, and queries analytics for channels and posts.

import { createClient } from '@/lib/supabase/admin';
import * as botApi from './bot-api';
import type {
  TelegramChannelAnalytics,
  TelegramPostAnalytics,
} from './types';

function getSupabase() {
  return createClient();
}

// ─── Post Analytics ─────────────────────────────────────────

/**
 * Snapshot current metrics for a published post.
 * The Telegram API doesn't expose all metrics directly; views come from
 * channel_post.views when available. This records whatever we have.
 */
export async function recordPostAnalytics(
  postId: string,
  metrics: {
    views?: number;
    forwards?: number;
    replies?: number;
    reactions?: Record<string, number>;
  }
): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('telegram_post_analytics').insert({
    post_id: postId,
    views: metrics.views ?? 0,
    forwards: metrics.forwards ?? 0,
    replies: metrics.replies ?? 0,
    reactions: metrics.reactions ?? {},
  });
}

/** Get the latest analytics snapshot for a post. */
export async function getLatestPostAnalytics(
  postId: string
): Promise<TelegramPostAnalytics | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('telegram_post_analytics')
    .select('*')
    .eq('post_id', postId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  return (data as TelegramPostAnalytics) ?? null;
}

/** Get analytics history for a post (time series). */
export async function getPostAnalyticsHistory(
  postId: string,
  limit = 30
): Promise<TelegramPostAnalytics[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('telegram_post_analytics')
    .select('*')
    .eq('post_id', postId)
    .order('recorded_at', { ascending: true })
    .limit(limit);

  return (data ?? []) as TelegramPostAnalytics[];
}

// ─── Channel Analytics ──────────────────────────────────────

/**
 * Record a daily analytics snapshot for a channel.
 * Should be called once per day (e.g. via cron/edge function).
 */
export async function recordChannelSnapshot(
  channelId: string,
  chatId: number
): Promise<void> {
  const supabase = getSupabase();
  const today = new Date().toISOString().split('T')[0];

  // Get current member count from Telegram
  const countRes = await botApi.getChatMemberCount(chatId);
  const memberCount = countRes.ok ? countRes.result ?? 0 : 0;

  // Get yesterday's snapshot for delta calculations
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const { data: yesterdaySnap } = await supabase
    .from('telegram_channel_analytics')
    .select('member_count')
    .eq('channel_id', channelId)
    .eq('date', yesterday)
    .single();

  const prevCount = yesterdaySnap?.member_count ?? memberCount;
  const memberDelta = memberCount - prevCount;

  // Count today's posts
  const { count: postsCount } = await supabase
    .from('telegram_posts')
    .select('id', { count: 'exact', head: true })
    .eq('channel_id', channelId)
    .eq('status', 'published')
    .gte('published_at', `${today}T00:00:00Z`)
    .lt('published_at', `${today}T23:59:59Z`);

  // Aggregate post views for today
  const { data: todayPosts } = await supabase
    .from('telegram_posts')
    .select('id')
    .eq('channel_id', channelId)
    .eq('status', 'published')
    .gte('published_at', `${today}T00:00:00Z`);

  let viewsTotal = 0;
  if (todayPosts && todayPosts.length > 0) {
    const postIds = todayPosts.map((p) => p.id);
    const { data: analytics } = await supabase
      .from('telegram_post_analytics')
      .select('views')
      .in('post_id', postIds)
      .order('recorded_at', { ascending: false });

    // Use latest views for each post
    const seen = new Set<string>();
    if (analytics) {
      for (const a of analytics) {
        if (!seen.has(a.views?.toString() ?? '')) {
          viewsTotal += a.views ?? 0;
        }
      }
    }
  }

  const avgReach = memberCount > 0 && (postsCount ?? 0) > 0
    ? (viewsTotal / (postsCount ?? 1) / memberCount) * 100
    : 0;

  const engagementRate = memberCount > 0
    ? (viewsTotal / memberCount) * 100
    : 0;

  await supabase.from('telegram_channel_analytics').upsert(
    {
      channel_id: channelId,
      date: today,
      member_count: memberCount,
      new_members: memberDelta > 0 ? memberDelta : 0,
      left_members: memberDelta < 0 ? Math.abs(memberDelta) : 0,
      messages_count: postsCount ?? 0,
      views_total: viewsTotal,
      avg_post_reach: Math.round(avgReach * 100) / 100,
      engagement_rate: Math.round(engagementRate * 100) / 100,
    },
    { onConflict: 'channel_id,date' }
  );

  // Also update the channel's member_count
  await supabase
    .from('telegram_channels')
    .update({ member_count: memberCount, updated_at: new Date().toISOString() })
    .eq('id', channelId);
}

/** Get channel analytics for a date range. */
export async function getChannelAnalytics(
  channelId: string,
  days = 30
): Promise<TelegramChannelAnalytics[]> {
  const supabase = getSupabase();
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

  const { data } = await supabase
    .from('telegram_channel_analytics')
    .select('*')
    .eq('channel_id', channelId)
    .gte('date', since)
    .order('date', { ascending: true });

  return (data ?? []) as TelegramChannelAnalytics[];
}

/** Get aggregated stats for a channel overview. */
export async function getChannelOverview(channelId: string): Promise<{
  totalMembers: number;
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  last7DaysViews: number;
  last7DaysNewMembers: number;
  avgEngagementRate: number;
}> {
  const supabase = getSupabase();

  // Get channel info
  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('member_count')
    .eq('id', channelId)
    .single();

  // Count posts by status
  const statuses = ['published', 'scheduled', 'draft'] as const;
  const counts: Record<string, number> = {};

  for (const status of statuses) {
    const { count } = await supabase
      .from('telegram_posts')
      .select('id', { count: 'exact', head: true })
      .eq('channel_id', channelId)
      .eq('status', status);
    counts[status] = count ?? 0;
  }

  // Last 7 days analytics
  const since7 = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const { data: weekAnalytics } = await supabase
    .from('telegram_channel_analytics')
    .select('views_total, new_members, engagement_rate')
    .eq('channel_id', channelId)
    .gte('date', since7);

  let views7 = 0;
  let newMembers7 = 0;
  let totalEngagement = 0;

  if (weekAnalytics) {
    for (const day of weekAnalytics) {
      views7 += day.views_total ?? 0;
      newMembers7 += day.new_members ?? 0;
      totalEngagement += day.engagement_rate ?? 0;
    }
  }

  return {
    totalMembers: channel?.member_count ?? 0,
    totalPosts: counts.published + counts.scheduled + counts.draft,
    publishedPosts: counts.published,
    scheduledPosts: counts.scheduled,
    draftPosts: counts.draft,
    last7DaysViews: views7,
    last7DaysNewMembers: newMembers7,
    avgEngagementRate: weekAnalytics?.length
      ? Math.round((totalEngagement / weekAnalytics.length) * 100) / 100
      : 0,
  };
}

/** Get top-performing posts by views. */
export async function getTopPosts(
  channelId: string,
  limit = 10
): Promise<Array<{ post_id: string; content: string; views: number; published_at: string }>> {
  const supabase = getSupabase();

  const { data: posts } = await supabase
    .from('telegram_posts')
    .select('id, content, published_at')
    .eq('channel_id', channelId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const { data: analytics } = await supabase
    .from('telegram_post_analytics')
    .select('post_id, views')
    .in('post_id', postIds)
    .order('views', { ascending: false });

  // Deduplicate by post_id, keeping highest views
  const bestByPost = new Map<string, number>();
  if (analytics) {
    for (const a of analytics) {
      const current = bestByPost.get(a.post_id) ?? 0;
      if (a.views > current) bestByPost.set(a.post_id, a.views);
    }
  }

  const results = posts
    .map((p) => ({
      post_id: p.id,
      content: p.content.substring(0, 200),
      views: bestByPost.get(p.id) ?? 0,
      published_at: p.published_at ?? '',
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  return results;
}

/** Snapshot all active channels — for cron use. */
export async function snapshotAllChannels(): Promise<number> {
  const supabase = getSupabase();
  const { data: channels } = await supabase
    .from('telegram_channels')
    .select('id, chat_id')
    .eq('is_active', true);

  if (!channels) return 0;

  let count = 0;
  for (const ch of channels) {
    try {
      await recordChannelSnapshot(ch.id, ch.chat_id);
      count++;
    } catch (e) {
      console.error(`[TelegramAnalytics] Failed snapshot for channel ${ch.id}:`, e);
    }
  }
  return count;
}
