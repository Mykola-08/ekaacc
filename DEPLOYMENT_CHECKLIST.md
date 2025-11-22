# Deployment Checklist for EKA Account

## Pre-Deployment Checklist

### 1. Environment Configuration ✅
- [x] Auth0 environment variables added to .env.example
- [x] Middleware properly configured
- [x] Build succeeds locally

### 2. Auth0 Configuration Requirements

#### Auth0 Tenant Setup
Before deploying to production, configure your Auth0 tenant:

1. **Create Auth0 Application**
   - Type: Regular Web Application
   - Go to: https://manage.auth0.com/dashboard
   
2. **Configure Application Settings**
   - Allowed Callback URLs: 
     ```
     http://localhost:9002/api/auth/callback
     https://your-production-domain.vercel.app/api/auth/callback
     ```
   - Allowed Logout URLs:
     ```
     http://localhost:9002
     https://your-production-domain.vercel.app
     ```
   - Allowed Web Origins:
     ```
     http://localhost:9002
     https://your-production-domain.vercel.app
     ```

3. **Enable Social Connections (Optional)**
   - Google OAuth
   - LinkedIn
   - Twitter/X
   - Configure in: Connections → Social

#### Required Environment Variables for Production

Add these to Vercel Dashboard → Settings → Environment Variables:

**Auth0 (Required):**
```bash
# Auth0 Domain (NO https://)
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com

# Auth0 Client Credentials
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# Auth0 SDK Configuration
# Generate with: openssl rand -base64 32
AUTH0_SECRET=your_production_secret_min_32_chars
AUTH0_BASE_URL=https://your-production-domain.vercel.app
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# Auth0 API Configuration
AUTH0_AUDIENCE=https://your-api-identifier
AUTH0_SCOPE=openid profile email
```

**Supabase (Required):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Application (Required):**
```bash
NEXT_PUBLIC_APP_URL=https://your-production-domain.vercel.app
NODE_ENV=production
```

**Stripe (Optional - for payments):**
```bash
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Other Services (Optional):**
```bash
# Resend (for emails)
RESEND_API_KEY=re_your_api_key

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your_openai_api_key

# Anthropic (for Claude AI)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

# Google AI (for Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

### 3. Vercel Project Configuration

#### Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: Leave blank (monorepo uses vercel.json)
- **Build Command**: `turbo run build --filter=web` (from vercel.json)
- **Output Directory**: `apps/web/.next` (from vercel.json)
- **Install Command**: `npm install`

#### Build & Development Settings
The `vercel.json` file at the repository root configures these automatically.

### 4. Database Setup (Supabase)

1. **Run Migrations**
   ```bash
   # For hosted Supabase
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

2. **Verify Row Level Security (RLS)**
   - Ensure all tables have appropriate RLS policies
   - Test that users can only access their own data

3. **Create Required Tables**
   - user_profiles
   - user_roles
   - permissions
   - journal_entries
   - goals
   - bookings
   - (See DATABASE_REQUIREMENTS.md for complete list)

### 5. Testing Before Deployment

#### Local Testing
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env.local with your credentials**
   ```bash
   cd apps/web
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

3. **Test the build**
   ```bash
   npm run build
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Test authentication flow**
   - Visit http://localhost:9002
   - Click "Sign In" or "Create Account"
   - Should redirect to Auth0 Universal Login
   - After login, should redirect back to /dashboard

#### Preview Deployment
1. Push to a feature branch
2. Vercel automatically creates a preview deployment
3. Test the authentication flow on preview
4. Verify all features work correctly

### 6. Security Checklist

- [x] HTTPS enforced (Vercel handles this automatically)
- [x] Security headers configured (in next.config.ts and proxy.ts)
- [x] Auth0 session encryption (AUTH0_SECRET)
- [x] Supabase RLS policies enabled
- [x] API routes protected with authentication
- [x] Environment variables not exposed to client (except NEXT_PUBLIC_*)
- [ ] Run CodeQL security scan
- [ ] Review and fix any security vulnerabilities

### 7. Performance Optimization

- [x] Next.js image optimization configured
- [x] Package imports optimized (in next.config.ts)
- [x] Static page generation where possible
- [x] Compression enabled
- [x] Production browser source maps disabled

### 8. Monitoring & Analytics

- [x] Vercel Analytics enabled
- [x] Speed Insights enabled
- [ ] Configure error tracking (Sentry - optional)
- [ ] Set up uptime monitoring

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Automatic (Recommended)
1. Connect repository to Vercel
2. Vercel automatically deploys on push to main
3. Monitor deployment in Vercel dashboard

#### Option B: Manual
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Update AUTH0_BASE_URL with custom domain
5. Update Auth0 callback URLs with custom domain

### Step 4: Post-Deployment Verification

1. **Test Authentication**
   - Visit your production URL
   - Test sign up flow
   - Test sign in flow
   - Test sign out
   - Verify redirect to dashboard works

2. **Test Key Features**
   - User profile loading
   - Dashboard access
   - Protected routes redirect to login
   - Public routes accessible without login

3. **Monitor Logs**
   - Check Vercel deployment logs
   - Monitor Supabase logs
   - Check Auth0 logs

4. **Performance Testing**
   - Run Lighthouse audit
   - Check Core Web Vitals in Vercel Analytics
   - Test on mobile devices

## Troubleshooting

### Authentication Issues

**Problem: Infinite redirect loop**
- Solution: Verify AUTH0_BASE_URL matches your deployment URL
- Solution: Check middleware matcher patterns
- Solution: Ensure /api/auth routes are excluded from middleware

**Problem: "Configuration missing" error**
- Solution: Verify all Auth0 environment variables are set in Vercel
- Solution: Ensure NEXT_PUBLIC_* variables are set for both client and server

**Problem: Session not persisting**
- Solution: Verify AUTH0_SECRET is set and at least 32 characters
- Solution: Check cookie settings (sameSite, secure, httpOnly)

### Build Issues

**Problem: Build fails with type errors**
- Solution: TypeScript errors are ignored in build (ignoreBuildErrors: true)
- Solution: Fix type errors for production readiness

**Problem: Environment variables not found during build**
- Solution: Set environment variables in Vercel for all environments (Production, Preview, Development)
- Solution: Verify variable names match exactly (case-sensitive)

### Database Issues

**Problem: "supabaseUrl is required" error**
- Solution: Set NEXT_PUBLIC_SUPABASE_URL in environment variables
- Solution: Verify Supabase project is running and accessible

**Problem: RLS policy errors**
- Solution: Ensure user has proper permissions
- Solution: Check RLS policies in Supabase dashboard
- Solution: Verify JWT token is being passed correctly

## Post-Deployment Tasks

1. **Monitor Performance**
   - Check Vercel Analytics daily
   - Review error rates
   - Monitor response times

2. **Security Updates**
   - Rotate AUTH0_SECRET every 90 days
   - Keep dependencies updated
   - Review security advisories

3. **Backup Strategy**
   - Supabase handles automatic backups
   - Export important data regularly
   - Test restoration process

4. **Documentation**
   - Update README with production URL
   - Document any production-specific configurations
   - Keep deployment guide current

## Success Criteria

- ✅ Application accessible at production URL
- ✅ Auth0 login flow works correctly
- ✅ Users can sign up and sign in
- ✅ Protected routes require authentication
- ✅ Dashboard loads for authenticated users
- ✅ No console errors on production
- ✅ Performance metrics within acceptable range
- ✅ Mobile responsive design works correctly

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Auth0 Documentation**: https://auth0.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs

## Notes

- Always test in preview environment before deploying to production
- Keep production and development Auth0 applications separate
- Use different database instances for production and development
- Never commit .env.local or production secrets to version control
- Monitor costs for all third-party services
