'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Target,
  SmilePlus,
} from 'lucide-react';
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

const ENERGY_MAP: Record<string, number> = { very_low: 1, low: 3, moderate: 5, high: 7, very_high: 9 };
const STRESS_MAP: Record<string, number> = { minimal: 9, mild: 7, moderate: 5, high: 3, severe: 1 };

export function ProgressTab() {
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

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
          .from('booking')
          .select('id', { count: 'exact' })
          .eq('customer_reference_id', user.id)
          .eq('status', 'completed'),
        supabase
          .from('wellness_goals')
          .select('id, status')
          .eq('user_id', user.id),
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
    const moods = wellnessEntries.map(e => e.mood);
    const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
    const latestMood = moods[moods.length - 1] || 0;
    const firstMood = moods[0] || 0;
    const moodTrend = latestMood - firstMood;

    const energyScores = wellnessEntries.map(e => ENERGY_MAP[e.energy] || 5);
    const avgEnergy = energyScores.reduce((a, b) => a + b, 0) / energyScores.length;

    const stressScores = wellnessEntries.map(e => STRESS_MAP[e.stress] || 5);
    const avgStress = stressScores.reduce((a, b) => a + b, 0) / stressScores.length;

    const sleepEntries = wellnessEntries.filter(e => e.sleep_quality !== null);
    const avgSleep = sleepEntries.length > 0
      ? sleepEntries.reduce((a, b) => a + (b.sleep_quality || 0), 0) / sleepEntries.length
      : 0;

    return { avgMood, latestMood, moodTrend, avgEnergy, avgStress, avgSleep, totalEntries: wellnessEntries.length };
  }, [wellnessEntries]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 py-20 text-center">
        <SmilePlus className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold text-foreground">No wellness data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start tracking your mood and wellness to see progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Mood</CardTitle>
            {stats.moodTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgMood.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">
              {stats.moodTrend >= 0 ? '+' : ''}{stats.moodTrend} since first entry
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${stats.avgMood * 10}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Energy</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEnergy.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">Based on {stats.totalEntries} entries</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${stats.avgEnergy * 10}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <HeartPulse className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsCompleted}</div>
            <p className="text-xs text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}/{totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              {totalGoals > 0 ? `${Math.round((completedGoals / totalGoals) * 100)}% achieved` : 'No goals set'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mood History */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Your mood scores over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {wellnessEntries.length === 0 ? (
            <p className="py-8 text-center text-sm italic text-muted-foreground">
              No entries recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {wellnessEntries.slice(-10).map((entry) => (
                <div key={entry.id} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="h-6 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${entry.mood * 10}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium">
                    {entry.mood}/10 &middot; {entry.energy.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wellness Snapshot */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Current Wellness Snapshot</CardTitle>
          <CardDescription>Your average scores across key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Mood', value: stats.avgMood, max: 10, color: 'bg-primary' },
              { label: 'Energy', value: stats.avgEnergy, max: 10, color: 'bg-blue-600' },
              { label: 'Stress Mgmt', value: stats.avgStress, max: 10, color: 'bg-emerald-600' },
              { label: 'Sleep', value: stats.avgSleep, max: 5, color: 'bg-indigo-600' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{metric.label}</span>
                  <span className="text-muted-foreground">
                    {metric.value.toFixed(1)}/{metric.max}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
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
