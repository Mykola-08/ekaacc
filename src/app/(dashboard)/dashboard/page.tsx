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
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChartUpIcon, Calendar03Icon, Wallet01Icon, Target01Icon, UserGroupIcon } from '@hugeicons/core-free-icons';


// ─── Permission helper ─────────────────────────────────────────────

function can(permissions: any[], group: string, action: string): boolean {
  return permissions.some(
    (p) => p.group === group && (p.action === action || p.action === 'manage')
  );
}

// ─── Greeting ──────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
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

  // ── Parallel data fetching based on permissions ──────────────────

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const canViewAllPatients = can(permissions, 'patient_data', 'view_all');
  const canManageAppointments = can(permissions, 'appointment_management', 'manage');
  const canManageSystem = can(permissions, 'system_settings', 'manage');
  const canManageUsers = can(permissions, 'user_management', 'manage');
  const canUseTherapistTools = can(permissions, 'therapist_tools', 'create');

  // Build parallel queries based on what the user can see
  const queries: Record<string, PromiseLike<any>> = {};

  // Everyone: own upcoming bookings
  queries.nextBooking = supabase
    .from('bookings')
    .select('*, therapist:therapist_id(full_name), client:client_id(full_name)')
    .or(`client_id.eq.${profile?.id},therapist_id.eq.${profile?.id}`)
    .eq('status', 'scheduled')
    .gte('starts_at', now)
    .order('starts_at')
    .limit(5)
    .then((r) => r.data || []);

  // Everyone: wallet
  queries.wallet = supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()
    .then((r) => r.data);

  // Clients: wellness goals
  queries.goals = supabase
    .from('wellness_goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(6)
    .then((r) => r.data || []);

  // Clients: active plan
  queries.plan = supabase
    .from('user_subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', profile?.id)
    .eq('status', 'active')
    .single()
    .then((r) => r.data?.subscription_plans);

  // Clients: recent journal entries
  queries.journalEntries = supabase
    .from('journal_entries')
    .select('id, title, created_at, mood')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)
    .then((r) => r.data || []);

  // Clients: active assignments / homework
  queries.assignments = supabase
    .from('assignments')
    .select('id, title, due_date, status')
    .eq('client_id', profile?.id)
    .in('status', ['pending', 'in_progress'])
    .order('due_date')
    .limit(5)
    .then((r) => r.data || []);

  // Admin/Manager: platform stats
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

  // Therapist: today's client count
  if (canUseTherapistTools) {
    queries.todayClients = supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('therapist_id', profile?.id)
      .eq('status', 'scheduled')
      .gte('starts_at', today)
      .then((r) => r.count || 0);
  }

  // Resolve all queries
  const keys = Object.keys(queries);
  const values = await Promise.all(Object.values(queries));
  const data: Record<string, any> = {};
  keys.forEach((k, i) => (data[k] = values[i]));

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* ── Welcome ──────────────────────────────────────────────── */}
      <div className="px-4 lg:px-6">
        <p className="text-muted-foreground text-sm">
          {getGreeting()}, {firstName}. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* ── Platform Stats (admin/manager only) ─────────────────── */}
      {canManageUsers && (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatsCard label="Total Users" value={data.totalUsers} icon={UserGroupIcon} />
          <StatsCard label="All Bookings" value={data.totalBookings} icon={Calendar03Icon} />
          <StatsCard label="Today" value={data.todayBookings} icon={ChartUpIcon} accent />
          <StatsCard label="Active Plans" value={data.activeSubs} icon={Target01Icon} />
        </div>
      )}

      {/* ── Therapist quick stats ────────────────────────────────── */}
      {canUseTherapistTools && !canManageUsers && (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <StatsCard label="Today's Sessions" value={data.todayClients} icon={Calendar03Icon} accent />
          <StatsCard label="Upcoming" value={data.nextBooking?.length || 0} icon={ChartUpIcon} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        {/* ── Upcoming Appointments ──────────────────────────────── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription>Upcoming</CardDescription>
            <CardAction>
              <Link href="/bookings">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View all
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {data.nextBooking?.length > 0 ? (
              <div className="space-y-3">
                {data.nextBooking.map((b: any) => {
                  const otherPerson = canUseTherapistTools
                    ? b.client?.full_name
                    : b.therapist?.full_name;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary h-8 w-1 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">{otherPerson || 'Appointment'}</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(b.starts_at).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at{' '}
                            {new Date(b.starts_at).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          b.status === 'scheduled'
                            ? 'default'
                            : b.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">No upcoming appointments</p>
                <Link href="/bookings" className="mt-4 flex justify-center">
                  <Button variant="default">Book a session</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Right Column ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardDescription>Quick Actions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1.5">
              <Link href="/bookings">
                <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                  Book Session
                </Button>
              </Link>
              <Link href="/journal">
                <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                  Write Journal
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                  Send Message
                </Button>
              </Link>
              <Link href="/wellness">
                <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                  Resources
                </Button>
              </Link>
              {canUseTherapistTools && (
                <>
                  <Link href="/therapist/clients">
                    <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                      Client Directory
                    </Button>
                  </Link>
                  <Link href="/availability">
                    <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                      Manage Availability
                    </Button>
                  </Link>
                </>
              )}
              {canManageUsers && (
                <>
                  <Link href="/console/users">
                    <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/console/permissions">
                    <Button variant="outline" size="sm" className="h-8 w-full justify-start text-xs">
                      Permissions
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Plan Info (clients) */}
          {!canUseTherapistTools && (
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Plan</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Upgrade Plan
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          )}

          {/* Wallet Balance */}
          {data.wallet && (
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Balance</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {(data.wallet.balance_cents / 100).toFixed(2)}{' '}
                  <span className="text-muted-foreground text-sm font-normal">
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
            </Card>
          )}
        </div>
      </div>

      {/* ── Wellness Goals (clients) ─────────────────────────────── */}
      {data.goals?.length > 0 && (
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardDescription>Active Goals</CardDescription>
              <CardAction>
                <Link href="/wellness">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Manage
                  </Button>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.goals.map((goal: any) => (
                  <div key={goal.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium">{goal.title}</span>
                      <span className="text-muted-foreground text-xs">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="mt-2 h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Journal & Assignments ────────────────────────────────── */}
      {(data.journalEntries?.length > 0 || data.assignments?.length > 0) && (
        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
          {/* Recent Journal */}
          {data.journalEntries?.length > 0 && (
            <Card>
              <CardHeader>
                <CardDescription>Recent Journal</CardDescription>
                <CardAction>
                  <Link href="/journal">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View all
                    </Button>
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.journalEntries.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="truncate text-sm font-medium">
                          {entry.title || 'Untitled'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(entry.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {entry.mood && (
                        <Badge variant="outline" className="text-xs">
                          {entry.mood}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignments / Homework */}
          {data.assignments?.length > 0 && (
            <Card>
              <CardHeader>
                <CardDescription>Assignments</CardDescription>
                <CardAction>
                  <Link href="/assignments">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View all
                    </Button>
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.assignments.map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="truncate text-sm font-medium">{a.title}</p>
                        {a.due_date && (
                          <p className="text-muted-foreground text-xs">
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
                        className="text-xs"
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
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6">
          <QuickLink
            href="/console/features"
            title="Feature Flags"
            description="Control feature rollouts and overrides"
          />
          <QuickLink
            href="/console/audit"
            title="Audit Log"
            description="Monitor system events and actions"
          />
          <QuickLink
            href="/console/analytics"
            title="Analytics"
            description="Platform performance and insights"
          />
        </div>
      )}
    </div>
  );
}

function StatsCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: any;
  accent?: boolean;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className={cn('text-2xl font-semibold tabular-nums @[250px]/card:text-3xl', accent && 'text-primary')}>
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <HugeiconsIcon icon={icon} strokeWidth={2} />
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 h-full transition-colors">
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-sm">{description}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
