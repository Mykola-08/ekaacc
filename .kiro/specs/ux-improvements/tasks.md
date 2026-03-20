# Implementation Plan: UX Improvements

## Overview

Incremental implementation of the EKA Balance UX overhaul across five priority tiers: P0 critical bugs, P1 UI polish, P2 interaction quality, P3 mobile responsiveness, and P4/P5 performance. Each task builds on the previous, ending with full integration.

## Tasks

- [x] 1. P0 — Centralize permission helper
  - [x] 1.1 Ensure `src/lib/permissions.ts` exports `can(permissions: PermissionRecord[], group: string, action: string): boolean`
    - Implement the function: return `permissions.some(p => p.group === group && (p.action === action || p.action === 'manage'))`
    - Ensure return type is strictly `boolean` (not truthy/falsy)
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.2 Write property tests for `can()`
    - **Property 1: Always returns boolean** — for all inputs, `typeof can(...) === 'boolean'`
    - **Property 2: Empty permissions always returns false** — `can([], group, action) === false`
    - **Property 3: manage action grants all** — if any entry has `{ group, action: 'manage' }`, result is `true`
    - **Property 4: Pure function / idempotence** — calling twice with same args returns same result
    - **Property 5: No matching group returns false** — no entry with matching group → `false`
    - **Validates: Requirements 26.1, 26.2, 26.3, 26.4, 26.5**
  - [x] 1.3 Remove local `can` from `src/app/(dashboard)/dashboard/page.tsx` and import from `src/lib/permissions.ts`
    - _Requirements: 1.4_
  - [x] 1.4 Remove local `can` from `UnifiedDashboardShell` and import from `src/lib/permissions.ts`
    - _Requirements: 1.5_

- [x] 2. P0 — Remove dead code directories and dead props
  - [x] 2.1 Delete `src/app/dashboard-shadcn-backup/` directory
    - _Requirements: 2.1_
  - [x] 2.2 Delete `src/styles/backup/` directory
    - _Requirements: 2.2_
  - [x] 2.3 Remove `onConfirm` no-op prop from `BookingWizard` component interface and all call sites
    - _Requirements: 25.1_
  - [x] 2.4 Remove `onLoad` prop from `ConfirmStep` if `isSubmitting` state it drives has no visible UI effect; if retaining `isSubmitting`, wire it to disable the navigation footer or show a loading indicator
    - _Requirements: 25.2, 25.3_

- [x] 3. P0 — Fix BookingWizard step auto-advance and ConfirmStep navigation
  - [x] 3.1 Replace `setTimeout`-based step advance in `BookingWizard` with `useEffect` watching `selectedService`
    - Add `useEffect(() => { if (selectedService && currentStep === 1) setCurrentStep(2); }, [selectedService])`
    - _Requirements: 3.1, 3.3_
  - [x] 3.2 Replace `setTimeout`-based step advance watching `selectedTherapist` with `useEffect`
    - Add `useEffect(() => { if (selectedTherapist && currentStep === 2) setCurrentStep(3); }, [selectedTherapist])`
    - _Requirements: 3.2, 3.3_
  - [x] 3.3 Write property tests for step sequencing
    - **Property 6: Advance only when canProceed** — step only increments when selection committed
    - **Property 7: Retreat never below step 1** — back from step 1 navigates away, never sets currentStep < 1
    - **Property 8: currentStep always in [1, N]** — for Step_Config of length N
    - **Property 9: Step count equals STEPS.length** — derived count invariant
    - **Validates: Requirements 27.1, 27.2, 27.3, 27.4**
  - [x] 3.4 Replace `window.location.href` in `ConfirmStep` with `router.push('/bookings')`
    - Import `useRouter` from `next/navigation` if not already present
    - _Requirements: 12.1, 12.2_

- [x] 4. Checkpoint — Ensure all P0 tests pass, ask the user if questions arise.

- [ ] 5. P1 — Update design tokens in `globals.css`
  - [ ] 5.1 Update `:root` CSS variables: `--primary: #0071e3`, `--ring: #0071e3`, `--muted-foreground: #6e6e73`, `--radius: 0.625rem`
    - Refine `--shadow-sm` to `0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)`
    - Do NOT touch any `.marketing`-scoped styles
    - _Requirements: 8.1_
  - [ ] 5.2 Update `.dark` block: set `--primary: #0071e3` (Apple blue works in dark mode)
    - _Requirements: 8.1_

- [ ] 6. P1 — Update Card, Button, and Tabs components
  - [ ] 6.1 Update `src/components/ui/card.tsx`: `CardHeader` → `px-5 py-4`, `CardContent` → `px-5 pb-5`, `CardFooter` → `px-5 py-3 border-t border-border bg-muted/30`
    - _Requirements: 8.1_
  - [ ] 6.2 Update `src/components/ui/button.tsx` ghost variant: change `hover:bg-muted` to `hover:bg-muted/60`
    - _Requirements: 8.1_

- [ ] 7. P1 — Update `UnifiedDashboardShell`
  - [ ] 7.1 Remove `backdrop-blur-sm` from header, change `bg-background/95` to `bg-background`
    - _Requirements: 8.1_
  - [ ] 7.2 Add skip link as first child of `<SidebarInset>`: `<a href="#main-content" className="ux-skip-link">Skip to main content</a>`
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 8. P1 — Polish Dashboard page (`src/app/(dashboard)/dashboard/page.tsx`)
  - [ ] 8.1 Remove all `px-4 lg:px-6` wrappers from every section; shell provides all padding
    - _Requirements: 8.1, 8.2_
  - [ ] 8.2 Remove all gradient selectors (`*:data-[slot=card]:bg-gradient-to-t` / `*:data-[slot=card]:bg-linear-to-t`) from stats grid
    - _Requirements: 8.1_
  - [ ] 8.3 Update `DashStatsCard`: render `<div className="mt-1 h-8 w-16 animate-pulse rounded-lg bg-muted" />` when `value` is `undefined` or `null`
    - _Requirements: 15.1, 15.2_
  - [ ] 8.4 Wrap `<MoodTrendWidget>` in `<Suspense fallback={<MoodTrendSkeleton />}>` — create a minimal `MoodTrendSkeleton` inline or as a small component
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 8.5 Group independent Supabase queries with `Promise.all` where queries do not depend on each other
    - Ensure total independent queries on a single page load stays ≤ 12
    - _Requirements: 23.1, 23.2, 23.3_

- [ ] 9. P1 — Polish Bookings page (`src/app/(dashboard)/bookings/page.tsx`)
  - [ ] 9.1 Remove `px-4 lg:px-6` wrappers; remove gradient selectors from stats grid; change stats grid to `sm:grid-cols-3`
    - _Requirements: 8.1_
  - [ ] 9.2 Change page-level `<TabsList>` to `variant="line"`
    - _Requirements: 8.1_
  - [ ] 9.3 Update `BookingCard` date/time column: remove `bg-muted/30` background, add `border-l-2 border-l-primary pl-4 py-1` left accent
    - _Requirements: 8.1_

- [ ] 10. P1 — Polish Settings page (`src/app/(dashboard)/settings/settings-client.tsx`)
  - [ ] 10.1 Replace horizontal `<Tabs>` with `grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6` layout
    - Desktop: vertical `<nav>` with `rounded-lg` buttons, `bg-muted` active state
    - Mobile: horizontal scrollable `<TabsList variant="line">`
    - _Requirements: 8.1_
  - [ ] 10.2 Remove the search input from the settings header
    - _Requirements: 8.1_
  - [ ] 10.3 Change form inputs from `rounded-xl` to `rounded-lg`
    - _Requirements: 8.1_

- [ ] 11. P1 — Polish Journal page (`src/app/(dashboard)/journal/journal-client.tsx`)
  - [ ] 11.1 Replace `@xl/main:grid-cols-12` layout with `grid gap-4 lg:grid-cols-[288px_1fr]` two-panel layout
    - _Requirements: 8.1_
  - [ ] 11.2 Remove `px-4 lg:px-6` wrappers; change search input to `rounded-lg`
    - _Requirements: 8.1_

- [ ] 12. P1 — Polish Goals page (`src/app/(dashboard)/goals/goals-client.tsx`)
  - [ ] 12.1 Remove `hover:-translate-y-px` from `GoalCard`; add `hover:shadow-sm` transition
    - _Requirements: 8.1_
  - [ ] 12.2 Change `GoalCard` radius from `rounded-2xl` to `rounded-xl`
    - _Requirements: 8.1_
  - [ ] 12.3 Change progress bar from `h-2` to `h-1.5`
    - _Requirements: 8.1_

- [ ] 13. P1 — Polish Finances page (`src/app/(dashboard)/finances/page.tsx`)
  - [ ] 13.1 Remove gradient selectors from stats grid; change to `sm:grid-cols-3` flat cards
    - _Requirements: 8.1_
  - [ ] 13.2 Change page-level `<TabsList>` to `variant="line"`
    - _Requirements: 8.1_

- [ ] 14. P1 — Polish Wallet page (`src/app/(dashboard)/wallet/page.tsx`)
  - [ ] 14.1 Remove gradient (`bg-linear-to-br from-primary/5`) from balance card; replace with flat white `border-primary/20`
    - _Requirements: 8.1_
  - [ ] 14.2 Change balance amount to `text-3xl font-semibold tabular-nums`
    - _Requirements: 8.1_

- [ ] 15. P1 — Polish Community page (`src/app/(dashboard)/community/community-client.tsx` and `src/components/community/CommunityFeed.tsx`)
  - [ ] 15.1 Add `border-b border-border` to the sticky feed header
    - _Requirements: 13.1, 13.2_
  - [ ] 15.2 Replace `CardFooter bg-muted` on post cards with `border-t border-border/50 pt-3` inside card content
    - _Requirements: 8.1_
  - [ ] 15.3 Update like/comment buttons to `text-muted-foreground hover:text-primary transition-colors`
    - _Requirements: 8.1_

- [ ] 16. P1 — Polish Chat page (`src/app/(dashboard)/chat/chat-client.tsx`)
  - [ ] 16.1 Change sidebar width from `w-64` to `w-60`
    - _Requirements: 8.1_
  - [ ] 16.2 Change active channel state from `bg-primary/10 text-primary` to `bg-muted text-foreground`
    - _Requirements: 8.1_

- [ ] 17. P1 — Polish Assignments page (`src/app/(dashboard)/assignments/assignments-client.tsx`)
  - [ ] 17.1 Change cards from `rounded-2xl` to `rounded-xl`; remove `hover:-translate-y-px`; change tabs to `variant="line"`
    - _Requirements: 8.1_

- [ ] 18. P1 — Polish Resources page (`src/app/(dashboard)/resources/resources-client.tsx`)
  - [ ] 18.1 Change resource cards to `rounded-xl`; remove `hover:-translate-y-px`
    - _Requirements: 8.1_

- [ ] 19. P1 — Polish Profile page (`src/app/(dashboard)/profile/profile-client.tsx`)
  - [ ] 19.1 Change layout to `grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6`
    - _Requirements: 8.1_
  - [ ] 19.2 Change avatar to `size-20 rounded-xl`; change save button to `rounded-lg`
    - _Requirements: 8.1_

- [ ] 20. Checkpoint — Ensure all P1 visual changes render correctly, no gradient or translate classes remain on cards. Ask the user if questions arise.

- [ ] 21. P2 — BookingWizard interaction quality
  - [ ] 21.1 Define `STEPS` config array in `BookingWizard.tsx` and derive `STEPS_COUNT = STEPS.length`
    - Remove any hardcoded step count constant
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ] 21.2 Add mobile back button (`sm:hidden`) in the BookingWizard top bar
    - Step 1: calls `router.back()`; steps 2–4: calls `handleBack`
    - _Requirements: 9.1, 9.2, 9.3_
  - [ ] 21.3 Add collapsible mobile summary panel (`lg:hidden`) above the main step card with a toggle button
    - Desktop summary sidebar remains `hidden lg:block`
    - _Requirements: 20.1, 20.2, 20.3_
  - [ ] 21.4 Replace `<img>` with `next/image` `<Image>` for therapist avatars in `BookingWizard` summary sidebar
    - Fallback to `/assets/avatar-placeholder.png` when `avatar_url` is null
    - _Requirements: 5.1, 5.3_
  - [ ] 21.5 Replace `<img>` with `next/image` `<Image>` for therapist avatars in `TherapistStep`
    - Fallback to `/assets/avatar-placeholder.png` when `avatar_url` is null
    - _Requirements: 5.2, 5.3_

- [ ] 22. P2 — BookingStepIndicator and TherapistStep polish
  - [ ] 22.1 Update `BookingStepIndicator` to always show the current step label at all viewport sizes
    - Non-current labels may be hidden on mobile; current step label is always visible
    - _Requirements: 10.1, 10.2_
  - [ ] 22.2 Update `TherapistStep` to conditionally render rating only when `therapist.rating != null`
    - Remove any hardcoded 5-star fallback
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 23. P2 — DateTimeStep and AIDailySummary error recovery
  - [ ] 23.1 Add error recovery UI to `DateTimeStep`: when slot fetch fails, show descriptive error message and a "Retry" button that re-calls `fetchSlots`
    - Use the empty-state pattern: `rounded-xl border border-dashed py-10`
    - _Requirements: 17.1, 17.2, 17.3_
  - [ ] 23.2 Update `AIDailySummary` error state: replace generic message with "Could not load your daily briefing" and add a "Try again" button that re-triggers the fetch
    - _Requirements: 18.1, 18.2, 18.3_

- [ ] 24. P2 — Community optimistic likes and pagination
  - [ ] 24.1 Implement optimistic like toggle in `CommunityFeed`: update local state immediately, revert and show `toast.error` on server failure
    - _Requirements: 16.1, 16.2_
  - [ ] 24.2 Implement pagination in `CommunityFeed`: load 20 posts per page, append on "Load more", show end-of-feed message when exhausted
    - Post count badge uses channel's `post_count` field, not `posts.length`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ] 24.3 Add `inputMode="text"` and `autoComplete="off"` to the community comment input
    - _Requirements: 22.1, 22.2_

- [ ] 25. Checkpoint — Ensure all P2 interaction changes work end-to-end in automated tests. Ask the user if questions arise.

- [ ] 26. P3 — Mobile responsiveness
  - [ ] 26.1 Update `DateTimeStep` mobile layout: stack calendar and time slots vertically on mobile (`flex-col` below `sm`), time slots immediately below calendar with minimal gap
    - _Requirements: 21.1, 21.2_

- [ ] 27. P4/P5 — Performance and code quality
  - [ ] 27.1 Add `next/dynamic` import with `{ ssr: false }` for the Plate editor at all usage sites (journal, any other page using the editor)
    - Render a skeleton/loading indicator while the editor loads
    - _Requirements: 24.1, 24.2_
  - [ ] 27.2 Validate mood scores in `MoodTrendWidget`: filter out entries where `score < 1 || score > 5` before computing the trend
    - _Requirements: 28.1, 28.2, 28.3_
  - [ ] 27.3 Write property tests for mood score validation
    - **Property 10: Out-of-range scores excluded** — entries with score outside [1,5] never appear in trend data
    - **Property 11: Average of valid entries in [1,5]** — computed average is always within valid range
    - **Validates: Requirements 28.2, 28.3**

- [ ] 28. Final checkpoint — Ensure all tests pass and no regressions in P0–P5 changes. Ask the user if questions arise.
