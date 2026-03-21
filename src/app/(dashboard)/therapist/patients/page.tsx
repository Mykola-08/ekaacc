import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon,
  ArrowRight01Icon,
  Message01Icon,
  Calendar03Icon,
  Mail01Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

function getInitials(name: string | null) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const PALETTE = [
  'bg-primary/10 text-primary',
  'bg-success/10 text-success',
  'bg-warning/10 text-warning',
  'bg-destructive/10 text-destructive',
];

export default async function PatientManagerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: therapist } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!therapist) redirect('/login');

  // Get unique patients from bookings with last booking info
  const { data: bookings } = await supabase
    .from('bookings')
    .select('client_id, status, starts_at, profiles:client_id(id, full_name, email, phone, created_at)')
    .eq('therapist_id', therapist.id)
    .order('starts_at', { ascending: false });

  // Build patient map — keep latest booking per client
  const patientMap = new Map<string, { profile: any; lastBooking: any; sessionCount: number }>();
  for (const b of bookings ?? []) {
    const profile = b.profiles as any;
    if (!profile?.id) continue;
    const existing = patientMap.get(profile.id);
    if (!existing) {
      patientMap.set(profile.id, { profile, lastBooking: b, sessionCount: 1 });
    } else {
      existing.sessionCount += 1;
    }
  }
  const patients = Array.from(patientMap.values());

  const totalActive = patients.length;
  const scheduledCount = (bookings ?? []).filter((b) => b.status === 'scheduled').length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ─── */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Patients</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {totalActive} active client{totalActive !== 1 ? 's' : ''} in your caseload
            </p>
          </div>
          <Button size="sm" className="gap-1.5 rounded-[calc(var(--radius)*0.8)] shrink-0">
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* ── Quick stats ─── */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-[var(--radius)] border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Clients</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{totalActive}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[var(--radius)] border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-xs text-primary uppercase tracking-wide">Upcoming</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-primary">{scheduledCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[var(--radius)] border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Sessions</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {totalActive > 0 ? Math.round((bookings?.length ?? 0) / totalActive) : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Patient list ─── */}
      {patients.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-4 rounded-[var(--radius)] border border-dashed py-16 text-center lg:mx-6">
          <div className="rounded-[var(--radius)] bg-muted p-5">
            <HugeiconsIcon icon={UserGroupIcon} className="size-10 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No patients yet</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              Patients will appear here once you have bookings linked to your account.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {patients.map(({ profile, lastBooking, sessionCount }, idx) => {
            const avatarClass = PALETTE[idx % PALETTE.length];
            const hasUpcoming =
              lastBooking?.status === 'scheduled' && new Date(lastBooking.starts_at) > new Date();

            return (
              <Link key={profile.id} href={`/therapist/patients/${profile.id}`} className="group block">
                <Card className="h-full rounded-[var(--radius)] border border-border/60 transition-all hover:-translate-y-px hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-12 shrink-0">
                        <AvatarFallback className={cn('text-sm font-semibold', avatarClass)}>
                          {getInitials(profile.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {profile.full_name ?? 'Unknown'}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              'shrink-0 text-xs',
                              hasUpcoming && 'border-primary/30 bg-primary/5 text-primary'
                            )}
                          >
                            {hasUpcoming ? 'Upcoming' : 'Active'}
                          </Badge>
                        </div>
                        {profile.email && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <HugeiconsIcon icon={Mail01Icon} className="size-3 shrink-0" />
                            {profile.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-4">
                    {/* Session meta */}
                    <div className="flex items-center justify-between rounded-[var(--radius)] bg-muted/50 px-3 py-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                        <span>
                          {sessionCount} session{sessionCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {lastBooking?.starts_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>
                            {new Date(lastBooking.starts_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/therapist/patients/${profile.id}`}
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full gap-1.5 rounded-[var(--radius)] text-xs"
                        >
                          View Profile
                          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                        </Button>
                      </Link>
                      <Link href="/chat" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="rounded-[var(--radius)] px-2.5">
                          <HugeiconsIcon icon={Message01Icon} className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
