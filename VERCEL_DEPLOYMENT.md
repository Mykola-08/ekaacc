# Vercel Monorepo Deployment Guide

This monorepo contains multiple Next.js applications that can be deployed separately to Vercel.

## Apps Available for Deployment

- **web** - Main web application
- **api** - API endpoints
- **booking** - Booking system
- **admin** - Admin dashboard
- **marketing** - Marketing site
- **legal** - Legal pages
- **therapist** - Therapist portal
- **docs** - Documentation site

## Quick Deployment

### Deploy a Single App

```powershell
# Deploy to preview (staging)
.\scripts\deploy-vercel.ps1 -App web

# Deploy to production
.\scripts\deploy-vercel.ps1 -App web -Production
```

### Deploy All Apps

```powershell
# Deploy all apps to preview
.\scripts\deploy-vercel.ps1 -App all

# Deploy all apps to production
.\scripts\deploy-vercel.ps1 -App all -Production
```

## Manual Deployment

If you prefer to deploy manually:

```powershell
# Navigate to the app directory
cd apps/web

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Setting Up Vercel Projects

For each app, you'll need to:

1. **Create a Vercel Project** (first time only):
   ```powershell
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
   ```powershell
   cd apps/web
   vercel --prod
   ```

## Vercel Configuration

Each app has its own `vercel.json` configuration file that:
- Uses Turbo to build only the specific app and its dependencies
- Configures security headers
- Sets up the correct build and output directories

## Environment Variables

Make sure to configure environment variables for each project in the Vercel dashboard. Common variables include:

- `NEXT_PUBLIC_*` - Public environment variables
- API keys and secrets
- Database connection strings
- Auth0 configuration
- Stripe keys
- etc.

## Troubleshooting

### Build Failures

If a build fails:
1. Check the Vercel build logs
2. Ensure all dependencies are in the root `package.json`
3. Verify the turbo filter is correct in `vercel.json`

### Environment Variables

If environment variables are missing:
1. Go to Vercel dashboard > Project Settings > Environment Variables
2. Add the required variables
3. Redeploy the project

### Monorepo Issues

If Vercel can't find dependencies:
1. Ensure the build command uses `cd ../..` to run from the monorepo root
2. Check that `turbo.json` includes the app in the pipeline
3. Verify `package.json` has the correct dependencies

## CI/CD Integration

You can also set up automatic deployments via GitHub:

1. Connect your repository to Vercel
2. Configure each app as a separate project
3. Set up deployment rules (e.g., main branch = production)
4. Each push will trigger deployments automatically

## Vercel CLI Reference

```powershell
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
```
