'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  getChannelOverviewAction,
  getChannelAnalyticsAction,
  getTopPostsAction,
  recordSnapshotAction,
} from '@/server/telegram/actions';
import type { TelegramChannel, TelegramChannelAnalytics } from '@/server/telegram/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

interface AnalyticsPanelProps {
  channels: TelegramChannel[];
}

interface Overview {
  totalMembers: number;
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  last7DaysViews: number;
  last7DaysNewMembers: number;
  avgEngagementRate: number;
}

interface TopPost {
  post_id: string;
  content: string;
  views: number;
  published_at: string;
}

export function AnalyticsPanel({ channels }: AnalyticsPanelProps) {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id ?? '');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [timeSeries, setTimeSeries] = useState<TelegramChannelAnalytics[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [isPending, startTransition] = useTransition();
  const [days, setDays] = useState('30');

  useEffect(() => {
    if (!selectedChannel) return;
    loadData(selectedChannel, parseInt(days, 10));
  }, [selectedChannel, days]);

  function loadData(channelId: string, d: number) {
    startTransition(async () => {
      const [overviewRes, analyticsRes, topRes] = await Promise.all([
        getChannelOverviewAction(channelId),
        getChannelAnalyticsAction(channelId, d),
        getTopPostsAction(channelId, 5),
      ]);

      if (overviewRes.success) setOverview(overviewRes.data);
      if (analyticsRes.success) setTimeSeries(analyticsRes.data);
      if (topRes.success) setTopPosts(topRes.data);
    });
  }

  function handleSnapshot() {
    startTransition(async () => {
      await recordSnapshotAction(selectedChannel);
      loadData(selectedChannel, parseInt(days, 10));
    });
  }

  if (channels.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-12 text-center text-sm">
          No channels connected. Add a channel first.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleSnapshot} disabled={isPending}>
          Record Snapshot
        </Button>
      </div>

      {/* KPI Cards */}
      {overview && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Members" value={overview.totalMembers.toLocaleString()} />
          <StatCard label="7-Day Views" value={overview.last7DaysViews.toLocaleString()} />
          <StatCard label="New Members (7d)" value={`+${overview.last7DaysNewMembers}`} />
          <StatCard label="Avg Engagement" value={`${overview.avgEngagementRate}%`} />
          <StatCard label="Published Posts" value={overview.publishedPosts.toString()} />
          <StatCard label="Scheduled Posts" value={overview.scheduledPosts.toString()} />
          <StatCard label="Draft Posts" value={overview.draftPosts.toString()} />
          <StatCard label="Total Posts" value={overview.totalPosts.toString()} />
        </div>
      )}

      {/* Member Growth Chart */}
      {timeSeries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(v) => new Date(v).toLocaleDateString()}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="member_count"
                    name="Members"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.15)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Views & Engagement Chart */}
      {timeSeries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Views & Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(v) => new Date(v).toLocaleDateString()}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar
                    dataKey="views_total"
                    name="Views"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="messages_count"
                    name="Posts"
                    fill="hsl(var(--primary) / 0.4)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              {topPosts.map((post, idx) => (
                <div
                  key={post.post_id}
                  className="flex items-start justify-between gap-3 rounded-2xl border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0">
                        #{idx + 1}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm">{post.content}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-semibold">{post.views.toLocaleString()}</p>
                    <p className="text-muted-foreground text-xs">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
