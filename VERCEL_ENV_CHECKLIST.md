# Vercel Environment Variables Checklist

This document lists all environment variables needed for your Vercel deployment.

## 🔐 Critical - Required for Production

### Auth0 (Authentication)
```bash
AUTH0_SECRET=                    # Generate with: openssl rand -base64 32
AUTH0_BASE_URL=                  # Your production URL (e.g., https://your-app.vercel.app)
AUTH0_ISSUER_BASE_URL=           # Your Auth0 tenant URL (e.g., https://your-tenant.auth0.com)
AUTH0_CLIENT_ID=                 # From Auth0 Application settings
AUTH0_CLIENT_SECRET=             # From Auth0 Application settings (keep secret!)
AUTH0_SCOPE=                     # Default: "openid profile email offline_access"
PROD_AUTH0_AUDIENCE=             # Your Auth0 API audience
PROD_AUTH0_DOMAIN=               # Your Auth0 domain without https://
```

### Supabase (Database & Storage)
```bash
NEXT_PUBLIC_SUPABASE_URL=        # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # From Supabase project settings (public key)
SUPABASE_SERVICE_ROLE_KEY=       # From Supabase project settings (secret!)
SUPABASE_JWT_SECRET=             # From Supabase project settings
```

### Stripe (Payments)
```bash
STRIPE_SECRET_KEY=               # Use sk_live_* for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Use pk_live_* for production
STRIPE_WEBHOOK_SECRET=           # From Stripe webhook configuration
```

### Resend (Email)
```bash
RESEND_API_KEY=                  # From Resend dashboard
RESEND_WEBHOOK_SECRET=           # For webhook verification (optional)
```

## ⚙️ Application Configuration

### General
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=             # Your production URL
NEXT_PUBLIC_API_URL=             # Usually ${NEXT_PUBLIC_APP_URL}/api
```

### AI Services (Optional but recommended)
```bash
OPENAI_API_KEY=                  # For GPT models
ANTHROPIC_API_KEY=               # For Claude models
GOOGLE_GENERATIVE_AI_API_KEY=    # For Gemini models
```

## 📦 Optional Integrations

### Square (if using Square integration)
```bash
SQUARE_ACCESS_TOKEN=
SQUARE_ENVIRONMENT=              # sandbox or production
SQUARE_APPLICATION_ID=
SQUARE_LOCATION_ID=
SQUARE_WEBHOOK_SIGNATURE_KEY=
SQUARE_API_VERSION=2025-01-23
NEXT_PUBLIC_SQUARE_APPOINTMENTS_ENABLED=false
```

### Analytics & Monitoring
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # Google Analytics
SENTRY_DSN=                      # Error tracking
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

### Email (SMTP - if not using Resend)
```bash
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

### Other Services
```bash
CALENDLY_API_KEY=                # Scheduling
ZOOM_CLIENT_ID=                  # Video calls
ZOOM_CLIENT_SECRET=
TWILIO_ACCOUNT_SID=              # SMS notifications
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## 🚀 How to Add Variables to Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `AUTH0_SECRET`)
   - **Value**: The secret value
   - **Environments**: Select Production, Preview, Development as needed
5. Click **Save**

### Method 2: Vercel CLI
```powershell
# Install Vercel CLI first
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add a variable
vercel env add AUTH0_SECRET

# Pull variables to local .env
vercel env pull
```

### Method 3: Bulk Import
Create a `.env.production` file (DON'T commit this!) and use:
```powershell
vercel env pull .env.production
```

## 📋 Environment Scopes

When adding variables in Vercel, choose the appropriate scope:

- **Production**: Used for production deployments (main branch)
- **Preview**: Used for preview deployments (PRs)
- **Development**: Used for local development (`vercel dev`)

### Recommended Scopes:

| Variable Type | Production | Preview | Development |
|---------------|------------|---------|-------------|
| Auth0 credentials | ✅ Live | ✅ Dev tenant | ✅ Dev tenant |
| Supabase keys | ✅ Prod DB | ✅ Dev DB | ✅ Local/Dev |
| Stripe keys | ✅ Live | ⚠️ Test | ✅ Test |
| API keys | ✅ | ✅ | ✅ |
| Feature flags | ✅ | ✅ | ✅ |

## ⚠️ Security Best Practices

1. **Never commit secrets** to Git
2. **Use different keys** for development, preview, and production
3. **Rotate secrets** every 90 days
4. **Use test keys** for preview deployments when possible
5. **Monitor usage** of all API keys
6. **Set up alerts** for unusual activity
7. **Document** which services require which keys

## 🔍 Verify Configuration

After adding variables, verify they're set:

```powershell
# List all environment variables
vercel env ls

# Check specific variable (shows masked value)
vercel env ls | Select-String "AUTH0"
```

## 🐛 Troubleshooting

### Variables not working in deployment
1. Verify variable names match exactly (case-sensitive)
2. Check variable scope (Production/Preview/Development)
3. Redeploy after adding variables
4. Check build logs for missing variables

### Local development not working
```powershell
# Pull latest environment variables
vercel env pull .env.local

# Verify .env.local exists and has values
cat .env.local
```

### How to update a variable
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Find the variable
3. Click the three dots → Edit
4. Update value and save
5. Redeploy for changes to take effect

## 📊 Current Status Checklist

Use this to track which variables you've configured:

### Required Variables
- [ ] AUTH0_SECRET
- [ ] AUTH0_BASE_URL
- [ ] AUTH0_ISSUER_BASE_URL
- [ ] AUTH0_CLIENT_ID
- [ ] AUTH0_CLIENT_SECRET
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] RESEND_API_KEY

### Optional Variables
- [ ] OPENAI_API_KEY
- [ ] ANTHROPIC_API_KEY
- [ ] GOOGLE_GENERATIVE_AI_API_KEY
- [ ] NEXT_PUBLIC_GA_MEASUREMENT_ID
- [ ] SENTRY_DSN
- [ ] Square integration keys (if needed)

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Environment Variables**: https://vercel.com/docs/environment-variables
- **Auth0 Dashboard**: https://manage.auth0.com/
- **Supabase Dashboard**: https://app.supabase.com/
- **Stripe Dashboard**: https://dashboard.stripe.com/
- **Resend Dashboard**: https://resend.com/

---

**Note**: This file is for reference only. Never commit actual secret values to Git!
