import { NextResponse } from 'next/server';
import { integrationManager } from '@/lib/integrations/manager';

export const dynamic = 'force-dynamic';

export async function GET() {
  const statuses = await integrationManager.getAllStatuses();
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: statuses.length,
      active: statuses.filter(s => s.connected).length,
      failed: statuses.filter(s => !s.connected).length,
    },
    results: statuses.map(s => ({
      id: s.id,
      name: s.name,
      connected: s.connected,
      details: s.details,
      error: s.error
    }))
  };

  return NextResponse.json(report, { status: 200 });
}
