# EKA SEO Website - AI Coding Instructions

## Project Overview
This is a full-stack application built with **Next.js** (Frontend) and **Cloudflare Workers** (Backend).
- **Frontend:** `src/app` (Next.js App Router). Legacy components reside in `src/react-app`.
- **Backend:** `src/worker` (Hono, Cloudflare D1, R2, Vercel Blob)
- **Shared:** `src/shared` (Types, Zod schemas)
- **Database:** Cloudflare D1 (SQLite) for data, Supabase for Authentication.
- **Deployment:** Vercel.

## Architecture & Patterns

### 1. Frontend (Next.js)
- **Entry Point:** `src/app/layout.tsx`
- **Routing:** Next.js App Router. Routes defined in `src/app`.
- **Styling:** Tailwind CSS. Use utility classes.
- **Animations:** Framer Motion (`framer-motion`).
- **Icons:** Lucide React (`lucide-react`) and Phosphor React (`phosphor-react`).
- **State Management:** React Context (`LanguageContext`, `SupabaseAuthContext`, `BookingProvider`).
- **Internationalization (i18n):**
  - Managed via `LanguageContext` in `src/react-app/contexts/LanguageContext.tsx`.
  - **CRITICAL:** All UI text must be translatable. Add keys to the `translations` object in `LanguageContext.tsx` for **Catalan (ca), English (en), Spanish (es), and Russian (ru)**.
  - Usage: `const { t } = useLanguage(); ... {t('key.name')}`.
- **Components:** New components go in `src/app/components`. Legacy components are in `src/react-app/components` and should be migrated or imported from there.

### 2. Backend (Cloudflare Workers + Hono)
- **Framework:** Hono (`hono`).
- **Entry Point:** `src/worker/index.ts`.
- **Database:** Cloudflare D1 (SQLite). Accessed via `env.DB`.
- **Storage:** 
  - Cloudflare R2 (`env.R2_BUCKET`).
  - Vercel Blob (`env.BLOB_READ_WRITE_TOKEN`).
- **Validation:** Use `zod` and `@hono/zod-validator`.
- **AI Integration:** OpenAI and Perplexity APIs are configured in bindings.

### 3. Shared Code
- **Location:** `src/shared/types.ts`.
- **Pattern:** Define Zod schemas here and export inferred types.
- **Usage:** Import these types in both frontend and `src/worker` to ensure type safety across the network boundary.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (Runs Next.js).
- **Build:** `npm run build` (Runs `next build`).
- **Lint:** `npm run lint`.
- **Database Migrations:** SQL files are in `migrations/`. Use Wrangler to apply them (e.g., `npx wrangler d1 migrations apply`).

## Coding Conventions
- **Imports:** Use the `@` alias to refer to the `src` directory (e.g., `import { ... } from "@/shared/types"`).
- **Types:** Prefer strict TypeScript types. Avoid `any`.
- **Component Structure:** Keep components small and focused.
- **Auth:** Use `useSupabaseAuth` hook for accessing user session and auth state.

## Key Files
- `wrangler.json`: Cloudflare Worker configuration (D1, R2 bindings).
- `next.config.mjs`: Next.js configuration.
- `src/react-app/contexts/LanguageContext.tsx`: Core i18n logic and translations.
- `src/worker/index.ts`: Backend API routes.
- `src/app/layout.tsx`: Main application layout.
