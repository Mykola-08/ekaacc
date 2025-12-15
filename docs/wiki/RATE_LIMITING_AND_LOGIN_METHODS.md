# Rate Limiting & Multi-Provider Login

## Distributed Rate Limiting
Rate limiting has been migrated from in-memory counters to Upstash Redis for consistency across serverless/edge instances.

### Global Middleware
`src/middleware.ts` invokes `ipRateLimit(ip, 'global', RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_SECONDS)`.

Environment Variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RATE_LIMIT_MAX_REQUESTS` (default 300)
- `RATE_LIMIT_WINDOW_SECONDS` (default 60)

### Access Token Endpoint
`/api/auth/access-token` uses Redis rate limiting with its own bucket `access-token` and limit (`ACCESS_TOKEN_RATE_LIMIT`, default 80/min).

Auto-refresh engages when remaining lifetime < `ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS`.

## Multi-Provider / Connection-Specific Login
Dynamic route: `GET /api/auth/login/[connection]` allows initiating login for a specified connection (e.g. `google-oauth2`, `github`, `linkedin`, passwordless email, etc.).

Example:
```
/api/auth/login/google-oauth2?returnTo=/dashboard
/api/auth/login/github?returnTo=/repos
```

Parameters Passed:
- `connection` = dynamic segment

### Adding New Connections
1. Enable provider in Dashboard.
2. Configure domain + credentials required by provider (client ID/secret).
3. Test via the dynamic login route.

### Passwordless (Email / SMS)
For passwordless email, create a passwordless connection and invoke:
```
/api/auth/login/email?returnTo=/onboarding
```
Ensure Action & Post-Login flows still attach custom claims (role, tenant).

## Security Considerations
- Ensure rate limits reflect expected traffic patterns; over-restrict can impact legitimate sessions.
- For high-value endpoints consider adding a secondary hCaptcha / Turnstile challenge.
- Monitor Redis usage and adjust TTL/window sizes for cost efficiency.

## Troubleshooting
| Issue | Cause | Resolution |
|-------|-------|------------|
| 429 responses on most pages | Low `RATE_LIMIT_MAX_REQUESTS` value | Increase limit or extend window seconds |
| 401 on provider login | Connection name mismatch | Verify connection slug in dashboard |
| Refresh never triggers | Threshold too low vs token lifetime | Increase `ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS` |
| Redis errors | Missing Upstash env vars | Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` |

---
Document version: 2025-11-21