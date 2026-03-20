# Implementation Plan: UI/UX Unification

## Overview

Systematically unify the design language across the entire application to achieve a premium shadcn/Notion/Linear-style aesthetic. Work proceeds from design tokens outward to components, then layouts, then flows — ensuring each layer builds on a solid foundation.

## Tasks

- [x] 1. Design token standardization in `globals.css`
  - Refine `--radius` to `0.5rem` (already set) and audit all radius scale values (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`) for Maya-style consistency
  - Tighten shadow tokens: replace `--apple-shadow*` aliases with a clean `--shadow-xs` / `--shadow-sm` / `--shadow-md` / `--shadow-lg` / `--shadow-xl` scale; remove duplicate `--apple-shadow` / `--apple-shadow-hover` / `--apple-shadow-large` variables
  - Refine light-mode color tokens: `--border` to `oklch(0.92 0 0)`, `--input` to `oklch(0.94 0 0)`, `--card` to `#FFFFFF`, `--background` to `oklch(0.985 0 0)` for a cleaner canvas
  - Refine dark-mode color tokens: ensure `--border`, `--input`, `--card`, `--sidebar` values produce a premium dark surface hierarchy
  - Add `--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.04)` and update `app-shell-card`, `card`, `apple-card` component classes to use the new shadow scale
  - Ensure `@theme` block maps all new shadow tokens as `--shadow-*` custom properties
  - _Requirements: 1.1, 1.4, 1.5, 8.1, 8.3, 9.1, 9.2_

- [x] 2. Button component unification (`src/components/ui/button.tsx`)
  - Change base class from `rounded-4xl` to `rounded-lg` (Maya style — `var(--radius)`)
  - Verify all size variants (`xs`, `sm`, `default`, `lg`, `icon-*`) have correct height, padding, and gap values matching the design spec
  - Ensure `destructive` variant uses `bg-destructive text-destructive-foreground` (solid) rather than the current `bg-destructive/10` tint for stronger visual signal
  - Confirm `focus-visible:ring-[3px] focus-visible:ring-ring/50` is present on all variants
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 3.9_

- [x] 3. Input component unification (`src/components/ui/input.tsx`)
  - Change `rounded-4xl` to `rounded-lg` in the input className
  - Change `bg-input/30` to `bg-transparent` for a cleaner field appearance
  - Ensure `border-input` uses the refined border token from task 1
  - Verify `focus-visible:ring-[3px] focus-visible:ring-ring/50` focus ring is present
  - _Requirements: 5.1, 5.2, 5.3, 5.7_

- [x] 4. Textarea and Select unification (`src/components/ui/textarea.tsx`, `src/components/ui/select.tsx`)
  - Audit textarea for `rounded-4xl` usage; replace with `rounded-lg`
  - Audit select trigger for `rounded-4xl` usage; replace with `rounded-lg`
  - Ensure consistent `h-9` height on select trigger to match input height
  - Verify focus ring and border tokens match the unified input style from task 3
  - _Requirements: 5.1, 5.2, 5.6_

- [x] 5. Card component refinement (`src/components/ui/card.tsx`)
  - Change `rounded-2xl` to `rounded-xl` on the base `Card` for a slightly tighter Maya radius
  - Replace `ring-1 ring-foreground/10` with `border border-border` for consistent border treatment
  - Add `shadow-xs` (from task 1 token) as default elevation; remove the ring-based shadow
  - Add `transition-shadow duration-200` and `hover:shadow-sm` for interactive cards
  - Ensure `CardHeader`, `CardFooter` border-radius sub-classes (`rounded-t-xl`, `rounded-b-xl`) match the new parent radius
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

- [x] 6. Checkpoint — base tokens and atoms
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Dashboard layout shell refinement (`src/components/dashboard/layout/UnifiedDashboardShell.tsx`)
  - Refine the `<header>` element: add `bg-background/95 backdrop-blur-sm` for a clean sticky header feel
  - Ensure header border uses `border-border` (updated token from task 1) rather than a hardcoded value
  - Tighten header height to `h-12` (48px) for a more compact, Linear-style header
  - Ensure `<main>` content area has consistent `p-4 md:p-6` padding applied via a wrapper div
  - _Requirements: 7.1, 7.2, 7.3, 12.1_

- [x] 8. Sidebar refinement (`src/components/dashboard/layout/UnifiedSidebar.tsx`)
  - Ensure `Sidebar` uses `variant="inset"` with `bg-sidebar` background and `border-r border-border` border
  - Refine brand logo block: ensure `rounded-lg` on the icon container (not `rounded-xl`)
  - Ensure `SidebarMenuButton` active state uses `bg-sidebar-accent text-sidebar-accent-foreground` with `rounded-lg`
  - Ensure `SidebarGroupLabel` uses `text-xs font-medium text-muted-foreground uppercase tracking-wider` for clean section labels
  - Ensure `NavUser` avatar uses `rounded-lg` (not `rounded-full`) for consistency with shadcn dashboard pattern
  - _Requirements: 12.2, 12.5, 12.6, 12.7_

- [x] 9. Breadcrumb and navigation refinement (`src/components/ui/breadcrumb.tsx`)
  - Audit breadcrumb item styles: ensure active item uses `text-foreground font-medium` and inactive uses `text-muted-foreground hover:text-foreground`
  - Ensure separator uses `text-muted-foreground/50` for a subtle divider
  - Verify consistent `text-sm` sizing across all breadcrumb items
  - _Requirements: 12.3, 12.7_

- [x] 10. Booking flow unification (`src/components/booking/BookingWizard.tsx` and step components)
  - Replace `rounded-full` on navigation buttons (`Back`, `Continue`) with `rounded-lg` to match unified button style
  - Replace `rounded-2xl` on `Card` wrappers with `rounded-xl` (matching task 5 card update)
  - Ensure the top bar uses `bg-background border-b border-border` (no `/60` opacity on border)
  - Ensure the loading state uses the unified `Skeleton` component (task 12) instead of a spinner-only state
  - Audit `BookingStepIndicator`, `ServiceStep`, `TherapistStep`, `DateTimeStep`, `ConfirmStep` for any `rounded-full` or `rounded-4xl` on non-pill elements; replace with `rounded-lg`
  - _Requirements: 3.10, 4.9, 5.10_

- [x] 11. Dashboard section cards refinement (`src/components/section-cards.tsx`)
  - Remove the `*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5` gradient override — use flat `bg-card` for a cleaner premium look
  - Replace `*:data-[slot=card]:shadow-xs` with the new `shadow-xs` token from task 1
  - Ensure `CardTitle` stat numbers use `text-2xl font-semibold tabular-nums` (already correct — verify no regressions after card task 5)
  - _Requirements: 4.1, 4.7, 4.9_

- [x] 12. Loading states and skeleton unification (`src/components/ui/skeleton.tsx`, `src/components/ui/spinner.tsx`, `src/components/ui/loading-states.tsx`)
  - Change `Skeleton` base class from `rounded-xl` to `rounded-md` for a tighter, more neutral placeholder shape
  - Audit `spinner.tsx` and `loading-states.tsx` for size variants (`sm`, `md`, `lg`) — ensure all use semantic color tokens (`text-muted-foreground`, `text-primary`) rather than hardcoded colors
  - Ensure skeleton animation uses `animate-pulse` with `bg-muted` (already correct — verify dark mode renders correctly with updated `--muted` token)
  - _Requirements: 15.1, 15.2, 15.4, 15.5, 15.6_

- [x] 13. Toast / notification styling unification (`src/components/ui/sonner.tsx`, `src/components/ui/morphing-toaster.tsx`)
  - In `sonner.tsx`: update `--border-radius` CSS var to use `var(--radius-lg)` (from task 1 refined tokens) instead of `var(--radius)`
  - Ensure `--normal-bg`, `--normal-border` reference the updated card/border tokens
  - Audit `morphing-toaster.tsx` for any hardcoded `rounded-*` values; replace with `rounded-lg` or `rounded-xl` as appropriate
  - Ensure success/error/warning/info icon colors use semantic tokens (`text-success`, `text-destructive`, `text-warning`, `text-info`)
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 14. Form components unification (`src/components/ui/form.tsx`, `src/components/ui/label.tsx`, `src/components/ui/field.tsx`)
  - Ensure `Label` uses `text-sm font-medium text-foreground` with `mb-1.5` spacing below
  - Ensure `FormMessage` (error state) uses `text-sm text-destructive` with consistent spacing
  - Ensure `FormDescription` uses `text-sm text-muted-foreground`
  - Audit `field.tsx` for any inconsistent spacing or radius values; align with task 3 input styles
  - _Requirements: 5.4, 5.5, 5.8_

- [x] 15. Checkpoint — components and layouts
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Dark mode consistency pass
  - Audit `globals.css` `.dark` block: ensure `--card`, `--popover`, `--sidebar` form a clear 3-level surface hierarchy (background → card → elevated)
  - Ensure `--shadow-*` tokens in dark mode use `rgb(0 0 0 / 0.3+)` opacity for visible elevation
  - Audit `app-shell-card`, `glass-panel`, `apple-card-glass` component classes for dark mode correctness
  - Verify `border-border` renders visibly in dark mode with the updated `--border: oklch(0.25 0 0)` token
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.6_

- [x] 17. Typography system cleanup (`globals.css` `@layer components`)
  - Consolidate duplicate heading utilities: ensure `apple-headline`/`heading-1`, `apple-title`/`heading-2`, `apple-subtitle`/`heading-3` are aliases pointing to the same styles (no divergence)
  - Ensure `text-balance` is applied to all heading utilities via `text-wrap: balance`
  - Audit `dashboard-header-title` class: align to `text-base font-semibold tracking-tight` for consistency with Linear-style headers
  - Remove or consolidate `apple-large-title` if unused outside marketing context
  - _Requirements: 6.1, 6.2, 6.7, 6.9_

- [x] 18. Utility class and globals cleanup (`globals.css`)
  - Remove the `--apple-shadow`, `--apple-shadow-hover`, `--apple-shadow-large` CSS variables from `:root` (replaced by task 1 shadow scale)
  - Consolidate `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-outline` CSS component classes — these are now superseded by the unified `Button` component (task 2); add a deprecation comment pointing to `<Button>` component
  - Ensure `app-shell-card` uses `rounded-xl` (not `rounded-2xl`) to match the updated card radius from task 5
  - Verify `dashboard-nav-item` uses `rounded-lg` (already `var(--radius)`) — confirm no regression
  - _Requirements: 1.8, 22.6, 25.7_

- [x] 19. Final checkpoint — full pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Work proceeds token → atom → molecule → layout → flow to avoid rework
- The `.marketing` wrapper in `globals.css` intentionally overrides base tokens — do not modify marketing-scoped styles unless explicitly targeting marketing pages
- All `rounded-4xl` → `rounded-lg` changes are the single highest-impact visual unification step
- Dark mode pass (task 16) should be done after all component changes are complete
