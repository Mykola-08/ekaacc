# Deployment Architecture: Microfrontends

We have split the application into three distinct microfrontends to separate concerns and improve scalability.

## Structure

- **Marketing Site** (`apps/marketing-app`)
  - **URL:** `https://www.ekabalance.com`
  - **Port:** 9003
  - **Purpose:** Public landing page.

- **Main Application** (`apps/web`)
  - **URL:** `https://app.ekabalance.com`
  - **Port:** 9002
  - **Purpose:** Core SaaS platform (Dashboard, Auth).

- **Booking System** (`apps/booking-app`)
  - **URL:** `https://booking.ekabalance.com`
  - **Port:** 9004
  - **Tech:** Next.js, Supabase, Stripe
  - **Purpose:** Public booking flow for services (no login required).

## Local Development

To run all applications simultaneously:

```bash
npm run dev
# or
npx turbo run dev --parallel
```

- Marketing: http://localhost:9003
- Web App: http://localhost:9002
- Booking: http://localhost:9004

## Vercel Deployment Guide

You should deploy these as **separate projects** in Vercel.

### Project 1: Marketing Site
... (see above)

### Project 2: Main Application
... (see above)

### Project 3: Booking System

1.  **Create New Project** in Vercel.
2.  **Import** the `ekaacc` repository.
3.  **Root Directory:** `apps/booking-app`.
4.  **Build Command:** `cd ../.. && npx turbo run build --filter=booking-app`
5.  **Domains:** Configure `booking.ekabalance.com`.
6.  **Environment Variables:** Copy from `apps/web` or configure Supabase/Stripe keys.

1.  **Create New Project** in Vercel.
2.  **Import** the `ekaacc` repository.
3.  **Framework Preset:** Next.js
4.  **Root Directory:** Edit and select `apps/marketing-app`.
5.  **Build Command:** `cd ../.. && npx turbo run build --filter=marketing-app`
    *   *Note: Vercel might auto-detect `next build`, but using turbo is recommended for caching.*
6.  **Output Directory:** `.next` (default)
7.  **Environment Variables:**
    *   Add any public keys if needed (currently none required for static content).
8.  **Domains:** Configure `ekabalance.com` and `www.ekabalance.com`.

### Project 2: Main Application (Existing)

1.  **Go to your existing project**.
2.  **Settings > General > Root Directory:** Ensure it is set to `apps/web`.
3.  **Build Command:** `cd ../.. && npx turbo run build --filter=web`
4.  **Domains:** Configure `app.ekabalance.com`.
5.  **Environment Variables:** Ensure all Supabase, Auth0, and Stripe keys are present.

## Shared Configuration

Both apps share the same `packages/` and `turbo.json` configuration.
