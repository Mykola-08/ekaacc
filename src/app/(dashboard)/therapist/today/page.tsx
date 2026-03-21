import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  UserGroupIcon,
  CheckListIcon,
  ArrowRight01Icon,
  Clock01Icon,
  PlusSignIcon,
  NoteDoneIcon,
} from '@hugeicons/core-free-icons';

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default async function TherapistTodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('auth_id', user.id)
    .single();

  const therapistId = profile?.id ?? user.id;
  const today = new Date();
  const dayStart = startOfDay(today).toISOString();
  const dayEnd = endOfDay(today).toISOString();

  const [{ data: sessions }, { data: pendingAssignments }, { data: upcomingBookings }] =
    await Promise.all([
      supabase
        .from('bookings')
        .select('id, starts_at, ends_at, status, service_name, client_name, notes')
        .eq('therapist_id', therapistId)
        .gte('starts_at', dayStart)
        .lte('starts_at', dayEnd)
        .order('starts_at', { ascending: true }),
      supabase
        .from('assignments')
        .select('id, title, status, due_date, client_id')
        .eq('therapist_id', therapistId)
        .in('status', ['assigned', 'in_progress'])
        .order('due_date', { ascending: true })
        .limit(10),
      supabase
        .from('bookings')
        .select('id, starts_at, status, service_name, client_name')
        .eq('therapist_id', therapistId)
        .eq('status', 'scheduled')
        .gt('starts_at', dayEnd)
        .order('starts_at', { ascending: true })
        .limit(5),
    ]);

  const todaysSessions = sessions ?? [];
  const activeAssignments = pendingAssignments ?? [];
  const upcoming = upcomingBookings ?? [];

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const dayLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const completedToday = todaysSessions.filter((s: any) => s.status === 'completed').length;
  const remainingToday = todaysSessions.filter((s: any) => s.status === 'scheduled').length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Today, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">{dayLabel}</p>
        </div>
        <Link href="/book">
          <Button size="sm" className="shrink-0 gap-1.5">
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[var(--radius)] border border-border/60 bg-card p-3">
          <p className="text-xs text-muted-foreground">Scheduled</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{remainingToday}</p>
        </div>
        <div className="rounded-[var(--radius)] border border-border/60 bg-card p-3">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-primary">{completedToday}</p>
        </div>
        <div className="rounded-[var(--radius)] border border-border/60 bg-card p-3">
          <p className="text-xs text-muted-foreground">Pending tasks</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{activeAssignments.length}</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's sessions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar03Icon} className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Today&apos;s Sessions</CardTitle>
              </div>
              <CardAction>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    All bookings
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                  </Button>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              {todaysSessions.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No sessions scheduled today</p>
                  <Link href="/book">
                    <Button size="sm" variant="outline" className="mt-1">
                      Schedule a session
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {todaysSessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 rounded-[calc(var(--radius)*0.8)] border border-border/60 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-[calc(var(--radius)*0.8)] bg-muted text-center">
                        <span className="text-xs font-semibold leading-none text-foreground">
                          {session.starts_at ? formatTime(session.starts_at) : '—'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {session.client_name ?? 'Client'}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.service_name ?? 'Session'}
                          {session.ends_at && ` · until ${formatTime(session.ends_at)}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          session.status === 'completed'
                            ? 'secondary'
                            : session.status === 'scheduled'
                              ? 'default'
                              : 'outline'
                        }
                        className="shrink-0 capitalize text-xs"
                      >
                        {session.status ?? 'scheduled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1.5">
              {[
                { href: '/therapist/clients', icon: UserGroupIcon, label: 'Client Directory' },
                { href: '/therapist/assignments', icon: CheckListIcon, label: 'Assignments' },
                { href: '/availability', icon: Clock01Icon, label: 'Manage Availability' },
                { href: '/therapist/session-notes', icon: NoteDoneIcon, label: 'Session Notes' },
              ].map(({ href, icon, label }) => (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-full justify-start gap-2.5 rounded-[calc(var(--radius)*0.8)] px-3 text-xs font-medium"
                  >
                    <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" />
                    {label}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming (next days) */}
          {upcoming.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Coming Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcoming.map((b: any) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-[calc(var(--radius)*0.8)] border border-border/60 p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{b.client_name ?? 'Client'}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.starts_at ? formatDate(b.starts_at) + ' · ' + formatTime(b.starts_at) : '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Pending assignments */}
      {activeAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckListIcon} className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Pending Assignment Reviews</CardTitle>
            </div>
            <CardAction>
              <Link href="/therapist/assignments">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  View all
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeAssignments.map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-[calc(var(--radius)*0.8)] border border-border/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.title ?? 'Assignment'}</p>
                    {a.due_date && (
                      <p className="text-xs text-muted-foreground">Due {formatDate(a.due_date)}</p>
                    )}
                  </div>
                  <Badge
                    variant={a.status === 'in_progress' ? 'default' : 'outline'}
                    className="ml-2 shrink-0 capitalize text-xs"
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
  );
}
