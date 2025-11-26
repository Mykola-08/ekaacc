# Deploying EKA Balance API to Vercel

This API service is designed to be deployed as a separate Vercel project from the main web app.

## Deployment Steps

1.  **Go to Vercel Dashboard** and click **"Add New..."** -> **"Project"**.
2.  **Import the `ekaacc` repository**.
3.  **Configure Project:**
    *   **Project Name:** `eka-balance-api` (or similar)
    *   **Framework Preset:** Next.js
    *   **Root Directory:** Click `Edit` and select `apps/api`.
4.  **Environment Variables:**
    Add the following variables in the Vercel project settings:
    *   `AUTH0_ISSUER_BASE_URL`
    *   `AUTH0_CLIENT_ID`
    *   `STRIPE_SECRET_KEY`
    *   `STRIPE_WEBHOOK_SECRET`
    *   `RESEND_API_KEY`
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY`
5.  **Deploy:** Click **Deploy**.

## Configuration

The project uses `apps/api/vercel.json` for configuration:
*   **Build Command:** `npx turbo run build --filter=api`
*   **CORS Headers:** Automatically configured for `/api/*` routes.
*   **Region:** Defaults to `iad1` (US East), change in `vercel.json` if needed.
