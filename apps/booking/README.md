## Eka Booking

Production-ready frictionless prepaid booking micro-app built on Next.js + Supabase + Stripe.

Implements:
- Minimal data capture (email required, phone optional)
- Real-time staff-based availability
- Slot reservation with TTL while payment completes
- Prepayment (full or deposit) + cancellation & refund policies
- Tokenized manage links (no user login)
- Stripe payment + webhook capture + refund on cancel
- Waitlist enrollment per service/date
- Secure secret retrieval via `app_config` (service role)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Environment Variables
Set these in `.env.local` (service role key must stay server only):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=... (optional if stored in app_config)
STRIPE_WEBHOOK_SECRET=... (optional if stored in app_config)
BOOKING_TOKEN_SECRET=... (optional if stored in app_config)
```

### Supabase Schema
Apply `SUPABASE_BOOKING_SCHEMA.sql` then insert secrets:
```sql
insert into app_config(key,value) values
 ('BOOKING_TOKEN_SECRET','your-long-random'),
 ('STRIPE_SECRET_KEY','sk_live_...'),
 ('STRIPE_WEBHOOK_SECRET','whsec_...');
```
Protect `app_config` with RLS for service role only.

### Run Tests
```
npm run test
```

### Design System (shadcn)
UI components follow shadcn conventions (variant-driven, headless Radix primitives). Extend under `components/ui/`. Ensure consistent styling via Tailwind + `cn()` helper.

### Key Directories
- `app/api/*` – route handlers (REST-style endpoints)
- `lib/` – clients, tokens, config, utilities
- `server/booking/` – booking service logic
- `types/` – shared TypeScript interfaces
- `tests/` – Vitest endpoint tests (mocked Supabase/Stripe)

### Booking Flow Summary
1. Fetch services
2. Fetch availability (staff schedules + existing bookings)
3. Create booking (pending + slot hold)
4. Pay via Stripe checkout (webhook marks captured)
5. Manage via token (cancel/reschedule, refund if eligible)
6. Waitlist for unavailable dates

See `BOOKING_SYSTEM_PROMPT.md` and `BOOKING_API_SCHEMA.md` for full behavioral specs.


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architecture Overview
High-level docs in `ARCHITECTURE.md`; testing guidance in `TESTING.md`.

Event emission currently logs to console via `lib/events.ts`. Replace with webhook dispatch or message bus (e.g. Kafka, SNS) in production.

Security notes:
- Service role key only used server-side (`supabaseServerClient`).
- Booking manage tokens are short-lived JWTs with rotation.
- Refund logic validates capture status and amount basis.

Performance targets: availability <300ms typical, booking confirmation <5s including Stripe.

Accessibility: keyboard-navigable time selection; clear status and policy messaging.

For future enhancements consult `BOOKING_API_SCHEMA.md` Future section.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Ensure environment variables and Supabase database populated; configure Stripe webhook to point to `/api/stripe/webhook`.

