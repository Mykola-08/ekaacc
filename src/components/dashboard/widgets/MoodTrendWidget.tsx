import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type MoodPoint = {
  score: number;
  date: string;
};

function toPath(points: MoodPoint[], width = 260, height = 64) {
  if (points.length < 2) return '';

  const max = 5;
  const min = 1;
  const stepX = width / Math.max(1, points.length - 1);

  return points
    .map((point, index) => {
      const x = index * stepX;
      const normalizedY = (point.score - min) / (max - min);
      const y = height - normalizedY * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function getTrend(points: MoodPoint[]) {
  if (points.length < 2) return { direction: 'stable', delta: 0 };
  const first = points[0].score;
  const last = points[points.length - 1].score;
  const delta = Number((last - first).toFixed(1));

  if (delta > 0.3) return { direction: 'up', delta };
  if (delta < -0.3) return { direction: 'down', delta };
  return { direction: 'stable', delta };
}

export async function MoodTrendWidget() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const since = new Date();
  since.setDate(since.getDate() - 14);

  const { data } = await supabase
    .from('mood_entries')
    .select('score, logged_at')
    .eq('user_id', user.id)
    .gte('logged_at', since.toISOString())
    .order('logged_at', { ascending: true });

  const points: MoodPoint[] = (data ?? [])
    .map((entry) => ({ score: Number(entry.score ?? 0), date: entry.logged_at }))
    .filter((entry) => entry.score >= 1 && entry.score <= 5);

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Mood Trend</CardTitle>
          <CardDescription>Last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No mood logs yet. Add one to see your trend.</p>
        </CardContent>
      </Card>
    );
  }

  const avgMood = Number((points.reduce((sum, point) => sum + point.score, 0) / points.length).toFixed(1));
  const trend = getTrend(points);
  const path = toPath(points);

  const trendLabel = trend.direction === 'up' ? 'Improving' : trend.direction === 'down' ? 'Declining' : 'Stable';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Mood Trend</CardTitle>
        <CardDescription>Last 14 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold tabular-nums">{avgMood}/5</p>
          <Badge
            className={cn(
              'capitalize',
              trend.direction === 'up' && 'bg-success/10 text-success',
              trend.direction === 'down' && 'bg-destructive/10 text-destructive',
              trend.direction === 'stable' && 'bg-muted text-muted-foreground'
            )}
            variant="secondary"
          >
            {trendLabel}
          </Badge>
        </div>

        <div className="rounded-lg border border-border/70 p-2">
          <svg viewBox="0 0 260 64" role="img" aria-label="Mood trend sparkline" className="h-16 w-full">
            <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
