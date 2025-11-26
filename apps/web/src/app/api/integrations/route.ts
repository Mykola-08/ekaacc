import { NextResponse } from 'next/server';
import { integrationManager } from '@/lib/integrations/manager';

export async function GET() {
  const statuses = await integrationManager.getAllStatuses();
  
  return NextResponse.json({
    integrations: statuses
  });
}
