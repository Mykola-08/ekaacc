# Global Authentication Enforcement Strategy

All application routes require authentication except a small set of legal/public pages. This is enforced via Next.js middleware plus a lightweight session cookie set after Auth0 callback.

## Components
1. `middleware.ts` – Redirects any request without a valid Auth0 server-side session to `/login` unless path is whitelisted.
2. `api/auth/callback` – Establishes Auth0 session cookie (`appSession`).
3. `api/auth/logout` – Clears Auth0 session and redirects to `/login`.
4. `PUBLIC_ROUTES` env var – Comma-separated list of additional whitelisted paths.

## Whitelisted Paths (Default)
- `/login`
- `/signup`
- `/privacy`
- `/terms`
- `/cookies`
- `/unsubscribe`
- `/manifest.json`
- `/favicon.ico`

## Limitations / Security Notes
- This cookie gate is not a full security boundary; tokens remain client-side (localStorage) via Auth0 SPA SDK.
- All protected data relies on validated Auth0 session + JWT verification at the API / Supabase layer.
- For stronger guarantees, migrate to a server-side session (Auth0 Node SDK / nextjs-auth0) issuing httpOnly, signed session cookies.

## Migration Path (Recommended)
1. Replace SPA SDK with Auth0 Next.js SDK in route handlers to exchange code and store session.
2. Removed temporary `logged_in` cookie logic (deprecated).
3. Middleware validates session via SDK utilities instead of simple cookie existence.

## Operational Checklist
- [ ] `PUBLIC_ROUTES` matches legal compliance requirements.
- [ ] Callback sets cookie; observe browser dev tools after login.
- [ ] Logout clears cookie.
- [ ] Access to `/dashboard` unauthenticated → redirect to `/login`.
- [ ] API calls still validate Auth0 JWT (RLS / Supabase policies).

## Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| Continuous redirect loop | Session not established | Confirm callback executes and domain matches; check HTTPS locally using dev certs |
| Legal page redirects to login | Path missing from `PUBLIC_ROUTES` | Add path and redeploy |
| Auth pages accessible but data queries fail | Token not acquired yet | Wait for SPA SDK to finish token exchange; adjust cookie maxAge if needed |

## Future Enhancements
- Replace cookie gate with server session validation.
- Add caching for public assets bypass.
- Include organization/tenant validation in middleware.

**Status:** Global redirect logic active. Strengthen with server sessions for production hardening.
