import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type MoodPoint = {
  score: number;
  date: string;
};

const W = 260;
const H = 64;
const MAX = 5;
const MIN = 1;

function getCoords(points: MoodPoint[]) {
  const stepX = W / Math.max(1, points.length - 1);
  return points.map((point, i) => {
    const x = i * stepX;
    const y = H - ((point.score - MIN) / (MAX - MIN)) * H;
    return { x: +x.toFixed(1), y: +y.toFixed(1), score: point.score, date: point.date };
  });
}

function toLinePath(coords: ReturnType<typeof getCoords>) {
  return coords.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
}

function toAreaPath(coords: ReturnType<typeof getCoords>) {
  if (coords.length < 2) return '';
  const line = coords.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const last = coords[coords.length - 1];
  const first = coords[0];
  return `${line} L ${last.x} ${H} L ${first.x} ${H} Z`;
}

function getTrend(points: MoodPoint[]) {
  if (points.length < 2) return { direction: 'stable' as const, delta: 0 };
  const delta = +(points[points.length - 1].score - points[0].score).toFixed(1);
  if (delta > 0.3) return { direction: 'up' as const, delta };
  if (delta < -0.3) return { direction: 'down' as const, delta };
  return { direction: 'stable' as const, delta };
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
    .map((e) => ({ score: Number(e.score ?? 0), date: e.logged_at }))
    .filter((e) => e.score >= MIN && e.score <= MAX);

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Mood Trend</CardTitle>
          <CardDescription>Last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <div className="text-3xl opacity-40">📈</div>
            <p className="text-muted-foreground text-sm">
              No mood logs yet. Log your first mood to start tracking trends.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgMood = +(points.reduce((s, p) => s + p.score, 0) / points.length).toFixed(1);
  const minMood = Math.min(...points.map((p) => p.score));
  const maxMood = Math.max(...points.map((p) => p.score));
  const trend = getTrend(points);
  const coords = getCoords(points);
  const linePath = toLinePath(coords);
  const areaPath = toAreaPath(coords);

  const trendLabel =
    trend.direction === 'up'
      ? '↑ Improving'
      : trend.direction === 'down'
        ? '↓ Declining'
        : '→ Stable';
  const firstDate = new Date(points[0].date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const lastDate = new Date(points[points.length - 1].date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Mood Trend</CardTitle>
        <CardDescription>
          Last 14 days · {points.length} {points.length === 1 ? 'entry' : 'entries'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <p className="text-2xl leading-none font-bold tabular-nums">{avgMood}</p>
            <p className="text-muted-foreground mb-0.5 text-sm">/5 avg</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs tabular-nums">
              {minMood}–{maxMood}
            </span>
            <Badge
              className={cn(
                'text-xs capitalize',
                trend.direction === 'up' && 'bg-success/10 text-success border-success/20',
                trend.direction === 'down' &&
                  'bg-destructive/10 text-destructive border-destructive/20',
                trend.direction === 'stable' && 'bg-muted text-muted-foreground'
              )}
              variant="outline"
            >
              {trendLabel}
            </Badge>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="border-border/50 bg-muted/20 overflow-hidden rounded-[calc(var(--radius)*0.8)] border px-2 pt-2 pb-0">
          <svg
            viewBox={`0 0 ${W} ${H + 6}`}
            role="img"
            aria-label={`Mood trend sparkline, average ${avgMood} out of 5`}
            className="h-16 w-full"
          >
            <defs>
              <linearGradient id="mood-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Axis guides */}
            <line
              x1="0"
              y1={H}
              x2={W}
              y2={H}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
              className="text-foreground"
            />
            <line
              x1="0"
              y1={H / 2}
              x2={W}
              y2={H / 2}
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeWidth="1"
              strokeDasharray="4 3"
              className="text-foreground"
            />
            <line
              x1="0"
              y1="0"
              x2={W}
              y2="0"
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
              className="text-foreground"
            />

            {/* Area fill */}
            <path d={areaPath} fill="url(#mood-area-gradient)" className="text-primary" />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />

            {/* Dots — only render if not too many points */}
            {points.length <= 14 &&
              coords.map(({ x, y, score }, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={score === maxMood || score === minMood ? 2.5 : 1.75}
                  fill="currentColor"
                  className={cn(
                    score === maxMood
                      ? 'text-success'
                      : score === minMood
                        ? 'text-destructive'
                        : 'text-primary'
                  )}
                />
              ))}
          </svg>

          {/* Date range labels */}
          <div className="flex justify-between px-0.5 pt-0.5 pb-1.5">
            <span className="text-muted-foreground/60 text-[10px]">{firstDate}</span>
            <span className="text-muted-foreground/60 text-[10px]">{lastDate}</span>
          </div>
        </div>

        {/* Scale reference */}
        <div className="flex justify-between px-0.5">
          <span className="text-muted-foreground/50 text-[10px]">1 = Low</span>
          <span className="text-muted-foreground/50 text-[10px]">5 = High</span>
        </div>
      </CardContent>
    </Card>
  );
}
