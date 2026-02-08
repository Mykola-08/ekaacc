import { createClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import * as motion from 'framer-motion/client';
import { getBookingsHistory } from '@/server/dashboard/service';
import { BookingHistoryList } from '@/components/booking/BookingHistoryList';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, Add01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <DashboardHeader
        title="Your Bookings"
        subtitle="View your session history and upcoming appointments."
      >
        <Button asChild variant="default" className="shadow-primary/20 shadow-lg">
          <Link href="/book">
            <HugeiconsIcon icon={Add01Icon} className="mr-2 h-4 w-4" strokeWidth={2.5} />
            New Booking
          </Link>
        </Button>
      </DashboardHeader>

      {/* Unified Card Container for List */}
      <div className="bg-card border-border/60 overflow-hidden rounded-[24px] border p-1 shadow-sm">
        <div className="p-6 md:p-8">
          <BookingHistoryList bookings={bookings} userId={profile.id} />
        </div>
      </div>
    </motion.div>
  );
}
