import { NextResponse } from 'next/server';
import { getResources } from '@/server/resources/service';

// This endpoint is purposefully public to serve marketing materials and open wellness resources.
// Premium resources are filtered within `getResources` or validated on the client side playing premium content.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;

  const resources = await getResources(category);

  return NextResponse.json({ resources });
}
