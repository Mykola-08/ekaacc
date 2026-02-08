# GitHub Copilot Instructions for EKA Account

This repository is a Next.js 16 application for a mental health & wellness
platform.

## 1. Project Structure & Architecture

- **Structure**: Unified single-application structure.
  - `src/app`: Next.js 16 App Router with route groups for (marketing), (platform), (auth), (booking), (dashboard)
  - `src/components`: React components organized by feature
  - `src/lib`: Shared utilities, constants, and configuration
  - `server`: Server-side business logic organized by domain (booking, calendar, dashboard, etc.)
- **Tech Stack**: Next.js 16, TypeScript, React 19, Tailwind CSS 4, Supabase,
  Stripe, Square, Resend.

### Key Architectural Patterns

- **Service Layer**: Isolate business logic from API routes (e.g.,
  `server/booking/service.ts`).
  - Flow: `Client` -> `API Route` -> `Service Layer` -> `Supabase/Stripe`.
- **Middleware Usage**: Middleware exists at root level (`middleware.ts`) but should be used sparingly.
  Prefer architectural patterns within the App Router for most use cases.
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
- **Styling**: Use Tailwind CSS 4. Merge classes with `cn()` from `@/lib/utils`.
- **Pattern**: Export single component with `variant` and `size` props (using
  `cva` from `class-variance-authority`).
- **Theming**: Use Tailwind config tokens (`primary`, `accent`, `eka-dark`), avoid hardcoded
  hex values. Brand colors: `accent` (#FFB405), `eka-dark` (#000035).
- **Border Radius**: Use Apple standard 20px (`rounded-[20px]`) for buttons, cards, inputs.
  See `src/lib/design-tokens.ts` for all design tokens.
- **Shadows**: Use CSS variables (`var(--shadow-base)`, `var(--shadow-md)`, `var(--shadow-lg)`)
  instead of Tailwind shadow classes for important components.
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

- **Global State**: Use **Zustand** (stores in `src/store/`).
- **Forms**: Use **React Hook Form** with **Zod** validation.
- **Path Aliases**: Use `@/` for `src/*` and `@/server/*` for `server/*`.
- **Hooks**: Located in `src/hooks/` directory.

### Quality & Safety

- **Strict Linting**: Resolve ALL linter warnings and errors. Zero tolerance.
- **Dependencies**: Do not introduce deprecated or insecure packages.
- **Types**: Share interfaces via `src/types/` directory.
- **Radix UI Slot**: Use `Slot` directly from `@radix-ui/react-slot`, not `Slot.Root`.

## 3. Workflows & Commands

- **Development**: `npm run dev` (runs on port 9002).
- **Build**: `npm run build`.
- **Linting**: 
  - `npm run lint` - Check for lint errors
  - `npm run lint:fix` - Auto-fix lint issues
- **Type Checking**: `npm run typecheck` - Run TypeScript compiler checks.
- **Full Check**: `npm run check` - Runs both lint and typecheck.
- **Formatting**: `npm run format` - Format code with Prettier.
- **Security**:
  - `npm run security:audit` - Run npm audit
  - `npm run security:secrets` - Scan for leaked secrets with gitleaks
- **Database**:
  - `npm run db:check` - Check database connection
  - `npm run db:seed` - Seed services data
- **Scripts**: Use `scripts/` for ops tasks (e.g., `npx tsx scripts/web/check-db-connection.ts`).

## 4. Integrations

- **Supabase**: Database & Storage. Use consolidated schema in `supabase/migrations/20260120000000_consolidated_schema.sql`.
- **Auth**: Supabase Auth with JWT tokens.
- **Stripe/Square**: Payments & Booking. Use mocked clients for unit tests.
- **AI**: OpenAI GPT-4, Anthropic Claude, Google Gemini via `ai` SDK.
- **Email**: Resend for transactional emails.
- **Feature Flags**: Statsig for feature management.
- **Analytics**: Vercel Analytics and Speed Insights.

## 5. Code Organization

### Directory Structure
```
ekaacc/
├── src/                      # Application source
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth routes (login, signup)
│   │   ├── (booking)/       # Booking flow routes
│   │   ├── (dashboard)/     # Dashboard routes
│   │   ├── (marketing)/     # Public marketing pages
│   │   ├── (platform)/      # Platform features
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── context/             # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and config
│   ├── store/               # Zustand stores
│   ├── styles/              # Global styles
│   └── types/               # TypeScript types
├── server/                  # Server-side business logic
│   ├── booking/            # Booking service layer
│   ├── calendar/           # Calendar management
│   ├── dashboard/          # Dashboard data
│   └── [other domains]/    # Other business domains
├── public/                  # Static assets
├── supabase/               # Database migrations
└── scripts/                # Utility scripts
```

### Removed Features (Not to be re-implemented)
The following features were removed to focus on core wellness platform:
- Academy/courses system
- Community forums
- Shop/e-commerce
- Educator portal
- Donation seeker applications
- VIP tier system (silver/gold/platinum)
- Referral program (legacy)

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
