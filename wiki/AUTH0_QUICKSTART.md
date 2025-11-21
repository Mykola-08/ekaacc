# Auth0 + Supabase Quick Start Guide

## ✅ What's Been Configured

### Auth0 Setup
- ✅ **Application Created**: EKAACC Next.js App (SPA)
  - Client ID: `C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n`
  - Domain: `ekabalance.eu.auth0.com`
  
- ✅ **Action Deployed**: "Sync User to Supabase"
  - Automatically syncs users to Supabase on login
  - Adds custom JWT claims for Supabase integration

### Files Created/Updated
- ✅ `src/lib/auth0-provider.tsx` - Auth0 React provider
- ✅ `src/hooks/useAuth0Supabase.ts` - Combined Auth0 + Supabase hook
- ✅ `src/app/api/auth/callback/route.ts` - Auth0 callback handler
- ✅ `src/app/api/auth/logout/route.ts` - Logout handler
- ✅ `supabase/migrations/20251121_auth0_integration.sql` - Database setup
- ✅ `.env` and `.env.local` - Environment variables configured
- ✅ `supabase/config.toml` - Auth0 third-party provider enabled

## 🚀 Next Steps

### 1. Apply Database Migration

Run the Supabase migration to create the users table:

```bash
# Option A: Using Supabase CLI (recommended)
supabase db push

# Option B: Manual via Supabase Dashboard
# 1. Go to https://supabase.com/dashboard
# 2. Select your project
# 3. Navigate to SQL Editor
# 4. Run the SQL from: supabase/migrations/20251121_auth0_integration.sql
```

### 2. Configure Supabase JWT Settings

**IMPORTANT**: You must configure Supabase to accept Auth0 JWT tokens.

#### Via Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project: `rbnfyxhewsivofvwdpuk`
3. Navigate to **Settings** → **Authentication** → **JWT Settings**
4. Add the following configuration:

**JWKS URL**:
```
https://ekabalance.eu.auth0.com/.well-known/jwks.json
```

**Issuer**:
```
https://ekabalance.eu.auth0.com/
```

**Audience**:
```
https://rbnfyxhewsivofvwdpuk.supabase.co
```

See `wiki/SUPABASE_JWT_CONFIGURATION.md` for detailed instructions.

### 3. Update Your Root Layout

Wrap your app with the Auth0 provider in `src/app/layout.tsx`:

```tsx
import { Auth0Provider } from '@/lib/auth0-provider'

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  )
}
```

### 4. Use Auth in Components

```tsx
'use client'

import { useAuth0Supabase } from '@/hooks/useAuth0Supabase'

export function MyComponent() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    loginWithRedirect, 
    logout,
    supabase 
  } = useAuth0Supabase()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Log In</button>
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  )
}
```

### 5. Configure Auth0 Login Flow

In your Auth0 Dashboard:
1. Go to **Actions** → **Flows** → **Login**
2. Drag and drop "Sync User to Supabase" action into the flow
3. Click **Apply**

### 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your app and click login
3. Complete Auth0 login flow
4. Check that user is synced to Supabase:
   ```sql
   SELECT * FROM users WHERE auth_provider = 'auth0';
   ```

## 📋 Environment Variables Reference

Your `.env` and `.env.local` have been configured with:

```bash
# Auth0
NEXT_PUBLIC_AUTH0_DOMAIN=ekabalance.eu.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=C4ATaeg2x3LELazJY4rMmxlbsQtIpt3n
AUTH0_CLIENT_SECRET=z6ozyNNaE-x2FdeSZpTZYlaftphg0u9Y4hZzKM-XK_SUrccUyBuYw5NNi5DH-uhV
AUTH0_AUDIENCE=https://rbnfyxhewsivofvwdpuk.supabase.co
AUTH0_SCOPE=openid profile email

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rbnfyxhewsivofvwdpuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
SUPABASE_SERVICE_ROLE_KEY=[configured]
```

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Rotate secrets regularly
- [ ] Use HTTPS in production
- [ ] Enable MFA in Auth0 for admin accounts
- [ ] Review RLS policies in Supabase
- [ ] Monitor Auth0 logs for suspicious activity

## 📚 Documentation

- `wiki/AUTH0_SUPABASE_INTEGRATION.md` - Full integration guide
- `wiki/SUPABASE_JWT_CONFIGURATION.md` - JWT configuration details

## 🆘 Troubleshooting

### "Invalid JWT" Error
- Verify JWKS URL is correct in Supabase settings
- Check that Auth0 Action is deployed

### User Not Syncing to Supabase
- Check Auth0 Action logs
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Ensure `users` table exists

### Login Redirect Not Working
- Verify callback URLs in Auth0 match your app URLs
- Check that Auth0Provider is wrapping your app

## 🎯 What This Gives You

✅ **Secure Authentication**: Industry-standard OAuth 2.0 + OIDC  
✅ **User Management**: Centralized in Auth0 dashboard  
✅ **Database Integration**: Users automatically synced to Supabase  
✅ **JWT Tokens**: Secure, signed tokens for API access  
✅ **Social Logins**: Easy to add Google, GitHub, etc.  
✅ **MFA Support**: Two-factor authentication ready  
✅ **Session Management**: Automatic token refresh  
✅ **Row Level Security**: User-scoped data access in Supabase  

## 🔄 Migration from Supabase Auth

If you were using Supabase Auth before:

1. Existing users will need to sign up again via Auth0
2. You can migrate users using Auth0 bulk import
3. Update RLS policies to use `auth.jwt_user_id()`
4. Remove Supabase auth code after migration

## 📞 Support

- Auth0 Documentation: https://auth0.com/docs
- Supabase Documentation: https://supabase.com/docs
- Auth0 Community: https://community.auth0.com
