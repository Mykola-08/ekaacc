import { NextRequest, NextResponse } from 'next/server';
import { listAllSubscriptions, cancelSubscription } from '@/lib/platform/services/stripe-client';
import { getCurrentUser } from '@/lib/platform/supabase';
import Stripe from 'stripe';

async function requireAdminUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };

  const role = currentUser.app_metadata?.role;
  if (!role || !['admin', 'super_admin', 'Admin', 'SuperAdmin'].includes(role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { user: currentUser };
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const status = searchParams.get('status') as Stripe.SubscriptionListParams.Status | undefined;

  try {
    const subscriptions = await listAllSubscriptions(limit, status || undefined);
    return NextResponse.json(subscriptions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { subscriptionId, prorate = true } = body;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const result = await cancelSubscription(subscriptionId, prorate);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
