# Google OAuth Implementation Checklist

Use this checklist to deploy the Google OAuth implementation to your project.

## ✅ Pre-Deployment Checklist

### 1. Google Cloud Console Setup
- [ ] Create/select Google Cloud project
- [ ] Enable required APIs (Calendar, Drive, Gmail, etc.)
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorized JavaScript origins
  - [ ] `http://localhost:3000` (development)
  - [ ] `https://yourdomain.com` (production)
- [ ] Add authorized redirect URIs
  - [ ] `http://localhost:54321/auth/v1/callback` (local)
  - [ ] `https://your-project.supabase.co/auth/v1/callback` (production)
- [ ] Configure OAuth consent screen
- [ ] Set up required scopes in Google Auth Platform
  - [ ] `openid`
  - [ ] `.../auth/userinfo.email`
  - [ ] `.../auth/userinfo.profile`
- [ ] (Optional) Add additional scopes as needed
- [ ] Save Client ID and Client Secret

### 2. Environment Configuration
- [ ] Add environment variables to `.env.local`:
  ```bash
  SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=...
  SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=...
  GOOGLE_CLIENT_SECRET=...
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
  ```
- [ ] Add same variables to production environment (Vercel/etc)
- [ ] Verify environment variables are loaded

### 3. Database Setup
- [ ] Review migration: `supabase/migrations/20251120070601_add_provider_tokens.sql`
- [ ] Run migration locally: `npx supabase db reset`
- [ ] Push migration to production: `npx supabase db push`
- [ ] Verify table created: `user_provider_tokens`
- [ ] Verify RLS policies are active
- [ ] Test database access

### 4. Code Review
- [ ] Review `supabase/config.toml` - Google OAuth enabled
- [ ] Review `src/context/auth-context.tsx` - OAuth with offline access
- [ ] Review `src/app/auth/callback/page.tsx` - Token saving logic
- [ ] Review `src/services/provider-tokens-service.ts` - Token management
- [ ] Review `src/lib/google-api-helper.ts` - API helpers
- [ ] Review `src/app/api/auth/refresh-google-token/route.ts` - Token refresh

## ✅ Testing Checklist

### Sign-In Flow
- [ ] Navigate to login page
- [ ] Click "Sign in with Google"
- [ ] Redirected to Google consent screen
- [ ] URL contains `access_type=offline`
- [ ] URL contains `prompt=consent`
- [ ] Grant permissions
- [ ] Redirected back to app
- [ ] Console shows "Saved google tokens for user..."
- [ ] Successfully signed in

### Token Storage
- [ ] Query database: `SELECT * FROM user_provider_tokens`
- [ ] Verify entry exists for user
- [ ] Verify `provider_token` is not null
- [ ] Verify `provider_refresh_token` is not null
- [ ] Verify `token_expires_at` is set
- [ ] Verify timestamps are correct

### Token Refresh
- [ ] Wait for token expiration (or manually set past expiration)
- [ ] Call `getValidGoogleToken(userId)`
- [ ] Verify token is refreshed automatically
- [ ] Check database shows updated `provider_token`
- [ ] Verify new `token_expires_at`
- [ ] No errors in console

### API Calls
- [ ] Test `getGoogleProfile(userId)`
- [ ] Test `listGoogleCalendarEvents(userId)`
- [ ] Test `listGoogleDriveFiles(userId)`
- [ ] Test `getGmailProfile(userId)`
- [ ] All API calls succeed
- [ ] Correct data returned
- [ ] No authentication errors

### UI Components
- [ ] Navigate to OAuth Connections page
- [ ] See Google listed as connected
- [ ] View token expiration time
- [ ] View granted scopes (if any)
- [ ] Test disconnect functionality
- [ ] Verify token removed from database

## ✅ Production Deployment Checklist

### Before Deploy
- [ ] All tests passing locally
- [ ] Environment variables set in production
- [ ] Migration applied to production database
- [ ] OAuth redirect URIs updated in Google Console
- [ ] Site URL updated in Supabase dashboard

### Deploy
- [ ] Deploy to production (Vercel, etc.)
- [ ] Verify deployment successful
- [ ] Check environment variables loaded
- [ ] Test production sign-in flow

### Post-Deploy
- [ ] Test sign-in with Google on production
- [ ] Verify tokens saved to production database
- [ ] Test token refresh on production
- [ ] Test API calls on production
- [ ] Monitor error logs for 24 hours
- [ ] Check for any security issues

## ✅ Security Checklist

- [ ] Google Client Secret never exposed to client
- [ ] RLS policies tested and working
- [ ] Users can only access their own tokens
- [ ] Token refresh endpoint secured
- [ ] HTTPS enabled on production
- [ ] OAuth redirect URIs using HTTPS
- [ ] No tokens logged in production
- [ ] Audit logs enabled
- [ ] Rate limiting configured

## ✅ Optional Enhancements

### Scopes
- [ ] Add Calendar scope for event access
- [ ] Add Drive scope for file access
- [ ] Add Gmail scope for email access
- [ ] Add YouTube scope for video access
- [ ] Update auth context with custom scopes
- [ ] Test additional scopes

### UI/UX
- [ ] Add Google One Tap sign-in
- [ ] Add personalized Google button
- [ ] Show OAuth status in user profile
- [ ] Add scope management UI
- [ ] Add token expiration warnings
- [ ] Improve error messages

### Features
- [ ] Implement Google Calendar integration
- [ ] Implement Google Drive integration
- [ ] Implement Gmail integration
- [ ] Add webhook for token revocation
- [ ] Add analytics for OAuth usage
- [ ] Add admin dashboard for tokens

## ✅ Documentation Checklist

- [ ] Read `GOOGLE_OAUTH_SETUP.md`
- [ ] Review `GOOGLE_OAUTH_IMPLEMENTATION_SUMMARY.md`
- [ ] Study `GOOGLE_OAUTH_QUICK_REFERENCE.md`
- [ ] Review code examples in `src/examples/google-oauth-examples.tsx`
- [ ] Document any custom implementations
- [ ] Update team documentation
- [ ] Create runbook for common issues

## 📝 Notes

Use this space to track issues, observations, or custom changes:

```
Date: ___________
Issue/Note: 




Resolution: 




```

---

## ✨ Success Criteria

Your implementation is successful when:

✅ Users can sign in with Google
✅ Refresh tokens are saved and auto-refreshed
✅ Google API calls work correctly
✅ OAuth Connections UI shows status
✅ All security policies working
✅ Production deployment stable
✅ Documentation complete

---

**Last Updated:** November 20, 2025
**Implementation Version:** 1.0.0
