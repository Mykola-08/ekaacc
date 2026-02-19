import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();
  const supabase = await createClient();

  try {
    // Check critical tables in parallel for faster response
    const tables = ['service', 'staff', 'booking', 'app_config'] as const;

    const tableChecks = await Promise.allSettled(
      tables.map(async (table) => {
        const { error } = await supabase.from(table).select('id', { count: 'exact', head: true });
        return { table, healthy: !error, error: error?.message };
      })
    );

    const tableStatus: Record<string, boolean> = {};
    const errors: Record<string, string> = {};

    for (const result of tableChecks) {
      if (result.status === 'fulfilled') {
        tableStatus[result.value.table] = result.value.healthy;
        if (result.value.error) {
          errors[result.value.table] = result.value.error;
        }
      } else {
        // Table check failed
        const index = tableChecks.indexOf(result);
        if (index !== -1 && tables[index]) {
          tableStatus[tables[index] as string] = false;
          errors[tables[index] as string] = result.reason?.message || 'Unknown error';
        }
      }
    }

    const responseTime = Date.now() - startTime;
    const allTablesHealthy = Object.values(tableStatus).every((status) => status);

    const response = NextResponse.json(
      {
        healthy: allTablesHealthy,
        timestamp: new Date().toISOString(),
        responseTimeMs: responseTime,
        database: {
          connected: true,
          tables: tableStatus,
          allTablesAccessible: allTablesHealthy,
          ...(Object.keys(errors).length > 0 && { errors }),
        },
      },
      { status: allTablesHealthy ? 200 : 503 }
    );

    response.headers.set('Cache-Control', 'public, s-maxage=30');
    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        healthy: false,
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        error: errorMessage,
      },
      { status: 503 }
    );
  }
}
