import { createClient } from '@/lib/supabaseServerClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check database connection
    const { data, error } = await supabase.from('service').select('count').limit(1).single();
    
    const dbStatus = error ? 'error' : 'connected';
    const dbError = error ? error.message : null;

    return NextResponse.json({
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      database: dbStatus,
      error: dbError
    });
  } catch (e: any) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      error: e.message
    }, { status: 500 });
  }
}
