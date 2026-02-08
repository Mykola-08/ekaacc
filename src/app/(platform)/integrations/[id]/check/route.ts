import { NextResponse } from 'next/server';
import { integrationManager } from '@/lib/platform/integrations/manager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const integration = integrationManager.getIntegration(id);

  if (!integration) {
    return NextResponse.json(
      { error: 'Integration not found' },
      { status: 404 }
    );
  }

  const status = await integration.getStatus();

  return NextResponse.json({
    success: true,
    data: status
  });
}

