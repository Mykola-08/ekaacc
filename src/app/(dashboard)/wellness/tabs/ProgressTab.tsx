'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, HeartPulse, Target, SmilePlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function ProgressTab() {
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
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

      const [entriesRes, bookingsRes, goalsRes] = await Promise.all([
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
        supabase.from('wellness_goals').select('id, status').eq('user_id', user.id),
      ]);

      if (entriesRes.data) setWellnessEntries(entriesRes.data);
      if (bookingsRes.count) setSessionsCompleted(bookingsRes.count);
      if (goalsRes.data) {
        setTotalGoals(goalsRes.data.length);
        setCompletedGoals(goalsRes.data.filter((g: any) => g.status === 'completed').length);
      }
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

    return {
      avgMood,
      latestMood,
      moodTrend,
      avgEnergy,
      avgStress,
      avgSleep,
      totalEntries: wellnessEntries.length,
    };
  }, [wellnessEntries]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="border-border bg-muted/30 rounded-lg border-2 border-dashed py-20 text-center">
        <SmilePlus className="text-muted-foreground/50 mx-auto mb-4 h-10 w-10" />
        <h3 className="text-foreground text-lg font-semibold">No wellness data yet</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Start tracking your mood and wellness to see progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Mood</CardTitle>
            {stats.moodTrend >= 0 ? (
              <TrendingUp className="text-success h-4 w-4" />
            ) : (
              <TrendingDown className="text-destructive h-4 w-4" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.avgMood.toFixed(1)}/10</div>
            <p className="text-muted-foreground text-xs">
              {stats.moodTrend >= 0 ? '+' : ''}
              {stats.moodTrend} since first entry
            </p>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${stats.avgMood * 10}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Energy</CardTitle>
            <TrendingUp className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.avgEnergy.toFixed(1)}/10</div>
            <p className="text-muted-foreground text-xs">Based on {stats.totalEntries} entries</p>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${stats.avgEnergy * 10}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <HeartPulse className="text-destructive h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sessionsCompleted}</div>
            <p className="text-muted-foreground text-xs">Completed sessions</p>
          </CardContent>
        </Card>
        <Card className="border-border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Target className="text-warning h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {completedGoals}/{totalGoals}
            </div>
            <p className="text-muted-foreground text-xs">
              {totalGoals > 0
                ? `${Math.round((completedGoals / totalGoals) * 100)}% achieved`
                : 'No goals set'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mood History */}
      <Card className="border-border rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Your mood scores over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {wellnessEntries.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm italic">
              No entries recorded yet.
            </p>
          ) : (
            <div className="h-75 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={wellnessEntries.map((e) => ({
                    date: new Date(e.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    }),
                    mood: e.mood,
                    rawDate: new Date(e.created_at).getTime(),
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
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
                          <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                            <p className="text-muted-foreground mb-1 text-xs">{label}</p>
                            <p className="text-primary text-sm font-bold">
                              Mood: {payload[0].value}/10
                            </p>
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
                    fill="url(#colorMood)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wellness Snapshot */}
      <Card className="border-border rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Current Wellness Snapshot</CardTitle>
          <CardDescription>Your average scores across key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Mood', value: stats.avgMood, max: 10, color: 'bg-primary' },
              { label: 'Energy', value: stats.avgEnergy, max: 10, color: 'bg-primary' },
              { label: 'Stress Mgmt', value: stats.avgStress, max: 10, color: 'bg-success' },
              { label: 'Sleep', value: stats.avgSleep, max: 5, color: 'bg-primary' },
            ].map((metric) => (
              <div key={metric.label} className="">
                <div className="flex justify-between text-sm font-medium">
                  <span>{metric.label}</span>
                  <span className="text-muted-foreground">
                    {metric.value.toFixed(1)}/{metric.max}
                  </span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                    style={{ width: `${(metric.value / metric.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
