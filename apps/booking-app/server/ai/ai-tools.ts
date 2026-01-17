import { z } from 'zod';
import { tool } from 'ai';
import { createClient } from '@/lib/supabase/server';

/**
 * AI Tool Blocks
 * These functions are exposed to the LLM to interact with the database on behalf of the user.
 */

const getMyBookingsSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'canceled', 'all']).optional().describe('Filter by booking status'),
});

export const getMyBookings = tool({
  description: 'Get a list of the current user\'s bookings (past and upcoming).',
  parameters: getMyBookingsSchema,
  execute: async ({ status }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not logged in' };
    }

    // Get Profile ID
    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', user.id).single();
    if (!profile) return { error: 'Profile not found' };

    // Fetch Bookings (Respecting RLS via Supabase Client)
    let query = supabase
      .from('booking')
      .select('*, service(name), staff(name)')
      .eq('email', user.email) // Or customer_reference_id if updated
      .order('start_time', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) return { error: error.message };
    
    return { bookings: data };
  },
});





export const checkAvailability = tool({
  description: 'Check available time slots for a specific service on a given date.',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service to check'),
    date: z.string().describe('The date to check in YYYY-MM-DD format'),
  }),
  execute: async ({ serviceId, date }: { serviceId: string, date: string }) => {
    // Reusing existing server action logic
    const { getAvailableSlotsAction } = await import('@/server/actions/booking-actions'); 
    const result = await getAvailableSlotsAction(serviceId, date);
    if (!result.success) {
      return { error: result.error };
    }
    return { slots: result.data.slots }; // Ensure this matches return type
  },
});


export const cancelBooking = tool({
  description: 'Cancel a booking for the current user.',
  parameters: z.object({
    bookingId: z.string().describe('The ID of the booking to cancel'),
    reason: z.string().optional().describe('Reason for cancellation'),
  }),
  execute: async ({ bookingId, reason }: { bookingId: string, reason?: string }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { cancelBookingAction } = await import('@/server/actions/booking-actions');
    const result = await cancelBookingAction(bookingId, user.id);
    return result;
  },
});


export const getWalletBalance = tool({
  description: 'Get the current wallet balance of the user.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', user.id).single();
    if (!profile) return { error: 'Profile not found' };

    const { data: wallet } = await supabase
      .from('user_wallet')
      .select('balance_cents, currency')
      .eq('user_id', user.id) 
      .single();

    if (!wallet) return { balance: 0, currency: 'USD' };

    return { 
      balance: wallet.balance_cents / 100, 
      currency: wallet.currency 
    };
  },
});


export const searchServices = tool({
  description: 'Search for available services to book.',
  parameters: z.object({
    query: z.string().optional().describe('Search term like \'massage\' or \'consultation\''),
  }),
  execute: async ({ query }: { query?: string }) => {
    const supabase = await createClient();
    let q = supabase.from('service').select('id, name, description, price_amount, duration_min').eq('active', true);
    
    if (query) {
      q = q.ilike('name', `%${query}%`);
    }
    
    const { data } = await q;
    return { services: data };
  },
});


export const bookAppointment = tool({
  description: 'Book an appointment for a service at a specific time. REQUIRES a confirmed time slot from checkAvailability.',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service to book'),
    serviceVariantId: z.string().optional().describe('The ID of the specific variant if known'),
    dateTime: z.string().describe('The start time in ISO format'),
  }),
  execute: async ({ serviceId, serviceVariantId, dateTime }: { serviceId: string, serviceVariantId?: string, dateTime: string }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'You must be logged in to book an appointment.' };
    }

    const { data: profile } = await supabase.from('profiles').select('full_name, phone').eq('auth_id', user.id).single();
    const displayName = profile?.full_name || 'Guest User';
    const phone = profile?.phone;

    const { fetchService, createBooking } = await import('@/server/booking/service');

    if (!serviceVariantId) {
        const sData = await fetchService(serviceId);
        if (sData.data && sData.data.variants && sData.data.variants.length > 0) {
            serviceVariantId = sData.data.variants[0].id;
        }
    }

    const res = await createBooking({
        serviceId,
        serviceVariantId,
        startTime: dateTime,
        userId: user.id,
        email: user.email!,
        displayName,
        phone: phone || undefined,
        paymentMode: 'full', 
        originApp: 'ai-concierge'
    });

    if (res.error) {
        return { error: typeof res.error === 'string' ? res.error : 'Booking failed' };
    }

    return { 
        success: true, 
        bookingId: res.data?.bookingId,
        message: 'Booking created successfully',
        details: {
            serviceId,
            dateTime
        }
    };
  },
});


export const aiTools = {
  getMyBookings,
  checkAvailability,
  cancelBooking,
  getWalletBalance,
  searchServices,
  bookAppointment
};

