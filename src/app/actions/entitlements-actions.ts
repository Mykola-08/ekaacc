'use server';

import { createClient } from '@/lib/supabase/server';

export type EntitlementSummary = {
  planName: string;
  planStatus: string;
  renewalDate: string | null;
  sessionsIncluded: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  discountPercent: number;
  savingsCents: number;
  communityTier: string;
  resourcesTier: string;
};

const DEFAULT_SUMMARY: EntitlementSummary = {
  planName: 'Free',
  planStatus: 'inactive',
  renewalDate: null,
  sessionsIncluded: 0,
  sessionsUsed: 0,
  sessionsRemaining: 0,
  discountPercent: 0,
  savingsCents: 0,
  communityTier: 'standard',
  resourcesTier: 'standard',
};

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getEntitlementSummary() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: DEFAULT_SUMMARY, error: 'Unauthenticated' };
  }

  const { data: row, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: DEFAULT_SUMMARY, error: error.message };
  }

  const metadata = ((row as any)?.metadata ?? {}) as Record<string, unknown>;

  const sessionsIncluded = toNumber(metadata.sessions_included ?? (row as any)?.sessions_included, 0);
  const sessionsUsed = toNumber(metadata.sessions_used ?? (row as any)?.sessions_used, 0);
  const sessionsRemaining = Math.max(0, sessionsIncluded - sessionsUsed);

  const data: EntitlementSummary = {
    planName: String((row as any)?.plan_name ?? metadata.plan_name ?? 'Free'),
    planStatus: String((row as any)?.status ?? 'inactive'),
    renewalDate: ((row as any)?.current_period_end as string | null) ?? null,
    sessionsIncluded,
    sessionsUsed,
    sessionsRemaining,
    discountPercent: toNumber(metadata.discount_percent ?? (row as any)?.discount_percent, 0),
    savingsCents: toNumber(metadata.savings_cents ?? (row as any)?.savings_cents, 0),
    communityTier: String(metadata.community_tier ?? 'standard'),
    resourcesTier: String(metadata.resources_tier ?? 'standard'),
  };

  return { data, error: null };
}
