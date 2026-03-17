import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  Clock01Icon,
  Video01Icon,
  Location01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  PlusSignIcon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const STATS_CARD_CLASS = 'rounded-2xl border-border/60 bg-card';
const STATS_LABEL_CLASS = 'text-muted-foreground text-xs uppercase tracking-wide';
const STATS_VALUE_CLASS = 'text-foreground mt-1 text-2xl font-bold tabular-nums';

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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatDateFull(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getDuration(start: string, end: string | null) {
  if (!end) return null;
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}`;
}

function statusConfig(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    scheduled: { label: 'Confirmed', className: 'bg-primary/10 text-primary border-primary/20' },
    pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
    completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
    cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
    no_show: {
      label: 'No Show',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  };
  return map[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
}

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_id', user.id)
    .single();

  const isTherapist = profile?.role === 'therapist' || profile?.role === 'admin';
  const now = new Date().toISOString();

  // Fetch bookings (upcoming)
  const upcomingQ = supabase
    .from('bookings')
    .select(
      'id, starts_at, ends_at, status, notes, service_name, location_type, meeting_url, therapist:therapist_id(full_name, email), client:client_id(full_name, email)'
    )
    .gte('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(20);

  if (isTherapist) {
    upcomingQ.eq('therapist_id', profile!.id);
  } else {
    upcomingQ.eq('client_id', profile!.id);
  }

  const pastQ = supabase
    .from('bookings')
    .select(
      'id, starts_at, ends_at, status, notes, service_name, location_type, meeting_url, therapist:therapist_id(full_name, email), client:client_id(full_name, email)'
    )
    .lt('starts_at', now)
    .order('starts_at', { ascending: false })
    .limit(30);

  if (isTherapist) {
    pastQ.eq('therapist_id', profile!.id);
  } else {
    pastQ.eq('client_id', profile!.id);
  }

  const [{ data: upcoming }, { data: past }] = await Promise.all([upcomingQ, pastQ]);

  const upcomingBookings = upcoming ?? [];
  const pastBookings = past ?? [];

  // Group upcoming by date
  const grouped = new Map<string, typeof upcomingBookings>();
  for (const b of upcomingBookings) {
    const day = new Date(b.starts_at).toDateString();
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day)!.push(b);
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {upcomingBookings.length
                ? `${upcomingBookings.length} upcoming session${upcomingBookings.length !== 1 ? 's' : ''}`
                : 'No upcoming sessions'}
            </p>
          </div>
          <Link href="/book">
            <Button size="sm" className="shrink-0 gap-1.5 rounded-full">
              <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
              Book Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      {(upcomingBookings.length > 0 || pastBookings.length > 0) && (
        <div className="grid grid-cols-3 gap-3 px-4 lg:px-6">
          <Card className={cn(STATS_CARD_CLASS, 'border-primary/20 bg-primary/5')}>
            <CardContent className="p-4">
              <p className={cn(STATS_LABEL_CLASS, 'text-primary')}>Upcoming</p>
              <p className={cn(STATS_VALUE_CLASS, 'text-primary')}>{upcomingBookings.length}</p>
            </CardContent>
          </Card>
          <Card className={STATS_CARD_CLASS}>
            <CardContent className="p-4">
              <p className={STATS_LABEL_CLASS}>Completed</p>
              <p className={STATS_VALUE_CLASS}>
                {pastBookings.filter((b) => b.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
          <Card className={STATS_CARD_CLASS}>
            <CardContent className="p-4">
              <p className={STATS_LABEL_CLASS}>Total</p>
              <p className={STATS_VALUE_CLASS}>{upcomingBookings.length + pastBookings.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="upcoming">
          <TabsList className="h-10 rounded-xl">
            <TabsTrigger value="upcoming" className="gap-1.5 rounded-lg text-xs">
              Upcoming
              {upcomingBookings.length > 0 && (
                <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-xs tabular-nums">
                  {upcomingBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-1.5 rounded-lg text-xs">
              History
              {pastBookings.length > 0 && (
                <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs tabular-nums">
                  {pastBookings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upcoming */}
          <TabsContent value="upcoming" className="mt-4">
            {upcomingBookings.length === 0 ? (
              <EmptyBookings onBook="/book" />
            ) : (
              <div className="space-y-6">
                {Array.from(grouped.entries()).map(([day, bookings]) => (
                  <div key={day}>
                    <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                      {formatDateFull(bookings[0].starts_at)}
                    </p>
                    <div className="space-y-3">
                      {bookings.map((b) => (
                        <BookingCard key={b.id} booking={b} isTherapist={isTherapist} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past */}
          <TabsContent value="past" className="mt-4">
            {pastBookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center">
                <div className="bg-muted rounded-2xl p-4">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    className="text-muted-foreground/40 size-8"
                  />
                </div>
                <p className="text-sm font-semibold">No session history</p>
                <p className="text-muted-foreground text-xs">
                  Your past sessions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {pastBookings.map((b) => (
                  <PastBookingRow key={b.id} booking={b} isTherapist={isTherapist} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookingCard({ booking: b, isTherapist }: { booking: any; isTherapist: boolean }) {
  const other = isTherapist ? (b.client as any) : (b.therapist as any);
  const status = statusConfig(b.status);
  const duration = getDuration(b.starts_at, b.ends_at);

  return (
    <Card className="border-border/60 overflow-hidden rounded-2xl border transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Date/time column */}
          <div className="bg-muted/30 border-border/40 flex shrink-0 justify-center gap-3 border-b px-4 py-4 sm:w-36 sm:flex-col sm:justify-start sm:gap-1 sm:border-r sm:border-b-0 sm:py-5">
            <div className="text-primary flex items-center gap-2 text-sm font-semibold sm:flex-col sm:items-start sm:gap-0.5">
              <HugeiconsIcon icon={Calendar03Icon} className="size-4 sm:hidden" />
              <span>{formatDate(b.starts_at)}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs tabular-nums">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
              {formatTime(b.starts_at)}
              {duration && <span className="text-muted-foreground/60">· {duration}</span>}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 items-start justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0 space-y-2">
              {/* Other person */}
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(other?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {other?.full_name ?? (isTherapist ? 'Client' : 'Therapist')}
                  </p>
                  {other?.email && (
                    <p className="text-muted-foreground truncate text-xs">{other.email}</p>
                  )}
                </div>
              </div>

              {/* Type + location */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                    status.className
                  )}
                >
                  {status.label}
                </span>
                {b.service_name && (
                  <span className="text-muted-foreground text-xs">{b.service_name}</span>
                )}
                {b.location_type && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <HugeiconsIcon
                      icon={b.location_type === 'online' ? Video01Icon : Location01Icon}
                      className="size-3"
                    />
                    <span className="capitalize">{b.location_type}</span>
                  </div>
                )}
              </div>

              {b.notes && <p className="text-muted-foreground line-clamp-1 text-xs">{b.notes}</p>}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              {b.meeting_url && b.status === 'scheduled' && (
                <a href={b.meeting_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="gap-1.5 rounded-full text-xs">
                    <HugeiconsIcon icon={Video01Icon} className="size-3.5" />
                    Join
                  </Button>
                </a>
              )}
              {b.status === 'scheduled' && (
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs">
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PastBookingRow({ booking: b, isTherapist }: { booking: any; isTherapist: boolean }) {
  const other = isTherapist ? (b.client as any) : (b.therapist as any);
  const status = statusConfig(b.status);
  const duration = getDuration(b.starts_at, b.ends_at);

  return (
    <div className="border-border/60 hover:bg-muted/30 flex items-center gap-3 rounded-2xl border p-4 transition-colors">
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-xl',
          b.status === 'completed' ? 'bg-success/10' : 'bg-muted'
        )}
      >
        <HugeiconsIcon
          icon={b.status === 'completed' ? CheckmarkCircle01Icon : Calendar03Icon}
          className={cn(
            'size-4',
            b.status === 'completed' ? 'text-success' : 'text-muted-foreground'
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-foreground text-sm font-semibold">
            {other?.full_name ?? (isTherapist ? 'Client' : 'Therapist')}
          </p>
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0 text-xs font-medium',
              status.className
            )}
          >
            {status.label}
          </span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {formatDate(b.starts_at)} · {formatTime(b.starts_at)}
          {duration && ` · ${duration}`}
          {b.service_name && ` · ${b.service_name}`}
        </p>
      </div>
      {b.status === 'completed' && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground shrink-0 gap-1 rounded-full text-xs"
        >
          Notes
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
        </Button>
      )}
    </div>
  );
}

function EmptyBookings({ onBook }: { onBook: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
      <div className="bg-muted rounded-2xl p-5">
        <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground/40 size-10" />
      </div>
      <div>
        <p className="text-foreground font-semibold">No upcoming sessions</p>
        <p className="text-muted-foreground mt-1 max-w-xs text-sm">
          Book a session with your therapist to get started on your wellness journey.
        </p>
      </div>
      <Link href={onBook}>
        <Button className="gap-2 rounded-full">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Book a Session
        </Button>
      </Link>
    </div>
  );
}
