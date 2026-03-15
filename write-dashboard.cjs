const fs = require('fs');

const content = import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getUserPermissions } from '@/lib/permissions/actions';
import { cn } from '@/lib/utils';
import { 
  Calendar, Clock, Target, BookOpen, 
  FileText, LayoutDashboard, ChevronRight, 
  Wallet, Settings, Users, Activity, Sparkles 
} from 'lucide-react';

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
    .or(\client_id.eq.\,therapist_id.eq.\\)
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
    .from('wellness_goals')
    .select('*')
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

  queries.assignments = supabase
    .from('assignments')
    .select('id, title, due_date, status')
    .eq('client_id', profile?.id)
    .in('status', ['pending', 'in_progress'])
    .order('due_date')
    .limit(5)
    .then((r) => r.data || []);

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

  return (
    <div className="flex-1 space-y-6 animate-fade-in pb-8">
      {/* ── Welcome ──────────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-muted-foreground text-base">Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* ── Platform Stats (admin/manager only) ─────────────────── */}
      {canManageUsers && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Users className="h-4 w-4" />} label="Users" value={data.totalUsers} />
          <StatsCard icon={<Calendar className="h-4 w-4" />} label="Bookings" value={data.totalBookings} />
          <StatsCard icon={<Activity className="h-4 w-4 text-primary" />} label="Today" value={data.todayBookings} accent />
          <StatsCard icon={<Sparkles className="h-4 w-4" />} label="Active Plans" value={data.activeSubs} />
        </div>
      )}

      {/* ── Therapist quick stats ────────────────────────────────── */}
      {canUseTherapistTools && !canManageUsers && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Activity className="h-4 w-4 text-primary" />} label="Today's Sessions" value={data.todayClients} accent />
          <StatsCard icon={<Calendar className="h-4 w-4" />} label="Upcoming" value={data.nextBooking?.length || 0} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Upcoming Appointments ──────────────────────────────── */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col h-full border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary/70" />
                Upcoming Sessions
              </CardTitle>
              <Link href="/bookings" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 group">
                View all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {data.nextBooking?.length > 0 ? (
              <div className="space-y-3 flex-1">
                {data.nextBooking.map((b: any) => {
                  const otherPerson = canUseTherapistTools ? b.client?.full_name : b.therapist?.full_name;
                  return (
                    <div
                      key={b.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:bg-muted/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary group-hover:scale-105 transition-transform duration-300">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{otherPerson || 'Appointment'}</p>
                          <p className="text-muted-foreground text-sm tabular-nums mt-0.5">
                            {new Date(b.starts_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                            at{' '}
                            {new Date(b.starts_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={b.status === 'scheduled' ? 'default' : b.status === 'completed' ? 'secondary' : 'outline'}
                        className="mt-3 sm:mt-0 w-fit"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-card/30">
                <Calendar className="h-8 w-8 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm font-medium">No upcoming appointments</p>
                <Link href="/bookings" className="mt-4">
                  <Button variant="default" className="rounded-full px-6">Book a session</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Right Column ──────────────────────────────────────── */}
        <div className="space-y-6 flex flex-col">
          {/* Plan Info (clients) */}
          {!canUseTherapistTools && (
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary/70" />
                  Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">{data.plan?.name || 'Free Tier'}</span>
                  <Badge variant={data.plan ? 'default' : 'secondary'} className="rounded-full shadow-sm">
                    {data.plan ? 'Active' : 'Basic'}
                  </Badge>
                </div>
                {!data.plan && (
                  <Link href="/settings?section=billing">
                    <Button variant="outline" size="sm" className="w-full text-xs rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Wallet Balance */}
          {data.wallet && (
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary/70" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight tabular-nums mt-1">
                  {(data.wallet.balance_cents / 100).toFixed(2)}{' '}
                  <span className="text-muted-foreground text-base font-normal align-top">
                    {data.wallet.currency}
                  </span>
                </p>
                <Link href="/settings?section=billing" className="text-xs text-primary font-medium hover:underline mt-2 inline-block">
                  Top up balance
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="flex-1 shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-primary/70" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <QuickActionButton href="/bookings" icon={<Calendar className="h-4 w-4" />} label="Book Session" />
              <QuickActionButton href="/journal" icon={<BookOpen className="h-4 w-4" />} label="Write Journal" />
              <QuickActionButton href="/chat" icon={<LayoutDashboard className="h-4 w-4" />} label="Send Message" />
              <QuickActionButton href="/wellness" icon={<Target className="h-4 w-4" />} label="Resources" />
              
              {canUseTherapistTools && (
                <>
                  <QuickActionButton href="/therapist/clients" icon={<Users className="h-4 w-4" />} label="Client Directory" />
                  <QuickActionButton href="/availability" icon={<Clock className="h-4 w-4" />} label="Manage Availability" />
                </>
              )}
              {canManageUsers && (
                <>
                  <QuickActionButton href="/console/users" icon={<Users className="h-4 w-4" />} label="Manage Users" />
                  <QuickActionButton href="/console/permissions" icon={<Settings className="h-4 w-4" />} label="Permissions" />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Additional Rows ───────────────────────────────────────── */}
      {(data.goals?.length > 0 || data.journalEntries?.length > 0 || data.assignments?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Wellness Goals */}
          {data.goals?.length > 0 && (
            <Card className="shadow-sm border-border/60 lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary/70" />
                    Active Goals
                  </CardTitle>
                  <Link href="/wellness" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 group">
                    Manage <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.goals.map((goal: any) => (
                    <div key={goal.id} className="group rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:bg-muted/30 hover:-translate-y-0.5 hover:shadow-sm">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="truncate font-semibold text-foreground/90">{goal.title}</span>
                        <span className="text-muted-foreground text-xs font-semibold tabular-nums bg-muted px-2 py-0.5 rounded-full">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2 rounded-full overflow-hidden bg-muted" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Journal */}
          {data.journalEntries?.length > 0 && (
            <Card className="shadow-sm border-border/60 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary/70" />
                    Recent Journal
                  </CardTitle>
                  <Link href="/journal" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 group">
                    View all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {data.journalEntries.map((entry: any) => (
                    <Link
                      key={entry.id}
                      href={\/journal/\\}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:bg-muted/30 hover:shadow-sm cursor-pointer"
                    >
                      <div>
                        <p className="truncate text-sm font-semibold group-hover:text-primary transition-colors text-balance">
                          {entry.title || 'Untitled Entry'}
                        </p>
                        <p className="text-muted-foreground text-xs tabular-nums mt-1">
                          {new Date(entry.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {entry.mood && (
                        <Badge variant="outline" className="text-xs bg-card mt-2 sm:mt-0 shadow-sm border-border/80">
                          {entry.mood}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignments */}
          {data.assignments?.length > 0 && (
            <Card className="shadow-sm border-border/60 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary/70" />
                    Assignments
                  </CardTitle>
                  <Link href="/assignments" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 group">
                    View all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {data.assignments.map((a: any) => (
                    <Link
                      key={a.id}
                      href={\/assignments/\\}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:bg-muted/30 hover:shadow-sm cursor-pointer"
                    >
                      <div>
                        <p className="truncate text-sm font-semibold group-hover:text-primary transition-colors text-balance">{a.title}</p>
                        {a.due_date && (
                          <p className="text-muted-foreground text-xs tabular-nums mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due{' '}
                            {new Date(a.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={a.status === 'in_progress' ? 'default' : 'secondary'}
                        className="text-xs mt-2 sm:mt-0 shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                      >
                        {a.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Admin Quick Links ────────────────────────────────────── */}
      {canManageSystem && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickLink href="/console/features" title="Feature Flags" description="Control feature rollouts and overrides" />
          <QuickLink href="/console/audit" title="Audit Log" description="Monitor system events and actions" />
          <QuickLink href="/console/analytics" title="Analytics" description="Platform performance and insights" />
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function QuickActionButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Button variant="outline" size="sm" className="h-[42px] w-full justify-start text-sm group rounded-xl border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all duration-300 shadow-sm">
        <span className="mr-2 text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
        {label}
      </Button>
    </Link>
  );
}

function StatsCard({ label, value, accent, icon }: { label: string; value: number; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <Card
      className={cn(
        'bg-background relative flex w-full flex-col overflow-hidden transition-all duration-300 hover:shadow-card-hover border-border/60',
        accent ? 'border-primary/30 bg-primary/[0.02] shadow-[0_0_20px_rgba(var(--primary),0.05)]' : 'shadow-sm'
      )}
    >
      <CardContent className="px-5 pt-5 pb-4 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          {icon && <div className={cn("p-2 rounded-full", accent ? "bg-primary/10" : "bg-muted")}>{icon}</div>}
        </div>
        <p className={cn('text-3xl font-bold tracking-tight tabular-nums', accent && 'text-primary')}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string; }) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="hover:bg-muted/30 h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover border-border/60 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        <CardContent className="p-5 flex flex-col justify-center h-full">
          <p className="text-base font-semibold group-hover:text-primary transition-colors">{title}</p>
          <p className="text-muted-foreground mt-1.5 text-sm text-balance leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
;

fs.writeFileSync('src/app/(dashboard)/dashboard/page.tsx', content, 'utf8');
console.log('Successfully updated dashboard/page.tsx');
