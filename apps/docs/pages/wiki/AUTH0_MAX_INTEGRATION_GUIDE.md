# Auth0 Maximum Integration Guide

This guide enumerates recommended Auth0 integrations, connection strategies, flows, and Actions for a production-grade multi-tenant, multi-role application with Supabase RLS enforcement.

## 1. Core Components
- Application: Primary SPA/SSR Next.js app (already provisioned).
- Resource Server (API): Issues audience-specific access tokens containing custom claims (roles, tenant).
- Actions: Post-Login enrichment + supplemental lifecycle hooks.
- Connections: Social (Google, GitHub, Apple, LinkedIn), Enterprise (Azure AD / OIDC), Passwordless (Email / SMS), Classic DB for fallback.
- Organizations (optional): Multi-tenant grouping; map `org_id` to Supabase `tenant_id` via Post-Login Action.
- Adaptive MFA & Attack Protection: Enable high security posture.

## 2. Recommended Auth0 Settings
| Category | Setting | Recommendation |
|----------|---------|---------------|
| Refresh Tokens | Rotation | Enabled with leeway < 60s |
| MFA | Factors | Email/Guardian + WebAuthn for admins |
| Attack Protection | Brute-force, Breached Password, Suspicious IP | All enabled (actionable mode) |
| Organizations | Usage | `allow` or `require` depending on B2B features |
| Password Policy | Complexity | At least `Good`, prefer `Excellent` |
| Session Lifetime | Rolling Sessions | Enabled, short inactivity (24h) |

## 3. Connection Matrix
| Connection | Strategy | Purpose | Notes |
|-----------|----------|---------|-------|
| google-oauth2 | Social | Low-friction onboarding | Map `hd` claim for domain scoping if needed |
| github | Social | Developer users | Use to auto-import avatar, username |
| apple | Social | Privacy-focused users | Requires private email handling |
| linkedin | Social | Professional identities | Can enrich profile with headline |
| email | Passwordless | Simplified entry | Magic link or code mode |
| sms | Passwordless | Mobile-first | Consider cost & regional coverage |
| azuread | Enterprise | Company SSO | Use incremental profile mapping |
| custom-oidc | Enterprise | External partner IdP | Validate issuer & JWKS caching |
| auth0-db | Database | Fallback / Service accounts | Restrict sign-up, use invite-only |

## 4. Actions Overview
Current: Post-Login user + roles + tenant sync.

Additional Recommended Actions:
1. Pre-User-Registration: Validate invite / referral code, assign default metadata.
2. Post-Registration: Send welcome email via Resend API (avoid synchronous blocking; fire-and-forget).
3. Post-Login (Risk Logging): Capture login context (IP, auth method, device) -> Supabase `auth_events` table.
4. Post-Change-Password: Mark `password_last_changed` timestamp in Supabase; invalidate risky sessions.
5. On-MFA-Verified (via log stream or action when available): Append `mfa_level` claim.
6. Pre-Token-Exchange (Machine-to-Machine): Inject service permissions claim.

### 4.1 Example Pre-User-Registration Action
```javascript
exports.onExecutePreUserRegistration = async (event, api) => {
  const inviteCode = event.body?.invite_code
  if (!inviteCode || inviteCode !== event.secrets.VALID_INVITE_CODE) {
    // Block self-registration unless code is valid
    api.access.deny('Invalid invite code')
    return
  }
  api.user.setAppMetadata({ roles: ['user'], tenant_id: 'default' })
}
```

### 4.2 Post-Registration Welcome Action
```javascript
exports.onExecutePostUserRegistration = async (event, api) => {
  try {
    const key = event.secrets.RESEND_API_KEY
    if (!key) return
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Support <support@yourdomain.com>',
        to: event.user.email,
        subject: 'Welcome to EKA',
        html: '<h1>Welcome!</h1><p>Your account is ready.</p>'
      })
    })
  } catch (e) {
    console.log('[WelcomeEmail] Error:', e.message)
  }
}
```

### 4.3 Post-Login Risk Logging Action
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const { user, client, request } = event
  api.accessToken.setCustomClaim('https://supabase.io/jwt/claims', {
    auth_method: event.authentication?.method || 'unknown'
  })
  try {
    const url = event.secrets.SUPABASE_URL
    const key = event.secrets.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      await fetch(`${url}/rest/v1/auth_events`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Prefer': 'resolution=merge-duplicates', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          email: user.email,
          ip: request.ip,
          user_agent: request.user_agent,
          auth_method: event.authentication?.method,
          client_id: client.client_id,
          timestamp: new Date().toISOString()
        })
      })
    }
  } catch (e) {
    console.log('[AuthEventLog] Error:', e.message)
  }
}
```

## 5. Supabase Schema Additions
Tables:
- `auth_events` (id, user_id, email, ip, user_agent, auth_method, client_id, timestamp)
- `invites` (code PK, issued_to_email, role, tenant_id, expires_at, used_at)

RLS Policies:
- Users can read their own `auth_events`.
- Admin can read all.

## 6. Environment Variables (Additional)
| Variable | Purpose |
|----------|---------|
| `VALID_INVITE_CODE` | Temporary invite gating for Pre-Registration |
| `RESEND_API_KEY` | Welcome email sending |
| `AUTH_EVENT_LOGGING_ENABLED` | Toggle Post-Login risk logging action behavior |

## 7. Management API Scripts
Scripts provided:
- `verify-auth0-setup.js`: Baseline checks.
- `verify-auth0-connections.js`: Lists connection coverage & missing recommended providers.

Future script ideas:
- `sync-auth0-organizations.js`: Mirror orgs to Supabase `tenants` table.
- `export-auth0-logs.js`: Pull security logs for offline analysis.

## 8. Token Claims Strategy
Namespaced key: `https://supabase.io/jwt/claims`
Embedded fields:
- `user_id`, `email`, `roles[]`, `role`, `tenant_id`, `auth_method`, `mfa_level` (if available)

## 9. Security Hardening Checklist
| Item | Status |
|------|--------|
| Refresh token rotation | Enabled |
| Actions namespaced claims | Implemented |
| Upstash rate limiting | Implemented |
| Session cookie httpOnly, secure | Enabled |
| Adaptive MFA | Pending (enable in Auth0 dashboard) |
| Social provider domain restrictions | Optional per connection |
| Log stream to SIEM (AWS/OpenSearch) | Future |

## 10. Deployment Ordering
1. Create/Enable connections in Auth0 UI.
2. Add secrets for Actions (Supabase URL/service key, Resend API key, VALID_INVITE_CODE).
3. Deploy Actions (Pre-Registration, Post-Registration, Risk Logging, existing role/tenant sync).
4. Update Supabase schema (auth_events, invites) & RLS policies.
5. Roll out dynamic connection login routes (already implemented).
6. QA and verify tokens contain all required claims.

## 11. Validation Steps
1. Run `npm run verify:auth0:connections` — ensure recommended providers present.
2. Test each connection login (/api/auth/login/[connection]).
3. Inspect returned `accessToken` via `/api/auth/access-token` for claims.
4. Query Supabase `auth_events` after login to confirm logging.
5. Attempt registration without invite code — expect denial.
6. Attempt with valid invite code — expect success & assigned metadata.

## 12. Troubleshooting
| Symptom | Possible Cause | Resolution |
|---------|----------------|-----------|
| Missing claims | Action not deployed or namespace mismatch | Confirm Action deploy & claim key |
| 400 on Pre-Registration | Missing invite code body | Include `invite_code` field in signup payload |
| Rate limit sporadic 429 | Aggressive limits | Adjust `RATE_LIMIT_MAX_REQUESTS` or window |
| Connection not found | Wrong slug | Re-check provider connection name in Auth0 dashboard |

---
Document version: 2025-11-21