# Vercel Deployment Guide

## Overview

This guide covers deploying the EKA Account application to Vercel with Auth0 authentication.

### Development Setup Note
This project uses **port 9002** for local development (instead of Next.js default port 3000) to avoid conflicts with other services. This is configured in `apps/web/package.json` dev script: `next dev --turbopack -p 9002`.

### Authentication Flow
The application uses a hybrid authentication approach:
- **Server-side**: `@auth0/nextjs-auth0` for secure session management via edge middleware
- **Client-side**: `@auth0/auth0-react` for seamless user experience in React components
- **Login Flow**: 
  1. User visits `/login` or `/signup` 
  2. Client-side Auth0 SDK initiates Universal Login
  3. Auth0 redirects to `/api/auth/callback`
  4. Server-side SDK establishes secure session
  5. User redirected to `/dashboard` or specified `returnTo` URL

### Key Routes
- `/login` - Login page with Auth0 integration
- `/signup` - Signup page with Auth0 integration
- `/api/auth/login` - Auth0 login initiation endpoint
- `/api/auth/callback` - Auth0 callback handler (validates returnTo for security)
- `/api/auth/logout` - Logout endpoint
- `/api/auth/me` - Get current user session

## Prerequisites
- Vercel account with project connected to GitHub repository
- Auth0 tenant configured with production application
- Supabase project configured
- Stripe account (production or test mode)
- Resend account for email services

## Step 1: Vercel Project Configuration

### Root Directory Settings
- **Root Directory**: Leave blank (monorepo root)
- **Framework Preset**: Other (vercel.json overrides)
- **Build Command**: `turbo run build --filter=web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `npm install`

### Build & Development Settings
The `vercel.json` file configures these automatically:
```json
{
  "buildCommand": "turbo run build --filter=web",
  "devCommand": "turbo run dev --filter=web",
  "installCommand": "npm install",
  "outputDirectory": "apps/web/.next"
}
```

## Step 2: Environment Variables

### Required Auth0 Variables

```bash
# Auth0 Domain (NO https://)
NEXT_PUBLIC_AUTH0_DOMAIN=ekabalance.eu.auth0.com

# Auth0 Client Credentials
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# Auth0 SDK Configuration
AUTH0_SECRET=your_production_secret_min_32_chars
AUTH0_BASE_URL=https://your-production-domain.vercel.app
AUTH0_ISSUER_BASE_URL=https://ekabalance.eu.auth0.com

# Auth0 API Configuration
AUTH0_AUDIENCE=https://your-supabase-project.supabase.co
AUTH0_SCOPE=openid profile email
```

**Generate AUTH0_SECRET:**
```bash
openssl rand -base64 32
```

### Required Supabase Variables

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Public Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

### Required Stripe Variables

```bash
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Required Resend Variables

```bash
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=Your App <noreply@yourdomain.com>
RESEND_AUDIENCE_ID=your_audience_id
```

### Application Configuration

```bash
NEXT_PUBLIC_APP_URL=https://your-production-domain.vercel.app
NODE_ENV=production
```

### Optional Variables

```bash
# Square Integration (if using)
SQUARE_ACCESS_TOKEN=your_access_token
SQUARE_APP_ID=your_app_id
SQUARE_ENVIRONMENT=production

# External Auth Domain
EXTERNAL_AUTH_BASE_URL=https://auth.yourdomain.com

# Custom Public Routes (comma-separated)
PUBLIC_ROUTES=/custom-route,/another-route
```

## Step 3: Auth0 Configuration

### Application Settings

1. **Application Type**: Regular Web Application
2. **Allowed Callback URLs**:
   ```
   https://your-domain.vercel.app/api/auth/callback
   http://localhost:9002/api/auth/callback
   ```

3. **Allowed Logout URLs**:
   ```
   https://your-domain.vercel.app
   http://localhost:9002
   ```

4. **Allowed Web Origins**:
   ```
   https://your-domain.vercel.app
   http://localhost:9002
   ```

5. **Allowed Origins (CORS)**:
   ```
   https://your-domain.vercel.app
   http://localhost:9002
   ```

### Advanced Settings

- **Grant Types**: 
  - Authorization Code
  - Refresh Token
  - Implicit (if needed)

- **Token Endpoint Authentication Method**: Post

- **OIDC Conformant**: Enabled (recommended)

### API Configuration

1. Create an API in Auth0 with identifier: `https://your-supabase-project.supabase.co`
2. Enable RBAC and Add Permissions in Access Token
3. Set Token Expiration as needed

## Step 4: Deployment Checklist

### Pre-Deployment
- [ ] All environment variables added to Vercel project settings
- [ ] Auth0 callback URLs updated with production domain
- [ ] Auth0 logout URLs updated with production domain
- [ ] Supabase RLS policies configured
- [ ] Stripe webhook endpoint configured (if using)
- [ ] Resend domain verified (if using custom domain)

### Build Verification
- [ ] Local build successful: `npm run build`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Tests passing: `npm run test`
- [ ] Middleware configured correctly (proxy function exported)

### Post-Deployment
- [ ] Visit production URL - should redirect to Auth0 login
- [ ] Complete authentication flow
- [ ] Verify session persistence after refresh
- [ ] Check API routes: `/api/auth/me`, `/api/health`
- [ ] Test logout flow
- [ ] Verify middleware protection on protected routes
- [ ] Check public routes accessible without auth

## Step 5: Troubleshooting

### Common Issues

**"ERR_TOO_MANY_REDIRECTS"**
- Check middleware matcher excludes `/api/auth/*`
- Verify AUTH0_BASE_URL matches production domain
- Ensure Auth0 callback URLs are correct

**"Callback URL mismatch"**
- Add production domain to Auth0 Allowed Callback URLs
- Format: `https://your-domain.vercel.app/api/auth/callback`

**"Invalid state"**
- Generate new AUTH0_SECRET
- Clear browser cookies and retry

**"Session not found"**
- Verify AUTH0_SECRET is set in production
- Check AUTH0_ISSUER_BASE_URL is correct
- Ensure cookies are not blocked

**Build fails with "routes-manifest.json not found"**
- Verify `vercel.json` outputDirectory points to `apps/web/.next`
- Check buildCommand uses turbo filter: `turbo run build --filter=web`

## Step 6: Monitoring

### Vercel Analytics
- Enable Web Analytics in Vercel dashboard
- Monitor Core Web Vitals
- Track authentication flow completion rates

### Error Tracking
- Check Vercel Function Logs for API route errors
- Monitor middleware execution logs
- Set up error alerting for critical paths

### Performance
- Monitor Time to First Byte (TTFB)
- Track authentication redirect times
- Optimize middleware execution

## Step 7: Security Best Practices

### Environment Variables
- Never commit `.env.local` to git
- Use different secrets for production/staging
- Rotate AUTH0_SECRET periodically
- Use Vercel's encrypted environment variables

### Headers
- CSP headers configured in middleware
- HSTS enabled for HTTPS enforcement
- X-Frame-Options set to DENY
- Referrer-Policy configured

### Auth0
- Enable MFA for admin accounts
- Configure brute-force protection
- Enable suspicious IP throttling
- Regular security log reviews

## Deployment Commands

```bash
# Manual deployment
vercel --prod

# Deploy specific environment
vercel --prod --env-file=.env.production

# Check deployment logs
vercel logs <deployment-url>

# List deployments
vercel ls

# Promote deployment
vercel promote <deployment-url>
```

## Success Criteria

✅ Production URL loads and redirects to Auth0  
✅ Authentication completes and returns to app  
✅ User session persists across page refreshes  
✅ Protected routes require authentication  
✅ Public routes accessible without auth  
✅ Logout clears session and redirects correctly  
✅ No console errors in browser  
✅ No server errors in Vercel logs  
✅ API routes respond correctly  
✅ Build completes without warnings  

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Turborepo Deployment](https://turbo.build/repo/docs/handbook/deploying-with-vercel)
