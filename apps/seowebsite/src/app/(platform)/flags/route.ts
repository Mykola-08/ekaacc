import { NextResponse } from 'next/server';
import { getAllFlags } from '@/lib/platform/services/featureFlags';

export const revalidate = 30;

export async function GET() {
  // In a real app, derive user ID from auth context/cookies; fallback anonymous
  const userId = 'anonymous';
  const flags = await getAllFlags({ userId });
  // Ensure no secrets are leaked (server secret never included)
  return NextResponse.json({ flags });
}