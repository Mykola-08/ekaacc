'use server';

import { createBooking, getServiceAvailability } from '@/lib/platform/services/booking-service';
import { revalidatePath } from 'next/cache';

export async function createNewBookingAction(data: any) {
  try {
    const booking = await createBooking(data);
    if (!booking || !booking.id) {
      return { success: false, error: 'Failed to create booking' };
    }
    revalidatePath('/bookings');
    return { success: true, bookingId: booking.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function getAvailableSlotsAction(serviceId: string, date: string, variantId?: string) {
  const result = await getServiceAvailability(serviceId, date, variantId);
  if (result.error) return { success: false, error: result.error };
  return { success: true, data: result.data };
}

export async function getUpcomingSession() {
  const { bookingService } = await import('@/lib/platform/services/booking-service');
  // We need to get current user here, but bookingService usually takes userId or handles it.
  // However, for a server action, it's reliable to get user first.
  // But since this is a quick action, let's delegate to service if possible or just use supabase.
  const { createClient } = await import('@/lib/platform/supabase/server');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Use the service method we added/verified
  const bookings = await bookingService.getUserBookings(user.id);
  // Filter for upcoming
  const now = new Date();
  const upcoming = bookings
    .filter((b) => new Date(b.slot.start) > now)
    .sort((a, b) => new Date(a.slot.start).getTime() - new Date(b.slot.start).getTime())[0];

  return upcoming || null;
}
