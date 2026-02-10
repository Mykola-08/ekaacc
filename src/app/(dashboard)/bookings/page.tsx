import { createClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getBookingsHistory } from '@/server/dashboard/service';
import { BookingsPageContent } from '@/components/dashboard/shared/BookingsPageContent';

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Use user id directly
  const bookings = await getBookingsHistory(user.id);

  return <BookingsPageContent bookings={bookings} userId={user.id} />;
}
