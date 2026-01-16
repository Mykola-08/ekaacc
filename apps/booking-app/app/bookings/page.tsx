import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getBookingsHistory } from '@/server/dashboard/service';
import { BookingHistoryList } from '@/components/booking/BookingHistoryList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
      redirect('/onboarding');
  }

  const bookings = await getBookingsHistory(profile.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 animate-in fade-in duration-700">
        
        {/* Header - Minimal/Glassy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
            <div className="space-y-3">
                <Button variant="link" className="pl-0 h-auto text-muted-foreground hover:text-foreground/80 transition-colors group" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground/90">Your Bookings</h1>
                    <p className="text-lg text-muted-foreground font-light mt-1">
                        History and upcoming sessions.
                    </p>
                </div>
            </div>
            
            <Button asChild className="rounded-full h-10 px-6 font-medium bg-foreground text-background hover:opacity-90 shadow-none transition-all">
                <Link href="/book">
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                </Link>
            </Button>
        </div>

        <BookingHistoryList bookings={bookings} userId={profile.id} />

      </div>
    </div>
  );
}
