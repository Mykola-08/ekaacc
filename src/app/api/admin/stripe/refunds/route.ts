import { NextRequest, NextResponse } from 'next/server';
import { refundPayment } from '@/lib/platform/services/stripe-client';
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

export async function POST(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { chargeId, amount, reason } = body;

    if (!chargeId) {
      return NextResponse.json({ error: 'Missing chargeId' }, { status: 400 });
    }

    const refund = await refundPayment(
      chargeId,
      amount,
      reason as Stripe.RefundCreateParams.Reason | undefined
    );
    return NextResponse.json(refund);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
