'use server';

interface BookingData {
  id: string;
  bookingId: string;
  status: 'pending' | 'scheduled' | 'confirmed';
  clientSecret?: string;
}

interface BookingResult {
  success: boolean;
  data?: BookingData;
  bookingId?: string;
  error?: string;
}

interface PaymentProofResult {
  success: boolean;
  data?: {
    verified: boolean;
    message?: string;
  };
  error?: string;
}

export async function createBookingAction(
  _therapistId: string,
  _slot: { start: string; end: string },
  _serviceId: string,
  _price: number,
  _paymentMethod: 'wallet' | 'stripe' | 'pay_at_place' | 'bizum'
): Promise<BookingResult> {
  console.warn("createBookingAction called (stub)");
  return { 
    success: true, 
    bookingId: 'mock_booking_id', 
    data: { 
      id: 'mock_booking_id', 
      bookingId: 'mock_booking_id',
      status: 'scheduled'
    }, 
    error: undefined 
  };
}

export async function submitPaymentProofAction(
  _bookingId: string,
  _proofUrl: string
): Promise<PaymentProofResult> {
  console.warn("submitPaymentProofAction called (stub)");
  return { 
    success: true, 
    data: { verified: true },
    error: undefined 
  };
}
