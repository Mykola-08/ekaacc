import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export default async function TherapistTodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date();
  const dayStart = startOfDay(today).toISOString();
  const dayEnd = endOfDay(today).toISOString();

  const [{ data: sessions, error: sessionsError }, { data: pendingAssignments, error: assignmentsError }] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, starts_at, status, service_name, client_name')
      .eq('therapist_id', user.id)
      .gte('starts_at', dayStart)
      .lte('starts_at', dayEnd)
      .order('starts_at', { ascending: true }),
    supabase
      .from('assignments')
      .select('id, title, status, due_date')
      .eq('therapist_id', user.id)
      .in('status', ['assigned', 'in_progress'])
      .order('due_date', { ascending: true })
      .limit(8),
  ]);

  const todaysSessions = sessions ?? [];
  const activeAssignments = pendingAssignments ?? [];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Therapist Today</CardTitle>
          <CardDescription>
            Operational view for sessions, follow-ups, and quick daily priorities.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Sessions scheduled</p>
            <p className="text-xl font-semibold">{todaysSessions.length}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Active assignments</p>
            <p className="text-xl font-semibold">{activeAssignments.length}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-xl font-semibold">{todaysSessions.length > 0 ? 'In flow' : 'No sessions'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Today&apos;s Sessions</CardTitle>
          <CardDescription>
            {sessionsError ? 'Session data unavailable right now.' : 'Timeline for today.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {todaysSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions scheduled today.</p>
          ) : (
            todaysSessions.map((session: any) => (
              <div key={session.id} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{session.client_name ?? 'Client session'}</p>
                  <Badge variant="secondary" className="capitalize">{session.status ?? 'scheduled'}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{session.service_name ?? 'Session'}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {session.starts_at ? new Date(session.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Pending assignment reviews</CardTitle>
          <CardDescription>
            {assignmentsError ? 'Assignment data unavailable right now.' : 'Follow-up tasks requiring therapist attention.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {activeAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending assignment reviews.</p>
          ) : (
            activeAssignments.map((assignment: any) => (
              <div key={assignment.id} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{assignment.title ?? 'Assignment'}</p>
                  <Badge variant="outline" className="capitalize">{assignment.status ?? 'assigned'}</Badge>
                </div>
                {assignment.due_date && (
                  <p className="mt-1 text-xs text-muted-foreground">Due {new Date(assignment.due_date).toLocaleDateString()}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
