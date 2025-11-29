# Vercel Monorepo Deployment Guide

This monorepo contains multiple Next.js applications that can be deployed separately to Vercel.

## Apps Available for Deployment

- **web** - Main web application (includes Payload CMS)
- **booking** - Booking system
- **marketing** - Marketing site
- **legal** - Legal pages

## Quick Deployment

### Deploy from Repository Root

The root `vercel.json` is configured to deploy the main web app:

```bash
# From the repository root
vercel

# Deploy to production
vercel --prod
```

### Deploy a Specific App

```bash
# Navigate to the app directory
cd apps/web
vercel

# Deploy to production
vercel --prod
```

## Vercel Configuration

Each app has its own `vercel.json` configuration file that:
- Uses Turbo to build only the specific app and its dependencies
- Configures security headers
- Sets up the correct build and output directories
- Uses `ignoreCommand: "npx turbo-ignore"` to skip unnecessary builds in monorepo

### Root-level Deployment

When deploying from the repository root, Vercel will use the root `vercel.json` which is configured to:
- Build the `web` app using `npx turbo run build --filter=web`
- Output to `apps/web/.next`
- Apply security headers and cron jobs

### App-level Deployment

When deploying from an app directory (e.g., `apps/web`), the app's `vercel.json` is used which:
- Installs dependencies from the monorepo root using `--prefix ../..`
- Builds the specific app using Turbo
- Outputs to `.next`

## Environment Variables

Configure these environment variables in the Vercel dashboard:

### Required for Web App

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `POSTGRES_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Payload CMS secret (min 32 chars) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `RESEND_API_KEY` | Resend email API key |
| `CRON_SECRET` | Secret for cron job authentication |

### Optional

| Variable | Description |
|----------|-------------|
| `SQUARE_ACCESS_TOKEN` | Square payments access token |
| `SQUARE_APP_ID` | Square application ID |
| `SQUARE_ENVIRONMENT` | Square environment (sandbox/production) |
| `AI_GATEWAY_API_KEY` | AI gateway API key |
| `OPENAI_API_KEY` | OpenAI API key |

## Setting Up Vercel Projects

1. **Create a Vercel Project** (first time only):
   ```bash
   cd apps/web
   vercel
   # Follow the prompts to link or create a new project
   ```

2. **Configure Environment Variables**:
   - Go to your Vercel dashboard
   - Select the project
   - Navigate to Settings > Environment Variables
   - Add all required environment variables

3. **Subsequent Deployments**:
   ```bash
   cd apps/web
   vercel --prod
   ```

## Troubleshooting

### Build Failures

If a build fails:
1. Check the Vercel build logs
2. Ensure all dependencies are in the root `package.json`
3. Verify the turbo filter is correct in `vercel.json`
4. Check that `turbo.json` has all required environment variables in `globalEnv`

### Environment Variables

If environment variables are missing:
1. Go to Vercel dashboard > Project Settings > Environment Variables
2. Add the required variables
3. Redeploy the project

### Monorepo Issues

If Vercel can't find dependencies:
1. Ensure the install command uses `--prefix ../..` for app-level deployments
2. Check that `turbo.json` includes the app in the pipeline
3. Verify `package.json` has the correct dependencies

### Database Connection Issues

If Payload CMS fails to connect:
1. Ensure `POSTGRES_URL` is set correctly
2. Use the Transaction Pooler URL from Supabase (port 6543)
3. Verify SSL settings in the connection string

## CI/CD Integration

### GitHub Integration

1. Connect your repository to Vercel
2. Configure each app as a separate project
3. Set the Root Directory in project settings (e.g., `apps/web`)
4. Set up deployment rules (e.g., main branch = production)
5. Each push will trigger deployments automatically

### Ignore Command

The `ignoreCommand: "npx turbo-ignore"` in `vercel.json` helps skip unnecessary builds when changes don't affect the specific app.

## Vercel CLI Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View project details
vercel inspect [deployment-url]

# Remove a deployment
vercel rm [deployment-url]

# Link to existing project
vercel link

# View environment variables
vercel env ls
```

## Payload CMS (Web App)

The `web` app uses Payload CMS. Ensure the following:

1. **Database Connection**: Payload requires a database connection during the build process.
   - Ensure `POSTGRES_URL` is set in Vercel environment variables
   - Use the Transaction Pooler URL from Supabase (port 6543)
   - Connection string should include `?sslmode=require`

2. **Payload Secret**: Ensure `PAYLOAD_SECRET` is set (minimum 32 characters).

3. **Vercel Blob**: For media storage, ensure `BLOB_READ_WRITE_TOKEN` is set.

4. **Build Settings**: The `vercel.json` is configured to handle the build correctly.

## Cron Jobs

The web app has configured cron jobs that run automatically on Vercel:

| Path | Schedule | Description |
|------|----------|-------------|
| `/api/cron/cleanup` | Daily at 2 AM | Database cleanup |
| `/api/cron/health-check` | Daily at 3 AM | Health check |

Ensure `CRON_SECRET` is set to authenticate cron job requests.
