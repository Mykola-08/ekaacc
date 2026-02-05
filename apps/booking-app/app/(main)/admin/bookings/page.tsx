import { getAdminBookings } from "@/server/admin/actions"
import { BookingsList } from "@/components/admin/BookingsList"

export const dynamic = "force-dynamic"

export default async function BookingsPage() {
  const adminBookings = await getAdminBookings();
  return <BookingsList bookings={adminBookings} />
}
