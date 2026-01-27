import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getBookingsHistory } from '@/server/dashboard/service';
import { BookingHistoryList } from '@/components/booking/BookingHistoryList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

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
    <DashboardLayout profile={profile}>
      <div className="space-y-8 animate-in fade-in duration-700">

        <DashboardHeader
          title="Your Bookings"
          subtitle="View your session history and upcoming appointments."
        >
          <Button asChild className="rounded-[18px] h-10 px-5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-0 transition-all active:scale-95">
            <Link href="/book">
              <Plus className="w-4 h-4 mr-2" strokeWidth={2.75} />
              New Booking
            </Link>
          </Button>
        </DashboardHeader>

        {/* Unified Card Container for List */}
        <div className="bg-card rounded-[32px] border border-border/60 shadow-sm overflow-hidden p-1">
          <div className="p-6 md:p-8">
            <BookingHistoryList bookings={bookings} userId={profile.id} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
