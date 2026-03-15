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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">My Sessions</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          View your upcoming and past therapy sessions.
        </p>
      </div>
      <BookingsPageContent bookings={bookings} userId={user.id} />
    </div>
  );
}
