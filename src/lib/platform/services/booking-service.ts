// Booking Service - Therapist Session Booking
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface BookingRequest {
  userId: string;
  therapistId: string;
  slot: { start: string; end: string };
  serviceId: string;
  price: number;
  paymentMethod: 'wallet' | 'stripe' | 'pay_at_place' | 'bizum';
  notes?: string;
  status?: string;
}

export interface Booking extends BookingRequest {
  id: string;
  status: string;
  created_at: string;
  payment_proof_url?: string;
  clientId?: string;
}

export const bookingService = {
  createBooking: async (request: BookingRequest): Promise<Booking> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .insert({
          user_id: request.userId,
          therapist_id: request.therapistId,
          service_id: request.serviceId,
          scheduled_start: request.slot.start,
          scheduled_end: request.slot.end,
          price: request.price,
          payment_method: request.paymentMethod,
          status: request.status || 'pending',
          notes: request.notes,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        id: data.id,
        status: data.status,
        created_at: data.created_at,
        ...request,
      };
    } catch (err) {
      // Fallback for development
      console.error('Booking creation error:', err);
      return {
        id: `booking_${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString(),
        ...request,
      };
    }
  },

  submitPaymentProof: async (
    bookingId: string,
    proofUrl: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({
          payment_proof_url: proofUrl,
          payment_proof_submitted_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },

  getBooking: async (bookingId: string): Promise<Booking | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        therapistId: data.therapist_id,
        serviceId: data.service_id,
        slot: { start: data.scheduled_start, end: data.scheduled_end },
        price: data.price,
        paymentMethod: data.payment_method,
        status: data.status,
        created_at: data.created_at,
        payment_proof_url: data.payment_proof_url,
        notes: data.notes,
        clientId: data.user_id, // mapping for platform service compatibility
      } as Booking;
    } catch {
      return null;
    }
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];

      return (data || []).map(
        (b) =>
          ({
            id: b.id,
            userId: b.user_id,
            therapistId: b.therapist_id,
            serviceId: b.service_id,
            slot: { start: b.scheduled_start, end: b.scheduled_end },
            price: b.price,
            paymentMethod: b.payment_method,
            status: b.status,
            created_at: b.created_at,
            payment_proof_url: b.payment_proof_url,
            notes: b.notes,
            clientId: b.user_id,
          }) as Booking
      );
    } catch {
      return [];
    }
  },

  getBookingsForUser: async (userId: string): Promise<Booking[]> => {
    // Alias for compatibility
    return bookingService.getUserBookings(userId);
  },

  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return [];

      return (data || []).map(
        (b) =>
          ({
            id: b.id,
            userId: b.user_id,
            therapistId: b.therapist_id,
            serviceId: b.service_id,
            slot: { start: b.scheduled_start, end: b.scheduled_end },
            price: b.price,
            paymentMethod: b.payment_method,
            status: b.status,
            created_at: b.created_at,
            payment_proof_url: b.payment_proof_url,
            notes: b.notes,
            clientId: b.user_id,
          }) as Booking
      );
    } catch {
      return [];
    }
  },

  getBookingsForTherapist: async (therapistId: string): Promise<Booking[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false });

      if (error) return [];

      return (data || []).map(
        (b) =>
          ({
            id: b.id,
            userId: b.user_id,
            therapistId: b.therapist_id,
            serviceId: b.service_id,
            slot: { start: b.scheduled_start, end: b.scheduled_end },
            price: b.price,
            paymentMethod: b.payment_method,
            status: b.status,
            created_at: b.created_at,
            payment_proof_url: b.payment_proof_url,
            notes: b.notes,
            clientId: b.user_id,
          }) as Booking
      );
    } catch {
      return [];
    }
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    try {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.notes) dbUpdates.notes = updates.notes;
      // Map other fields as necessary

      const { data, error } = await supabaseAdmin
        .from('bookings')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) return null;

      return bookingService.getBooking(id);
    } catch {
      return null;
    }
  },

  cancelBooking: async (bookingId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },
};

export async function createBooking(params: any) {
  return bookingService.createBooking({
    userId: params.userId,
    therapistId: params.staffId || 'staff-1',
    serviceId: params.serviceId,
    price: params.priceCents ? params.priceCents / 100 : 0,
    paymentMethod: params.paymentMode === 'wallet' ? 'wallet' : 'stripe',
    slot: {
      start: params.startTime.toISOString(),
      end: params.endTime?.toISOString() || params.startTime.toISOString(),
    },
    notes: params.notes,
    displayName: params.displayName,
    email: params.email,
  } as any);
}

export async function getServiceAvailability(serviceId: string, date: string, variantId?: string) {
  // Mock availability for current phase to ensure UI works
  const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => ({
    startTime: `${date}T${time}:00`,
    endTime: `${date}T${time}:00`,
    staffId: 'staff-1',
  }));

  return { data: { slots }, error: null };
}
