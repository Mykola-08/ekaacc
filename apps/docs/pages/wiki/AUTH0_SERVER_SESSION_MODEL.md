# Auth0 Server-Side Session Model

This document describes how the application now uses server-side sessions with `@auth0/nextjs-auth0` (Edge runtime) and integrates them with Supabase Row Level Security (RLS).

## Overview
The previous client-side SPA approach stored tokens in memory and gated navigation with a temporary `logged_in` cookie. We now rely on Auth0's encrypted session cookie (`appSession`) managed by the Next.js Edge handlers:

- `GET /api/auth/login` -> Initiates Auth0 login with audience & scope
- `GET /api/auth/callback` -> Finalizes login, establishes session cookie
- `GET /api/auth/logout` -> Clears session and redirects
- `GET /api/auth/me` -> Returns user claims (sans tokens)
- `GET /api/auth/access-token` -> Provides resource API access token for Supabase RLS mapping

## Middleware Enforcement
`src/middleware.ts` now validates authentication by calling `getSession` from `@auth0/nextjs-auth0/edge`. If no session is present the user is redirected to `/login?returnTo=<original>`.

## Supabase Integration
Supabase RLS policies expect Auth0-issued JWT claims (role, tenant, user id). The access token returned by Auth0 for the configured `audience` contains those custom claims added via Actions. The client requests `/api/auth/access-token` when it needs to instantiate a Supabase client that will forward this token (e.g., through an Authorization header or custom fetch wrapper).

### Recommended Client Pattern
```ts
import { createClient } from '@supabase/supabase-js'

async function getSupabase() {
  const atRes = await fetch('/api/auth/access-token')
  const { accessToken } = await atRes.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  })
  return supabase
}
```

Ensure your Supabase JWT verification configuration trusts Auth0's JWKS so that RLS can interpret claims.

## Security Notes
- Legacy `logged_in` cookie fully removed; server-side session is sole gate.
- All auth checks pivot on server-side session; prevents tampering vs simple flag cookie.
- Access token endpoint returns only the token required; consider narrowing scopes further.
- Add rate limiting and bot protection (already in middleware) to `/api/auth/*` routes if abuse observed.

## Environment Variables
- `PROD_AUTH0_AUDIENCE` / `NEXT_PUBLIC_AUTH0_AUDIENCE`: Resource server audience for access token issuance.
- `AUTH0_SCOPE`: Scope string (default includes `openid profile email offline_access`). Reduce if refresh tokens not required.
- `ACCESS_TOKEN_RATE_LIMIT`: Per-minute cap for `/api/auth/access-token` requests (default 40).
- `ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS`: If remaining lifetime < threshold, token refresh attempted automatically (default 60).
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: Required for Redis-based global & token route rate limiting.
- `RATE_LIMIT_WINDOW_SECONDS`: Window size (seconds) for global Redis rate limiting.

## Migration Tasks Remaining
- Update any components using `@auth0/auth0-react` to rely on `AuthSessionProvider` (`src/context/auth-session.tsx`).
- Remove deprecated `Auth0ClientProvider` component and references.
- (Completed) Removed all references to legacy `logged_in` cookie.

## Troubleshooting
- 401 from `/api/auth/access-token`: Session expired; re-login.
- Missing custom claims: Verify Auth0 Action runs post-login and audience matches resource server.
- Supabase RLS denial: Confirm JWT claim names match policy (`auth.role`, `auth.tenant_id`, etc.) and JWKS configured correctly.

## Future Enhancements
- Introduce a server-side Supabase client for SSR data fetching using the access token.
- Add refresh token rotation & automatic session renewal.
- Enforce stricter CSP with nonce-based inline script control and disallow unsafe-inline styles.
 - Replace in-memory rate limiter with distributed store (Redis/Upstash) for multi-instance scaling.
 - Add provider-specific login routes using dynamic `connection` segment (implemented).

---
Document version: 2025-11-21