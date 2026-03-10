import { NextResponse } from 'next/server';
import { publishScheduledPosts } from '@/server/telegram/service';
import { snapshotAllChannels } from '@/server/telegram/analytics';

/**
 * Cron endpoint for Telegram scheduled tasks:
 * 1. Publish overdue scheduled posts
 * 2. Snapshot all channel analytics
 *
 * Protect with CRON_SECRET header in production.
 */
export async function POST(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results = {
    publishedPosts: 0,
    snapshotChannels: 0,
    errors: [] as string[],
  };

  try {
    results.publishedPosts = await publishScheduledPosts();
  } catch (e) {
    results.errors.push(`Publish error: ${(e as Error).message}`);
  }

  try {
    results.snapshotChannels = await snapshotAllChannels();
  } catch (e) {
    results.errors.push(`Snapshot error: ${(e as Error).message}`);
  }

  return NextResponse.json({
    ok: true,
    ...results,
    timestamp: new Date().toISOString(),
  });
}
