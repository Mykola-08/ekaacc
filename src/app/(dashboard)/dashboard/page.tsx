import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getUserPermissions } from '@/lib/permissions/actions';
import { can } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ChartUpIcon,
  Calendar03Icon,
  Wallet01Icon,
  Target01Icon,
  UserGroupIcon,
  BookOpen01Icon,
  CheckListIcon,
  SparklesIcon,
  ArrowRight01Icon,
  Message01Icon,
  HeartCheckIcon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';
import { MoodQuickLog } from '@/components/dashboard/widgets/MoodQuickLog';
import { AIDailySummary } from '@/components/dashboard/widgets/AIDailySummary';
import { AIInsightCards } from '@/components/dashboard/widgets/AIInsightCards';
import { AIQuickActions } from '@/components/dashboard/widgets/AIQuickActions';
import { MoodTrendWidget } from '@/components/dashboard/widgets/MoodTrendWidget';
import { Suspense } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

// ─── Greeting ──────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getMoodEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤️';
  return '🌙';
}

function getConsecutiveDays(dates: string[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = new Set(
    dates.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (uniqueDays.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: profile }, permissions] = await Promise.all([
    supabase.from('profiles').select('*').eq('auth_id', user.id).single(),
    getUserPermissions(),
  ]);

  const role = profile?.role || 'client';
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const canViewAllPatients = can(permissions, 'patient_data', 'view_all');
  const canManageAppointments = can(permissions, 'appointment_management', 'manage');
  const canManageSystem = can(permissions, 'system_settings', 'manage');
  const canManageUsers = can(permissions, 'user_management', 'manage');
  const canUseTherapistTools = can(permissions, 'therapist_tools', 'create');

  const queries: Record<string, PromiseLike<any>> = {};

  queries.nextBooking = supabase
    .from('bookings')
    .select('*, therapist:therapist_id(full_name), client:client_id(full_name)')
    .or(`client_id.eq.${profile?.id},therapist_id.eq.${profile?.id}`)
    .eq('status', 'scheduled')
    .gte('starts_at', now)
    .order('starts_at')
    .limit(5)
    .then((r) => r.data || []);

  queries.wallet = supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()
    .then((r) => r.data);

  queries.goals = supabase
    .from('goals')
    .select('id, title, progress_percentage, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(6)
    .then((r) => r.data || []);

  queries.plan = supabase
    .from('user_subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', profile?.id)
    .eq('status', 'active')
    .single()
    .then((r) => r.data?.subscription_plans);

  queries.journalEntries = supabase
    .from('journal_entries')
    .select('id, title, created_at, mood')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)
    .then((r) => r.data || []);

  queries.activityForStreak = supabase
    .from('journal_entries')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString())
    .order('created_at', { ascending: false })
    .limit(45)
    .then((r) => r.data || []);

  queries.assignments = supabase
    .from('assignments')
    .select('id, title, due_date, status')
    .eq('client_id', profile?.id)
    .in('status', ['pending', 'in_progress'])
    .order('due_date')
    .limit(5)
    .then((r) => r.data || []);

  // Today's mood from mood_entries (new table) or fall back to journal_entries.mood
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  queries.todayMood = supabase
    .from('mood_entries')
    .select('score')
    .eq('user_id', user.id)
    .gte('logged_at', todayStart.toISOString())
    .order('logged_at', { ascending: false })
    .limit(1)
    .single()
    .then((r) => r.data?.score ?? null, () => null);

  if (canManageUsers) {
    queries.totalUsers = supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .then((r) => r.count || 0);

    queries.totalBookings = supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .then((r) => r.count || 0);

    queries.todayBookings = supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('starts_at', today)
      .then((r) => r.count || 0);

    queries.activeSubs = supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .then((r) => r.count || 0);
  }

  if (canUseTherapistTools) {
    queries.todayClients = supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('therapist_id', profile?.id)
      .eq('status', 'scheduled')
      .gte('starts_at', today)
      .then((r) => r.count || 0);
  }

  const keys = Object.keys(queries);
  const values = await Promise.all(Object.values(queries));
  const data: Record<string, any> = {};
  keys.forEach((k, i) => (data[k] = values[i]));
  const streakDays = getConsecutiveDays((data.activityForStreak ?? []).map((entry: any) => entry.created_at));

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* ── Welcome Banner ────────────────────────────────────────── */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {getGreeting()}, {firstName} {getMoodEmoji()}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {!canManageUsers && !canUseTherapistTools && (
              <p className="mt-1 text-xs text-muted-foreground">
                {streakDays > 0 ? `${streakDays}-day journal streak` : 'Start your first wellness streak today'}
              </p>
            )}
          </div>
          <Link href="/book">
            <Button size="sm" className="shrink-0 rounded-lg gap-1.5 hidden sm:flex">
              <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
              Book Session
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Mood Quick-Log (non-admin, non-therapist only) ───────── */}
      {!canManageUsers && !canUseTherapistTools && (
        <div>
          <MoodQuickLog todayScore={data.todayMood ?? null} />
        </div>
      )}

      {/* ── AI Widgets (patient/client only) ────────────────────── */}
      {!canManageUsers && !canUseTherapistTools && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIDailySummary />
          </div>
          <div className="flex flex-col gap-4">
            <AIQuickActions />
          </div>
        </div>
      )}

      {/* ── AI Insights (patient/client only) ────────────────────── */}
      {!canManageUsers && !canUseTherapistTools && (
        <div>
          <AIInsightCards />
        </div>
      )}

      {!canManageUsers && !canUseTherapistTools && (
        <div>
          <Suspense fallback={<MoodTrendSkeleton />}>
            <MoodTrendWidget />
          </Suspense>
        </div>
      )}

      {/* ── Platform Stats (admin/manager only) ─────────────────── */}
      {canManageUsers && (
        <div className="grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
          <DashStatsCard
            label="Total Users"
            value={data.totalUsers}
            icon={UserGroupIcon}
          />
          <DashStatsCard
            label="All Bookings"
            value={data.totalBookings}
            icon={Calendar03Icon}
          />
          <DashStatsCard
            label="Today's Sessions"
            value={data.todayBookings}
            icon={ChartUpIcon}
            accent
          />
          <DashStatsCard
            label="Active Plans"
            value={data.activeSubs}
            icon={Target01Icon}
          />
        </div>
      )}

      {/* ── Therapist quick stats ────────────────────────────────── */}
      {canUseTherapistTools && !canManageUsers && (
        <div className="grid grid-cols-2 gap-3">
          <DashStatsCard
            label="Today's Sessions"
            value={data.todayClients}
            icon={Calendar03Icon}
            accent
          />
          <DashStatsCard
            label="Upcoming"
            value={data.nextBooking?.length || 0}
            icon={Clock01Icon}
          />
        </div>
      )}

      {/* ── Main content row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Upcoming Appointments</CardTitle>
            <CardAction>
              <Link href="/bookings">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  View all
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {data.nextBooking?.length > 0 ? (
              <div className="space-y-2">
                {data.nextBooking.map((b: any) => {
                  const otherPerson = canUseTherapistTools
                    ? b.client?.full_name
                    : b.therapist?.full_name;
                  const startDate = new Date(b.starts_at);
                  return (
                    <div
                      key={b.id}
                      className="group flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40"
                    >
                      {/* Color accent bar */}
                      <div className="h-9 w-1 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {otherPerson || 'Appointment'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {startDate.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          ·{' '}
                          {startDate.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          b.status === 'scheduled'
                            ? 'default'
                            : b.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="shrink-0 capitalize text-xs"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <HugeiconsIcon icon={Calendar03Icon} className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No upcoming appointments</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Book a session to get started</p>
                </div>
                <Link href="/book">
                  <Button size="sm" className="mt-1 rounded-lg">
                    Book a Session
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Quick Actions */}
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
                  <CardDescription className="text-xs">Right-click for AI assist options</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-1.5">
                  <QuickAction href="/book" icon={Calendar03Icon} label="Book Session" />
                  <QuickAction href="/journal" icon={BookOpen01Icon} label="Write Journal" />
                  <QuickAction href="/chat" icon={Message01Icon} label="Send Message" />
                  <QuickAction href="/wellness" icon={HeartCheckIcon} label="Wellness" />
                  {canUseTherapistTools && (
                    <>
                      <QuickAction href="/therapist/clients" icon={UserGroupIcon} label="Client Directory" />
                      <QuickAction href="/availability" icon={Clock01Icon} label="Availability" />
                    </>
                  )}
                  {canManageUsers && (
                    <>
                      <QuickAction href="/console/users" icon={UserGroupIcon} label="Manage Users" />
                      <QuickAction href="/console/analytics" icon={ChartUpIcon} label="Analytics" />
                    </>
                  )}
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuLabel>AI Context Menu</ContextMenuLabel>
              <ContextMenuItem asChild inset>
                <Link href="/chat?prompt=Summarize%20my%20wellness%20signals%20for%20today">Summarize my day</Link>
              </ContextMenuItem>
              <ContextMenuItem asChild inset>
                <Link href="/chat?prompt=Give%20me%203%20personalized%20actions%20for%20today">Suggest 3 personalized actions</Link>
              </ContextMenuItem>
              <ContextMenuItem asChild inset>
                <Link href="/chat?prompt=Analyze%20my%20recent%20mood%20and%20journal%20trends">Analyze mood & journal trends</Link>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {/* Plan Info (clients) */}
          {!canUseTherapistTools && (
            <Card>
              <CardHeader>
                <CardDescription>Your Plan</CardDescription>
                <CardTitle className="text-xl font-bold tabular-nums">
                  {data.plan?.name || 'Free'}
                </CardTitle>
                <CardAction>
                  <Badge variant={data.plan ? 'default' : 'secondary'}>
                    {data.plan ? 'Active' : 'Basic'}
                  </Badge>
                </CardAction>
              </CardHeader>
              {!data.plan && (
                <CardFooter>
                  <Link href="/settings?section=billing" className="w-full">
                    <Button variant="outline" size="sm" className="w-full rounded-lg text-xs">
                      Upgrade Plan
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          )}

          {/* Wallet Balance */}
          {data.wallet && (
            <Card>
              <CardHeader>
                <CardDescription>Balance</CardDescription>
                <CardTitle className="text-xl font-bold tabular-nums">
                  {(data.wallet.balance_cents / 100).toFixed(2)}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    {data.wallet.currency}
                  </span>
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />
                    Wallet
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter>
                <Link href="/wallet" className="w-full">
                  <Button variant="outline" size="sm" className="w-full rounded-lg text-xs">
                    View Wallet
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* ── Wellness Goals ───────────────────────────────────────── */}
      {data.goals?.length > 0 && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Active Goals</CardTitle>
              <CardAction>
                <Link href="/wellness">
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    Manage
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                  </Button>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.goals.map((goal: any) => (
                  <div key={goal.id} className="rounded-xl border border-border/60 p-3.5">
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {goal.title}
                      </span>
                      <span className="ml-2 shrink-0 text-xs font-semibold text-primary">
                        {goal.progress_percentage ?? 0}%
                      </span>
                    </div>
                    <Progress value={goal.progress_percentage ?? 0} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Journal & Assignments ────────────────────────────────── */}
      {(data.journalEntries?.length > 0 || data.assignments?.length > 0) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.journalEntries?.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={BookOpen01Icon} className="size-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-semibold">Recent Journal</CardTitle>
                </div>
                <CardAction>
                  <Link href="/journal">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      View all
                      <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                    </Button>
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.journalEntries.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {entry.title || 'Untitled'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {entry.mood && (
                        <Badge variant="outline" className="ml-2 shrink-0 text-xs capitalize">
                          {entry.mood}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.assignments?.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckListIcon} className="size-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-semibold">Assignments</CardTitle>
                </div>
                <CardAction>
                  <Link href="/assignments">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      View all
                      <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                    </Button>
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.assignments.map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                        {a.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Due{' '}
                            {new Date(a.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={a.status === 'in_progress' ? 'default' : 'secondary'}
                        className="ml-2 shrink-0 text-xs"
                      >
                        {a.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Admin Quick Links ────────────────────────────────────── */}
      {canManageSystem && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AdminQuickLink
            href="/console/features"
            title="Feature Flags"
            description="Control feature rollouts and overrides"
            icon={SparklesIcon}
          />
          <AdminQuickLink
            href="/console/audit"
            title="Audit Log"
            description="Monitor system events and actions"
            icon={CheckListIcon}
          />
          <AdminQuickLink
            href="/console/analytics"
            title="Analytics"
            description="Platform performance and insights"
            icon={ChartUpIcon}
          />
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function MoodTrendSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-3 h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-16 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

function DashStatsCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number | null | undefined;
  icon: any;
  accent?: boolean;
}) {
  return (
    <Card className={cn(accent && 'border-primary/20')}>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs uppercase tracking-wider">{label}</CardDescription>
        <CardTitle
          className={cn(
            'text-2xl font-bold tabular-nums',
            accent && 'text-primary'
          )}
        >
          {value == null ? (
            <div className="mt-1 h-8 w-16 animate-pulse rounded-lg bg-muted" />
          ) : (
            value
          )}
        </CardTitle>
        <CardAction>
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl',
              accent
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <HugeiconsIcon icon={icon} className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-full justify-start gap-2.5 rounded-lg px-3 text-xs font-medium hover:bg-muted/60"
      >
        <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" />
        {label}
      </Button>
    </Link>
  );
}

function AdminQuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <Link href={href}>
      <Card className="group h-full cursor-pointer hover:bg-muted/30">
        <CardHeader>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <HugeiconsIcon icon={icon} className="size-4" />
          </div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
