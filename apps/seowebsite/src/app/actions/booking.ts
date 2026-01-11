'use server';

export async function createBookingAction(..._args: any[]) {
  console.warn("createBookingAction called (stub)");
  return { success: true, bookingId: 'mock_booking_id', data: { id: 'mock_booking_id' }, error: undefined };
}

export async function submitPaymentProofAction(..._args: any[]) {
  console.warn("submitPaymentProofAction called (stub)");
  return { success: true, error: undefined };
}
