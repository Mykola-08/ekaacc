export type BooleanFlagKey =
  | 'ai_insights_enabled'
  | 'ai_chat_enabled'
  | 'journal_enabled'
  | 'goals_enabled'
  | 'messaging_enabled'
  | 'community_enabled'
  | 'therapist_portal_enabled'
  | 'therapist_booking_enabled'
  | 'admin_dashboard_enabled'
  | 'analytics_enabled'
  | 'subscription_tiers_enabled'
  | 'wallet_enabled'
  | 'loyalty_program_enabled'
  | 'referrals_enabled'
  | 'square_integration_enabled'
  | 'stripe_billing_enabled'
  | 'onboarding_flow_v2_enabled'
  | 'impersonation_enabled'
  | 'feature_flags_ui_enabled';

export interface FlagDefinitions {
  ai_insights_enabled: boolean;
  ai_chat_enabled: boolean;
  journal_enabled: boolean;
  goals_enabled: boolean;
  messaging_enabled: boolean;
  community_enabled: boolean;
  therapist_portal_enabled: boolean;
  therapist_booking_enabled: boolean;
  admin_dashboard_enabled: boolean;
  analytics_enabled: boolean;
  subscription_tiers_enabled: boolean;
  wallet_enabled: boolean;
  loyalty_program_enabled: boolean;
  referrals_enabled: boolean;
  square_integration_enabled: boolean;
  stripe_billing_enabled: boolean;
  onboarding_flow_v2_enabled: boolean;
  impersonation_enabled: boolean;
  feature_flags_ui_enabled: boolean;
}

export interface FlagEvaluationOptions {
  userId?: string;
  country?: string;
  custom?: Record<string, unknown>;
}

export interface FlagEvaluationResult<K extends BooleanFlagKey> {
  key: K;
  value: boolean;
  ruleID?: string;
  secondaryExposures?: Array<Record<string, string>>;
}