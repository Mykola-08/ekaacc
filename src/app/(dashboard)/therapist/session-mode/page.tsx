import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Message01Icon,
  Note01Icon,
  UserIcon,
  Video01Icon,
} from '@hugeicons/core-free-icons';

const SESSION_TYPE_LABELS: Record<string, string> = {
  intake: 'Intake Session',
  follow_up: 'Follow-up Session',
  crisis_support: 'Crisis Support Session',
  coaching: 'Coaching / Action Session',
};

export default async function TherapistSessionModePage({
  searchParams,
}: {
  searchParams: { clientId?: string; sessionType?: string; locationType?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const clientId = searchParams.clientId;

  const [{ data: client }, { data: bookings }] = await Promise.all([
    clientId
      ? supabase.from('profiles').select('id, full_name').eq('id', clientId).single()
      : Promise.resolve({ data: null }),
    clientId
      ? supabase
          .from('bookings')
          .select('id, starts_at, status')
          .eq('client_id', clientId)
          .order('starts_at', { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
  ]);

  const sessionTypeLabel = SESSION_TYPE_LABELS[searchParams.sessionType || ''] || 'Session';

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Therapist Session Mode</h1>
            <p className="text-muted-foreground text-sm">
              Structured session flow with client context, note-taking, and communication shortcuts.
            </p>
          </div>
          <Badge variant="outline">{sessionTypeLabel}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Session setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} className="text-muted-foreground size-4" />
                <span>Client: {client?.full_name || 'Not selected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Video01Icon} className="text-muted-foreground size-4" />
                <span>Channel: {(searchParams.locationType || 'online').replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Link href="/therapist/session-notes?draft=true">
                  <Button variant="outline" className="w-full justify-between">
                    Open session notes
                    <HugeiconsIcon icon={Note01Icon} className="size-4" />
                  </Button>
                </Link>
                <Link href="/console/telegram">
                  <Button variant="outline" className="w-full justify-between">
                    Telegram integration hub
                    <HugeiconsIcon icon={Message01Icon} className="size-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Recent bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {(bookings ?? []).length === 0 && (
                <p className="text-muted-foreground">No recent bookings for this client.</p>
              )}
              {(bookings ?? []).map((booking) => (
                <Link key={booking.id} href={`/therapist/active-session/${booking.id}`}>
                  <div className="hover:bg-muted/40 flex items-center justify-between rounded-[calc(var(--radius)*0.8)] border p-2 transition-colors">
                    <span>{new Date(booking.starts_at).toLocaleString()}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
