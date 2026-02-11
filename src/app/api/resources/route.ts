import { NextResponse } from 'next/server';
import { getResources } from '@/server/resources/service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;

  const resources = await getResources(category);

  return NextResponse.json({ resources });
}
