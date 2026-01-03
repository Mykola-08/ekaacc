# Vercel Integration Tests

This directory contains tests for verifying Vercel deployments.

## Test Scripts

- `deployment-test.sh` - Verifies deployment is accessible and functional
- `env-check.sh` - Validates environment variable configuration

## Usage

```bash
# Test a deployment
./vercel-tests/deployment-test.sh https://your-app.vercel.app

# Or use npm scripts
npm run test:vercel https://your-app.vercel.app
npm run test:vercel:env https://your-app.vercel.app
```

## What Gets Tested

### Deployment Test
- ✓ Deployment is accessible
- ✓ Homepage loads without 500 errors
- ✓ Login page is accessible
- ✓ Dashboard route exists
- ✓ API routes respond
- ✓ Static assets load
- ✓ Response time is acceptable
- ✓ HTTPS is enforced
- ✓ Essential HTML content is present
- ✓ No critical JavaScript errors

### Environment Check
- ✓ Application configuration is present
- ✓ Database connectivity (through API)
- ✓ Authentication service is configured
- ✓ Build-time configuration is correct

## Integration with CI/CD

Add to your deployment pipeline:

```bash
# After Vercel deployment
DEPLOYMENT_URL=$(vercel --prod --yes)
./vercel-tests/deployment-test.sh $DEPLOYMENT_URL
./vercel-tests/env-check.sh $DEPLOYMENT_URL
```

## Required Environment Variables

These should be configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- Other application-specific variables

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed
