import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarIcon, Clock, CheckCircle2, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TelegramClientUI } from './telegram-client-ui';

export default async function TelegramDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Might still be logging in via background provider, return waiting state
    return (
      <div className="bg-background text-foreground flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground animate-pulse text-sm">Autenticant...</p>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
    return <div className="mt-10 p-4 text-center">Perfil no trobat.</div>;
  }

  const now = new Date().toISOString();

  // Fetch upcoming bookings
  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('*, therapist:therapist_id(full_name), service:service_id(title)')
    .eq('client_id', profile.id)
    .in('status', ['scheduled', 'pending'])
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(3);

  // Fetch recent past bookings
  const { data: pastBookings } = await supabase
    .from('bookings')
    .select('*, therapist:therapist_id(full_name), service:service_id(title)')
    .eq('client_id', profile.id)
    .in('status', ['completed', 'cancelled'])
    .lt('start_time', now)
    .order('start_time', { ascending: false })
    .limit(3);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col pb-20">
      {/* Top Banner */}
      <div className="bg-primary/5 px-4 py-8">
        <h1 className="text-primary text-2xl font-bold">
          Hola, {profile.full_name?.split(' ')[0] || 'amic'} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Aquest és el teu resum ràpid a EKA.</p>
      </div>

      <div className="flex-1 space-y-6 p-4">
        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="h-14 w-full rounded-2xl">
            <Link href="/booking">
              <CalendarIcon className="mr-2 size-5" />
              Nova Reserva
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-card h-14 w-full rounded-2xl">
            <Link href="/dashboard/wallet">
              <History className="mr-2 size-5" />
              El meu Moneder
            </Link>
          </Button>
        </div>

        {/* Upcoming */}
        <section>
          <h2 className="mb-3 flex items-center text-lg font-semibold">
            <Clock className="text-primary mr-2 size-5" />
            Properes Cites
          </h2>

          {upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking: any) => (
                <Card
                  key={booking.id}
                  className="border-l-primary hover: border-l-4 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{booking.service?.title || 'Servei EKA'}</p>
                        <p className="text-muted-foreground mt-1 flex items-center text-sm">
                          <CalendarIcon className="mr-1 inline size-3" />
                          {format(new Date(booking.start_time), 'dd MMM, HH:mm')}
                        </p>
                      </div>
                      <Badge
                        variant={booking.status === 'scheduled' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/20 border-dashed">
              <CardContent className="text-muted-foreground flex flex-col items-center p-6 text-center text-sm">
                <CalendarIcon className="mx-auto mb-2 size-8 opacity-20" />
                No tens cites programades.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Past Bookings */}
        <section>
          <h2 className="mt-8 mb-3 flex items-center text-lg font-semibold">
            <CheckCircle2 className="text-muted-foreground mr-2 size-5" />
            Historial Recent
          </h2>

          {pastBookings && pastBookings.length > 0 ? (
            <div className="space-y-3 opacity-80">
              {pastBookings.map((booking: any) => (
                <Card key={booking.id} className="bg-muted/10 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {booking.service?.title || 'Servei EKA'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(booking.start_time), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center text-sm italic">
              No hi ha historial recent.
            </p>
          )}
        </section>
      </div>

      <TelegramClientUI />
    </div>
  );
}
