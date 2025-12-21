# Deploying Apps to Vercel

This monorepo uses a **multi-project** deployment strategy on Vercel. Each app is deployed as a separate Vercel project.

## Quick Start

### Prerequisites
- Vercel account with access to the GitHub repository
- Each app should have its environment variables configured in Vercel

### Deployment Steps

Each app (`web`, `booking-app`, `legal`, `api`) should be set up as a separate Vercel project:

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Project Name**: `ekaacc-web` (or `ekaacc-booking`, `ekaacc-legal`, etc.)
   - **Framework Preset**: Next.js
   - **Root Directory**: Select the specific app directory:
     - `apps/web` for the main web app
     - `apps/booking-app` for the booking system
     - `apps/legal` for legal pages
     - `apps/api` for API endpoints
   - Build settings will be automatically detected from the app's `vercel.json`
5. **Add Environment Variables** for the specific app
6. **Deploy**

## Why Multi-Project?

Each app is deployed to its own Vercel project because:
- **Independent deployments**: Deploy each app without affecting others
- **Isolated environments**: Each app has its own environment variables
- **Separate URLs**: Each app gets its own production URL
- **Better scaling**: Each app can scale independently

## App Configuration

Each app has its own `vercel.json` in its directory with monorepo-aware build commands:

```json
{
  "buildCommand": "npm --prefix ../.. run build -- --filter=<app-name>",
  "installCommand": "npm --prefix ../.. install --legacy-peer-deps"
}
```

These commands:
- Run from the monorepo root using `--prefix ../..`
- Use Turborepo to build only the specific app and its dependencies with `--filter`

## Environment Variables

Each Vercel project needs its own environment variables. See the documentation for each app:
- **web**: See `apps/web/README.md`
- **booking-app**: See `apps/booking-app/README.md`
- **legal**: See `apps/legal/README.md`
- **api**: See `apps/api/README.md`

## CI/CD

When you push to GitHub:
- Vercel automatically detects changes to each app
- Only the affected apps will be redeployed
- Each app's deployment is independent

## Troubleshooting

### Build fails with "turbo not found"
Ensure the build command includes `--prefix ../..` to run from the monorepo root.

### Dependencies not found
Make sure the install command uses `npm --prefix ../.. install` to install all workspace dependencies.

### Wrong app is building
Check that the **Root Directory** in Vercel project settings points to the correct app directory.

---

For more details, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
