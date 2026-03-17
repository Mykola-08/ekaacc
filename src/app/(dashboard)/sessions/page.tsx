import { redirect } from 'next/navigation';

// Sessions is consolidated into Bookings (single source of truth).
// All session history and upcoming sessions live at /bookings.
export default function SessionsPage() {
  redirect('/bookings');
}
