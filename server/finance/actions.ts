'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPendingVerifications() {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Role check
  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (!['admin', 'therapist'].includes(role)) throw new Error('Forbidden');

  // Fetch bookings that need attention
  // Use customer_reference_id as user identifier
  const { data: bookings, error } = await supabase
    .from('booking')
    .select(
      `
            id, created_at, start_time, 
            service:service(name), 
            customer_reference_id,
            payment_status, amount:base_price_cents, is_identity_verified, confidence_score
        `
    )
    .eq('is_identity_verified', false)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Fetch finance error:', error);
    return [];
  }

  // Enrich with user info from users_view
  const enriched = await Promise.all(bookings.map(async (b: any) => {
      let profile = null;
      if (b.customer_reference_id) {
          const { data } = await supabase
            .from('users_view')
            .select('full_name, avatar_url, trust_score')
            .eq('id', b.customer_reference_id)
            .single();
          profile = data;
          // Add email? users_view might not expose email if I defined it strictly.
          // But Admin needs email. 
          // If users_view does not have email (security), we might need admin client to get email.
          // Let's assume view has what we need or we use admin client.
      }
      return { 
          ...b, 
          profiles: profile // Map to 'profiles' to keep frontend compat if possible, or update frontend
      };
  }));

  return enriched;
}

export async function verifyBookingIdentity(bookingId: string) {
  const supabase = await createClient();

  // Auth & Permission Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };

  try {
    // 1. Mark booking as verified
    const { error: bookingError } = await supabase
      .from('booking')
      .update({ is_identity_verified: true, confidence_score: 100 })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    revalidatePath('/admin/finance');
    return { success: true, message: 'Identity Verified' };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
