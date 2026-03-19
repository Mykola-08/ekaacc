# EKA Platform

Mental health & wellness platform — AI-powered insights, therapist booking,
personalized care.

**Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Supabase ·
Stripe · Resend

---

## Quick Start

```bash
# Prerequisites: Node.js ≥22, npm ≥10
git clone https://github.com/Mykola-08/ekaacc.git && cd ekaacc
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                   # → http://localhost:9002
```

### Local Supabase (optional)

```bash
npx supabase start
npm run supabase:setup
```

---

## Project Structure

```
ekaacc/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, signup
│   │   ├── (booking)/          # Booking flow
│   │   ├── (dashboard)/        # All authenticated pages (permission-gated)
│   │   ├── (marketing)/        # Public marketing & SEO pages
│   │   ├── (platform)/         # Webhooks, cron, email, uploads
│   │   ├── actions/            # Server actions
│   │   └── api/                # API routes
│   ├── components/             # React components (ui/, admin/, ai/, booking/, etc.)
│   ├── context/                # React contexts (Language, Features)
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utils, Supabase clients, platform services
│   ├── marketing/              # Marketing-specific components, hooks, contexts
│   ├── store/                  # Zustand stores
│   └── types/                  # Shared type definitions
├── server/                     # Server-side business logic (ai/, booking/, payment/, etc.)
├── supabase/                   # Migrations, edge functions, email templates
├── scripts/                    # Utility scripts
├── docs/                       # Documentation (see docs/README.md)
└── public/                     # Static assets
```

### Path Aliases

| Alias           | Maps to             |
| --------------- | ------------------- |
| `@/*`           | `./src/*`           |
| `@/server/*`    | `./server/*`        |
| `@/marketing/*` | `./src/marketing/*` |

---

## Architecture

```
Client Component → Server Action → Service Layer → Supabase / Stripe / Resend
```

- **Service Layer**: All business logic in `server/*/service.ts` or
  `src/lib/platform/services/*.ts`.
- **Server Actions**: Thin wrappers calling service functions.
- **Permissions**: Role-based with per-user overrides. One `(dashboard)` route
  group for all roles, gated by permissions.
- **Auth**: Supabase Auth + cookie-based sessions refreshed in middleware.

### Supabase Clients

| Context | Import                  | Pattern             |
| ------- | ----------------------- | ------------------- |
| Browser | `@/lib/supabase/client` | Singleton           |
| Server  | `@/lib/supabase/server` | Async (per-request) |
| Admin   | `@/lib/supabase/admin`  | Service key         |

---

## Recent Feature Highlights

- **Community engagement & moderation**
  - Threaded replies (`parent_id`) and post reactions (`reactions`) are now
    supported in dashboard community flows.
  - End users can report posts with reason/details.
  - Admins can review reports in `/admin/community` and move them through
    `open → reviewing → resolved/dismissed` states.
  - Report status updates are protected by both app-level admin checks and
    Supabase RLS admin update policies.
- **Saved resources**
  - Users can save/unsave resources and filter resources by saved state.
  - Server actions: `getSavedResourceIds`, `toggleSavedResource`.
- **Goals & onboarding**
  - Goal progress history snapshots are written on updates and surfaced in the
    goals UI.
  - Onboarding is a multi-step flow that captures profile context and seeds
    initial goals.
- **Dashboard AI & mood context**
  - Added a mood trend widget and background AI prefetch trigger to improve
    perceived responsiveness for insights workflows.

---

## Commands

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

### Migrations for recent features

If you are syncing a local database for community/resource/onboarding changes,
ensure these migrations are applied:

- `supabase/migrations/20260318000003_onboarding_and_goal_history.sql`
- `supabase/migrations/20260318000004_saved_resources.sql`
- `supabase/migrations/20260319000005_community_reactions_and_threading.sql`
- `supabase/migrations/20260319000006_community_reports.sql`
- `supabase/migrations/20260319000007_community_reports_admin_update_policy.sql`

### Re-import repository state

If you need to continue work from a clean/latest local state:

```bash
git fetch --all --prune
git reset --hard origin/main   # or origin/<your-branch>
npm install
```

Use `git stash` first if you need to preserve uncommitted local changes.

---

## Integrations

| Service        | Purpose            | Key files                                    |
| -------------- | ------------------ | -------------------------------------------- |
| **Supabase**   | DB, Auth, Storage  | `src/lib/supabase/*`, `supabase/migrations/` |
| **Stripe**     | Payments & Billing | `src/lib/platform/integrations/stripe.ts`    |
| **Resend**     | Email              | `src/lib/platform/integrations/resend.ts`    |
| **AI (multi)** | Chat & Analysis    | `server/ai/*` (OpenAI, Anthropic, Google)    |
| **Telegram**   | Bot notifications  | `server/telegram/*`                          |

---

## Deployment

```bash
npm i -g vercel
vercel login
vercel --prod
```

Required env vars for production: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `POSTGRES_URL`.
All other secrets (Stripe, Resend, etc.) are loaded from the `app_config` table.

---

## Documentation

See [docs/README.md](docs/README.md) for full documentation index.

---

## License

MIT
