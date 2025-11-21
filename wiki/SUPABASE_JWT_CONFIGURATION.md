# Supabase JWT Configuration for Auth0

## Overview
This document contains the JWT configuration needed in your Supabase project to accept Auth0 tokens.

## Steps to Configure

### 1. Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `rbnfyxhewsivofvwdpuk`
3. Navigate to **Settings** → **API**

### 2. JWT Settings

Supabase needs to be configured to verify JWT tokens from Auth0.

#### Option A: Using Supabase CLI (Recommended)

Add this to your `supabase/config.toml`:

```toml
[auth]
# Enable Auth0 as external auth provider
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://ekaacc.vercel.app"]

# JWT Settings for Auth0
[auth.jwt]
# Auth0 issuer
aud = "https://rbnfyxhewsivofvwdpuk.supabase.co"
# Auth0 JWKS endpoint for public key verification
jwks_url = "https://ekabalance.eu.auth0.com/.well-known/jwks.json"
# Expected issuer in JWT
iss = "https://ekabalance.eu.auth0.com/"

# Custom claims mapping
[auth.jwt.claims]
# Map Auth0 user_id to Supabase user id
user_id = "https://supabase.io/jwt/claims/user_id"
email = "https://supabase.io/jwt/claims/email"
role = "https://supabase.io/jwt/claims/role"
```

#### Option B: Manual Configuration in Dashboard

If you prefer to configure manually:

1. Go to **Authentication** → **Settings** in Supabase Dashboard
2. Scroll to **JWT Settings**
3. Click **Add Provider**
4. Configure the following:

**Provider Name**: Auth0

**JWKS URL**: 
```
https://ekabalance.eu.auth0.com/.well-known/jwks.json
```

**Expected Issuer**:
```
https://ekabalance.eu.auth0.com/
```

**Expected Audience**:
```
https://rbnfyxhewsivofvwdpuk.supabase.co
```

**Custom Claims Path**:
```
https://supabase.io/jwt/claims
```

### 3. Database Configuration

Run this SQL in your Supabase SQL Editor to configure custom JWT claim extraction:

```sql
-- Create a function to extract Auth0 user ID from JWT
CREATE OR REPLACE FUNCTION auth.jwt_user_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->'https://supabase.io/jwt/claims'->>'user_id',
    current_setting('request.jwt.claims', true)::json->>'sub'
  );
$$ LANGUAGE SQL STABLE;

-- Create a function to extract email from JWT
CREATE OR REPLACE FUNCTION auth.jwt_email()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->'https://supabase.io/jwt/claims'->>'email',
    current_setting('request.jwt.claims', true)::json->>'email'
  );
$$ LANGUAGE SQL STABLE;

-- Create a function to extract role from JWT
CREATE OR REPLACE FUNCTION auth.jwt_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->'https://supabase.io/jwt/claims'->>'role',
    'user'
  );
$$ LANGUAGE SQL STABLE;
```

### 4. Update Row Level Security Policies

Update your RLS policies to use Auth0 user IDs:

```sql
-- Example: Update user table RLS policy
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (
    id = auth.jwt_user_id()
  );

DROP POLICY IF EXISTS "Users can update own data" ON public.users;

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (
    id = auth.jwt_user_id()
  );
```

### 5. Test JWT Verification

Use this SQL to test if JWT claims are being read correctly:

```sql
-- Test function to view current JWT claims
CREATE OR REPLACE FUNCTION auth.debug_jwt_claims()
RETURNS JSON AS $$
  SELECT current_setting('request.jwt.claims', true)::json;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Call this function to see JWT claims
SELECT auth.debug_jwt_claims();
```

## Verification Checklist

- [ ] JWKS URL is configured: `https://ekabalance.eu.auth0.com/.well-known/jwks.json`
- [ ] Expected issuer is set: `https://ekabalance.eu.auth0.com/`
- [ ] Expected audience matches Supabase URL
- [ ] Custom claims namespace is configured: `https://supabase.io/jwt/claims`
- [ ] Database migration has been run
- [ ] RLS policies updated to use Auth0 user IDs
- [ ] JWT extraction functions created

## Common Issues

### Issue: "Invalid JWT" Error
**Solution**: Verify that the JWKS URL is correct and accessible. Auth0's JWKS endpoint should return a valid JSON with signing keys.

### Issue: User ID Not Found in Claims
**Solution**: Check that the Auth0 Action "Sync User to Supabase" is deployed and adding custom claims correctly.

### Issue: RLS Policies Not Working
**Solution**: Ensure the policy uses `auth.jwt_user_id()` function instead of hardcoded claim paths.

## Security Notes

1. **Always verify tokens server-side**: Don't trust client-side validation alone
2. **Use HTTPS only**: Never send tokens over unencrypted connections
3. **Rotate signing keys**: Auth0 automatically rotates keys; Supabase JWKS fetching handles this
4. **Monitor token expiration**: Auth0 tokens expire after 10 hours by default
5. **Custom claims namespace**: Using `https://supabase.io/jwt/claims` prevents claim collisions

## Additional Resources

- [Auth0 JWT Structure](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
- [Supabase JWT Authentication](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [JWKS Specification](https://datatracker.ietf.org/doc/html/rfc7517)
