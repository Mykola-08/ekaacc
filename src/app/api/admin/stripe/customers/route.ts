import { NextRequest, NextResponse } from 'next/server';
import { listAllCustomers } from '@/lib/platform/services/stripe-client';
import { getCurrentUser, supabaseAdmin } from '@/lib/platform/supabase';

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
  const startingAfter = searchParams.get('starting_after') || undefined;

  try {
    const customers = await listAllCustomers(limit, startingAfter);
    return NextResponse.json(customers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
