import { NextResponse } from 'next/server';
import { listServices } from '@/server/booking/service';

// GET /api/services
// Returns minimal list of active services available for anonymous users
export async function GET() {
  const { data, error } = await listServices();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ services: data });
}
