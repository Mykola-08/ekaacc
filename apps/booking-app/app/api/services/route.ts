import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// GET /api/services
// Returns minimal list of active services available for anonymous users
export async function GET() {
  const supabase = await createClient();
  // Query the anon_services table
  const { data, error } = await supabase
    .from('anon_services')
    .select('id,name,price,duration,description,image_url,location,version')
    .eq('is_active', true);

  if (error) {
    // Fallback to 'services' if anon_services doesn't exist yet (for smooth migration/dev)
    if (error.code === '42P01') { // undefined_table
       const { data: fallbackData, error: fallbackError } = await supabase
        .from('services')
        .select('id,name,price,duration,description,image_url')
        .eq('is_active', true);
       if (fallbackError) return NextResponse.json({ error: fallbackError.message }, { status: 500 });
       return NextResponse.json({ services: fallbackData });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ services: data });
}
