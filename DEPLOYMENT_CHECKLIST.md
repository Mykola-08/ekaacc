# Deployment Checklist ✅

Use this checklist before deploying to production.

## Pre-Deployment Verification

### Environment Variables

- [x] Auth0 configured (6 variables)
  - [x] AUTH0_SECRET
  - [x] AUTH0_BASE_URL
  - [x] AUTH0_ISSUER_BASE_URL
  - [x] AUTH0_CLIENT_ID
  - [x] AUTH0_CLIENT_SECRET
  - [x] NEXT_PUBLIC_AUTH0_DOMAIN

- [x] Supabase configured (3 variables)
  - [x] NEXT_PUBLIC_SUPABASE_URL
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [x] SUPABASE_SERVICE_ROLE_KEY

- [x] Stripe configured (13 variables)
  - [x] STRIPE_SECRET_KEY
  - [x] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [x] STRIPE_WEBHOOK_SECRET
  - [x] STRIPE_PRICE_* (10 price IDs)

- [x] Email configured (1 variable)
  - [x] RESEND_API_KEY

- [x] Application settings (2 variables)
  - [x] NODE_ENV
  - [x] NEXT_PUBLIC_APP_URL

### GitHub Configuration

- [x] Repository connected to Vercel
- [x] Auto-deploy enabled for main branch
- [x] GitHub Actions workflows configured
- [x] Branch protection rules documented
- [x] Issue and PR templates created
- [x] Dependabot configured

### Vercel Settings

- [x] Production domain configured (app.ekabalance.com)
- [x] Preview deployments enabled
- [x] Environment variables scoped correctly
- [x] Build settings configured
- [x] Security headers configured
- [x] Caching rules optimized

### Auth0 Setup

- [ ] Callback URLs include all Vercel domains
  - [ ] https://app.ekabalance.com/api/auth/callback
  - [ ] https://ekaacc-1.vercel.app/api/auth/callback
  - [ ] http://localhost:3000/api/auth/callback (dev)

- [ ] Logout URLs configured
  - [ ] https://app.ekabalance.com
  - [ ] https://ekaacc-1.vercel.app
  - [ ] http://localhost:3000 (dev)

- [ ] Application URIs configured
  - [ ] https://app.ekabalance.com
  - [ ] https://ekaacc-1.vercel.app

### Supabase Setup

- [x] Database migrations applied
- [x] RLS policies configured
- [x] Auth0 integration configured
- [ ] Connection pooling enabled
- [ ] Backup schedule configured

### Stripe Setup

- [ ] Webhook endpoint configured
  - URL: https://app.ekabalance.com/api/webhooks/stripe
  - Events: All relevant events
  - Secret matches STRIPE_WEBHOOK_SECRET

- [x] Test mode disabled for production
- [x] Price IDs configured
- [ ] Payment methods enabled

---

## Deployment Steps

### 1. Pull Latest Environment Variables

```powershell
cd C:\ekaacc\ekaacc-1
vercel env pull .env.local
```

**Expected:** `.env.local` file created with all 45 environment variables

### 2. Run Local Tests

```powershell
# Install dependencies
npm install

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run unit tests
npm test

# Run E2E tests (optional)
npm run test:e2e
```

**Expected:** All tests pass

### 3. Build Locally (Optional)

```powershell
npm run build
```

**Expected:** Build succeeds with no errors

### 4. Deploy to Production

```powershell
vercel --prod
```

**Expected Output:**
```
🔍  Inspect: https://vercel.com/...
✅  Production: https://app.ekabalance.com [copied to clipboard]
```

### 5. Verify Deployment

Visit https://app.ekabalance.com and check:

- [ ] Site loads successfully
- [ ] Auth0 login works
- [ ] User can log in and out
- [ ] Protected routes require authentication
- [ ] Database connection works
- [ ] Stripe integration works (if applicable)
- [ ] Email sending works (if applicable)

### 6. Monitor Deployment

```powershell
# Check deployment status
vercel ls

# View logs
vercel logs https://app.ekabalance.com

# Check for errors
vercel logs https://app.ekabalance.com --follow
```

### 7. Post-Deployment Checks

- [ ] Check Vercel Analytics
- [ ] Verify no error logs
- [ ] Test critical user flows
- [ ] Check database connections
- [ ] Verify API responses

---

## Quick Deploy (After Initial Setup)

Once everything is configured, future deployments are simple:

```powershell
# 1. Commit and push to GitHub
git add .
git commit -m "Your commit message"
git push origin main

# 2. Vercel auto-deploys via GitHub integration
# Check status at: https://vercel.com/mykola-08s-projects/ekaacc-1

# OR manual deploy:
vercel --prod
```

---

## Rollback Procedure

If deployment fails:

```powershell
# 1. Find previous working deployment
vercel ls

# 2. Promote previous deployment to production
vercel promote <previous-deployment-url>

# 3. Or rollback via Vercel dashboard
# https://vercel.com/mykola-08s-projects/ekaacc-1/deployments
```

---

## Continuous Deployment Workflow

Your GitHub Actions are configured to:

1. ✅ Run CI on every push/PR
   - Lint check
   - Type check
   - Unit tests
   - Build verification

2. ✅ Run security scans daily
   - Gitleaks (secrets)
   - TruffleHog (credentials)
   - CodeQL (vulnerabilities)
   - npm audit (dependencies)

3. ✅ Deploy to Vercel automatically
   - Preview for all PRs
   - Production for main branch merges

4. ✅ Run E2E tests on deployments
   - Playwright tests
   - API tests
   - Auth flow tests

---

## Troubleshooting

### Deployment Fails

**Check:**
1. Build logs: `vercel logs <deployment-url>`
2. Environment variables: `vercel env ls`
3. Build configuration: Review `next.config.ts`

**Common Issues:**
- Missing environment variables → Add via `vercel env add`
- Build errors → Check `vercel logs` for details
- Timeout errors → Increase function timeout in Vercel settings

### Auth0 Not Working

**Check:**
1. Callback URLs in Auth0 dashboard
2. Environment variables are correct
3. Auth0_SECRET is properly generated
4. Check browser console for errors

**Fix:**
```powershell
# Re-verify Auth0 variables
vercel env ls | Select-String "AUTH0"

# Re-deploy
vercel --prod --force
```

### Supabase Connection Issues

**Check:**
1. Service role key is correct
2. RLS policies allow connections
3. Database is not paused

**Fix:**
```powershell
# Verify Supabase variables
vercel env ls | Select-String "SUPABASE"

# Test connection locally
npm run dev
```

---

## Automation Scripts

All scripts are in the `scripts/` directory:

- `add-auth0-vars.ps1` - Add Auth0 environment variables to Vercel
- `verify-vercel-env.ps1` - Verify all required variables exist
- `setup-github-labels.ps1` - Create GitHub labels
- `verify-setup.ps1` - Verify complete setup

---

## Monitoring

### Vercel Analytics
- **URL:** https://vercel.com/mykola-08s-projects/ekaacc-1/analytics
- **Metrics:** Page views, unique visitors, top pages

### Vercel Logs
```powershell
# Real-time logs
vercel logs https://app.ekabalance.com --follow

# Specific deployment logs
vercel logs <deployment-url>
```

### GitHub Actions
- **URL:** https://github.com/Mykola-08/ekaacc/actions
- **Workflows:** CI, Security, Deploy, E2E

---

## Next Steps

After successful deployment:

1. **Configure DNS** (if not done)
   - Point app.ekabalance.com to Vercel

2. **Enable Monitoring**
   - Set up Vercel Analytics
   - Configure error tracking (Sentry, etc.)
   - Set up uptime monitoring

3. **Optimize Performance**
   - Review Web Vitals
   - Optimize images
   - Enable CDN caching

4. **Security Hardening**
   - Review OWASP Top 10
   - Set up security headers
   - Enable rate limiting

5. **Documentation**
   - Update API documentation
   - Document deployment process
   - Create runbooks for common issues

---

**✅ You're Ready to Deploy!**

All prerequisites are met. Run `vercel --prod` to deploy to production.

---

*Checklist Version: 1.0*
*Last Updated: November 21, 2025*
