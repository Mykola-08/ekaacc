# Vercel Configuration Guide

## Overview
This document explains the Vercel configuration and integration with GitHub for automated deployments.

## Configuration Files

### vercel.json
The main configuration file with the following settings:

#### Build Settings
- **buildCommand**: `npm run build` - Production build
- **devCommand**: `npm run dev` - Local development
- **installCommand**: `npm ci` - Clean install for reproducible builds
- **framework**: `nextjs` - Framework detection

#### Security Headers
Applied to all routes for enhanced security:
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy
- `Permissions-Policy` - Disable unnecessary browser features

#### Caching Strategy
- **API Routes**: No caching (`no-store, must-revalidate`)
- **Static Assets**: Long-term caching (1 year, immutable)
- **HTML Pages**: Default Next.js caching

#### Cron Jobs
- **Cleanup**: Daily at 2 AM UTC (`/api/cron/cleanup`)
- **Health Check**: Every 15 minutes (`/api/cron/health-check`)

#### Regions
- Primary: `iad1` (Washington, D.C., USA)
- Adjust based on your user base location

#### Function Timeouts
- Standard API: 10 seconds
- Long-running: 60 seconds (for specific endpoints)

## GitHub Integration

### Automatic Deployments

#### Production Deployments
- **Trigger**: Push to `main` branch
- **URL**: Your production domain
- **Auto-alias**: Enabled (production domain always points to latest)

#### Preview Deployments
- **Trigger**: Pull requests to `main`
- **URL**: Unique preview URL per PR
- **Auto-generated**: For every commit in PR
- **Lifecycle**: Deleted when PR is closed/merged

### Deployment Workflow

```
┌─────────────────┐
│  Git Push/PR    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Detects │
│     Change      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Build Starts  │
│  (npm ci + build)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Checks  │
│   Run (CI/CD)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Deploy to    │
│  Vercel Edge    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Comment on PR  │
│ w/ Preview URL  │
└─────────────────┘
```

## Environment Variables

### Required Secrets in Vercel Dashboard
Set these in: `Vercel Dashboard → Project → Settings → Environment Variables`

#### Production
- `AUTH0_SECRET` - Auth0 session secret
- `AUTH0_BASE_URL` - Production URL
- `AUTH0_ISSUER_BASE_URL` - Auth0 tenant URL
- `AUTH0_CLIENT_ID` - Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Auth0 application secret
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `RESEND_API_KEY` - Resend email API key

#### Preview (Optional Overrides)
- Consider using test/development credentials for preview deployments
- Set environment-specific variables with "Preview" scope

#### Development
- Use local `.env.local` file (never commit!)
- Copy from `.env.example` if available

## Vercel CLI Commands

### Installation
```bash
npm i -g vercel
```

### Common Commands
```bash
# Login to Vercel
vercel login

# Link local project to Vercel
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# List deployments
vercel ls

# View environment variables
vercel env ls

# Add environment variable
vercel env add [NAME]

# Pull environment variables to .env.local
vercel env pull
```

## Deployment Protection

### Branch Protection in GitHub
Set up branch protection (see `.github/BRANCH_PROTECTION.md`):
- Require PR reviews before merging
- Require status checks to pass
- Include Vercel deployment status

### Vercel Settings
In Vercel Dashboard → Project Settings:
- **Ignored Build Step**: Leave empty (build on every push)
- **Auto-assign Domain**: Enabled for main branch
- **Deployment Protection**: Consider enabling for production
- **Password Protection**: Optional for preview deployments

## Monitoring

### Build Logs
- View in Vercel Dashboard
- Available via CLI: `vercel logs`

### Analytics
- Enable Vercel Analytics for performance insights
- Track Core Web Vitals
- Monitor edge function performance

### Alerts
Set up alerts for:
- Build failures
- Deployment errors
- Function errors
- Performance degradation

## Rollback Procedure

### Via Dashboard
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." menu → "Promote to Production"

### Via CLI
```bash
# List recent deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

### Via GitHub
1. Revert the problematic commit
2. Push to main branch
3. New deployment will be triggered

## Performance Optimization

### Edge Functions
- Use Edge Runtime where possible
- Keep functions lightweight
- Set appropriate timeout limits

### Caching
- Static assets: Aggressive caching (1 year)
- API responses: Implement cache headers based on data volatility
- Use Vercel's Edge Cache

### Image Optimization
- Use Next.js Image component
- Automatic optimization via Vercel
- Supports WebP/AVIF formats

## Troubleshooting

### Build Failures
1. Check build logs in Vercel Dashboard
2. Verify environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors: `npm run typecheck`

### Preview Deployment Not Created
- Verify GitHub integration is active
- Check branch protection rules
- Ensure PR is targeting correct branch

### Environment Variables Not Working
- Verify variable names match exactly
- Check variable scope (Production/Preview/Development)
- Redeploy after changing variables

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Test in preview** before merging to production
3. **Monitor deployment status** - Set up Slack/Discord notifications
4. **Use semantic versioning** for release tags
5. **Review Vercel logs** regularly for errors
6. **Optimize bundle size** - Monitor build output
7. **Set appropriate cache headers** for different content types
8. **Use Vercel Speed Insights** for performance monitoring

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Deployment Protection](https://vercel.com/docs/security/deployment-protection)
