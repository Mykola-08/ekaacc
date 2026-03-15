import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getBookingsHistory } from '@/server/dashboard/service';
import { BookingsPageContent } from '@/components/dashboard/shared/BookingsPageContent';

export default async function SessionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const bookings = await getBookingsHistory(user.id);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">My Sessions</h1>
        <p className="text-sm text-muted-foreground">
          View your upcoming and past therapy sessions.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <BookingsPageContent bookings={bookings} userId={user.id} />
      </div>
    </div>
  );
}
