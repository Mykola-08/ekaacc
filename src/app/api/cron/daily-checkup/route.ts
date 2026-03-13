import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramNotification } from '@/server/notifications/dispatcher';

// This endpoint is meant to be called by a CRON job (e.g. Vercel Cron or GitHub Actions) daily.

export async function GET(request: Request) {
  // Validate cron secret if provided
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch all users who have a verified Telegram account
    const { data: links, error } = await supabase
      .from('telegram_links')
      .select('user_id, telegram_chat_id')
      .eq('is_verified', true);

    if (error) {
      throw error;
    }

    if (!links || links.length === 0) {
      return NextResponse.json({ message: 'No verified telegram users found', count: 0 });
    }

    let successCount = 0;
    const errors: any[] = [];

    // 2. Loop and hit our dispatch function
    for (const link of links) {
      try {
        const sent = await sendTelegramNotification(
          link.user_id,
          'system',
          'Daily Wellness Check-in',
          'Hello! Take a moment for yourself today. How are you feeling? Remember to breathe and stay mindful. Click below to log your daily reflection.',
          {
            inline_keyboard: [
              [
                {
                  text: '📝 Log Reflection',
                  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekawellness.com'}/dashboard/reflection`,
                },
              ],
            ],
          }
        );
        if (sent) successCount++;
      } catch (err) {
        errors.push({ userId: link.user_id, error: err });
      }
    }

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: links.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('[CRON] Daily checkup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
