import { NextResponse } from 'next/server';
import { getExposureSnapshot } from '@/lib/statsig';

export async function GET() {
  if (process.env.NODE_ENV === 'production' && process.env.EXPOSURE_DEBUG !== 'true') {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.json({ exposures: getExposureSnapshot() });
}