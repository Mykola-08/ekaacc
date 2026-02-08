import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get('telegram_id');

  if (!telegramId) {
    return NextResponse.json({ error: 'Missing telegram_id' }, { status: 400 });
  }

  // Find user by telegram_id
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('telegram_user_id', telegramId)
    .single();

  if (userError || !user) {
      return NextResponse.json({ bookings: [] });
  }

  // Fetch bookings for this user
  // We check both customer_reference_id and email
  let query = supabase
    .from('booking')
    .select('*, service(name)')
    .order('start_time', { ascending: false });
    
  if (user.email) {
      query = query.or(`customer_reference_id.eq.${user.id},email.eq.${user.email}`);
  } else {
      query = query.eq('customer_reference_id', user.id);
  }

  const { data: bookings, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings });
}

