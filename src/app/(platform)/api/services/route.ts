import { NextResponse } from 'next/server';
import { listServices } from '@/server/booking/service';

// GET /api/services
// Returns minimal list of active services available for anonymous users
export async function GET() {
  const { data, error } = await listServices();

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
  return NextResponse.json({ services: data });
}

