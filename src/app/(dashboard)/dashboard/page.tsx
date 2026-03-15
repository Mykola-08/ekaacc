import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getUserPermissions } from '@/lib/permissions/actions';
import { cn } from '@/lib/utils';

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
    <div className="flex-1 space-y-4">
      <div className="flex flex-col space-y-6">
        {/* ── Welcome ──────────────────────────────────────────────── */}
        <p className="text-muted-foreground text-sm">
          {getGreeting()}, {firstName}. Here&apos;s what&apos;s happening today.
        </p>

        {/* ── Platform Stats (admin/manager only) ─────────────────── */}
        {canManageUsers && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Users" value={data.totalUsers} />
            <StatsCard label="Bookings" value={data.totalBookings} />
            <StatsCard label="Today" value={data.todayBookings} accent />
            <StatsCard label="Active Plans" value={data.activeSubs} />
          </div>
        )}

        {/* ── Therapist quick stats ────────────────────────────────── */}
        {canUseTherapistTools && !canManageUsers && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Today's Sessions" value={data.todayClients} accent />
            <StatsCard label="Upcoming" value={data.nextBooking?.length || 0} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* ── Upcoming Appointments ──────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    View all
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {data.nextBooking?.length > 0 ? (
                <div className="space-y-4">
                  {data.nextBooking.map((b: any) => {
                    const otherPerson = canUseTherapistTools
                      ? b.client?.full_name
                      : b.therapist?.full_name;
                    return (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-2xl border p-3"
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
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full justify-start text-xs"
                      >
                        Client Directory
                      </Button>
                    </Link>
                    <Link href="/availability">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full justify-start text-xs"
                      >
                        Manage Availability
                      </Button>
                    </Link>
                  </>
                )}
                {canManageUsers && (
                  <>
                    <Link href="/console/users">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full justify-start text-xs"
                      >
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/console/permissions">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full justify-start text-xs"
                      >
                        Permissions
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Plan Info (clients) */}
            {!canUseTherapistTools && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Plan</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.plan?.name || 'Free'}</span>
                    <Badge variant={data.plan ? 'default' : 'secondary'}>
                      {data.plan ? 'Active' : 'Basic'}
                    </Badge>
                  </div>
                  {!data.plan && (
                    <Link href="/settings?section=billing">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Upgrade Plan
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Wallet Balance */}
            {data.wallet && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold tracking-tight">
                    {(data.wallet.balance_cents / 100).toFixed(2)}{' '}
                    <span className="text-muted-foreground text-sm font-normal">
                      {data.wallet.currency}
                    </span>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ── Wellness Goals (clients) ─────────────────────────────── */}
        {data.goals?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Link href="/wellness">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Manage
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.goals.map((goal: any) => (
                  <div key={goal.id} className="rounded-2xl border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium">{goal.title}</span>
                      <span className="text-muted-foreground text-xs">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Journal & Assignments ────────────────────────────────── */}
        {(data.journalEntries?.length > 0 || data.assignments?.length > 0) && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Recent Journal */}
            {data.journalEntries?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Recent Journal</CardTitle>
                    <Link href="/journal">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View all
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.journalEntries.map((entry: any) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between rounded-2xl border p-3"
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
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                    <Link href="/assignments">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View all
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.assignments.map((a: any) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between rounded-2xl border p-3"
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
    </div>
  );
}

function StatsCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card
      className={cn(
        'bg-background relative flex w-full flex-col overflow-hidden',
        accent && 'border-primary/50'
      )}
    >
      <CardContent className="px-4 pt-4 pb-3">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className={cn('mt-1 text-2xl font-semibold tracking-tight', accent && 'text-primary')}>
          {value}
        </p>
      </CardContent>
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
        <CardContent className="px-4 pt-4 pb-3">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
