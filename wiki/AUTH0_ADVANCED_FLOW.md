# Auth0 Advanced Authentication Flow

This document outlines enhanced capabilities leveraged from Auth0 beyond basic login: organizations, MFA enforcement, scope-based authorization, silent session renewal, and secured route protection.

---
## 1. High-Level Flow (Enhanced)
1. User hits protected route `/dashboard`.
2. Middleware checks session cookie/token presence → redirects to Auth0 Universal Login if missing.
3. Auth0 login enforces MFA + email verification.
4. Post-Login Action enriches token with roles, tenant_id.
5. Application receives ID token & Access token (scoped).
6. Guard component resolves loading state, renders protected content.
7. Silent auth renews tokens before expiry (refresh token rotation).

---
## 2. Organizations (Multi-Tenant)
Set `organization_usage=allow` (already) and optionally require prompt by setting `organization_usage=require`.
Provider can send `organization` param:
```tsx
<Auth0ProviderBase authorizationParams={{ organization: process.env.PROD_AUTH0_ORG_ID }} />
```
Add `PROD_AUTH0_ORG_ID` to environment vars when org is created.

---
## 3. MFA Enforcement
In Auth0 Dashboard → Security → Multi-factor Auth:
- Enable factors: OTP, WebAuthn.
- Set Policy: Require for specific roles (e.g., admin) or always.

Client does not require code changes—enforcement is at login.

---
## 4. Silent Session Renewal
Auth0 SPA SDK handles silent renew when using refresh token rotation (`useRefreshTokens`).
Ensure:
- Refresh token rotation enabled (default in created application).
- `cacheLocation="localstorage"` for persistence.
- Alternatively use `refreshTokens: true` with cookie-based approach if migrating to Next.js server-side.

---
## 5. Scope-Based Guard
Access token contains space-delimited scopes (e.g., `read:profile manage:users`).
Guard pattern:
```ts
function hasScope(scopes: string | undefined, needed: string) {
  return scopes?.split(' ').includes(needed)
}
```
Used in components to enable/disable admin panels.

---
## 6. Protected Routes via Middleware
`src/middleware.ts` can redirect unauthenticated requests early:
```ts
import { NextResponse } from 'next/server'
export function middleware(req) {
  const url = req.nextUrl
  if (url.pathname.startsWith('/dashboard')) {
    // Check cookie or fallback query indicator.
    const idToken = req.cookies.get('id_token')?.value
    if (!idToken) {
      const loginUrl = new URL('/login', url.origin)
      loginUrl.searchParams.set('returnTo', url.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  return NextResponse.next()
}
```
Later enhancement: Issue httpOnly session cookie server-side (requires next-auth or custom Node SDK integration).

---
## 7. Email Verification Enforcement
Add rule or use action condition:
```js
if (!event.user.email_verified) {
  api.access.deny("email_not_verified", "Please verify email before continuing")
}
```
Optionally redirect to email verification page.

---
## 8. Token Lifetime Tuning
Current lifetime 10h (36000). Recommended: shorter ID token (1h) + refresh rotation. Adjust in Application advanced settings → Tokens.

---
## 9. Session Cookie Strategy (Optional Migration)
Move from SPA to backend-issued session:
1. Exchange code in server route using Auth0 Node SDK.
2. Set encrypted, httpOnly cookie containing session identifier.
3. Fetch user on server for SSR components.
This reduces exposure of tokens to JavaScript runtime.

---
## 10. Auditing & Logs
Use Management API to stream logs (login success, anomaly detection) into monitoring system (Datadog, ELK). Add script later if needed.

---
## 11. Verification Checklist (Advanced)
- [ ] MFA policy enabled for admins.
- [ ] Email verification enforcement active.
- [ ] Organization created and linked if multi-tenant.
- [ ] Middleware prevents unauthenticated direct access.
- [ ] Guard component displays loading state gracefully.
- [ ] Scopes present in access tokens & used for gating UI.
- [ ] Token lifetime tuned & rotation enabled.
- [ ] RLS policies reflect tenant & role claims.
- [ ] Sync script run for initial role population.

---
**Status:** Advanced flow documented. Implement components & middleware for enforcement.
