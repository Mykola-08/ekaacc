'use server';

import { bookingService, BookingRequest } from '@/services/booking-service';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBookingAction(
  therapistId: string,
  slot: { start: string; end: string },
  serviceId: string,
  price: number,
  paymentMethod: 'wallet' | 'stripe' | 'pay_at_place' | 'bizum'
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const request: BookingRequest = {
      userId: user.id,
      therapistId,
      slot,
      serviceId,
      price,
      paymentMethod,
    };

    const result = await bookingService.createBooking(request);
    revalidatePath('/bookings');
    return { success: true, data: result };
  } catch (error) {
    console.error('Booking creation failed:', error);
    return { error: error instanceof Error ? error.message : 'Booking failed' };
  }
}

export async function submitPaymentProofAction(bookingId: string, proofUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const result = await bookingService.submitPaymentProof(bookingId, proofUrl);
    revalidatePath('/bookings');
    return { success: true, data: result };
  } catch (error) {
    console.error('Payment proof submission failed:', error);
    return { error: error instanceof Error ? error.message : 'Submission failed' };
  }
}
