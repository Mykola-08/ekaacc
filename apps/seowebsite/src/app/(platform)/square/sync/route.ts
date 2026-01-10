import { NextResponse } from 'next/server';
import { squareStripeSyncService } from '@/services/square-stripe-sync-service';

export async function POST() {
  try {
    const result = await squareStripeSyncService.syncServices();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
