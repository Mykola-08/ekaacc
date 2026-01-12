'use server';

import { createClient } from '@/lib/platform/supabase/server';

export async function createBookingAction(..._args: any[]) {
  console.warn("createBookingAction called (stub)");
  return { success: true, bookingId: 'mock_booking_id', data: { id: 'mock_booking_id' }, error: undefined };
}

export async function submitPaymentProofAction(..._args: any[]) {
  console.warn("submitPaymentProofAction called (stub)");
  return { success: true, error: undefined };
}

export async function getUpcomingSession() {
  const supabase = await createClient();
  const { data: { user } } = await (supabase.auth as any).getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('booking')
    .select('*, service:service_id(name)')
    .eq('user_id', user.id)
    .gt('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
        console.error('Error fetching upcoming session:', error);
    }
    return null;
  }

  return data;
}
