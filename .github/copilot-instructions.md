# GitHub Copilot Instructions for EKA Account

This repository is a Next.js application for a mental health & wellness
platform.

## 1. Project Structure & Architecture

- **Structure**: Unified single-application structure.
  - `src/app`: Next.js 14 App Router.
  - `src/packages`: Internal shared logic and UI.
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe,
  Resend.

### Key Architectural Patterns

- **Service Layer**: Isolate business logic from API routes (e.g.,
  - `server/booking/service.ts`).
  - Flow: `Client` -> `Server Action` -> `Service Layer` -> `Supabase/Stripe`.
- **No Middleware**: **Do not use Next.js Middleware** for request handling/auth
  unless explicitly required. Prefer architectural patterns within the App
  Router.
- **Secrets Management**: Secrets are stored in the `app_config` table with RLS,
  not just env vars.
- **Data Fetching**: Use Supabase client with RLS. Avoid N+1 queries; batch
  fetch where possible.

## 2. Coding Standards & Conventions

### UI & Styling (shadcn/ui + Tailwind + Headless UI)

- **Standard Components**: Use `shadcn/ui` primitives (Radix UI) for standard
  interface elements (Dialogs, Inputs, Sheets).
- **Custom Transitions**: Use **Headless UI** (`@headlessui/react`) for complex,
  accessible transition logic and animations (e.g., Loaders, specialized
  Reveals).
- **Styling**: Use Tailwind CSS. Merge classes with `cn()`.
- **Pattern**: Export single component with `variant` and `size` props (using
  `cva`).
- **Theming**: Use Tailwind config tokens (`primary`, `accent`), avoid hardcoded
  hex values.
- **Example**:
  ```tsx
  import { cn } from '@/lib/utils';
  // ... cva definition
  export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  );
  ```

### State & Forms

- **Global State**: Use **Zustand**.
- **Forms**: Use **React Hook Form** with **Zod** validation.

### Quality & Safety

- **Strict Linting**: Resolve ALL linter warnings and errors. Zero tolerance.
- **Dependencies**: Do not introduce deprecated or insecure packages.
- **Types**: Share interfaces via `types/` directory or `packages/shared`.

## 3. Workflows & Commands

- **Development**: `npm run dev` (Web runs on port 9002).
- **Build**: `npm run build`.
- **Testing**:
  - Unit: `npm test` (Jest/Vitest).
  - E2E: `npm run test:e2e` (Playwright).
  - Load: `npm run test:load` (k6).
- **Scripts**: Use `scripts/` for ops tasks (e.g.,
  `npx tsx scripts/setup-stripe.ts`).

## 4. Integrations

- **Supabase**: Database & Storage. Use `SUPABASE_BOOKING_SCHEMA.sql` as source
  of truth for booking.
- **Auth**: Supabase Auth.
- **Stripe**: Payments & Billing. Use mocked clients for unit tests.
- **AI**: OpenAI/Anthropic/Google via `packages/ai-services`.

## 6. Animation Guidelines

### Easing

- **Enter/Exit**: Use `ease-out` variants (e.g., Quint, Expo) for natural entry.
- **Movement**: Use `ease-in-out` for movement within screen.
- **Avoid**: `ease-in` (feels sluggish).

### Duration & Timing

- **Micro-interactions**: `200ms ease` for hovers.
- **Responsiveness**: <1s max duration.
- **Origin-aware**: Animate from trigger source.

### Tools (Motion/Framer Motion)

- **Springs**: Prefer spring animations for natural feel.
- **Performance**: Animate `transform`/`opacity` only. Use `will-change`
  sparingly.
- **Radix UI**: Use `asChild` pattern with `motion.div`.

### Code Samples & Full Spec

Refer to `docs/DESIGN_SYSTEM_AND_ANIMATION.md` and
`docs/ANIMATION_THEORY_GUIDE.md` for comprehensive theory, exact cubic-bezier
values, and implementation details.
