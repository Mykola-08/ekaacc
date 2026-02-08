import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { emitEvent } from '@/lib/events';

// POST /api/services/:id/waitlist
// Body: { email, desiredDate (YYYY-MM-DD) }
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { email, desiredDate } = await req.json();
    if (!email || !desiredDate) return NextResponse.json({ error: 'Missing email or desiredDate' }, { status: 400 });
    const dateValid = /\d{4}-\d{2}-\d{2}/.test(desiredDate);
    if (!dateValid) return NextResponse.json({ error: 'Invalid desiredDate format' }, { status: 400 });
    const payload = {
      service_id: id,
      desired_date: desiredDate,
      email,
    };
    const supabase = await createClient();
    const { error } = await supabase.from('waitlist').insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await emitEvent('waitlist.joined', { serviceId: id, desiredDate, email });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

