# Vercel Deployment Guide

> **Note:** We have split the application into two microfrontends. Please refer to [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for the latest deployment strategy involving two separate Vercel projects.

## Legacy / Single Project Deployment

If you are deploying only the main web application, follow the instructions below.

## Prerequisites
- Vercel account with project connected to GitHub repository
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

### Required Variables
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

## Step 3: Supabase Auth Configuration

### Authentication Settings

1. **Site URL**: Set to your production domain (e.g., `https://your-domain.vercel.app`)
2. **Redirect URLs**:
   ```
   https://your-domain.vercel.app/auth/callback
   https://your-domain.vercel.app/
   ```

### Email Templates

1. Customize email templates in Supabase Dashboard > Authentication > Email Templates
2. Ensure "Confirm Email" and "Reset Password" links point to your production domain

## Step 4: Deployment Checklist

### Pre-Deployment
- [ ] All environment variables added to Vercel project settings
- [ ] Supabase Site URL and Redirect URLs updated with production domain
- [ ] Supabase RLS policies configured
- [ ] Stripe webhook endpoint configured (if using)
- [ ] Resend domain verified (if using custom domain)

### Build Verification
- [ ] Local build successful: `npm run build`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Tests passing: `npm run test`

### Post-Deployment
- [ ] Visit production URL
- [ ] Complete authentication flow (Sign Up / Sign In)
- [ ] Verify session persistence after refresh
- [ ] Check API routes: `/api/health`
- [ ] Test logout flow
- [ ] Verify protection on protected routes
- [ ] Check public routes accessible without auth

## Step 5: Troubleshooting

### Common Issues

**"AuthApiError: invalid_grant"**
- Check if the user's email is confirmed
- Verify Supabase project URL and Anon Key are correct

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
- Use Vercel's encrypted environment variables

### Headers
- CSP headers configured in middleware
- HSTS enabled for HTTPS enforcement
- X-Frame-Options set to DENY
- Referrer-Policy configured



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

✅ Production URL loads
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
- [Turborepo Deployment](https://turbo.build/repo/docs/handbook/deploying-with-vercel)
