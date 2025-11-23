# Architecture

## Overview
The Eka Booking micro-app is structured for maintainability, separating concerns between route handlers, service logic, shared types, and infrastructure utilities.

## Layers
1. API Routes (`app/api/*`): Minimal request parsing + response shaping.
2. Service Layer (`server/booking/*`): Business logic & Supabase queries (future expansion: pricing, staff rules, buffers, analytics).
3. Infrastructure (`lib/*`): Clients, token management, config loading, event emission.
4. Data Schema (`SUPABASE_BOOKING_SCHEMA.sql`): Source of truth for relational structure.
5. Types (`types/*`): Shared interfaces consumed across layers.

## Data Flow
Client → API Route → Service Layer → Supabase / Stripe → Event Emission.

Events currently logged; integrate outbound webhooks or queue for asynchronous processing.

## Secrets Management
Secrets stored in `app_config` table with RLS restricts select to service role. Fallback to environment vars when missing. Cache in memory for 60s.

## Booking Lifecycle
Pending (slot hold) → Captured (webhook) → Managed (reschedule/cancel) → Completed / Canceled / No-show.

## Availability Generation
Staff schedules drive per-staff slots. Future improvements:
- Buffer times (pre/post service)
- Dynamic blackout windows (vacation, maintenance)
- Service-specific padding.

## Testing Strategy
Vitest tests target route handlers with mocked Supabase/Stripe. For higher fidelity, add integration tests against Supabase emulator / local Docker and Stripe test mode.

## Extensibility Points
- `lib/events.ts` replace with message bus.
- `server/booking/service.ts` add availability algorithms, promotions, loyalty.
- Add `pricing` module for dynamic pricing tiers.
- Add `notifications` module (email/SMS) with provider abstraction.

## Performance Considerations
Avoid N+1 queries in availability—batch fetch schedule and bookings. Cache derived staff availability for a short window (e.g., 30s) to reduce recomputation.

## Security
- Use short-lived JWT manage tokens; rotate after state changes.
- Validate refund eligibility strictly.
- Enforce RLS so secrets never leak via anon key.
- Rate limit booking creation attempts (add middleware layer / edge function).

## Frontend (shadcn)
Component library under `components/ui` uses shadcn patterns: composition over inheritance, variant props for styling, Tailwind merges using `cn()`.
Introduce design tokens (colors, spacing) via Tailwind config for consistent theming.
