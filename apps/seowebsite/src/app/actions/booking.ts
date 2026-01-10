'use server';

export async function createBookingAction(data: any) {
  console.warn("createBookingAction called (stub)");
  return { success: true, bookingId: 'mock_booking_id' };
}

export async function submitPaymentProofAction(data: any) {
  console.warn("submitPaymentProofAction called (stub)");
  return { success: true };
}
