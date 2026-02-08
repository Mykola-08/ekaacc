import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Cache health check for 30 seconds
export const revalidate = 30;

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = await createClient();

    // Check database connection with simple count
    const { error } = await supabase.from('service').select('id', { count: 'exact', head: true });

    const dbStatus = error ? 'error' : 'connected';
    const responseTimeMs = Date.now() - startTime;

    const response = NextResponse.json({
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      database: dbStatus,
      responseTimeMs,
      ...(error && { error: error.message }),
    });

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=30');
    return response;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        responseTimeMs: Date.now() - startTime,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
