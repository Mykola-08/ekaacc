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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <Button variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground mb-2" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl md:text-4xl font-serif text-foreground">Your Bookings</h1>
                <p className="text-muted-foreground text-lg">Manage your upcoming sessions and view history.</p>
            </div>
            
            <Button asChild className="rounded-full shadow-lg shadow-primary/20 h-12 px-6">
                <Link href="/book">
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Session
                </Link>
            </Button>
        </div>

        <BookingHistoryList bookings={bookings} />

      </div>
    </div>
  );
}
