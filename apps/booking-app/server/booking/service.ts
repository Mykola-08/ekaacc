import { supabaseServer } from '@/lib/supabaseServerClient';

export async function fetchService(serviceId: string) {
  return supabaseServer.from('service').select('id,name,price,duration').eq('id', serviceId).single();
}

export async function listServiceBookings(serviceId: string, startIso: string, endIso: string) {
  return supabaseServer
    .from('booking')
    .select('id,start_time,end_time,payment_status,staff_id')
    .eq('service_id', serviceId)
    .or('payment_status.eq.pending,payment_status.eq.captured,payment_status.eq.authorized')
    .filter('start_time', 'lt', endIso)
    .filter('end_time', 'gt', startIso);
}

export async function listServices() {
  return supabaseServer
    .from('service')
    .select('id,name,price,duration,description,image_url,location,version,active,created_at')
    .eq('active', true)
    .order('name');
}

export async function getBookingById(bookingId: string) {
  return supabaseServer
    .from('booking')
    .select(`
      *,
      service:service_id (name, duration, price, description),
      staff:staff_id (name, display_name, bio, photo_url, specialties)
    `)
    .eq('id', bookingId)
    .single();
}
