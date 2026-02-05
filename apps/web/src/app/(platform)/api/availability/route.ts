import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    // Allow public access to availability? Or just authenticated? 
    // For now, let's say authenticated users can read availability (e.g. clients booking)
    // But to edit, it must be the therapist themselves.

    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get('therapist_id');

    let query = supabase.from('therapist_availability').select('*');

    if (therapistId) {
        query = query.eq('therapist_id', therapistId);
    } else {
        // If no therapist_id provided, maybe try current user?
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            query = query.eq('therapist_id', user.id);
        } else {
            return NextResponse.json({ error: 'therapist_id required' }, { status: 400 });
        }
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ availability: data });
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Expecting a full week dump or updates. For simplicity, let's say we replace for the user.
    // In a real app we might patch. 
    // Let's implement specific slot update/insert for robustness.
    const body = await req.json();
    const { slots } = body; // Array of { day, hour, active }

    if (!slots || !Array.isArray(slots)) {
        return NextResponse.json({ error: 'Invalid slots data' }, { status: 400 });
    }

    // Upsert logic
    const upsertData = slots.map((slot: any) => ({
        therapist_id: user.id,
        day_of_week: slot.day,
        start_time: slot.hour, // Assuming hour is "HH:mm"
        end_time: slot.hour, // Simplified: end time same as start for slot block logic or need duration
        is_active: slot.active
    }));

    // We need to handle conflict on (therapist_id, day, start_time)
    const { data, error } = await supabase
        .from('therapist_availability')
        .upsert(upsertData, { onConflict: 'therapist_id,day_of_week,start_time' })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data.length });
}
