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

// Database health and monitoring utilities
export async function getBookingStats() {
  const { data, error } = await supabaseServer
    .from('booking')
    .select('status, payment_status');
  
  if (error) return { error };
  
  const stats = {
    total: data?.length || 0,
    byStatus: data?.reduce((acc: any, b: any) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {}),
    byPaymentStatus: data?.reduce((acc: any, b: any) => {
      acc[b.payment_status] = (acc[b.payment_status] || 0) + 1;
      return acc;
    }, {})
  };
  
  return { data: stats };
}

export async function checkDatabaseHealth() {
  try {
    const startTime = Date.now();
    const { data, error } = await supabaseServer
      .from('service')
      .select('count')
      .limit(1)
      .single();
    
    const responseTime = Date.now() - startTime;
    
    return { 
      healthy: !error, 
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
      error: error?.message 
    };
  } catch (err) {
    return { 
      healthy: false, 
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
}
