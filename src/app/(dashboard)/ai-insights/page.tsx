import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon,
  ChartBarLineIcon,
  Brain02Icon,
  ArrowRight01Icon,
  TrendUpIcon,
  TrendDownIcon,
  HeartCheckIcon,
  BookOpen01Icon,
  CheckListIcon,
  Target01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

function moodLabel(avg: number) {
  if (avg >= 8) return { label: 'Great', color: 'text-success' };
  if (avg >= 6) return { label: 'Good',  color: 'text-primary' };
  if (avg >= 4) return { label: 'Fair',  color: 'text-warning' };
  return { label: 'Low', color: 'text-destructive' };
}

function MoodBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 70 ? 'bg-success' : pct >= 50 ? 'bg-primary' : pct >= 30 ? 'bg-warning' : 'bg-destructive';
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default async function AIInsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: journals },
    { data: goals },
    { data: assignments },
    { data: aiInsights },
  ] = await Promise.all([
    supabase
      .from('journal_entries')
      .select('id, title, mood, created_at')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('wellness_goals')
      .select('id, title, progress, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(5),
    supabase
      .from('assignments')
      .select('id, status')
      .or(`client_id.eq.${user.id},patient_id.eq.${user.id}`)
      .limit(20),
    supabase
      .from('ai_insights')
      .select('id, insight_type, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // Compute mood stats
  const moodEntries = (journals ?? []).filter((j) => j.mood != null);
  const avgMood = moodEntries.length
    ? moodEntries.reduce((s, j) => s + (j.mood as number), 0) / moodEntries.length
    : null;

  // Mood trend: compare last 7 vs previous 7 entries
  const last7 = moodEntries.slice(0, 7);
  const prev7 = moodEntries.slice(7, 14);
  const avgLast7 = last7.length ? last7.reduce((s, j) => s + (j.mood as number), 0) / last7.length : null;
  const avgPrev7 = prev7.length ? prev7.reduce((s, j) => s + (j.mood as number), 0) / prev7.length : null;
  const moodTrend =
    avgLast7 != null && avgPrev7 != null
      ? avgLast7 > avgPrev7 + 0.5 ? 'up' : avgLast7 < avgPrev7 - 0.5 ? 'down' : 'stable'
      : null;

  const journalStreak = (() => {
    let streak = 0;
    const today = new Date().toDateString();
    const sorted = [...(journals ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const seen = new Set<string>();
    for (const j of sorted) {
      const d = new Date(j.created_at).toDateString();
      if (!seen.has(d)) {
        seen.add(d);
        streak++;
      }
    }
    return streak;
  })();

  const completedAssignments = (assignments ?? []).filter((a) => a.status === 'completed').length;
  const totalAssignments = (assignments ?? []).length;
  const avgGoalProgress = (goals ?? []).length
    ? Math.round((goals ?? []).reduce((s, g) => s + (g.progress ?? 0), 0) / (goals ?? []).length)
    : null;

  const moodInfo = avgMood != null ? moodLabel(avgMood) : null;

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} className="size-5 text-primary" />
              AI Insights
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Personalized analysis of your wellness journey.
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 text-xs">
            <span className="size-1.5 rounded-full bg-success inline-block" />
            Last 30 days
          </Badge>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 @xl/main:grid-cols-4">
        {/* Mood */}
        <Card className={cn(
          'rounded-2xl',
          avgMood != null ? 'border-primary/20 bg-primary/5' : 'border-border/60'
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg Mood</p>
              <HugeiconsIcon icon={HeartCheckIcon} className="size-4 text-muted-foreground" />
            </div>
            {avgMood != null ? (
              <>
                <p className={cn('text-2xl font-bold tabular-nums', moodInfo?.color)}>
                  {avgMood.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">/10</span>
                </p>
                <div className="mt-2">
                  <MoodBar value={avgMood} />
                </div>
                <p className={cn('mt-1 text-xs font-medium', moodInfo?.color)}>{moodInfo?.label}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Journal Streak */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Journal Days</p>
              <HugeiconsIcon icon={BookOpen01Icon} className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{journalStreak}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {journalStreak > 0 ? 'days this month' : 'Start journaling'}
            </p>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Assignments</p>
              <HugeiconsIcon icon={CheckListIcon} className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {completedAssignments}<span className="text-sm font-normal text-muted-foreground">/{totalAssignments}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">completed</p>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Goal Progress</p>
              <HugeiconsIcon icon={Target01Icon} className="size-4 text-muted-foreground" />
            </div>
            {avgGoalProgress != null ? (
              <>
                <p className="text-2xl font-bold tabular-nums text-foreground">{avgGoalProgress}%</p>
                <div className="mt-2"><MoodBar value={avgGoalProgress} max={100} /></div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No active goals</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
        {/* Mood trend card */}
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HugeiconsIcon icon={ChartBarLineIcon} className="size-4 text-muted-foreground" />
                Mood Trend
              </CardTitle>
              {moodTrend && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
                  moodTrend === 'up' ? 'bg-success/10 text-success' : moodTrend === 'down' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                )}>
                  <HugeiconsIcon icon={moodTrend === 'up' ? TrendUpIcon : moodTrend === 'down' ? TrendDownIcon : HeartCheckIcon} className="size-3" />
                  {moodTrend === 'up' ? 'Improving' : moodTrend === 'down' ? 'Declining' : 'Stable'}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {moodEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">Start tracking your mood in journal entries to see trends here.</p>
                <Link href="/journal">
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs">
                    Open Journal
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {moodEntries.slice(0, 7).map((j) => (
                  <div key={j.id} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-xs text-muted-foreground tabular-nums">
                      {new Date(j.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1">
                      <MoodBar value={j.mood as number} />
                    </div>
                    <span className={cn('w-6 shrink-0 text-right text-xs font-semibold tabular-nums', moodLabel(j.mood as number).color)}>
                      {j.mood}
                    </span>
                  </div>
                ))}
                {moodEntries.length > 7 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{moodEntries.length - 7} more entries this month
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights / Recommendations */}
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={Brain02Icon} className="size-4 text-muted-foreground" />
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {(aiInsights ?? []).length > 0 ? (
              (aiInsights ?? []).map((insight) => (
                <div key={insight.id} className="rounded-xl border border-border/60 p-3">
                  <Badge variant="outline" className="text-xs capitalize mb-2">
                    {(insight.insight_type ?? 'insight').replace(/_/g, ' ')}
                  </Badge>
                  <p className="text-sm text-foreground leading-relaxed">
                    {typeof insight.content === 'string' ? insight.content : JSON.stringify(insight.content)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(insight.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))
            ) : (
              /* Auto-generated insights from data */
              <div className="space-y-2">
                {avgMood != null && (
                  <InsightChip
                    icon={HeartCheckIcon}
                    color={moodInfo?.color ?? 'text-muted-foreground'}
                    text={
                      avgMood >= 7
                        ? `Your mood has averaged ${avgMood.toFixed(1)}/10 this month — great progress!`
                        : avgMood >= 5
                        ? `Your mood averages ${avgMood.toFixed(1)}/10. Consistent journaling can help improve this.`
                        : `Your recent mood scores suggest you may benefit from discussing your feelings with your therapist.`
                    }
                  />
                )}
                {journalStreak >= 3 && (
                  <InsightChip
                    icon={BookOpen01Icon}
                    color="text-success"
                    text={`You've journaled on ${journalStreak} days this month — consistency is key to self-awareness.`}
                  />
                )}
                {journalStreak === 0 && (
                  <InsightChip
                    icon={BookOpen01Icon}
                    color="text-muted-foreground"
                    text="Try writing a short journal entry today — even a few sentences can improve mental clarity."
                  />
                )}
                {completedAssignments > 0 && (
                  <InsightChip
                    icon={CheckListIcon}
                    color="text-primary"
                    text={`You've completed ${completedAssignments} of ${totalAssignments} assignments. Keep going!`}
                  />
                )}
                {avgGoalProgress != null && avgGoalProgress >= 50 && (
                  <InsightChip
                    icon={Target01Icon}
                    color="text-success"
                    text={`You're ${avgGoalProgress}% through your active goals on average — you're making real progress.`}
                  />
                )}
                {avgMood == null && journalStreak === 0 && (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Start journaling and tracking your mood to unlock personalized insights.
                    </p>
                    <Link href="/journal">
                      <Button size="sm" className="gap-2 rounded-full">
                        <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
                        Start Journaling
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Goals preview */}
      {(goals ?? []).length > 0 && (
        <div className="px-4 lg:px-6">
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={Target01Icon} className="size-4 text-muted-foreground" />
                  Active Goals
                </CardTitle>
                <Link href="/goals">
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    View all
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {(goals ?? []).map((g) => (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{g.title}</p>
                      <span className="text-xs font-semibold text-primary tabular-nums">{g.progress ?? 0}%</span>
                    </div>
                    <MoodBar value={g.progress ?? 0} max={100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InsightChip({ icon, color, text }: { icon: any; color: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3">
      <HugeiconsIcon icon={icon} className={cn('size-4 mt-0.5 shrink-0', color)} />
      <p className="text-sm text-foreground leading-relaxed">{text}</p>
    </div>
  );
}
