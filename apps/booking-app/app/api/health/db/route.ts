import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Test basic connectivity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabaseServer
      .from('service')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return NextResponse.json({
        healthy: false,
        timestamp: new Date().toISOString(),
        error: error.message,
        responseTimeMs: responseTime
      }, { status: 503 });
    }
    
    // Check critical tables
    const tables = ['service', 'staff', 'booking', 'app_config'];
    const tableStatus: Record<string, boolean> = {};
    
    for (const table of tables) {
      const { error: tableError } = await supabaseServer
        .from(table)
        .select('id')
        .limit(1);
      
      tableStatus[table] = !tableError;
    }
    
    const allTablesHealthy = Object.values(tableStatus).every(status => status);
    
    return NextResponse.json({
      healthy: true,
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
      database: {
        connected: true,
        tables: tableStatus,
        allTablesAccessible: allTablesHealthy
      }
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      healthy: false,
      timestamp: new Date().toISOString(),
      error: String(err)
    }, { status: 503 });
  }
}
