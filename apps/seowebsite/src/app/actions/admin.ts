'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- Types ---
export type AdminKPI = {
  revenue_mtd: number;
  revenue_growth_pct: number;
  users_total: number;
  users_growth_pct: number;
};

export type AdminBooking = {
  id: string;
  created_at: string;
  start_time: string;
  service_name: string;
  customer_email: string;
  customer_name: string | null;
  provider_name: string | null;
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show';
  payment_status: 'pending' | 'captured' | 'refunded';
  amount_cents: number;
  total_count: number;
};

// --- Security Helper ---
async function ensureAdmin() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('Not authenticated');

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);
    
  const isAdmin = roles?.some(r => ['admin', 'super_admin'].includes(r.role));
  if (!isAdmin) throw new Error('Unauthorized');
  
  return supabase;
}

// --- KPI Stats ---
export async function getAdminKPIStats(): Promise<AdminKPI> {
  const supabase = await ensureAdmin();
  const { data, error } = await supabase.rpc('get_admin_kpi_stats');
  
  if (error) {
    console.error('KPI Error:', error);
    throw new Error('Failed to fetch KPIs');
  }
  
  return data as AdminKPI;
}

// --- Booking Management ---
export async function getAdminBookings(page = 1, limit = 10, status?: string, search?: string) {
  const supabase = await ensureAdmin();
  
  const { data, error } = await supabase.rpc('get_admin_bookings', {
    p_page: page,
    p_limit: limit,
    p_status: status || null,
    p_search: search || null
  });

  if (error) {
    console.error('Admin Bookings Error:', error);
    return { data: [], total: 0 };
  }

  // Extract total count from first row if exists, else 0
  const total = data && data.length > 0 ? Number(data[0].total_count) : 0;
  
  return { 
    bookings: data as AdminBooking[], 
    total 
  };
}

export async function adminCancelBooking(bookingId: string) {
  const supabase = await ensureAdmin();
  
  // Update status
  const { error } = await supabase
    .from('booking')
    .update({ 
       status: 'canceled', 
       payment_status: 'refunded', // Should trigger logic elsewhere for actual refund
       updated_at: new Date().toISOString()
    })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/bookings');
}

// --- User Management Stub ---
// (Would connect to auth.users and profiles)
export async function getAdminUsers(page = 1, limit = 20) {
  const supabase = await ensureAdmin();
  // ... implementation depends on profile/auth linkage
  // For now return empty or simple profile fetch
  return [];
}
