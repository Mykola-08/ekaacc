# GitHub Copilot Instructions

## Project Overview
This is a Next.js application using the App Router, TypeScript, and Tailwind CSS.
It uses Supabase for the backend (database, auth) and integrates with various services.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI + Tailwind)
- **Database**: Supabase (PostgreSQL)
- **Testing**:
  - Unit/Integration: Jest
  - E2E: Playwright
  - Load: k6
- **Deployment**: Vercel

## Coding Guidelines

### TypeScript
- Use strict type checking.
- Avoid `any`; use specific types or `unknown` if necessary.
- Define types/interfaces in `src/types/` or co-located with components if specific.

### Next.js App Router
- Use Server Components by default.
- Add `'use client'` directive only when necessary (state, effects, event listeners).
- Use `next/image` for images.
- Use `next/link` for navigation.

### Styling
- Use Tailwind CSS utility classes.
- Avoid inline styles.
- Use `clsx` or `cn` utility for conditional class names.

### Database (Supabase)
- Use the Supabase JS client for data access.
- Follow Row Level Security (RLS) policies.
- Use migrations for schema changes (`supabase/migrations`).

### Testing
- Write unit tests for utility functions and complex components.
- Write E2E tests for critical user flows.
- Ensure tests are deterministic.

## File Structure
- `src/app`: App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and shared logic.
- `src/services`: Business logic and API integrations.
- `supabase`: Database configuration, migrations, and functions.
- `e2e`: Playwright E2E tests.
- `load-tests`: k6 load tests.
