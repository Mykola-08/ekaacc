# Security Hardening Overview

## Recent Improvements
- Global auth enforcement via middleware (no public pages except legal).
- CSP, HSTS, frame, content-type, referrer, permissions headers injected universally.
- CSP nonce per response (`csp-nonce` cookie) for script whitelisting.
- In-memory rate limiting (single instance) with `RATE_LIMIT_MAX_REQUESTS` env control.
- Supabase migration revoked anonymous read access to `users` table; tightened RLS policies; added admin full access policy.
- Role extraction helper `public.current_user_role()` for RLS decisions.

## Remaining High-Value Hardening (Next Phase)
| Area | Action | Benefit |
|------|--------|---------|
| Session Handling | Migrate to server-side sessions | Eliminates client-side token storage risk |
| Secrets Management | Use Vercel encrypted env + periodic rotation schedule | Reduces blast radius of key leakage |
| Monitoring | Stream logs to SIEM (Datadog/ELK) | Early threat detection |
| Rate Limiting | Move to Redis / Upstash distributed store | Consistent enforcement across instances |
| MFA | Enforce MFA for all admin & practitioner roles | Mitigates credential theft |
| Email Verification | Deny access until verified | Reduces spam / fake accounts |
| Token Lifetime | Shorten ID token to 3600s, rely on refresh rotation | Limits stolen token usability window |
| Vulnerability Scans | SCA & secret scan in CI | Detect outdated libraries & committed secrets |
| Dependency Policies | Enable npm audit + renovate PR gating | Patch vulnerabilities quickly |

## Supabase Recommendations
- Add RLS to all tables (not only `users`).
- Restrict service role usage only to server functions; never expose client side.
- Use row-level policies referencing `public.current_user_role()` for role-specific access.

## Content Security Policy Guidance
Current CSP is strict but allows inline styles (unsafe-inline) for Tailwind preflight. Replace with hashed styles or move to external stylesheet for stricter policy.

## Migration to Server-Side Sessions (Outline)
1. Replace SPA provider with server-side login/logout handlers.
2. Remove temporary `logged_in` cookie & memory token storage.
3. Middleware uses SDK session check rather than cookie flag.
4. Adjust RLS claims injection via Action (unchanged).

## Rotation & Secrets
Suggested rotation cadence:
- Supabase service role key: Semi-annually (requires regenerating & updating action secret).
- Stripe & other 3rd party keys: Quarterly.

## Checklist
- [ ] MFA enabled for privileged roles
- [ ] Brute-force protection active
- [ ] Email verification enforced
- [ ] HSTS preload submitted (after stable domain)
- [ ] All tables have RLS
- [ ] Tokens shortened (ID 3600s, Access 7200s)
- [ ] No secrets in repository
- [ ] CI scanning (npm audit, secret scan) active

## Next Steps Script Ideas
- `scripts/rotate-supabase-service-key.ts`: Automate key replacement + action secret update.
- `scripts/export-audit-logs.ts`: Periodic log ingestion to SIEM.

**Status:** Core hardening applied; proceed with server-side session migration for stronger guarantees.
