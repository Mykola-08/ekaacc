import { NextResponse } from 'next/server';
import { sendUpcomingReminders } from '@/server/notifications/reminders';

export async function GET(request: Request) {
  // Validate cron secret if provided
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendUpcomingReminders(24);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      errors: result.errors,
    });
  } catch (error: any) {
    console.error('[CRON] Reminders error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
