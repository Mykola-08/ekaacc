import { checkFeature, getConfig } from '../lib/statsig';
import type { BooleanFlagKey, FlagDefinitions, FlagEvaluationOptions, FlagEvaluationResult } from '../types/featureFlags';

interface ExperimentConfig<T> {
  key: string;
  value: T | null;
  fetched: boolean;
}

const fallbacks: FlagDefinitions = {
  ai_insights_enabled: true,
  ai_chat_enabled: true,
  journal_enabled: true,
  goals_enabled: true,
  messaging_enabled: true,
  community_enabled: true,
  therapist_portal_enabled: true,
  therapist_booking_enabled: true,
  admin_dashboard_enabled: true,
  analytics_enabled: true,
  subscription_tiers_enabled: true,
  wallet_enabled: false,
  loyalty_program_enabled: true,
  referrals_enabled: true,
  square_integration_enabled: true,
  stripe_billing_enabled: true,
  onboarding_flow_v2_enabled: false,
  impersonation_enabled: true,
  feature_flags_ui_enabled: false,
};

export async function isFlagEnabled<K extends BooleanFlagKey>(key: K, opts: FlagEvaluationOptions = {}): Promise<FlagEvaluationResult<K>> {
  const value = await checkFeature(key, { userID: opts.userId, custom: opts.custom }) || fallbacks[key];
  return { key, value };
}

export async function getAllFlags(opts: FlagEvaluationOptions = {}): Promise<FlagDefinitions> {
  const entries = await Promise.all(
    (Object.keys(fallbacks) as BooleanFlagKey[]).map(async (k) => {
      const r = await isFlagEnabled(k, opts);
      return [k, r.value] as const;
    })
  );
  return Object.fromEntries(entries) as unknown as FlagDefinitions;
}

export async function getExperiment<T extends Record<string, unknown>>(key: string, opts: FlagEvaluationOptions = {}): Promise<ExperimentConfig<T>> {
  const value = await getConfig<T>(key, { userID: opts.userId, custom: opts.custom });
  return { key, value, fetched: value !== null };
}