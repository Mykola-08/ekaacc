import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('auth_id', user.id).single();
  const role = profile?.role || 'client';

  // --- ADMIN DASHBOARD ---
  if (role === 'admin') {
    return (
      <div className="space-y-8 p-8 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Admin Command Center</h1>
          <p className="text-muted-foreground text-lg">System status and deep control.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/features" className="group">
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                  Feature Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Control feature flags hierarchy, manage rollouts, and set user overrides.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/audit" className="group">
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">Global Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Monitor all system events, user actions, and security alerts.</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-300 opacity-60">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Impersonate users, manage roles, and track manual purchases.</p>
              <Badge variant="outline" className="mt-2">Coming Soon</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- THERAPIST DASHBOARD ---
  if (role === 'therapist') {
    const { data: todayBookings } = await supabase
      .from('bookings')
      .select('*, profiles:client_id(full_name)')
      .eq('therapist_id', profile.id)
      .eq('status', 'scheduled')
      .gte('starts_at', new Date().toISOString().split('T')[0]) // Today onwards
      .order('starts_at')
      .limit(5);

    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Therapist Workspace</h1>
            <p className="text-muted-foreground">Manage your sessions and patients.</p>
          </div>
          <Button className="btn-primary">Start Session</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10 pb-3">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {todayBookings?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No upcoming sessions today.</div>
              ) : (
                <div className="space-y-3">
                  {todayBookings?.map((b: any) => (
                    <div key={b.id} className="flex justify-between items-center border p-4 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-1 bg-primary rounded-full"></div>
                        <div>
                          <div className="font-semibold text-foreground">{b.profiles?.full_name || 'Client'}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{new Date(b.starts_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-[10px] h-5">{b.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8">Details</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
               <CardHeader className="pb-2"><CardTitle className="text-sm uppercase text-muted-foreground">Quick Actions</CardTitle></CardHeader>
               <CardContent className="flex flex-col gap-2 pt-2">
                 <Button variant="ghost" className="justify-start h-10 px-2 font-normal hover:bg-accent/50">📅 My Availability</Button>
                 <Button variant="ghost" className="justify-start h-10 px-2 font-normal hover:bg-accent/50">👥 Patient Directory</Button>
                 <Button variant="ghost" className="justify-start h-10 px-2 font-normal hover:bg-accent/50">💶 Invoices & Payouts</Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // --- CLIENT DASHBOARD ---

  // Parallel fetch for Client Data
  const [
    bookingsRes,
    walletRes,
    goalsRes,
    subRes
  ] = await Promise.all([
    supabase.from('bookings')
      .select('*, profiles:therapist_id(full_name)')
      .eq('client_id', profile.id)
      .eq('status', 'scheduled')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')
      .limit(1),
    supabase.from('wallets').select('*').eq('user_id', user.id).single(),
    supabase.from('wellness_goals').select('*').eq('user_id', user.id).eq('status', 'active'),
    supabase.from('user_subscriptions').select('*, subscription_plans(*)').eq('user_id', profile.id).eq('status', 'active').single()
  ]);

  const nextBooking = bookingsRes.data?.[0];
  const wallet = walletRes.data;
  const goals = goalsRes.data || [];
  const plan = subRes.data?.subscription_plans;

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}, <span className="font-semibold text-primary">{profile.full_name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground text-lg font-light">Your wellness journey is on track.</p>
        </div>
        <div className="flex gap-2">
           {wallet && (
             <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full border">
                <span className="text-sm font-medium">Balance:</span>
                <span className="font-bold">{(wallet.balance_cents / 100).toFixed(2)} {wallet.currency}</span>
             </div>
           )}
           <Link href="/book">
             <Button className="btn-primary">Book New Session</Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Session Card */}
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Next Session</CardTitle>
          </CardHeader>
          <CardContent>
            {nextBooking ? (
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight">
                    {new Date(nextBooking.starts_at).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {new Date(nextBooking.starts_at).toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'})}
                  </div>
                  <div className="flex items-center gap-2 pt-2 mt-4">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                      {nextBooking.profiles?.full_name?.[0]}
                    </div>
                    <span className="text-sm font-medium">with {nextBooking.profiles?.full_name}</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                   {/* Visual decoration or action */}
                   <Button variant="outline">Reschedule</Button>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-start gap-4">
                <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                <Link href="/book">
                  <Button className="btn-primary">Book Appointment</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan & Status */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{plan?.name || 'Free Tier'}</span>
              <Badge variant={plan ? 'default' : 'secondary'}>{plan ? 'Active' : 'Basic'}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {plan?.description || 'Upgrade to unlock premium features and priority booking.'}
            </p>
            {!plan && (
              <Button size="sm" variant="outline" className="w-full">Upgrade Plan</Button>
            )}
          </CardContent>
        </Card>

        {/* Goals Section */}
        <Card className="shadow-sm hover:shadow-md transition-all lg:col-span-3">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Goals</CardTitle>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">Manage Goals</Button>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal: any) => (
                  <div key={goal.id} className="border p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{goal.title}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Set wellness goals to track your progress.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
