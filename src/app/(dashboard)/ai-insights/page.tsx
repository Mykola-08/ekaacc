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
  HeartCheckIcon,
  BookOpen01Icon,
  CheckListIcon,
  Target01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

function moodLabel(avg: number) {
  if (avg >= 8) return { label: 'Great', color: 'text-success' };
  if (avg >= 6) return { label: 'Good', color: 'text-primary' };
  if (avg >= 4) return { label: 'Fair', color: 'text-warning' };
  return { label: 'Low', color: 'text-destructive' };
}

function MoodBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 70
      ? 'bg-success'
      : pct >= 50
        ? 'bg-primary'
        : pct >= 30
          ? 'bg-warning'
          : 'bg-destructive';
  return (
    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
      <div
        className={cn('h-full rounded-full transition-all', color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

type AIBlock = {
  id: 'goal-update' | 'journal-saved' | 'assignment' | 'quick-actions' | 'crisis-support';
  title: string;
  description: string;
  href: string;
  icon: any;
  tone?: 'default' | 'positive' | 'warning';
};

function buildAIBlocks({
  avgGoalProgress,
  journalStreak,
  completedAssignments,
  totalAssignments,
  avgMood,
  moodTrend,
}: {
  avgGoalProgress: number | null;
  journalStreak: number;
  completedAssignments: number;
  totalAssignments: number;
  avgMood: number | null;
  moodTrend: 'up' | 'down' | 'stable' | null;
}): AIBlock[] {
  return [
    {
      id: 'goal-update',
      title: 'Goal Update',
      description:
        avgGoalProgress == null
          ? 'No active goals yet. Create one to start receiving progress nudges.'
          : `Your active goals are ${avgGoalProgress}% complete on average.`,
      href: '/goals',
      icon: Target01Icon,
      tone: avgGoalProgress != null && avgGoalProgress >= 60 ? 'positive' : 'default',
    },
    {
      id: 'journal-saved',
      title: 'Journal Saved',
      description:
        journalStreak > 0
          ? `You have journaled on ${journalStreak} day${journalStreak === 1 ? '' : 's'} this month.`
          : 'No journal entries yet this month. A short note today can unlock better insights.',
      href: '/journal',
      icon: BookOpen01Icon,
      tone: journalStreak >= 3 ? 'positive' : 'default',
    },
    {
      id: 'assignment',
      title: 'Assignment Focus',
      description:
        totalAssignments === 0
          ? 'No assignments available right now.'
          : `${completedAssignments}/${totalAssignments} assignments completed.`,
      href: '/assignments',
      icon: CheckListIcon,
      tone:
        totalAssignments > 0 && completedAssignments === totalAssignments ? 'positive' : 'default',
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      description: 'Book a session, message your therapist, or open wellness tools in one tap.',
      href: '/dashboard',
      icon: SparklesIcon,
      tone: 'default',
    },
    {
      id: 'crisis-support',
      title: 'Crisis Support',
      description:
        avgMood != null && (avgMood <= 3.5 || moodTrend === 'down')
          ? 'Your recent mood looks lower. Please contact your therapist or local emergency services if needed.'
          : 'If you feel unsafe, contact local emergency services immediately or reach out to your support network.',
      href: '/resources',
      icon: HeartCheckIcon,
      tone: avgMood != null && (avgMood <= 3.5 || moodTrend === 'down') ? 'warning' : 'default',
    },
  ];
}

export default async function AIInsightsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: journals }, { data: goals }, { data: assignments }, { data: aiInsights }] =
    await Promise.all([
      supabase
        .from('journal_entries')
        .select('id, title, mood, created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })
        .limit(30),
      supabase
        .from('goals')
        .select('id, title, progress_percentage, status')
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
  const avgLast7 = last7.length
    ? last7.reduce((s, j) => s + (j.mood as number), 0) / last7.length
    : null;
  const avgPrev7 = prev7.length
    ? prev7.reduce((s, j) => s + (j.mood as number), 0) / prev7.length
    : null;
  const moodTrend =
    avgLast7 != null && avgPrev7 != null
      ? avgLast7 > avgPrev7 + 0.5
        ? 'up'
        : avgLast7 < avgPrev7 - 0.5
          ? 'down'
          : 'stable'
      : null;

  const journalStreak = (() => {
    let streak = 0;
    const today = new Date().toDateString();
    const sorted = [...(journals ?? [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
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
    ? Math.round(
        (goals ?? []).reduce((s, g) => s + (g.progress_percentage ?? 0), 0) /
          (goals ?? []).length
      )
    : null;

  const moodInfo = avgMood != null ? moodLabel(avgMood) : null;
  const aiBlocks = buildAIBlocks({
    avgGoalProgress,
    journalStreak,
    completedAssignments,
    totalAssignments,
    avgMood,
    moodTrend,
  });

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <HugeiconsIcon icon={SparklesIcon} className="text-primary size-5" />
              AI Insights
            </h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Personalized analysis of your wellness journey.
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 text-xs">
            <span className="bg-success inline-block size-1.5 rounded-full" />
            Last 30 days
          </Badge>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 @xl/main:grid-cols-4">
        {/* Mood */}
        <Card
          className={cn(
            'rounded-2xl',
            avgMood != null ? 'border-primary/20 bg-primary/5' : 'border-border/60'
          )}
        >
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Avg Mood</p>
              <HugeiconsIcon icon={HeartCheckIcon} className="text-muted-foreground size-4" />
            </div>
            {avgMood != null ? (
              <>
                <p className={cn('text-2xl font-bold tabular-nums', moodInfo?.color)}>
                  {avgMood.toFixed(1)}
                  <span className="text-muted-foreground text-sm font-normal">/10</span>
                </p>
                <div className="mt-2">
                  <MoodBar value={avgMood} />
                </div>
                <p className={cn('mt-1 text-xs font-medium', moodInfo?.color)}>{moodInfo?.label}</p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Journal Streak */}
        <Card className="border-border/60 rounded-2xl">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Journal Days</p>
              <HugeiconsIcon icon={BookOpen01Icon} className="text-muted-foreground size-4" />
            </div>
            <p className="text-foreground text-2xl font-bold tabular-nums">{journalStreak}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {journalStreak > 0 ? 'days this month' : 'Start journaling'}
            </p>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="border-border/60 rounded-2xl">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Assignments</p>
              <HugeiconsIcon icon={CheckListIcon} className="text-muted-foreground size-4" />
            </div>
            <p className="text-foreground text-2xl font-bold tabular-nums">
              {completedAssignments}
              <span className="text-muted-foreground text-sm font-normal">/{totalAssignments}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">completed</p>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="border-border/60 rounded-2xl">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Goal Progress</p>
              <HugeiconsIcon icon={Target01Icon} className="text-muted-foreground size-4" />
            </div>
            {avgGoalProgress != null ? (
              <>
                <p className="text-foreground text-2xl font-bold tabular-nums">
                  {avgGoalProgress}%
                </p>
                <div className="mt-2">
                  <MoodBar value={avgGoalProgress} max={100} />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No active goals</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="border-border/60 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <HugeiconsIcon icon={SparklesIcon} className="text-muted-foreground size-4" />
              AI Action Blocks
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              {aiBlocks.map((block) => (
                <Link
                  key={block.id}
                  href={block.href}
                  className="border-border/60 hover:bg-muted/30 rounded-xl border p-3 transition"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <HugeiconsIcon
                      icon={block.icon}
                      className={cn(
                        'size-4',
                        block.tone === 'positive'
                          ? 'text-success'
                          : block.tone === 'warning'
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                      )}
                    />
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      {block.id}
                    </p>
                  </div>
                  <p className="text-foreground text-sm font-semibold">{block.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{block.description}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
        {/* Mood trend card */}
        <Card className="border-border/60 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon icon={ChartBarLineIcon} className="text-muted-foreground size-4" />
                Mood Trend
              </CardTitle>
              {moodTrend && (
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                    moodTrend === 'up'
                      ? 'bg-success/10 text-success'
                      : moodTrend === 'down'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  <HugeiconsIcon
                    icon={
                      moodTrend === 'up' || moodTrend === 'down' ? ChartBarLineIcon : HeartCheckIcon
                    }
                    className="size-3"
                  />
                  {moodTrend === 'up' ? 'Improving' : moodTrend === 'down' ? 'Declining' : 'Stable'}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {moodEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Start tracking your mood in journal entries to see trends here.
                </p>
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
                    <span className="text-muted-foreground w-16 shrink-0 text-xs tabular-nums">
                      {new Date(j.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <MoodBar value={j.mood as number} />
                    </div>
                    <span
                      className={cn(
                        'w-6 shrink-0 text-right text-xs font-semibold tabular-nums',
                        moodLabel(j.mood as number).color
                      )}
                    >
                      {j.mood}
                    </span>
                  </div>
                ))}
                {moodEntries.length > 7 && (
                  <p className="text-muted-foreground pt-1 text-center text-xs">
                    +{moodEntries.length - 7} more entries this month
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights / Recommendations */}
        <Card className="border-border/60 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <HugeiconsIcon icon={Brain02Icon} className="text-muted-foreground size-4" />
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {(aiInsights ?? []).length > 0 ? (
              (aiInsights ?? []).map((insight) => (
                <div key={insight.id} className="border-border/60 rounded-xl border p-3">
                  <Badge variant="outline" className="mb-2 text-xs capitalize">
                    {(insight.insight_type ?? 'insight').replace(/_/g, ' ')}
                  </Badge>
                  <p className="text-foreground text-sm leading-relaxed">
                    {typeof insight.content === 'string'
                      ? insight.content
                      : JSON.stringify(insight.content)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {new Date(insight.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
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
                    <p className="text-muted-foreground text-sm">
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
          <Card className="border-border/60 rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <HugeiconsIcon icon={Target01Icon} className="text-muted-foreground size-4" />
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
                      <p className="text-foreground text-sm font-medium">{g.title}</p>
                      <span className="text-primary text-xs font-semibold tabular-nums">
                        {g.progress_percentage ?? 0}%
                      </span>
                    </div>
                    <MoodBar value={g.progress_percentage ?? 0} max={100} />
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
    <div className="bg-muted/40 flex items-start gap-3 rounded-xl p-3">
      <HugeiconsIcon icon={icon} className={cn('mt-0.5 size-4 shrink-0', color)} />
      <p className="text-foreground text-sm leading-relaxed">{text}</p>
    </div>
  );
}
