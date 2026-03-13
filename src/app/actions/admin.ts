'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const purchaseSchema = z.object({
  userId: z.string().uuid(),
  itemName: z.string().min(1),
  source: z.string().min(1),
  status: z.string().default('ordered'),
});

export async function logExternalPurchase(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    userId: formData.get('userId'),
    itemName: formData.get('itemName'),
    source: formData.get('source'),
    status: formData.get('status') || 'ordered',
  };

  const validated = purchaseSchema.safeParse(rawData);
  if (!validated.success) {
    return { message: 'Invalid data', errors: validated.error.flatten() };
  }

  const { error } = await supabase.from('external_purchases').insert({
    user_id: validated.data.userId,
    item_name: validated.data.itemName,
    source: validated.data.source,
    status: validated.data.status,
    // created_by is handled by RLS or default if set
  });

  if (error) return { message: error.message };

  revalidatePath(`/admin/users/${validated.data.userId}`);
  return { message: 'Success' };
}

export async function toggleFeatureOverride(userId: string, featureId: string, enabled: boolean) {
  const supabase = await createClient();

  // Check if enrollment exists
  const { data: existing } = await supabase
    .from('feature_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('feature_id', featureId)
    .single();

  if (existing) {
    await supabase.from('feature_enrollments').update({ enabled }).eq('id', existing.id);
  } else {
    await supabase.from('feature_enrollments').insert({
      user_id: userId,
      feature_id: featureId,
      enabled,
    });
  }

  revalidatePath(`/admin/users/${userId}`);
}

export async function getAdminBookings(page = 1, limit = 10, status = 'all', search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('bookings')
    .select(
      '*, client:profiles!client_id(full_name, email), therapist:profiles!therapist_id(full_name)',
      { count: 'exact' }
    );

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    // Naive search implementation
    // In real app, use full text search or filter by related profile fields if possible
    // For now, ignoring deep search to avoid complex join filtering issues with Supabase simple client
  }

  const { data, count, error } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return { bookings: [], total: 0 };
  }

  // Transform to match AdminBooking interface if needed, but for now return raw data
  return { bookings: data, total: count || 0 };
}

export async function adminCancelBooking(bookingId: string, reason?: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/bookings'); // Adjust path as needed
  revalidatePath('/console'); // Where the table likely is
}

export type AdminBooking = any; // Placeholder for strict type

export interface AdminKPI {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}
