# Auth0 + Supabase Integration Guide

## Overview

This application uses Auth0 as the authentication provider with Supabase as the database backend. Auth0 handles user authentication and authorization, while Supabase stores user data and handles database operations.

## Architecture

```
User → Auth0 (Login) → JWT Token → Supabase (Database Access)
                ↓
         Auth0 Action → Sync User Data → Supabase Users Table
```

## Configuration Complete

### 1. Auth0 Application Created
- **Application Name**: EKA Balance Web App
- **Type**: Regular Web Application
- **Client ID**: BxIHsLzhzXlyM6RNbavObTrYIhTgGTq2
- **Domain**: dev-adijdczrcqg13gp8.eu.auth0.com

### 2. Callback URLs Configured
- Development: `http://localhost:3000/api/auth/callback`
- Production: `https://app.ekabalance.com/api/auth/callback`

### 3. Auth0 Action Deployed
- **Name**: Sync User to Supabase
- **ID**: 6c80106b-7cd1-4f4f-95e9-41b5d8e370a9
- **Trigger**: Post-Login
- **Purpose**: Automatically syncs user data to Supabase after successful login

## Environment Variables

The following environment variables have been configured:

```bash
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=dev-adijdczrcqg13gp8.eu.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=BxIHsLzhzXlyM6RNbavObTrYIhTgGTq2
AUTH0_CLIENT_SECRET=[Redacted]
AUTH0_AUDIENCE=https://api.ekabalance.com
AUTH0_SCOPE=openid profile email

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rbnfyxhewsivofvwdpuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
SUPABASE_SERVICE_ROLE_KEY=[your-key]
```

## Supabase JWT Configuration

You need to configure Supabase to accept Auth0 JWT tokens. Follow these steps:

### 1. Get Auth0 JWKS URI
Your JWKS URI is: `https://dev-adijdczrcqg13gp8.eu.auth0.com/.well-known/jwks.json`

### 2. Update Supabase JWT Settings

Go to your Supabase Dashboard:
1. Navigate to **Authentication** → **Settings**
2. Scroll to **JWT Settings**
3. Update the following:

**JWT Secret** (HMAC):
- Keep your existing Supabase JWT secret for backward compatibility

**Additional Providers**:
Add Auth0 as an additional JWT provider:

```json
{
  "jwt_aud": "https://rbnfyxhewsivofvwdpuk.supabase.co",
  "jwt_secret": "Use RS256 verification with JWKS",
  "jwt_exp": 36000,
  "jwks_uri": "https://dev-adijdczrcqg13gp8.eu.auth0.com/.well-known/jwks.json"
}
```

### 3. Configure Auth0 Custom Claims

The Auth0 Action automatically adds these custom claims to the JWT:

```json
{
  "https://supabase.io/jwt/claims": {
    "user_id": "auth0|123456",
    "email": "user@example.com",
    "email_verified": true,
    "role": "user"
  }
}
```

## Installation

Install the required Auth0 dependencies:

```bash
npm install @auth0/auth0-react @auth0/auth0-spa-js
```

## Usage

### 1. Wrap Your App with Auth0Provider

Update your root layout (`src/app/layout.tsx`):

```tsx
import { Auth0Provider } from '@/lib/auth0-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

### 2. Use the Combined Hook

In your components:

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

  // Use supabase client with Auth0 token
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.sub)
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    </div>
  )
}
```

## Database Migration

Run the migration to create the users table and configure RLS:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually in Supabase SQL Editor
# Run the migration file: supabase/migrations/20251121_auth0_integration.sql
```

## Testing the Integration

1. **Test Login**:
   ```tsx
   loginWithRedirect()
   ```

2. **Verify Token**:
   ```tsx
   const claims = await getIdTokenClaims()
   console.log(claims)
   ```

3. **Test Supabase Access**:
   ```tsx
   const { data } = await supabase.from('users').select('*')
   ```

## Auth0 Dashboard Configuration

### Required Settings in Auth0:

1. **Application Settings** → **Allowed Callback URLs**:
   ```
   http://localhost:3000/api/auth/callback,
   http://localhost:3000,
   https://ekaacc.vercel.app/api/auth/callback,
   https://ekaacc.vercel.app
   ```

2. **Application Settings** → **Allowed Logout URLs**:
   ```
   http://localhost:3000,
   https://ekaacc.vercel.app
   ```

3. **Application Settings** → **Allowed Web Origins**:
   ```
   http://localhost:3000,
   https://ekaacc.vercel.app
   ```

4. **Actions** → **Flows** → **Login**:
   - Ensure "Sync User to Supabase" action is added to the flow
   - Action should be deployed (status: built)

## Troubleshooting

### Token Not Working
- Verify JWKS URI is correct in Supabase settings
- Check custom claims are being added in Auth0 Action
- Ensure audience matches your Supabase URL

### User Not Syncing
- Check Auth0 Action logs
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Ensure users table exists in Supabase

### RLS Policies Not Working
- Verify JWT claims structure matches policy conditions
- Check that `request.jwt.claims` is properly set
- Test with service role key to bypass RLS temporarily

## Security Considerations

1. **Never expose** `AUTH0_CLIENT_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` on the client
2. **Always use HTTPS** in production
3. **Validate tokens** on the server side for sensitive operations
4. **Use RLS policies** to protect data in Supabase
5. **Rotate secrets** regularly

## Next Steps

1. Configure additional Auth0 features (MFA, social logins)
2. Add more RLS policies for your specific tables
3. Implement role-based access control (RBAC)
4. Set up Auth0 Rules for additional custom logic
5. Configure Auth0 email templates
