# Production Auth0 Setup (Custom Domain auth.ekabalance.com)

This guide documents the production-ready Auth0 configuration now provisioned for the EkaBalance platform.

---
## Resources Created

### Application (Production)
- Name: EkaBalance Production Web App
- Type: SPA (OIDC Conformant)
- Client ID: `Yd7mGv7bFP4OBJB5PioD0aMzWxfLtTS1`
- Client Secret: (stored in deployment environment, do not commit)
- Callbacks:
  - `https://ekabalance.com/api/auth/callback`
  - `https://auth.ekabalance.com/api/auth/callback`
- Allowed Logout URLs:
  - `https://ekabalance.com`
  - `https://auth.ekabalance.com`
- Allowed Origins:
  - `https://ekabalance.com`
  - `https://auth.ekabalance.com`

### Resource Server (API)
- Name: EkaBalance API
- Identifier / Audience: `https://api.ekabalance.com`
- Scopes:
  - `read:profile`, `write:profile`
  - `read:orders`, `write:orders`
  - `read:analytics`
- Signing Algorithm: RS256
- Refresh Tokens: Enabled (expiring, rotation)

### Action (Post-Login)
- Name: `Sync User to Supabase (Prod)`
- Trigger: `post-login`
- Purpose: Adds Supabase-compatible custom JWT claims and syncs user into `users` table.
- Secrets:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (ensure production key configured in Auth0 Action secrets UI)

---
## Custom Domain Configuration (auth.ekabalance.com)
Auth0 custom domain cannot be automated via the current scripting interface; complete these steps manually:

1. In Auth0 Dashboard: `Authentication > Custom Domains > Add Domain`.
2. Enter: `auth.ekabalance.com`.
3. Auth0 will provide a CNAME target (e.g. `your-tenant.auth0.com`).
4. In your DNS provider, create a CNAME record:
   - Name: `auth`
   - Value: `<tenant-domain-provided-by-Auth0>`
5. Wait for DNS propagation; click **Verify** in Auth0.
6. Enable the domain (Auth0 will provision TLS automatically).
7. Update environment variables to use the custom domain for production flows.

After activation, the issuer & JWKS endpoints become:
```
Issuer: https://auth.ekabalance.com/
JWKS:  https://auth.ekabalance.com/.well-known/jwks.json
```
Update Supabase JWT configuration accordingly.

---
## Environment Variables
Add the following to deployment (e.g. Vercel project settings) – do NOT commit secrets to Git:
```
PROD_AUTH0_DOMAIN=auth.ekabalance.com
PROD_AUTH0_CLIENT_ID=Yd7mGv7bFP4OBJB5PioD0aMzWxfLtTS1
PROD_AUTH0_CLIENT_SECRET=******** (from Auth0)
PROD_AUTH0_AUDIENCE=https://api.ekabalance.com
PROD_AUTH0_SCOPE=openid profile email offline_access
SUPABASE_URL=https://rbnfyxhewsivofvwdpuk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=********
```

Recommended pattern in code (Next.js):
```ts
const domain = process.env.NODE_ENV === 'production'
  ? process.env.PROD_AUTH0_DOMAIN
  : process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
```

---
## Supabase JWT Configuration (Production)
Update in Supabase Dashboard:
```
JWKS URL: https://auth.ekabalance.com/.well-known/jwks.json
Issuer:   https://auth.ekabalance.com/
Audience: https://api.ekabalance.com  (if using Resource Server audience)
```
If you continue using the Supabase project URL as audience for row-level security integration, keep that value consistent across Auth0 Action and Supabase settings.

---
## Token & Claims
Custom claim namespace used:
```
https://supabase.io/jwt/claims
```
Sample ID Token payload additions:
```json
{
  "https://supabase.io/jwt/claims": {
    "user_id": "auth0|abc123",
    "email": "user@example.com",
    "email_verified": true,
    "role": "user"
  }
}
```

---
## Next Steps Checklist
- [ ] DNS CNAME created & propagated
- [ ] Auth0 custom domain verified & active
- [ ] Supabase JWT settings updated to custom domain issuer
- [ ] Production secrets stored in Vercel (not committed)
- [ ] Post-Login Action placed in Login Flow (production tenant)
- [ ] RLS policies validated using new issuer
- [ ] End-to-end login test on `https://ekabalance.com`
- [ ] Logout clears session & returns to site

---
## Security Recommendations
- Rotate `PROD_AUTH0_CLIENT_SECRET` periodically.
- Enable MFA for privileged roles.
- Monitor Auth0 logs & set anomaly detection.
- Restrict scopes issued to only what the UI needs.
- Ensure Service Role key is never exposed client-side.

---
## Troubleshooting
| Issue | Cause | Resolution |
|-------|-------|------------|
| Invalid issuer | Supabase still points to tenant domain | Update Supabase JWT settings to custom domain issuer |
| Login loop | Callback URLs mismatch | Verify both production callback URLs are registered |
| Missing claims | Action not deployed or secret missing | Re-deploy action; verify secrets in Action settings |
| 401 on API calls | Audience mismatch | Ensure `PROD_AUTH0_AUDIENCE` matches resource server identifier |

---
## Migration Notes
If you previously used the tenant domain in production, update frontend env vars, Supabase JWT config, and any hard-coded URLs immediately after custom domain activation to avoid mixed issuer errors.

---
## Verification Script Update
Consider extending `scripts/verify-auth0-setup.js` to check production vars (PROD_*). This ensures CI validation for production readiness.

---
## Reference
- Auth0 Custom Domains: https://auth0.com/docs/customize/custom-domains
- Supabase Auth: https://supabase.com/docs/guides/auth

---
**Status:** Production Auth0 resources provisioned; awaiting manual custom domain DNS & Supabase issuer update.
