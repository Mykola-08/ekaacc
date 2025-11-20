# Google OAuth Quick Reference

## 🚀 Quick Start

### 1. Environment Variables
```bash
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-client-id
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-client-secret
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
```

### 2. Run Migration
```bash
npx supabase db reset
```

### 3. Sign In
```tsx
const { signInWithOAuth } = useSimpleAuth()
await signInWithOAuth('google')
```

---

## 📚 Common Tasks

### Get User's Google Profile
```tsx
import { getGoogleProfile } from '@/lib/google-api-helper'

const profile = await getGoogleProfile(userId)
// { email, name, picture, verified_email }
```

### List Calendar Events
```tsx
import { listGoogleCalendarEvents } from '@/lib/google-api-helper'

const events = await listGoogleCalendarEvents(userId, 'primary', {
  timeMin: new Date().toISOString(),
  maxResults: 10,
})
```

### Check Token Status
```tsx
import { getGoogleTokens } from '@/services/provider-tokens-service'

const tokens = await getGoogleTokens(userId)
// { accessToken, refreshToken, expiresAt }
```

### Get Valid Token (Auto-Refresh)
```tsx
import { getValidGoogleToken } from '@/services/provider-tokens-service'

const token = await getValidGoogleToken(userId)
// Automatically refreshes if expired
```

---

## 🔐 Scopes

### Default (Always Included)
- `openid`
- `email`
- `profile`

### Calendar
- `https://www.googleapis.com/auth/calendar.readonly` - Read events
- `https://www.googleapis.com/auth/calendar` - Read/write events

### Drive
- `https://www.googleapis.com/auth/drive.readonly` - Read files
- `https://www.googleapis.com/auth/drive` - Read/write files

### Gmail
- `https://www.googleapis.com/auth/gmail.readonly` - Read emails
- `https://www.googleapis.com/auth/gmail.send` - Send emails

To add scopes, update `src/context/auth-context.tsx` line ~275.

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `src/services/provider-tokens-service.ts` | Token management |
| `src/lib/google-api-helper.ts` | API helpers |
| `src/app/api/auth/refresh-google-token/route.ts` | Token refresh |
| `src/components/auth/oauth-connections.tsx` | UI component |
| `src/examples/google-oauth-examples.tsx` | Usage examples |
| `GOOGLE_OAUTH_SETUP.md` | Full documentation |

---

## 🐛 Troubleshooting

### No Refresh Token?
```
1. Revoke app: https://myaccount.google.com/permissions
2. Sign in again (Google only returns refresh token on first consent)
```

### Token Refresh Fails?
```
1. Check GOOGLE_CLIENT_SECRET environment variable
2. Verify client ID matches
```

### API Calls Fail?
```
1. Check required scopes in auth context
2. Ensure scopes enabled in Google Console
3. User may need to re-authenticate
```

---

## 💡 Tips

- Use `getValidGoogleToken()` instead of accessing tokens directly
- Tokens auto-refresh 5 minutes before expiration
- Users can view/disconnect providers in OAuth Connections component
- All tokens stored with RLS (users can only access their own)

---

For complete documentation, see `GOOGLE_OAUTH_SETUP.md`
