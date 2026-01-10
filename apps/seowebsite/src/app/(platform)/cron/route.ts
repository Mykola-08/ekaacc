import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/platform/supabase';

type TaskStatus = 'success' | 'failed'

export async function GET(request: NextRequest) {
  // Verify the request is authorized
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const results: {
      cleanup_expired_insights: TaskStatus | null,
      cleanup_expired_payment_requests: TaskStatus | null,
      cleanup_old_analytics_data: TaskStatus | null,
    } = {
      cleanup_expired_insights: null,
      cleanup_expired_payment_requests: null,
      cleanup_old_analytics_data: null,
    };

    // Run cleanup tasks
    // These functions are defined in the database schema
    
    // 1. Cleanup expired insights
    const { error: error1 } = await supabaseAdmin.rpc('cleanup_expired_insights');
    if (error1) console.error('Error cleaning up insights:', error1);
    results.cleanup_expired_insights = error1 ? 'failed' : 'success';

    // 2. Cleanup expired payment requests
    const { error: error2 } = await supabaseAdmin.rpc('cleanup_expired_payment_requests');
    if (error2) console.error('Error cleaning up payment requests:', error2);
    results.cleanup_expired_payment_requests = error2 ? 'failed' : 'success';

    // 3. Cleanup old analytics data
    const { error: error3 } = await supabaseAdmin.rpc('cleanup_old_analytics_data');
    if (error3) console.error('Error cleaning up analytics data:', error3);
    results.cleanup_old_analytics_data = error3 ? 'failed' : 'success';

    return NextResponse.json({ 
      ok: true, 
      timestamp: new Date().toISOString(),
      results 
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
