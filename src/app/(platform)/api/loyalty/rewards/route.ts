import { NextResponse } from 'next/server';
import { CatalogService } from '@/server/catalog/service';
import { LoyaltyService } from '@/server/loyalty/service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    const catalog = new CatalogService();
    const rewards = await catalog.getRewards();

    let balance = { current_points: 0 };
    if (userId) {
      const loyalty = new LoyaltyService();
      balance = await loyalty.getBalance(userId);
    }

    return NextResponse.json({ rewards, balance });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}
