# Environment Configuration Guide

## Overview
This project uses a hierarchical environment configuration system with optimized file structure:

```
.env                          # Base configuration (shared across all environments)
.env.local                    # Development overrides
.env.local.production        # Production overrides  
.env.local.sandbox           # Sandbox/testing overrides
```

## Configuration Hierarchy
1. **Base Configuration** (`.env`): Contains shared settings like Supabase URLs, Stripe price IDs, and common API configurations
2. **Environment Overrides**: Contains only environment-specific values like API keys, tokens, and environment modes

## Benefits of This Structure
- **DRY Principle**: Eliminates duplication across environment files
- **Maintainability**: Update shared configs in one place
- **Security**: Sensitive keys are separated by environment
- **Clarity**: Easy to see what changes between environments

## Environment Variables by Category

### Supabase (Database & Authentication)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbnfyxhewsivofvwdpuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stripe (Payment Processing)
```bash
# Base configuration (in .env)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_test_webhook_secret
STRIPE_PRICE_*=price_...

# Environment-specific (in .env.local.*)
STRIPE_SECRET_KEY=sk_test_... (dev/sandbox) or sk_live_... (production)
```

### Square (Payment Processing & Bookings)
```bash
# Base configuration (in .env)
SQUARE_API_VERSION=2025-10-16

# Environment-specific (in .env.local.*)
SQUARE_ACCESS_TOKEN=EAAAl0bQ5SWEXDtx7fpkOsQl922HI0vwD3BTyKWF-8W5dTyBtrf-6_oEJ1DkWkFr (sandbox)
SQUARE_APP_ID=sandbox-sq0idb-S5dB2M3UZBbtySrULtdMMQ (sandbox)
SQUARE_ENVIRONMENT=sandbox (dev/sandbox) or production (production)
```

## Usage Instructions

### Development
```bash
# Uses .env + .env.local automatically
cp .env.local.example .env.local
npm run dev
```

### Production
```bash
# Uses .env + .env.local.production automatically
cp .env.local.example .env.local.production
# Update with production values
npm run build
```

### Sandbox/Testing
```bash
# Uses .env + .env.local.sandbox automatically
cp .env.local.example .env.local.sandbox
# Update with sandbox values
```

## Security Notes
- **Never commit** `.env.local*`, `.env.production`, or any file with actual API keys
- **Always use** environment-specific keys (test keys for development, live keys for production)
- **Rotate keys** regularly and update environment files accordingly
- **Use** `NEXT_PUBLIC_` prefix only for variables that need to be accessible in the browser

## Migration from Old Structure
If you were using the old structure, the migration is automatic:
1. Base configs moved to `.env`
2. Environment-specific configs remain in `.env.local.*`
3. No code changes required - Next.js loads the files automatically

## Troubleshooting
- **Missing variables**: Check that you're using the correct environment file
- **Key errors**: Verify the environment file has the required overrides
- **Build issues**: Ensure all required environment variables are set for the target environment