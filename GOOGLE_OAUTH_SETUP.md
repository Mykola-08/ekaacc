# Google OAuth Configuration Guide

This guide explains how to configure and use Google OAuth with enhanced features including token storage and Google API access.

## Features Implemented

Based on [Supabase Google OAuth documentation](https://supabase.com/docs/guides/auth/social-login/auth-google#saving-google-tokens), this implementation includes:

1. ✅ **Standard Google OAuth Sign-In** - Users can sign in with their Google account
2. ✅ **Offline Access** - Request refresh tokens for long-term API access
3. ✅ **Token Storage** - Securely store access and refresh tokens in the database
4. ✅ **Automatic Token Refresh** - Automatically refresh expired tokens
5. ✅ **Google API Integration** - Ready-to-use helpers for Calendar, Drive, Gmail, etc.
6. ✅ **Row-Level Security** - Users can only access their own tokens

## Setup Instructions

### 1. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:54321/auth/v1/callback` (local Supabase)
     - `https://your-project.supabase.co/auth/v1/callback` (production)
5. Save the **Client ID** and **Client Secret**

### 2. Configure OAuth Scopes

In the [Google Auth Platform console](https://console.cloud.google.com/auth/scopes), ensure these scopes are enabled:

**Required (default):**
- `openid`
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`

**Optional (add as needed):**
- `https://www.googleapis.com/auth/calendar.readonly` - Read calendar events
- `https://www.googleapis.com/auth/drive.readonly` - Read Drive files
- `https://www.googleapis.com/auth/gmail.readonly` - Read Gmail messages

> ⚠️ **Warning:** Sensitive or restricted scopes may require Google's verification process.

### 3. Set Up Environment Variables

Create or update your `.env.local` file:

```bash
# Google OAuth Credentials
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-client-secret
GOOGLE_CLIENT_SECRET=your-client-secret

# Also needed for frontend (Next.js public env var)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 4. Configure Supabase

The `supabase/config.toml` has been updated with Google OAuth settings:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
skip_nonce_check = false
```

### 5. Run Database Migration

Apply the migration to create the provider tokens table:

```bash
# If using Supabase CLI locally
npx supabase db reset

# Or push the migration to your hosted Supabase project
npx supabase db push
```

This creates the `user_provider_tokens` table with:
- Secure storage for access and refresh tokens
- RLS policies (users can only access their own tokens)
- Automatic timestamp management
- Support for multiple OAuth providers

## Usage

### Basic Sign-In

```tsx
import { useSimpleAuth } from '@/hooks/use-simple-auth'

function LoginButton() {
  const { signInWithOAuth } = useSimpleAuth()
  
  return (
    <button onClick={() => signInWithOAuth('google')}>
      Sign in with Google
    </button>
  )
}
```

### Request Additional Scopes

To request additional Google API scopes, update the OAuth options in `src/context/auth-context.tsx`:

```typescript
if (provider === 'google') {
  options.queryParams = {
    access_type: 'offline',
    prompt: 'consent',
  }
  // Add custom scopes
  options.scopes = 'openid email profile https://www.googleapis.com/auth/calendar.readonly'
}
```

### Access Google APIs

Use the pre-built Google API helpers:

```typescript
import { 
  getGoogleProfile,
  listGoogleCalendarEvents,
  listGoogleDriveFiles,
  getGmailProfile,
} from '@/lib/google-api-helper'

// Get user's Google profile
const profile = await getGoogleProfile(userId)

// List calendar events for the next 7 days
const events = await listGoogleCalendarEvents(userId, 'primary', {
  timeMin: new Date().toISOString(),
  timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  maxResults: 10,
})

// List recent Drive files
const files = await listGoogleDriveFiles(userId, {
  pageSize: 10,
  orderBy: 'modifiedTime desc',
})

// Get Gmail profile
const gmailProfile = await getGmailProfile(userId)
```

### Manual Token Management

If you need direct access to tokens:

```typescript
import {
  getGoogleTokens,
  getValidGoogleToken,
  isTokenExpired,
} from '@/services/provider-tokens-service'

// Get current tokens
const tokens = await getGoogleTokens(userId)

// Check if token is expired
if (isTokenExpired(tokens.expiresAt)) {
  console.log('Token is expired')
}

// Get a valid token (automatically refreshes if expired)
const accessToken = await getValidGoogleToken(userId)

// Use the token for custom API calls
const response = await fetch('https://www.googleapis.com/some/api', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
})
```

## Token Flow

### Initial Authentication

1. User clicks "Sign in with Google"
2. User is redirected to Google consent screen
3. User grants permissions (including offline access)
4. Google redirects back to `/auth/callback` with authorization code
5. Code is exchanged for session + provider tokens
6. **Provider tokens are automatically saved** to `user_provider_tokens` table

### Token Refresh

Google access tokens expire after 1 hour. The refresh flow:

1. App requests `getValidGoogleToken(userId)`
2. Service checks if token is expired or expiring soon (5 min buffer)
3. If expired, service calls `/api/auth/refresh-google-token` endpoint
4. Backend exchanges refresh token for new access token (using client secret)
5. New access token is saved to database
6. New access token is returned to caller

## Security Considerations

### Row-Level Security (RLS)

The `user_provider_tokens` table has RLS policies that ensure:
- Users can only access their own tokens
- Admins can view all tokens (for support/debugging)
- All operations require authentication

### Token Storage

- Tokens are stored in the database (encrypted at rest by Supabase)
- Refresh tokens never leave the server for token refresh operations
- Google Client Secret is never exposed to the client

### Best Practices

1. **Limit Scopes**: Only request the scopes you actually need
2. **Token Expiration**: Always use `getValidGoogleToken()` instead of accessing tokens directly
3. **Error Handling**: Handle cases where user has revoked access
4. **User Consent**: Always explain what data you'll access and why

## Files Modified/Created

### Configuration
- `supabase/config.toml` - Added Google OAuth configuration

### Database
- `supabase/migrations/20251120070601_add_provider_tokens.sql` - Provider tokens table

### Services
- `src/services/provider-tokens-service.ts` - Token storage and retrieval service
- `src/lib/google-api-helper.ts` - Google API helper functions

### Auth Flow
- `src/context/auth-context.tsx` - Updated to request offline access
- `src/app/auth/callback/page.tsx` - Updated to save provider tokens

### API Routes
- `src/app/api/auth/refresh-google-token/route.ts` - Secure token refresh endpoint

## Testing

### Test Sign-In Flow

1. Start your development server
2. Click "Sign in with Google"
3. Grant permissions (you should see `access_type=offline` and `prompt=consent` in URL)
4. Check browser console for "Saved google tokens" message

### Verify Token Storage

```sql
-- Query the database to see stored tokens
SELECT 
  user_id,
  provider,
  token_expires_at,
  scopes,
  created_at
FROM user_provider_tokens;
```

### Test Token Refresh

```typescript
// Force token refresh by setting expiration to past
// Then call getValidGoogleToken - it should refresh automatically
const token = await getValidGoogleToken(userId)
console.log('Got valid token:', token)
```

## Troubleshooting

### No Refresh Token Received

**Problem:** `provider_refresh_token` is null after sign-in

**Solutions:**
1. Ensure `access_type: 'offline'` is set in OAuth options
2. Use `prompt: 'consent'` to force consent screen
3. Check that user hasn't previously granted access (Google only returns refresh token on first consent)
4. Revoke access in [Google Account Settings](https://myaccount.google.com/permissions) and try again

### Token Refresh Fails

**Problem:** `/api/auth/refresh-google-token` returns error

**Solutions:**
1. Verify `GOOGLE_CLIENT_SECRET` environment variable is set
2. Check that refresh token exists in database
3. Verify client ID matches the one used for initial sign-in
4. Check Google Cloud Console for API errors

### Scope Permission Denied

**Problem:** API calls fail with 403 Insufficient Permission

**Solutions:**
1. Verify the required scope is requested during sign-in
2. Check that scope is enabled in Google Cloud Console
3. User may need to re-authenticate to grant new scopes
4. Some scopes require app verification by Google

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google API Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Google Calendar API](https://developers.google.com/calendar/api)
- [Google Drive API](https://developers.google.com/drive/api)
- [Gmail API](https://developers.google.com/gmail/api)
