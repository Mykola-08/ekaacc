# Production Deployment Guide

## Overview
This guide covers deploying the EKA Account application to production, including environment setup, security configurations, monitoring, and best practices.

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings reviewed and fixed
- [ ] Code reviewed and approved
- [ ] Tests passing (unit, integration, e2e)
- [ ] Build succeeds without warnings
- [ ] Dependencies audited for vulnerabilities

### Security
- [ ] Environment variables properly configured
- [ ] API keys stored in secure vault (not in code)
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] RLS policies reviewed and tested
- [ ] Authentication flows tested
- [ ] HTTPS enforced
- [ ] Security headers configured

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized and using Next.js Image
- [ ] Database queries optimized with indexes
- [ ] API response caching configured
- [ ] CDN configured for static assets
- [ ] Lazy loading implemented where appropriate

### Monitoring
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Performance monitoring setup
- [ ] Database monitoring configured
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file (never commit this):

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_production_publishable_key
SUPABASE_SECRET_KEY=your_production_secret_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Square (Production)
SQUARE_ACCESS_TOKEN=your_production_token
SQUARE_ENVIRONMENT=production
SQUARE_APPLICATION_ID=your_application_id

# AI Services (Use production rate limits)
OPENAI_API_KEY=your_production_openai_key
ANTHROPIC_API_KEY=your_production_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_production_google_key

# Email (if using)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@your-domain.com

# Monitoring & Analytics
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Security
NEXTAUTH_SECRET=your_very_long_random_secret_string_here
NEXTAUTH_URL=https://your-domain.com

# Feature Flags (optional)
FEATURE_FLAG_AI_INSIGHTS=true
FEATURE_FLAG_COMMUNITY=true
FEATURE_FLAG_BOOKINGS=true
```

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is the easiest platform for Next.js deployment.

#### Setup Steps:

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Link Project:**
```bash
vercel link
```

4. **Configure Environment Variables:**
- Go to Vercel Dashboard > Your Project > Settings > Environment Variables
- Add all production environment variables
- Set them for "Production" environment

5. **Deploy:**
```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy if configured)
git push origin main
```

#### Vercel Configuration (vercel.json):
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Option 2: Docker + Cloud Platform

#### Dockerfile:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Build and Deploy:
```bash
# Build image
docker build -t ekaacc:latest .

# Run locally to test
docker run -p 3000:3000 --env-file .env.production ekaacc:latest

# Push to registry (adjust for your registry)
docker tag ekaacc:latest your-registry/ekaacc:latest
docker push your-registry/ekaacc:latest

# Deploy to cloud platform (e.g., AWS ECS, Google Cloud Run, Azure Container Apps)
```

### Option 3: Self-Hosted (VPS/Dedicated Server)

#### Using PM2:
```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "ekaacc" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

## Database Setup

### Production Database Migration

1. **Backup existing data** (if any):
```bash
supabase db dump -f pre-migration-backup.sql
```

2. **Run migrations:**
```bash
# Using Supabase CLI
supabase db push

# Or manually
psql $DATABASE_URL -f supabase/migrations/[migration-file].sql
```

3. **Verify migrations:**
```sql
SELECT * FROM schema_migrations ORDER BY version DESC LIMIT 10;
```

4. **Seed essential data:**
```bash
psql $DATABASE_URL -f database/seeds/production-seeds.sql
```

### Database Performance Optimization

```sql
-- Create additional indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_bookings_date_status 
ON bookings(date, status) WHERE status = 'confirmed';

CREATE INDEX CONCURRENTLY idx_journal_entries_user_created 
ON journal_entries(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_messages_recipient_unread 
ON messages(recipient_id, is_read) WHERE is_read = false;

-- Analyze tables
ANALYZE;
```

## Security Hardening

### 1. Next.js Configuration

Update `next.config.ts`:

```typescript
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Image optimization
  images: {
    domains: ['your-domain.com', 'supabase.co'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Enable SWC minification
  swcMinify: true,
};

export default nextConfig;
```

### 2. API Route Protection

Example protected API route:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    await limiter.check(request, 10); // 10 requests per minute
    
    // Authentication
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Your logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Environment Variable Validation

Create `src/lib/env.ts`:

```typescript
function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value || '';
}

export const env = {
  // App
  nodeEnv: getEnvVar('NODE_ENV'),
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL'),
  
  // Supabase
  supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
  supabaseServiceKey: getEnvVar('SUPABASE_SECRET_KEY'),
  
  // Payment
  stripeSecretKey: getEnvVar('STRIPE_SECRET_KEY'),
  stripePublishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  
  // Optional
  sentryDsn: getEnvVar('SENTRY_DSN', false),
} as const;
```

## Monitoring & Logging

### Error Tracking with Sentry

Install and configure:

```bash
npm install @sentry/nextjs
```

`sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Application Logging

Create structured logging:

```typescript
// src/lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({ level: 'info', message, ...data, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, data?: any) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error?.message, 
      stack: error?.stack,
      ...data, 
      timestamp: new Date().toISOString() 
    }));
  },
  warn: (message: string, data?: any) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...data, timestamp: new Date().toISOString() }));
  },
};
```

### Health Check Endpoint

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Check database connection
    const supabase = createClient();
    const { error } = await supabase.from('user_roles').select('count').limit(1);
    
    if (error) throw error;
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        api: 'healthy',
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Service unhealthy'
    }, { status: 503 });
  }
}
```

## Performance Optimization

### Bundle Analysis

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Database Query Optimization

```typescript
// Use select to limit data
const { data } = await supabase
  .from('journal_entries')
  .select('id, title, created_at') // Only select needed columns
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);

// Use single query instead of multiple
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    therapist:therapist_profiles(full_name, avatar_url),
    product:products(name, duration_minutes)
  `)
  .eq('user_id', userId);
```

## Rollback Plan

### Quick Rollback Steps

1. **Vercel:** 
   - Go to Deployments > Find previous working deployment > "Promote to Production"

2. **Docker:**
```bash
# Roll back to previous version
docker pull your-registry/ekaacc:previous-tag
docker stop ekaacc-current
docker run -d --name ekaacc-current your-registry/ekaacc:previous-tag
```

3. **Database:**
```bash
# Restore from backup
psql $DATABASE_URL < backup-file.sql
```

## Post-Deployment Verification

### Automated Checks

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Test authentication
curl https://your-domain.com/api/user/profile \
  -H "Authorization: Bearer $TOKEN"

# Run smoke tests
npm run test:e2e -- --grep "smoke"
```

### Manual Checks

- [ ] Homepage loads correctly
- [ ] User can sign up
- [ ] User can log in
- [ ] Dashboard displays correctly
- [ ] Booking system works
- [ ] Payment processing works
- [ ] Email notifications work
- [ ] Mobile responsive
- [ ] All critical pages load

## Maintenance

### Regular Tasks

**Daily:**
- Check error logs
- Monitor application performance
- Check database performance

**Weekly:**
- Review analytics
- Check for dependency updates
- Review security alerts
- Database vacuum and analyze

**Monthly:**
- Update dependencies
- Review and update documentation
- Security audit
- Performance audit
- Backup verification

### Scaling Considerations

**When to scale:**
- Response time > 500ms consistently
- Database CPU > 70%
- Error rate > 1%
- User complaints about performance

**Scaling options:**
- Upgrade database tier
- Add read replicas
- Enable CDN for static assets
- Implement caching layer (Redis)
- Consider serverless functions for API routes

## Support & Troubleshooting

### Common Issues

**Issue:** 500 Internal Server Error
- Check application logs
- Verify environment variables
- Check database connection
- Review recent code changes

**Issue:** Slow page loads
- Check database query performance
- Review bundle size
- Check CDN configuration
- Review server resources

**Issue:** Authentication errors
- Verify Supabase configuration
- Check JWT secret
- Review CORS settings
- Check session management

---

**Last Updated:** 2024-11-17
**Deployment Version:** 1.0.0
