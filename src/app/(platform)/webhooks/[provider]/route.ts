import { NextResponse } from 'next/server';
import { integrationManager } from '@/lib/platform/integrations/manager';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const integration = integrationManager.getIntegration(provider);

  if (!integration) {
    return new Response(`Provider ${provider} not found`, { status: 404 });
  }

  try {
    return await integration.handleWebhook(request);
  } catch (error) {
    console.error(`Error handling webhook for ${provider}:`, error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

