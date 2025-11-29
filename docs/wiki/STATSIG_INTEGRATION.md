# Statsig Integration

This document outlines how feature flags and experimentation are integrated using Statsig.

## Keys

| Key | Format | Purpose | Exposure |
|-----|--------|---------|----------|
| `STATSIG_API_KEY` | `console-*` | Console API / MCP remote calls | Server only |
| `STATSIG_SERVER_SECRET` | `secret-*` | Server-side gate & config evaluation | Server only |
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | `client-*` | Optional client-side gate evaluation | Public |

## Environment Setup

Add variables to Vercel (all scopes where needed):
```powershell
vercel env add STATSIG_API_KEY production
vercel env add STATSIG_SERVER_SECRET production
vercel env add NEXT_PUBLIC_STATSIG_CLIENT_KEY production
```

Supabase Edge Functions (if used) require the server secret:
```powershell
supabase secrets set STATSIG_SERVER_SECRET=secret-...
```

## Server Usage

Use `src/lib/statsig.ts` for initialization and gate/config checks:
```ts
import { isFlagEnabled, getAllFlags } from '../services/featureFlags';
const flags = await getAllFlags({ userId: 'user_123' });
if (flags.ai_insights_enabled) {
  // load AI insights
}
```

## Client Usage (Optional)

Only if `NEXT_PUBLIC_STATSIG_CLIENT_KEY` is set:
```ts
import Statsig from 'statsig-js';
await Statsig.initialize(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!, { userID: 'user_123' });
const enabled = Statsig.checkGate('community_enabled');
```

## API Prefetch

An aggregated flags JSON endpoint is available at `/api/flags` returning:
```json
{ "flags": { "ai_insights_enabled": true, "wallet_enabled": false } }
```
Use this for lightweight client hydration if you cannot prefetch in a server component.

## Hydrated Provider Pattern

Server component + client provider example in `src/components/examples/FlagsStatus.tsx`.

## Flag Catalog

| Flag | Description | Default |
|------|-------------|---------|
| ai_insights_enabled | AI personalized insights | true |
| ai_chat_enabled | Conversational chat assistant | true |
| journal_enabled | Journal & mood tracking | true |
| goals_enabled | Goals and progress tracking | true |
| messaging_enabled | Secure messaging feature | true |
| community_enabled | Community forums | true |
| therapist_portal_enabled | Therapist tools portal | true |
| therapist_booking_enabled | Booking/scheduling system | true |
| admin_dashboard_enabled | Admin dashboards | true |
| analytics_enabled | Analytics modules | true |
| subscription_tiers_enabled | Subscription tier logic | true |
| wallet_enabled | User wallet module | false |
| loyalty_program_enabled | Loyalty / rewards | true |
| referrals_enabled | Referral program | true |
| square_integration_enabled | Square integration | true |
| stripe_billing_enabled | Stripe billing flows | true |
| onboarding_flow_v2_enabled | Experimental onboarding v2 | false |
| impersonation_enabled | Admin user impersonation | true |
| feature_flags_ui_enabled | Internal flags UI | false |

## Gating Component

`FeatureGate` (client-side) lives in `src/components/feature/FeatureGate.tsx`:
```tsx
<FeatureGate flag="wallet_enabled" fallback={<span>Wallet disabled</span>}>
  <WalletPanel />
</FeatureGate>
```

Prefer server prefetch (`PrefetchedFlags`) to avoid hydration flicker.

## Fallbacks

Fallbacks are defined in `src/services/featureFlags.ts` and applied when Statsig is not initialized (e.g., missing secret or downtime).

## Testing

Jest tests mock `statsig-node` in `src/__tests__/lib/statsig.test.ts` to verify logic without network calls.

## Rotation

Rotate secrets every 90 days:
1. Create new keys in Statsig dashboard.
2. Update Vercel / Supabase secrets.
3. Redeploy and verify gates.

## MCP Integration

`STATSIG_API_KEY` enables remote MCP calls for administrative or future automation tasks. Avoid using it for gate evaluations; always use the server secret.

## Security Notes
- Never expose `STATSIG_SERVER_SECRET` client-side.
- Use different secrets for dev, preview, and prod.
- Monitor exposure logs in Statsig for anomalies.
