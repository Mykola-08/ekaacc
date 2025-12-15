import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// GET /api/services
// Returns minimal list of active services available for anonymous users
export async function GET() {
  const supabase = await createClient();
  // Query the service table
  const { data, error } = await supabase
    .from('service')
    .select('id,name,price,duration,description,image_url,location,version')
    .eq('active', true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ services: data });
}
