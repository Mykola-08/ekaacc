# GitHub Copilot Instructions — EKA Platform

Mental health & wellness platform built with Next.js (App Router), TypeScript,
Tailwind CSS, Supabase, Stripe, and Resend.

---

## 1. Project Structure

```
ekaacc/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, signup)
│   │   ├── (booking)/          # Booking flow
│   │   ├── (dashboard)/        # All authenticated pages (unified by permissions)
│   │   ├── (marketing)/        # Public marketing & SEO pages
│   │   ├── (platform)/         # Platform utilities (webhooks, cron, email, etc.)
│   │   ├── actions/            # Server actions (admin, billing, wallet, etc.)
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (50+ components)
│   │   ├── ai/                 # AI chat components
│   │   ├── admin/              # Admin-specific components
│   │   ├── booking/            # Booking wizard and history
│   │   ├── dashboard/          # Dashboard layout, widgets, shared
│   │   ├── features/           # Feature modules (family, payment, referral, wallet)
│   │   ├── platform/           # Platform-wide (auth, navigation, settings, etc.)
│   │   ├── prompt-kit/         # Chat/prompt UI kit
│   │   └── theme/              # Theme providers
│   ├── context/                # React contexts (Language, Features, Translations)
│   ├── hooks/                  # Custom hooks (root + marketing/ + platform/)
│   ├── lib/
│   │   ├── supabase/           # Supabase clients (client.ts, server.ts, admin.ts)
│   │   ├── platform/
│   │   │   ├── services/       # 24 service modules (auth, booking, billing, etc.)
│   │   │   ├── integrations/   # External integrations (Stripe, Resend, Google)
│   │   │   ├── supabase/       # Platform Supabase utilities
│   │   │   ├── types/          # Platform type definitions
│   │   │   └── config/         # Navigation, permissions config
│   │   └── *.ts                # Shared utils (utils.ts, config.ts, permissions.ts)
│   ├── marketing/              # Marketing-specific code
│   │   ├── components/         # 50+ marketing components
│   │   ├── contexts/           # Marketing contexts & translations
│   │   ├── hooks/              # Marketing hooks
│   │   └── shared/             # Marketing constants & types
│   ├── store/                  # Zustand stores
│   ├── styles/                 # Global styles
│   └── types/                  # Shared type definitions
├── server/                     # Server-side business logic
│   ├── ai/                     # AI services (chat, memory, personalization)
│   ├── booking/                # Booking service
│   ├── payment/                # Payment service
│   ├── notifications/          # Notification dispatcher, handlers, reminders
│   ├── telegram/               # Telegram bot integration
│   └── */                      # Other domain services
├── supabase/                   # DB migrations, edge functions, email templates
├── scripts/                    # Utility scripts
├── docs/                       # Documentation (see docs/README.md)
│   ├── architecture/           # Dashboard, features, platform docs
│   └── design/                 # Design system, animations, UX
└── public/                     # Static assets
```

### Path Aliases (tsconfig)

| Alias           | Maps to             |
| --------------- | ------------------- |
| `@/*`           | `./src/*`           |
| `@/server/*`    | `./server/*`        |
| `@/marketing/*` | `./src/marketing/*` |

---

## 2. Architecture

### Data Flow

```
Client Component → Server Action → Service Layer → Supabase / Stripe / Resend
```

- **Service Layer** (`server/*/service.ts` and
  `src/lib/platform/services/*.ts`): all business logic lives here, never in API
  routes or components.
- **Server Actions** (`src/app/actions/*.ts` and `server/*/actions.ts`): thin
  wrappers that call service functions.

### Supabase Clients

| Context | Import                  | Pattern             | Key used        |
| ------- | ----------------------- | ------------------- | --------------- |
| Browser | `@/lib/supabase/client` | Singleton           | Publishable key |
| Server  | `@/lib/supabase/server` | Async (per-request) | Publishable key |
| Admin   | `@/lib/supabase/admin`  | Service key         | Secret key      |

**Key naming**: Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and
`SUPABASE_SECRET_KEY`. Never use the legacy names
`NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.

### Secrets & Configuration

- **Primary store**: `app_config` table (RLS: service-role only). All API keys
  and secrets live here.
- **Config API**: `src/lib/config.ts` — `getConfig(key)` loads from DB with
  5-min cache, falls back to `process.env[key]`.
- **Helpers**: `getStripeSecretKey()`, `getResendApiKey()`,
  `getTelegramBotToken()`, etc. Always use these instead of raw `process.env`.
- **Local `.env.local`**: Keep only Supabase connection keys + `POSTGRES_URL` +
  `CONFIG_DB_ENABLED=1`. All other secrets should be in `app_config`.

### Authentication & Permissions

- **Auth**: Supabase Auth with cookie-based sessions refreshed in
  `middleware.ts`.
- **Permissions**: Role-based with per-user overrides via `role_permissions`
  table. Gated via `PermissionGate` component and `getUserPermissions()`.
- **Middleware**: Session refresh + subdomain routing (`therapist.*` →
  `/therapist/*`).

### Dashboard (Unified)

Single `(dashboard)` route group for all authenticated users. Pages are gated by
**permissions**, not roles. See `docs/architecture/dashboard.md`.

---

## 3. Coding Standards

### UI & Styling

- **Component Library**: `shadcn/ui` (Radix UI) — use existing components first.
- **Animations**: `@headlessui/react` for transitions; `motion` (Framer Motion)
  for springs. Animate only `transform`/`opacity`.
- **Styling**: Tailwind CSS only. Merge with `cn()` from `@/lib/utils`.
- **Theming**: Use semantic tokens (`primary`, `accent`, `muted-foreground`).
  Never hardcode hex values. Never use `dark:` — themes handled via CSS vars.
- **Icons**: `lucide-react` (tree-shaken via `optimizePackageImports`).
- **Variants**: Use `cva` for component variants (`variant`, `size` props).
- **Patterns**:
  - `flex gap-*` over `space-x-*`/`space-y-*`
  - `size-*` when width = height
  - `cn()` for conditional classes, never template-literal ternaries

### State & Forms

- **Global State**: Zustand (`src/store/`).
- **Forms**: React Hook Form + Zod validation + `@hookform/resolvers`.

### TypeScript

- `strict: true` is enabled.
- Share types via `src/types/` or co-located with features.
- Validate external input with Zod at system boundaries.

### Quality

- **Zero tolerance** for linter errors/warnings.
- Do not introduce deprecated or insecure packages.
- Resolve all `eslint` and `tsc` issues before committing.

---

## 4. Commands

| Command                  | Purpose                           |
| ------------------------ | --------------------------------- |
| `npm run dev`            | Dev server (port 9002)            |
| `npm run build`          | Production build                  |
| `npm run lint`           | ESLint                            |
| `npm run lint:fix`       | ESLint auto-fix                   |
| `npm run typecheck`      | TypeScript check (`tsc --noEmit`) |
| `npm run check`          | lint + typecheck                  |
| `npm run format`         | Prettier                          |
| `npm run db:check`       | Test Supabase connection          |
| `npm run db:seed`        | Seed services data                |
| `npm run supabase:setup` | Full local Supabase setup         |
| `npm run supabase:reset` | Reset local DB                    |

---

## 5. Integrations

| Service        | Purpose             | Key files                                    |
| -------------- | ------------------- | -------------------------------------------- |
| **Supabase**   | DB, Auth, Storage   | `src/lib/supabase/*`, `supabase/migrations/` |
| **Stripe**     | Payments & Billing  | `src/lib/platform/integrations/stripe.ts`    |
| **Resend**     | Transactional Email | `src/lib/platform/integrations/resend.ts`    |
| **AI (multi)** | Chat & Analysis     | `server/ai/*` (OpenAI, Anthropic, Google)    |
| **Telegram**   | Bot notifications   | `server/telegram/*`                          |

---

## 6. Animation Guidelines

- **Enter/Exit**: `ease-out` curves (Quint, Expo).
- **Movement within screen**: `ease-in-out`.
- **Micro-interactions**: `200ms` duration for hovers.
- **Max duration**: <1s for all animations.
- **Springs**: Prefer `motion` spring animations for natural feel.
- **Performance**: Only animate `transform`/`opacity`. Use `will-change`
  sparingly.
- **Full spec**: See `docs/design/design-system.md` and
  `docs/design/animation-theory.md`.

---

## 7. Key Conventions Quick Reference

- **New UI component?** Check `shadcn/ui` registry first
  (`npx shadcn@latest search`).
- **New page?** Add to correct route group. Check if a permission gate is
  needed.
- **New service?** Create in `src/lib/platform/services/` or
  `server/<domain>/service.ts`.
- **New hook?** Place in `src/hooks/` (platform) or `src/marketing/hooks/`
  (marketing).
- **Database change?** Create migration in `supabase/migrations/`.
- **Supabase client?** Browser = `createClient()` singleton, Server =
  `await createClient()`.
- **New secret?** Add to `app_config` table via migration. Use config helpers
  from `src/lib/config.ts`. Never use legacy key names (`ANON_KEY`,
  `SERVICE_ROLE_KEY`).
- **File too large?** Under 300 lines preferred. Split into smaller modules.
