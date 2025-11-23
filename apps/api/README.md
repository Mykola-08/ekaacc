# EKA Balance API Service

This is the dedicated API service for EKA Balance, handling integrations, webhooks, and backend logic.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Port**: 9005

## Features
- **Integration Manager**: Centralized handling for Auth0, Stripe, Resend, Supabase, Zoom, and Google Calendar.
- **Security**: Configured with strict security headers and CORS policies.
- **Vercel Ready**: Optimized configuration for Vercel deployment.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npx turbo run dev --filter=api
   ```

## Deployment
See [DEPLOY.md](./DEPLOY.md) for detailed Vercel deployment instructions.

## Endpoints
- `GET /api/health`: Health check
- `GET /api/integrations`: List status of all integrations
- `POST /api/integrations/[id]/check`: Trigger a check for a specific integration
- `GET /api/test-suite`: Run a full validation suite for all integrations
- `POST /api/webhooks/[provider]`: Webhook receiver (e.g., `/api/webhooks/stripe`)

## Supported Integrations
- **Auth0**: Identity & Access Management
- **Stripe**: Payments & Subscriptions
- **Resend**: Transactional Emails
- **Supabase**: Database & Realtime
- **Zoom**: Video Conferencing (Therapy Sessions)
- **Google Calendar**: Scheduling & Availability

## Testing
To verify integrations locally:
1. Ensure `.env.local` has valid keys (or mock keys matching the format).
2. Run the test suite:
   ```bash
   curl http://localhost:9005/api/test-suite
   ```
- `GET /api/health`: Health check
- `GET /api/integrations`: List available integrations

## Environment Variables
See `.env.example` for required variables.
- `AUTH0_BASE_URL` should be `http://localhost:9005` for local development.
