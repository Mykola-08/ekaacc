export interface BookingRequest {
  userId: string;
  therapistId: string;
  slot: { start: string; end: string };
  serviceId: string;
  price: number;
  paymentMethod: 'wallet' | 'stripe' | 'pay_at_place' | 'bizum';
}

export const bookingService = {
  createBooking: async (request: BookingRequest) => {
    return { id: 'booking_123', status: 'pending', ...request };
  },
  submitPaymentProof: async (bookingId: string, proofUrl: string) => {
    return { success: true };
  }
};
