# Design Document: UX Improvements

## Overview

This document describes the technical design for a comprehensive visual and UX overhaul of the EKA Balance mental health platform. The goal is a white, clean, minimalist, premium interface — Apple.com meets Linear.app meets a high-end wellness product.

Every page should feel uncluttered, well-organized, and consistent. The design eliminates visual noise: no gradients on cards, no mixed spacing, no random border-radius values, no `hover:-translate-y-px` micro-animations.

The initiative covers five priority tiers:
- **P0** — Critical bugs and dead code removal
- **P1** — Premium minimalist UI polish (design tokens, component system, all pages)
- **P2** — Interaction quality (auto-advance, error recovery, optimistic updates)
- **P3** — Mobile responsiveness (booking wizard, calendar, summary panel)
- **P4/P5** — Performance and code quality (dynamic imports, query grouping, dead props)

All changes are CSS/JSX only. No new dependencies. Existing `.marketing`-scoped styles in `globals.css` are untouched.

---

## Architecture

The platform is a Next.js 16 App Router application. All dashboard pages are wrapped by `UnifiedDashboardShell`, which renders the `UnifiedSidebar` (shadcn `<Sidebar>`) and a `<SidebarInset>` containing the header and main content area.

```
UnifiedDashboardShell
├── SidebarProvider
│   ├── UnifiedSidebar          ← sidebar nav, logo, user block
│   └── SidebarInset
│       ├── <header h-12>       ← breadcrumbs, notifications, AI toggle
│       └── <main id="main-content">
│           └── <div p-4 md:p-6>
│               └── {children} ← page content
```

Design changes flow through three layers:

1. **Token layer** — `src/styles/globals.css` `:root` variables
2. **Component layer** — shadcn/ui primitives (`Card`, `Button`, `Tabs`, `Badge`, etc.)
3. **Page layer** — individual page files and client components

The shell's `p-4 md:p-6` wrapper on `<main>` provides all horizontal and vertical padding. Pages must not add their own `px-4 lg:px-6` wrappers — those are removed as part of this initiative.

---

## Components and Interfaces

### Design Token Changes (`globals.css`)

The following `:root` tokens are updated. The `.marketing` block is not touched.

```css
/* BEFORE → AFTER */
--primary: #4DAFFF          → #0071e3   /* Apple Blue */
--ring: #4DAFFF             → #0071e3
--muted-foreground: #999999 → #6e6e73   /* Apple Gray */
--radius: 0.5rem            → 0.625rem

/* Shadow refinement */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.04);   /* unchanged */
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04);
```

Dark mode: `--primary` stays `#0071e3` in `.dark` (Apple blue works in dark too). Update the `.dark` block accordingly.

The radius scale derives from `--radius: 0.625rem`:
- `--radius-sm`: `calc(0.625rem - 4px)` = `0.375rem`
- `--radius-md`: `calc(0.625rem - 2px)` = `0.5rem`
- `--radius-lg`: `0.625rem`
- `--radius-xl`: `calc(0.625rem + 4px)` = `0.875rem`
- `--radius-2xl`: `calc(0.625rem + 8px)` = `1.125rem`

These are already computed via the `@theme` block — only `--radius` needs updating.

---

### Shell (`UnifiedDashboardShell`)

**Current issues:**
- Header uses `backdrop-blur-sm` — remove it (too heavy, inconsistent)
- No skip link rendered
- `bg-background/95` on header — simplify to `bg-background`

**Target header:**
```tsx
<header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background transition-[width,height] ease-linear">
```

**Skip link** — render as first child of `<SidebarInset>`, before the header:
```tsx
<a href="#main-content" className="ux-skip-link">Skip to main content</a>
```

The `.ux-skip-link` class already exists in `globals.css` with the correct visually-hidden + focus-reveal behavior.

**Main content wrapper** — already correct at `p-4 md:p-6`. No change needed.

---

### Sidebar (`UnifiedSidebar`)

The sidebar uses shadcn's `<Sidebar>` primitive. Visual changes:

```
Logo block:
  - rounded-lg bg-primary text-primary-foreground  (Apple blue, not rounded-full)
  - Brand name: font-semibold tracking-tight

Section labels (SidebarGroupLabel):
  - text-xs uppercase tracking-wider text-muted-foreground  ← already correct

Nav items (SidebarMenuButton):
  - h-9 rounded-lg
  - active: bg-muted font-medium text-foreground
  - icons: size-4 text-muted-foreground (active: text-foreground)

User block (NavUser):
  - Avatar: rounded-lg (not rounded-full)
  - Name: font-medium text-sm
  - Role label: text-xs text-muted-foreground
```

The sidebar background is `bg-background` (white) with `border-r border-border`. This is already set via `--sidebar: oklch(0.985 0 0)` which matches `--background`.

---

### Card System

The `Card` component in `src/components/ui/card.tsx` already has `rounded-xl border border-border bg-card shadow-xs hover:shadow-sm`. The following adjustments are needed:

**CardHeader padding:** Change from `px-6` to `px-5 py-4`
**CardContent padding:** Change from `px-6` to `px-5 pb-5`
**CardFooter:** `px-5 py-3 border-t border-border bg-muted/30`

```tsx
// Card — no change to base classes needed (rounded-xl, border-border, shadow-xs already correct)

// CardHeader
className="px-5 py-4 ..."

// CardContent
className="px-5 pb-5"

// CardFooter
className="px-5 py-3 border-t border-border bg-muted/30"
```

**Stat Cards** — flat white, no gradients:
```tsx
<Card>
  <CardContent className="p-4">
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
  </CardContent>
</Card>
```

Accent variant adds `border-primary/20` to the Card and `text-primary` to the value only.

Remove all `*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5` class selectors from page files.

---

### Button System

The `Button` component already uses `rounded-lg` as its base. Verify all usages:
- Primary: `bg-primary text-white rounded-lg h-9` — Apple blue via token
- Outline: `border-border bg-transparent rounded-lg h-9`
- Ghost: `hover:bg-muted/60 rounded-lg` (update ghost variant hover from `hover:bg-muted` to `hover:bg-muted/60`)
- Destructive: `bg-destructive text-white rounded-lg`

No `rounded-xl` or `rounded-full` on buttons (except filter chips which are intentionally pill-shaped).

---

### Tabs System

The `Tabs` component supports `variant="line"` and `variant="default"` (pill). Usage rules:

- **Page-level tabs** (Bookings, Finances, Wellness, Assignments, Resources): `variant="line"`
- **In-card small tab switches**: `variant="default"` (pill)

```tsx
// Page-level
<TabsList variant="line">
  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
  <TabsTrigger value="past">History</TabsTrigger>
</TabsList>

// In-card
<TabsList>  {/* default pill */}
  <TabsTrigger value="week">Week</TabsTrigger>
  <TabsTrigger value="month">Month</TabsTrigger>
</TabsList>
```

---

### Badge System

All badges use semantic variants: `success`, `warning`, `destructive`, `info`, `secondary`, `outline`, `default`.

No custom inline color classes on badges. Size is always `text-xs`. Badges always include text (color is never the sole indicator).

---

### Empty State Pattern

Consistent across all pages:

```tsx
<div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
    <Icon className="size-6 text-muted-foreground/50" />
  </div>
  <div>
    <p className="text-sm font-medium">No {items} yet</p>
    <p className="text-xs text-muted-foreground mt-0.5">Descriptive message</p>
  </div>
  <Button size="sm" className="rounded-lg gap-1.5">CTA</Button>
</div>
```

The icon well uses `rounded-xl bg-muted` (not `rounded-full`). The CTA button is optional — only include when a primary action resolves the empty state.

---

## Data Models

No new data models are introduced. This initiative is purely CSS/JSX. The following existing data shapes are referenced:

- `Profile` — `{ id, full_name, bio, avatar_url, phone, role }`
- `Booking` — `{ id, starts_at, ends_at, status, service_name, location_type, meeting_url, therapist, client }`
- `Goal` — `{ id, title, description, category, progress_percentage, status, is_achieved, target_date }`
- `JournalEntry` — `{ id, title, content, mood, mood_score, tags, created_at }`
- `MoodEntry` — `{ id, score, logged_at, user_id }` — score must be in `[1, 5]`
- `WalletTransaction` — `{ id, amount_cents, type, description, created_at, balance_after_cents }`
- `PermissionRecord` — `{ group: string, action: string }`

The `can()` permission helper is centralized in `src/lib/permissions/permissions.ts` (or the existing `src/lib/permissions/actions.ts` — the exact path is determined during implementation). Its signature:

```ts
export function can(
  permissions: PermissionRecord[],
  group: string,
  action: string
): boolean {
  return permissions.some(
    (p) => p.group === group && (p.action === action || p.action === 'manage')
  );
}
```

This function is pure: no side effects, deterministic, always returns `boolean`.

---

## Page-by-Page Design

### Typography Scale

Applied consistently across all pages:

| Role | Classes |
|------|---------|
| Page title | `text-xl font-semibold tracking-tight` |
| Page subtitle | `text-sm text-muted-foreground` |
| Section label | `text-xs font-medium uppercase tracking-wider text-muted-foreground` |
| Card title | `text-sm font-semibold` (not `text-base`) |
| Card description | `text-xs text-muted-foreground` |
| Body | `text-sm text-foreground` |
| Caption | `text-xs text-muted-foreground` |
| Stat number | `text-2xl font-semibold tabular-nums` |
| Large stat | `text-3xl font-semibold tabular-nums` |

### Spacing Rules

| Context | Value |
|---------|-------|
| Page gap (between major sections) | `gap-6` |
| Card internal gap | `gap-4` |
| Form field gap | `gap-4` |
| List item gap | `gap-2` or `divide-y` |
| Icon + text gap | `gap-2` |
| Button icon gap | `gap-1.5` |

### Page Layout Pattern

Every page follows this exact structure (shell provides all padding):

```tsx
<div className="flex flex-col gap-6">
  {/* Page header */}
  <div className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Page Title</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">Subtitle</p>
    </div>
    {/* Optional CTA */}
  </div>

  {/* Content sections */}
</div>
```

No `px-4 lg:px-6` wrappers inside pages — the shell's `p-4 md:p-6` handles all padding.

---

### Dashboard (`/dashboard`)

**Changes:**
- Remove all `px-4 lg:px-6` wrappers from every section
- Welcome banner: `text-xl font-semibold tracking-tight`, streak moves to a small `<Badge>` next to the greeting
- AI widgets grid: `grid-cols-1 lg:grid-cols-3` — `AIDailySummary` spans `lg:col-span-2`
- Stats cards: flat white, remove any gradient selectors
- Appointments card: keep the `h-9 w-1 rounded-full bg-primary` left accent bar
- Wrap `<MoodTrendWidget>` in `<Suspense fallback={<MoodTrendSkeleton />}>`
- `DashStatsCard`: render skeleton when `value` is `undefined` or `null`

```tsx
// DashStatsCard skeleton
{value == null ? (
  <div className="mt-1 h-8 w-16 animate-pulse rounded-lg bg-muted" />
) : (
  <p className={cn('text-2xl font-semibold tabular-nums', accent && 'text-primary')}>{value}</p>
)}
```

---

### Bookings (`/bookings`)

**Changes:**
- Stats row: 3 flat white cards. Upcoming card: `border-primary/20`, value `text-primary`. Others: plain white.
- Tabs: `variant="line"`
- `BookingCard` date/time column: remove `bg-muted/30` background. Replace with `border-l-2 border-l-primary` left accent:

```tsx
<div className="flex flex-col gap-1 border-l-2 border-l-primary pl-4 py-1 shrink-0 w-32">
  <span className="text-sm font-semibold">{formatDate(b.starts_at)}</span>
  <span className="text-xs text-muted-foreground tabular-nums">{formatTime(b.starts_at)}</span>
</div>
```

- Past bookings: `divide-y divide-border` list rows, no card wrapper per row (already uses `PastBookingRow` divs — keep that pattern, remove the `border` wrapper and use `divide-y` on the container)

---

### Settings (`/settings`)

**Changes:**
- Replace horizontal `<Tabs>` with a **vertical sidebar nav** on desktop, horizontal scrollable tabs on mobile
- Remove the search input
- Layout: `grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6`

```tsx
// Desktop sidebar nav
<nav className="hidden lg:flex flex-col gap-1">
  {NAV_ITEMS.map((item) => (
    <button
      key={item.value}
      onClick={() => setActiveTab(item.value)}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 h-9 text-sm transition-colors',
        activeTab === item.value
          ? 'bg-muted text-foreground font-medium'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      )}
    >
      <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
      {item.label}
    </button>
  ))}
</nav>

// Mobile: horizontal scrollable tabs
<div className="lg:hidden overflow-x-auto">
  <TabsList variant="line">...</TabsList>
</div>
```

- Card radius: `rounded-xl` throughout (already correct)
- Form inputs: `h-10 rounded-lg` (change from `rounded-xl` to `rounded-lg`)
- Save buttons: right-aligned in `CardFooter` (already correct)

---

### Journal (`/journal`)

**Changes:**
- Two-panel layout on desktop: `lg:grid-cols-[288px_1fr]` (replace `@xl/main:grid-cols-12`)
- Entry list items: clean rows with title, relative date, mood badge
- Write view: full-width card with large textarea, mood selector at top
- Search input: `rounded-lg` (not `rounded-xl`)

```tsx
<div className="grid gap-4 lg:grid-cols-[288px_1fr]">
  {/* Entry list — w-72 equivalent */}
  <div className="space-y-3">...</div>
  {/* Entry detail */}
  <div>...</div>
</div>
```

---

### Goals (`/goals`)

**Changes:**
- `GoalCard`: remove `hover:-translate-y-px` → use `hover:shadow-sm` only
- Progress bar: `h-1.5` (thinner, more refined — change from `h-2`)
- Card radius: `rounded-xl` (change from `rounded-2xl`)
- Category badges: keep semantic colors, keep `rounded-full` pill style (appropriate for category chips)

```tsx
// GoalCard
<Card className={cn('rounded-xl transition-shadow hover:shadow-sm', goal.is_achieved && 'opacity-80')}>
  ...
  <Progress value={goal.progress_percentage} className="h-1.5" />
```

---

### Wellness (`/wellness`)

**Changes:**
- Page-level tabs: `variant="line"`
- Mood badge in header: keep it
- Tab content: no extra `mt-4` — tabs handle spacing

---

### Finances (`/finances`)

**Changes:**
- Remove `*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card` from the stats grid
- Stats: 3 flat white cards in a row, Current Balance card gets `border-primary/20`
- Tabs: `variant="line"`
- Transaction list: already uses `divide-y divide-border/50` — keep that pattern

```tsx
// Before
<div className="grid gap-4 @xl/main:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 ...">

// After
<div className="grid gap-4 sm:grid-cols-3">
```

---

### Wallet (`/wallet`)

**Changes:**
- Balance card: remove gradient (`bg-linear-to-br from-primary/5`) → flat white with `border-primary/20`
- Balance amount: `text-3xl font-semibold tabular-nums`
- Transactions: `divide-y divide-border` list

---

### Notifications (`/notifications`)

**Changes:**
- Group by "Unread" / "Earlier" with `text-xs font-medium uppercase tracking-wider text-muted-foreground` section labels
- Each notification: clean row with icon well, title, message, relative time
- "Mark all read" button: top-right of page header

---

### Community (`/community`)

**Changes:**
- Feed header: add `border-b border-border` (Requirement 13)
- Post cards: replace `CardFooter bg-muted` with `border-t border-border/50 pt-3` inside the card content
- Like/comment buttons: `text-muted-foreground hover:text-primary transition-colors`
- Create post: floating compose button (`fixed bottom-6 right-6`) or top card — floating button preferred on mobile

Pagination (Requirement 7):
- Load 20 posts per page
- "Load more" button at bottom of feed
- When no more posts: show "You've reached the end" message, hide button
- Post count badge: use channel's `post_count` field, not `posts.length`

Like optimistic update (Requirement 16):
```tsx
const handleLike = async (postId: string) => {
  // Optimistic update
  setPosts(prev => prev.map(p =>
    p.id === postId ? { ...p, like_count: p.like_count + (p.liked ? -1 : 1), liked: !p.liked } : p
  ));
  const res = await toggleLike(postId);
  if (!res.success) {
    // Revert
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, like_count: p.like_count + (p.liked ? -1 : 1), liked: !p.liked } : p
    ));
    toast.error('Failed to update like');
  }
};
```

Comment input attributes (Requirement 22):
```tsx
<Input inputMode="text" autoComplete="off" placeholder="Write a comment…" />
```

---

### Chat (`/chat`)

**Changes:**
- Sidebar: `w-60` (change from `w-64`), `bg-background border-r border-border`
- Channel list items: `rounded-lg` active state `bg-muted text-foreground` (remove `bg-primary/10 text-primary` active state — use muted instead)
- Message bubbles: mine = `bg-primary text-primary-foreground`, theirs = `bg-muted text-foreground` (already correct)
- Input area: the nested border-within-border pattern is already fixed in current code

---

### Assignments (`/assignments`)

**Changes:**
- Cards: `rounded-xl` (remove any `rounded-2xl`)
- Remove `hover:-translate-y-px`
- Tabs: `variant="line"`

---

### Resources (`/resources`)

**Changes:**
- Filter chips: `rounded-full` pill style (appropriate for filter chips — keep)
- Resource cards: `rounded-xl`, remove `hover:-translate-y-px`
- Type icon wells: keep colored backgrounds

---

### Profile (`/profile`)

**Changes:**
- Two-column layout: `grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6`
- Avatar: `size-20 rounded-xl` (not `rounded-full`)
- Save button: `rounded-lg` (not `rounded-full`)

---

### Booking Wizard (`/book`)

**Mobile navigation** (Requirement 9):
```tsx
// Top bar — mobile back button
<div className="flex items-center gap-3 border-b border-border px-4 py-3">
  <Button
    variant="ghost"
    size="icon"
    className="size-8 rounded-lg sm:hidden"
    onClick={currentStep === 1 ? () => router.back() : handleBack}
    aria-label="Go back"
  >
    <HugeiconsIcon icon={ChevronLeftIcon} className="size-4" />
  </Button>
  <h2 className="text-sm font-semibold">{STEPS[currentStep - 1].label}</h2>
</div>
```

**Step count from config** (Requirement 4):
```tsx
const STEPS: StepConfig[] = [
  { label: 'Service', component: ServiceStep },
  { label: 'Therapist', component: TherapistStep },
  { label: 'Date & Time', component: DateTimeStep },
  { label: 'Confirm', component: ConfirmStep },
];
const STEPS_COUNT = STEPS.length; // derived, not hardcoded
```

**Auto-advance via `useEffect`** (Requirement 3):
```tsx
// Replace setTimeout with useEffect watching selection state
useEffect(() => {
  if (selectedService && currentStep === 1) {
    setCurrentStep(2);
  }
}, [selectedService]);

useEffect(() => {
  if (selectedTherapist && currentStep === 2) {
    setCurrentStep(3);
  }
}, [selectedTherapist]);
```

**Mobile summary panel** (Requirement 20):
```tsx
// Mobile: collapsible panel above main card
<div className="lg:hidden">
  <button
    onClick={() => setSummaryOpen(!summaryOpen)}
    className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm"
  >
    <span className="font-medium">Your selections</span>
    <HugeiconsIcon icon={summaryOpen ? ChevronUpIcon : ChevronDownIcon} className="size-4" />
  </button>
  {summaryOpen && <BookingSummary ... />}
</div>
// Desktop: sidebar
<div className="hidden lg:block">
  <BookingSummary ... />
</div>
```

**Replace `<img>` with `<Image>`** (Requirement 5):
```tsx
import Image from 'next/image';

<Image
  src={therapist.avatar_url ?? '/assets/avatar-placeholder.png'}
  alt={therapist.full_name}
  width={40}
  height={40}
  className="rounded-lg object-cover"
/>
```

**Step indicator mobile label** (Requirement 10):
```tsx
// Always show current step label
<div className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground">
    Step {currentStep} of {STEPS_COUNT}
  </span>
  <span className="text-sm font-medium">{STEPS[currentStep - 1].label}</span>
</div>
```

**Confirm step navigation** (Requirement 12):
```tsx
// Replace window.location.href
router.push('/bookings');
```

**DateTime step error recovery** (Requirement 17):
```tsx
{slotsError && (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
    <p className="text-sm text-muted-foreground">{slotsError}</p>
    <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={fetchSlots}>
      <HugeiconsIcon icon={RefreshIcon} className="size-4" />
      Retry
    </Button>
  </div>
)}
```

**Therapist rating display** (Requirement 11):
```tsx
// Only render stars when rating exists
{therapist.rating != null && (
  <div className="flex items-center gap-1">
    <HugeiconsIcon icon={StarIcon} className="size-3.5 text-warning" />
    <span className="text-xs font-medium tabular-nums">{therapist.rating.toFixed(1)}</span>
  </div>
)}
```

---
