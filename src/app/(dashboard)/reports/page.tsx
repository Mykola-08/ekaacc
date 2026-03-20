'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChartIncreaseIcon, ChartDecreaseIcon, HeartCheckIcon, Target01Icon, BarChartIcon, Moon01Icon, ZapIcon, Brain02Icon } from '@hugeicons/core-free-icons';

import { createClient } from '@/lib/supabase/client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WellnessEntry {
  id: string;
  mood: number;
  energy: string;
  stress: string;
  sleep_quality: number | null;
  sleep_hours: number | null;
  created_at: string;
}

const ENERGY_MAP: Record<string, number> = {
  very_low: 1,
  low: 3,
  moderate: 5,
  high: 7,
  very_high: 9,
};
const STRESS_MAP: Record<string, number> = { minimal: 9, mild: 7, moderate: 5, high: 3, severe: 1 };

export default function ReportsPage() {
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [entriesRes, bookingsRes, goalsRes, journalRes] = await Promise.all([
        supabase
          .from('wellness_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: true }),
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('client_id', user.id)
          .eq('status', 'completed'),
        supabase.from('goals').select('id, status').eq('user_id', user.id),
        supabase
          .from('journal_entries')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
      ]);

      if (entriesRes.data) setWellnessEntries(entriesRes.data);
      if (bookingsRes.count) setSessionsCompleted(bookingsRes.count);
      if (goalsRes.data) {
        setTotalGoals(goalsRes.data.length);
        setCompletedGoals(goalsRes.data.filter((g: any) => g.status === 'completed').length);
      }
      if (journalRes.count) setJournalCount(journalRes.count);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (wellnessEntries.length === 0) return null;
    const moods = wellnessEntries.map((e) => e.mood);
    const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
    const latestMood = moods[moods.length - 1] || 0;
    const firstMood = moods[0] || 0;
    const moodTrend = latestMood - firstMood;

    const energyScores = wellnessEntries.map((e) => ENERGY_MAP[e.energy] || 5);
    const avgEnergy = energyScores.reduce((a, b) => a + b, 0) / energyScores.length;

    const stressScores = wellnessEntries.map((e) => STRESS_MAP[e.stress] || 5);
    const avgStress = stressScores.reduce((a, b) => a + b, 0) / stressScores.length;

    const sleepEntries = wellnessEntries.filter((e) => e.sleep_quality !== null);
    const avgSleep =
      sleepEntries.length > 0
        ? sleepEntries.reduce((a, b) => a + (b.sleep_quality || 0), 0) / sleepEntries.length
        : 0;

    return { avgMood, moodTrend, avgEnergy, avgStress, avgSleep, totalEntries: wellnessEntries.length };
  }, [wellnessEntries]);

  const weeklyData = useMemo(() => {
    if (wellnessEntries.length === 0) return [];
    const weeks: Record<string, { mood: number[]; energy: number[]; stress: number[] }> = {};
    wellnessEntries.forEach((e) => {
      const date = new Date(e.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!weeks[key]) weeks[key] = { mood: [], energy: [], stress: [] };
      weeks[key].mood.push(e.mood);
      weeks[key].energy.push(ENERGY_MAP[e.energy] || 5);
      weeks[key].stress.push(STRESS_MAP[e.stress] || 5);
    });
    return Object.entries(weeks).map(([week, data]) => ({
      week,
      mood: +(data.mood.reduce((a, b) => a + b, 0) / data.mood.length).toFixed(1),
      energy: +(data.energy.reduce((a, b) => a + b, 0) / data.energy.length).toFixed(1),
      stress: +(data.stress.reduce((a, b) => a + b, 0) / data.stress.length).toFixed(1),
    }));
  }, [wellnessEntries]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-xl font-bold tracking-tight">My Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personal progress summary.</p>
        </div>
        <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center px-4 lg:px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">My Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personal progress summary for the last 30 days.</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <HugeiconsIcon icon={BarChartIcon} className="mr-1 size-3" />
          {wellnessEntries.length} entries
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:shadow-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
            <HugeiconsIcon icon={HeartCheckIcon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sessionsCompleted}</div>
            <p className="text-muted-foreground text-xs">Total therapy sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
            <HugeiconsIcon icon={Target01Icon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{completedGoals}/{totalGoals}</div>
            <p className="text-muted-foreground text-xs">
              {totalGoals > 0
                ? `${Math.round((completedGoals / totalGoals) * 100)}% completion rate`
                : 'No goals set'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <HugeiconsIcon icon={Brain02Icon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{journalCount}</div>
            <p className="text-muted-foreground text-xs">Total journal entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
            {stats && stats.moodTrend >= 0 ? (
              <HugeiconsIcon icon={ChartIncreaseIcon} className="size-4 text-muted-foreground" />
            ) : (
              <HugeiconsIcon icon={ChartDecreaseIcon} className="size-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats ? `${stats.moodTrend >= 0 ? '+' : ''}${stats.moodTrend}` : '—'}
            </div>
            <p className="text-muted-foreground text-xs">Change over 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood History Chart */}
      {stats && (
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
            <CardDescription>Daily mood scores over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={wellnessEntries.map((e) => ({
                    date: new Date(e.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    }),
                    mood: e.mood,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMoodReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    minTickGap={30}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    tickCount={6}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="border bg-background rounded-[calc(var(--radius)*0.8)] p-2">
                            <p className="text-muted-foreground mb-1 text-xs">{label}</p>
                            <p className="text-primary text-sm font-bold">Mood: {payload[0].value}/10</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMoodReports)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Averages */}
      {weeklyData.length > 0 && (
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle>Weekly Averages</CardTitle>
            <CardDescription>Average mood, energy, and stress management by week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    tickCount={6}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="border bg-background rounded-[calc(var(--radius)*0.8)] p-2">
                            <p className="text-muted-foreground mb-1 text-xs">{label}</p>
                            {payload.map((p: any) => (
                              <p key={p.dataKey} className="text-sm font-medium" style={{ color: p.color }}>
                                {p.dataKey}: {p.value}/10
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="mood" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="energy" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stress" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wellness Metrics Summary */}
      {stats && (
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle>Wellness Metrics Summary</CardTitle>
            <CardDescription>Your average scores across all tracked metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {[
                { label: 'Mood', value: stats.avgMood, max: 10, icon: ChartIncreaseIcon },
                { label: 'Energy', value: stats.avgEnergy, max: 10, icon: ZapIcon },
                { label: 'Stress Mgmt', value: stats.avgStress, max: 10, icon: Brain02Icon },
                { label: 'Sleep Quality', value: stats.avgSleep, max: 5, icon: Moon01Icon },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={metric.icon} className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-semibold">
                    {metric.value.toFixed(1)}/{metric.max}
                  </div>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!stats && (
        <div className="mx-4 lg:mx-6 rounded-[calc(var(--radius)*0.8)] border-2 border-dashed py-20 text-center">
          <HugeiconsIcon icon={BarChartIcon} className="text-muted-foreground mx-auto mb-4 size-10" />
          <h3 className="text-lg font-semibold">No report data yet</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Start tracking your wellness to see reports and trends here.
          </p>
        </div>
      )}
    </div>
  );
}
