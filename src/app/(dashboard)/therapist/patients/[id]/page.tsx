import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Mail01Icon,
  Call02Icon,
  BookOpen01Icon,
  NoteIcon,
  CheckListIcon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  Message01Icon,
  PlusSignIcon,
  File01Icon,
  UserIcon,
  HeartCheckIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

function getInitials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(d: string) {
  const date = new Date(d);
  return (
    date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' at ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
}

function StatBadge({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-[calc(var(--radius)*1.8)] border px-5 py-4 text-center',
        accent ? 'border-primary/20 bg-primary/5' : 'border-border bg-muted/30'
      )}
    >
      <span className={cn('text-2xl font-bold tabular-nums', accent && 'text-primary')}>
        {value}
      </span>
      <span className="text-muted-foreground mt-0.5 text-xs">{label}</span>
    </div>
  );
}

function moodColor(mood: number | null) {
  if (!mood) return 'text-muted-foreground';
  if (mood >= 8) return 'text-success';
  if (mood >= 5) return 'text-warning';
  return 'text-destructive';
}

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status === 'completed') return 'default';
  if (status === 'in_progress') return 'secondary';
  return 'outline';
}

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patient } = await supabase.from('profiles').select('*').eq('id', id).single();

  if (!patient) notFound();

  const [{ data: journals }, { data: assignments }, { data: bookings }, { data: sessionNotes }] =
    await Promise.all([
      supabase
        .from('journal_entries')
        .select('id, title, content, mood, created_at')
        .eq('user_id', patient.auth_id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('assignments')
        .select('id, title, description, status, due_date, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('bookings')
        .select('id, starts_at, ends_at, status, notes')
        .eq('client_id', id)
        .order('starts_at', { ascending: false })
        .limit(10),
      supabase
        .from('session_notes')
        .select('id, content, created_at, session_date')
        .eq('patient_id', id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  const totalSessions = bookings?.length ?? 0;
  const completedSessions = bookings?.filter((b) => b.status === 'completed').length ?? 0;
  const completedAssignments = assignments?.filter((a) => a.status === 'completed').length ?? 0;
  const totalAssignments = assignments?.length ?? 0;
  const lastSession = bookings?.find((b) => b.status === 'completed');
  const nextSession = bookings?.find(
    (b) => b.status === 'scheduled' && new Date(b.starts_at) > new Date()
  );

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* ── Back nav ─── */}
      <div className="px-4 lg:px-6">
        <Link href="/therapist/patients">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2 gap-1.5 rounded-full"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Patients
          </Button>
        </Link>
      </div>

      {/* ── Hero profile card ─── */}
      <div className="px-4 lg:px-6">
        <Card className="border-border/60 overflow-hidden rounded-[calc(var(--radius)*1.8)] border">
          {/* Top color band */}
          <div className="from-primary/20 via-primary/10 h-20 bg-gradient-to-r to-transparent" />
          <CardContent className="-mt-10 pb-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + name */}
              <div className="flex items-end gap-4">
                <Avatar className="border-card size-20 border-4 shadow-md">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {getInitials(patient.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <h1 className="text-foreground text-xl font-bold">
                    {patient.full_name ?? 'Unknown'}
                  </h1>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {patient.role ?? 'Client'}
                    </Badge>
                    <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pb-1">
                <Link href="/chat">
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                    <HugeiconsIcon icon={Message01Icon} className="size-3.5" />
                    Message
                  </Button>
                </Link>
                <Link href="/book">
                  <Button size="sm" className="gap-1.5 rounded-full">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                    Book Session
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact info */}
            <div className="mt-5 flex flex-wrap gap-4">
              {patient.email && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                  <span>{patient.email}</span>
                </div>
              )}
              {patient.phone && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <HugeiconsIcon icon={Call02Icon} className="size-4" />
                  <span>{patient.phone}</span>
                </div>
              )}
              {patient.created_at && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <HugeiconsIcon icon={UserIcon} className="size-4" />
                  <span>Client since {formatDate(patient.created_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick stats ─── */}
      <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 @xl/main:grid-cols-4">
        <StatBadge value={totalSessions} label="Total Sessions" />
        <StatBadge value={completedSessions} label="Completed" accent />
        <StatBadge
          value={`${totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0}%`}
          label="Assignment Rate"
        />
        <StatBadge value={journals?.length ?? 0} label="Journal Entries" />
      </div>

      {/* ── Next / last session ─── */}
      {(nextSession || lastSession) && (
        <div className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:px-6">
          {nextSession && (
            <Card className="border-primary/20 bg-primary/5 rounded-[calc(var(--radius)*1.8)] border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-primary/10 text-primary shrink-0 rounded-[var(--radius)] p-2.5">
                  <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-primary text-xs font-medium tracking-wide uppercase">
                    Next Session
                  </p>
                  <p className="text-foreground text-sm font-semibold">
                    {formatDateTime(nextSession.starts_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {lastSession && (
            <Card className="border-border bg-muted/20 rounded-[calc(var(--radius)*1.8)] border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-muted text-muted-foreground shrink-0 rounded-[var(--radius)] p-2.5">
                  <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Last Session
                  </p>
                  <p className="text-foreground text-sm font-semibold">
                    {formatDateTime(lastSession.starts_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Tabs ─── */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="journal">
          <TabsList className="h-10 w-full rounded-[var(--radius)] sm:w-auto">
            <TabsTrigger
              value="journal"
              className="gap-1.5 rounded-[calc(var(--radius)*0.8)] text-xs"
            >
              <HugeiconsIcon icon={BookOpen01Icon} className="size-3.5" />
              Journal
              {(journals?.length ?? 0) > 0 && (
                <span className="bg-muted rounded-full px-1.5 py-0.5 text-xs tabular-nums">
                  {journals!.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="gap-1.5 rounded-[calc(var(--radius)*0.8)] text-xs"
            >
              <HugeiconsIcon icon={CheckListIcon} className="size-3.5" />
              Assignments
              {totalAssignments > 0 && (
                <span className="bg-muted rounded-full px-1.5 py-0.5 text-xs tabular-nums">
                  {totalAssignments}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="gap-1.5 rounded-[calc(var(--radius)*0.8)] text-xs"
            >
              <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="gap-1.5 rounded-[calc(var(--radius)*0.8)] text-xs"
            >
              <HugeiconsIcon icon={NoteIcon} className="size-3.5" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* ─ Journal ─ */}
          <TabsContent value="journal" className="mt-4">
            {(journals?.length ?? 0) === 0 ? (
              <EmptyTabState
                icon={BookOpen01Icon}
                title="No journal entries"
                description="This client hasn't written any journal entries yet."
              />
            ) : (
              <div className="space-y-3">
                {journals!.map((entry) => (
                  <Card
                    key={entry.id}
                    className="border-border/60 rounded-[calc(var(--radius)*1.8)] border"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-foreground truncate text-sm font-semibold">
                            {entry.title || 'Untitled Entry'}
                          </p>
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            {formatDate(entry.created_at)}
                          </p>
                        </div>
                        {entry.mood != null && (
                          <div
                            className={cn(
                              'flex shrink-0 items-center gap-1 text-sm font-bold',
                              moodColor(entry.mood)
                            )}
                          >
                            <HugeiconsIcon icon={HeartCheckIcon} className="size-3.5" />
                            {entry.mood}/10
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {entry.content && (
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                          {typeof entry.content === 'string'
                            ? entry.content
                            : JSON.stringify(entry.content)}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─ Assignments ─ */}
          <TabsContent value="assignments" className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                {completedAssignments} of {totalAssignments} completed
              </p>
              <Link href={`/therapist/assignments?patient=${id}`}>
                <Button size="sm" variant="outline" className="gap-1.5 rounded-full text-xs">
                  <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                  Assign Task
                </Button>
              </Link>
            </div>

            {totalAssignments === 0 ? (
              <EmptyTabState
                icon={CheckListIcon}
                title="No assignments yet"
                description="Assign tasks or exercises for this client to complete."
                action={
                  <Link href={`/therapist/assignments?patient=${id}`}>
                    <Button size="sm" className="gap-2 rounded-full">
                      <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                      Add Assignment
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-2">
                {assignments!.map((a) => (
                  <div
                    key={a.id}
                    className="border-border/60 hover:bg-muted/30 flex items-start gap-3 rounded-[calc(var(--radius)*1.8)] border p-4 transition-colors"
                  >
                    <div
                      className={cn(
                        'mt-0.5 shrink-0 rounded-[var(--radius)] p-2',
                        a.status === 'completed' ? 'bg-success/10' : 'bg-primary/10'
                      )}
                    >
                      <HugeiconsIcon
                        icon={a.status === 'completed' ? CheckmarkCircle01Icon : NoteIcon}
                        className={cn(
                          'size-4',
                          a.status === 'completed' ? 'text-success' : 'text-primary'
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-semibold">{a.title}</p>
                      {a.description && (
                        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                          {a.description}
                        </p>
                      )}
                      {a.due_date && (
                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1 text-xs">
                          <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                          Due {formatDate(a.due_date)}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={statusVariant(a.status)}
                      className="shrink-0 text-xs capitalize"
                    >
                      {a.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─ Sessions ─ */}
          <TabsContent value="sessions" className="mt-4">
            {totalSessions === 0 ? (
              <EmptyTabState
                icon={Calendar03Icon}
                title="No sessions yet"
                description="This client doesn't have any booked sessions."
                action={
                  <Link href="/book">
                    <Button size="sm" className="gap-2 rounded-full">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                      Book Session
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-2">
                {bookings!.map((b) => (
                  <div
                    key={b.id}
                    className="border-border/60 hover:bg-muted/30 flex items-center gap-3 rounded-[calc(var(--radius)*1.8)] border p-4 transition-colors"
                  >
                    <div className="bg-primary/40 h-10 w-1 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-semibold">
                        {formatDateTime(b.starts_at)}
                      </p>
                      {b.notes && (
                        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                          {b.notes}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={statusVariant(b.status)}
                      className="shrink-0 text-xs capitalize"
                    >
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─ Session Notes ─ */}
          <TabsContent value="notes" className="mt-4">
            <div className="mb-3 flex justify-end">
              <Link href={`/therapist/session-notes?patient=${id}`}>
                <Button size="sm" variant="outline" className="gap-1.5 rounded-full text-xs">
                  <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                  Add Note
                </Button>
              </Link>
            </div>
            {(sessionNotes?.length ?? 0) === 0 ? (
              <EmptyTabState
                icon={NoteIcon}
                title="No session notes"
                description="Start taking notes after sessions with this client."
              />
            ) : (
              <div className="space-y-3">
                {sessionNotes!.map((note) => (
                  <Card
                    key={note.id}
                    className="border-border/60 rounded-[calc(var(--radius)*1.8)] border"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted rounded-[calc(var(--radius)*0.8)] p-1.5">
                            <HugeiconsIcon
                              icon={File01Icon}
                              className="text-muted-foreground size-3.5"
                            />
                          </div>
                          <p className="text-muted-foreground text-xs font-medium">
                            {note.session_date
                              ? formatDate(note.session_date)
                              : formatDate(note.created_at)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                        {typeof note.content === 'string'
                          ? note.content
                          : JSON.stringify(note.content)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyTabState({
  icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[calc(var(--radius)*1.8)] border border-dashed py-14 text-center">
      <div className="bg-muted rounded-[calc(var(--radius)*1.8)] p-4">
        <HugeiconsIcon icon={icon} className="text-muted-foreground/40 size-8" />
      </div>
      <div>
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-1 max-w-xs text-xs">{description}</p>
      </div>
      {action}
    </div>
  );
}
