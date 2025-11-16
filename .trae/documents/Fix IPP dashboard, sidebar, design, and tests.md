## Scope
- Stabilize dashboard and sidebar, resolve design inconsistencies, and fix all runtime/unit-test errors.
- Enforce Inter font and remove forbidden mentions and stacks.
- Harden data layer for counters and transactions.

## Diagnostics
- Run `npm run typecheck` and `npm run lint` to surface TypeScript/ESLint issues.
- Run `npm test` to collect failing suites (focus: `src/__tests__/enhanced-data-service.test.ts`).
- Perform `next build` to catch compile-time errors only visible in production.
- Review dev server logs; current logs show repeated `404` for `/@vite/client` alongside Next/Turbopack requests, indicating a leftover Vite client reference. Remove any Vite-specific client script usage.

## Font & Forbidden Words
- Enforce Inter everywhere and remove forbidden mentions:
  - Replace `-apple-system` in `src/app/layout.tsx:38` with only `Inter, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`.
  - Remove any occurrences of the word `apple` in code/comments/strings flagged by search in:
    - `src/app/layout.tsx`
    - `src/app/globals-premium.css`
    - `src/components/eka/app-header.tsx`
    - `src/components/eka/ai-behavioral-insights.tsx`
    - `src/components/DashboardView.tsx`
    - `src/app/(app)/messages/page.tsx`
    - `src/app/(app)/goals/page.tsx`
    - `src/app/(app)/verificator/page.tsx`
    - `src/styles/role-based-design-system.css`
- Keep Inter defined in Tailwind (`tailwind.config.ts`) and CSS vars (`globals-minimal.css`).

## Tailwind & Theme Fixes
- Fix invalid `borderRadius` values in `tailwind.config.ts:103-106` (remove stray backticks so values are valid CSS `calc()` strings).
- Validate `darkMode: ['class','class']` and reduce to single `class` if necessary.
- Confirm `content` globs cover all component locations, including `keep-react` primitives (already present).

## Data Layer Reliability
- Replace unsupported `supabase.sql` template usage for atomic increments in `src/services/enhanced-data-service.ts`:
  - Implement Postgres RPC functions (e.g., `increment_post_likes`, `increment_post_views`) and call via `supabase.rpc(...)` for atomicity.
  - Alternatively, when RPC cannot be added, perform safe read-modify-write within `executeTransaction` using row locks or optimistic checks.
- Keep all validations and error logging; ensure methods return consistent types matching `Database` types.

## Dashboard & Sidebar Consistency
- Standardize UI primitives:
  - Prefer shadcn/ui components (`src/components/ui/*`) for form controls, cards, dialogs.
  - Use `keep-react` only where already integrated and visually consistent; otherwise migrate usages to shadcn equivalents.
- Audit sidebar components:
  - `src/components/ui/sidebar.tsx`, `src/components/navigation/dynamic-sidebar.tsx`, `src/components/eka/app-sidebar.tsx`, `src/components/eka/therapist-sidebar.tsx`
  - Align spacing, typography (`font-sans`, heading classes), and active-item styles with Inter-driven theme.
- Verify RBAC-driven visibility (
  `src/lib/navigation-config.ts`, `src/lib/permission-service.ts`) matches expected roles; fix mismatches that cause items to "show everything".

## Tests & Type Safety
- Ensure Jest setup aligns with Next 16 / React 19 (`jest.config.js` already uses `next/jest`).
- Update mocks to reflect data layer changes (RPC usage) without altering test intent.
- Expand tests for sidebar RBAC and dashboard routing rendering paths.

## Runtime Config
- Review `next.config.ts` for experimental `optimizePackageImports` and image domains; keep settings stable.
- Confirm environment variables for Supabase are present and correctly typed (`src/lib/supabase`).

## Verification
- Type-check clean: `npm run typecheck` passes.
- Unit tests: `npm test` green across suites.
- Build: `next build` succeeds.
- Manual QA:
  - Dashboard renders correctly per role (patient/therapist/admin).
  - Sidebar shows only permitted entries; active states and collapse behaviors work.
  - Community counters (likes/views) increment without errors.
- Visual: Inter font applied globally, no forbidden words.

## Deliverables
- A single diff updating referenced files:
  - `src/app/layout.tsx` (font stack fix)
  - `tailwind.config.ts` (radius values)
  - `src/services/enhanced-data-service.ts` (increment logic)
  - Sidebar/Dashboard style tweaks in their components as needed
  - Removal of forbidden word occurrences in listed files
- Test updates ensuring stable CI.

If you approve, I’ll implement these changes, run tests/build, and share the diff and verification results.