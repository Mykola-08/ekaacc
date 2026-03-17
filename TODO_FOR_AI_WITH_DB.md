# EKA Platform — TODO for AI Agent with Database Access

> This file is written for an AI agent that has read/write access to the
> Supabase database (via MCP or direct Postgres connection) AND can edit
> the codebase. Tasks are grouped by priority and domain.
>
> Each task includes: what to do, which tables/files are involved, and any
> validation steps.
>
> **Stack**: Next.js 16 · React 19 · TypeScript · Supabase (Postgres + RLS +
> Edge Functions) · Tailwind v4 · Stripe · Resend · OpenRouter AI

---

## PRIORITY 1 — Data Integrity & Missing Backend Wiring

### 1.1 Wire `mood_entries` into AI Insights page

**Problem**: `/ai-insights` page reads mood from `journal_entries.mood` column
(nullable int). The new `mood_entries` table is now the canonical source.

**What to do**:
1. In `src/app/(dashboard)/ai-insights/page.tsx`, replace the `journal_entries`
   mood query with a query to `mood_entries` for the same 30-day window.
2. Keep the `journal_entries` query for journal count/streak.
3. Join or merge if both exist (legacy entries may still have `.mood` set).

**Tables**: `mood_entries`, `journal_entries`
**File**: `src/app/(dashboard)/ai-insights/page.tsx`

---

### 1.2 Connect `assignments` page to correct FK column

**Problem**: `assignments` page (`src/app/(dashboard)/assignments/page.tsx`)
queries `.eq('patient_id', user.id)` but the `assignments` table uses
`auth.users.id` references. The `profiles` table maps `auth_id → id`.
Verify this is consistent — if `assignments.patient_id` references
`auth.users(id)`, use `user.id`; if it references `profiles(id)`, use
`profile.id`.

**What to do**:
```sql
-- Run this to check:
SELECT column_name, data_type, foreign_table_name
FROM information_schema.columns
JOIN information_schema.referential_constraints USING (constraint_name)
WHERE table_name = 'assignments';
```
Then fix the page query accordingly.

**Tables**: `assignments`, `profiles`, `auth.users`
**File**: `src/app/(dashboard)/assignments/page.tsx`

---

### 1.3 Populate initial `user_streaks` rows from existing data

**Problem**: `user_streaks` table is empty on first deploy. Existing users
who already have journal entries / mood logs need their streaks back-filled.

**What to do** (SQL):
```sql
-- Back-fill journal streaks
INSERT INTO public.user_streaks (user_id, activity_type, current_streak, longest_streak, last_activity_date, total_days)
SELECT
    user_id,
    'journal',
    -- Approximate current streak as days since last entry ≤ 1
    CASE WHEN MAX(DATE(created_at)) >= CURRENT_DATE - INTERVAL '1 day'
         THEN COUNT(DISTINCT DATE(created_at))
         ELSE 0
    END,
    COUNT(DISTINCT DATE(created_at)),
    MAX(DATE(created_at)),
    COUNT(DISTINCT DATE(created_at))
FROM public.journal_entries
GROUP BY user_id
ON CONFLICT (user_id, activity_type) DO NOTHING;

-- Back-fill mood_checkin streaks from legacy journal_entries.mood
INSERT INTO public.user_streaks (user_id, activity_type, current_streak, longest_streak, last_activity_date, total_days)
SELECT
    user_id,
    'mood_checkin',
    0,
    COUNT(DISTINCT DATE(created_at)),
    MAX(DATE(created_at)),
    COUNT(DISTINCT DATE(created_at))
FROM public.journal_entries
WHERE mood IS NOT NULL
GROUP BY user_id
ON CONFLICT (user_id, activity_type) DO NOTHING;
```

**Tables**: `user_streaks`, `journal_entries`

---

### 1.4 Seed `notifications` for all existing users who have bookings

**Problem**: The notifications table is empty. Users with upcoming bookings
should receive a seeded "upcoming session" notification.

**What to do** (SQL — run once):
```sql
INSERT INTO public.notifications (user_id, type, title, body, action_url, action_label)
SELECT DISTINCT
    b.client_id,
    'booking',
    'Upcoming session',
    'You have a session scheduled for ' ||
      TO_CHAR(b.starts_at AT TIME ZONE 'UTC', 'Mon DD, HH12:MI AM') || ' UTC.',
    '/bookings',
    'View Bookings'
FROM public.bookings b
WHERE b.status = 'scheduled'
  AND b.starts_at > now()
  AND b.starts_at < now() + INTERVAL '7 days'
  AND b.client_id IS NOT NULL
ON CONFLICT DO NOTHING;
```

**Tables**: `notifications`, `bookings`

---

### 1.5 Migrate legacy `journal_entries.mood` to `mood_entries`

**Problem**: `journal_entries.mood` contains historical mood scores. These
should be migrated to `mood_entries` for unified analytics.

**What to do** (SQL — run once, idempotent):
```sql
INSERT INTO public.mood_entries (user_id, score, note, journal_entry_id, logged_at)
SELECT
    user_id,
    mood::SMALLINT,
    NULL,
    id,
    created_at
FROM public.journal_entries
WHERE mood IS NOT NULL
  AND mood BETWEEN 1 AND 10
ON CONFLICT DO NOTHING;
```

Then optionally add an index on `journal_entries(user_id, mood)` for
legacy queries still using it.

**Tables**: `journal_entries`, `mood_entries`

---

## PRIORITY 2 — New Features to Implement

### 2.1 Add AI-powered weekly recap insight generation

**Problem**: `ai_insights` table exists but is never populated by the system.
An edge function or cron job should generate weekly insights.

**What to do**:
1. Create edge function `supabase/functions/generate-insights/index.ts`
2. It should:
   - Query each active user's past 7 days of `mood_entries` and `journal_entries`
   - Send a prompt to OpenRouter (Anthropic Claude) with the data
   - Insert the response into `ai_insights` with `insight_type = 'weekly_recap'`
3. Wire it to the existing `cron` endpoint in `src/app/(platform)/cron/route.ts`
4. Schedule: weekly on Sunday evenings

**Tables**: `ai_insights`, `mood_entries`, `journal_entries`, `user_streaks`
**Files**: `supabase/functions/generate-insights/index.ts`,
           `src/app/(platform)/cron/route.ts`

---

### 2.2 Implement `notification_preferences` UI in Settings

**Problem**: `notification_preferences` table exists but there's no UI to
manage it. Users can't control email/push/in-app opt-outs.

**What to do**:
1. Add a `NotificationPreferences` client component in
   `src/app/(dashboard)/settings/notifications/`
2. Fetch from `notification_preferences` (upsert on first load)
3. Show toggles for: email, push, in-app channels + category opt-outs
4. Save via server action

**Tables**: `notification_preferences`
**Files**: `src/app/(dashboard)/settings/notifications/page.tsx`,
           `src/app/actions/notification-preferences-actions.ts`

---

### 2.3 Show streak badges on dashboard sidebar

**Problem**: `user_streaks` table is populated but never displayed anywhere.

**What to do**:
1. In `src/components/dashboard/layout/UnifiedSidebar.tsx`, below the user
   avatar in the sidebar footer, add a mini streak strip.
2. Query the top 2 streaks (journal + mood_checkin) for the current user.
3. Show: 🔥 `{n} day streak` with the activity label.

**Tables**: `user_streaks`
**Files**: `src/components/dashboard/layout/UnifiedSidebar.tsx`

---

### 2.4 Add unread notification count badge to header bell

**Problem**: `NotificationDropdown.tsx` exists but doesn't show a count badge
on the bell icon.

**What to do**:
1. In `src/components/dashboard/layout/DashboardHeader.tsx`, fetch
   `get_unread_notification_count(user_id)` via RPC on the server.
2. Pass count to `NotificationDropdown` as a prop.
3. Render a small red badge `{count}` on the bell icon when count > 0.

**Tables**: `notifications`
**Files**: `src/components/dashboard/layout/DashboardHeader.tsx`,
           `src/components/dashboard/layout/NotificationDropdown.tsx`

---

### 2.5 Therapist assignments list — add client name column

**Problem**: `/therapist/assignments` shows assignments but doesn't display
the patient's name. Therapists need to see who each assignment is for.

**What to do**:
1. In `src/app/(dashboard)/therapist/assignments/page.tsx`, join
   `assignments` with `profiles` on `patient_id` → `auth_id` to get the
   patient's `full_name`.
2. Display the name in the assignment list row.

**Tables**: `assignments`, `profiles`
**File**: `src/app/(dashboard)/therapist/assignments/page.tsx`

---

### 2.6 Add `completed` status to assignments workflow

**Problem**: Patients can "submit" assignments (sets status to `submitted`)
but there's no way to mark them `completed`. The `submitAssignment` action
sets status to `'completed'` directly (check `assignments-actions.ts`), which
skips the `submitted → reviewed → completed` flow.

**What to do**:
1. Verify in DB: does `submitAssignment` set status to `submitted` or
   `completed`? If `submitted`, therapist needs a "mark reviewed" button.
2. Add a `reviewAssignment(id, feedback)` server action for therapists.
3. Add "Mark Reviewed" button to therapist assignments page.

**Tables**: `assignments`, `assignment_submissions`
**Files**: `src/app/actions/assignments-actions.ts`,
           `src/app/(dashboard)/therapist/assignments/page.tsx`

---

### 2.7 Add `goals` progress to weekly recap email

**Problem**: The weekly recap email (Resend) doesn't include goal progress.

**What to do**:
1. In the email template for weekly recap, query `goals` with `status = 'active'`
2. Include: goal title + progress_percentage bar (HTML)
3. Limit to top 3 goals by progress

**Tables**: `goals`
**Files**: `supabase/functions/send-email/index.ts`,
           `supabase/email-templates/`

---

## PRIORITY 3 — UX Polish & Consistency

### 3.1 Replace all raw `ring-green-500`, `text-[...]` hardcoded Tailwind classes

**Problem**: Several components use hardcoded Tailwind color values instead of
semantic design tokens.

**What to do**:
- Run: `grep -r "ring-green\|text-\[#\|bg-\[#" src/` to find violations
- Replace with: `ring-success`, `text-success`, `bg-success`, etc.
- Reference: `src/app/globals.css` or `tailwind.config.ts` for token names

---

### 3.2 Standardize empty-state pattern across all pages

**Current inconsistency**: Some pages use `border-dashed` containers,
others use plain text, some have no CTA.

**Standard pattern** (implement across all pages):
```tsx
<EmptyState
  icon={<HugeiconsIcon icon={SomeIcon} />}
  title="Nothing here yet"
  description="Supporting description text"
  action={<Button>Primary CTA</Button>}
/>
```

Create `src/components/ui/empty-state.tsx` and use it in:
- `/goals` (no goals)
- `/journal` (no entries)
- `/assignments` (no assignments)
- `/bookings` (no bookings)
- `/resources` (no resources)
- `/community` (no posts)

---

### 3.3 Add loading skeletons to all data-heavy pages

**Problem**: Pages without `loading.tsx` show a blank screen during server
render / navigation.

**What to do**: Add `loading.tsx` files (with skeleton UI) for:
- `/dashboard/loading.tsx`
- `/bookings/loading.tsx`
- `/goals/loading.tsx`
- `/wellness/loading.tsx`
- `/ai-insights/loading.tsx`
- `/assignments/loading.tsx`

Pattern:
```tsx
export default function Loading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
      {[1,2,3].map(i => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
```

---

### 3.4 Add `aria-label` and keyboard nav to MoodQuickLog

**Problem**: The MoodQuickLog emoji buttons have no screen-reader labels.

**What to do**:
- Add `aria-label={`Rate mood ${score} out of 10: ${emoji} ${label}`}` to each button
- Add `role="group"` and `aria-label="Mood rating"` to the container

**File**: `src/components/dashboard/widgets/MoodQuickLog.tsx`

---

### 3.5 Add `target_date` display to GoalCard

**Problem**: `GoalCard` component doesn't show the target date. Users set
target dates but can't see them at a glance.

**What to do**: Add below the progress bar:
```tsx
{goal.target_date && (
  <p className="text-xs text-muted-foreground mt-1">
    Target: {new Date(goal.target_date).toLocaleDateString()}
  </p>
)}
```

**File**: `src/app/(dashboard)/goals/goals-client.tsx`

---

## PRIORITY 4 — Admin & Therapist Tools

### 4.1 Implement audit log for therapist session-mode start/end

**Problem**: There's no logging when a therapist starts or ends a session
mode. The audit log is blind to therapy sessions.

**What to do**:
1. In `src/components/dashboard/layout/TherapistSessionModeLauncher.tsx`,
   after session start, call:
   ```ts
   await supabase.rpc('log_user_activity', {
     p_user_id: therapist.id,
     p_activity_type: 'session',
     p_event: 'session_mode_started',
     p_entity_id: bookingId,
     p_entity_table: 'bookings',
   });
   ```
2. Do the same on session end.

**Tables**: `user_activity_log`, `audit_logs`
**File**: `src/components/dashboard/layout/TherapistSessionModeLauncher.tsx`

---

### 4.2 Admin dashboard: add real-time metrics widget

**Problem**: Admin dashboard shows static counts. Add real-time charts using
the existing `recharts` dependency.

**What to do**:
1. Query: new users per week (last 8 weeks), bookings per week, revenue per week
2. Add a `<LineChart>` or `<BarChart>` to the admin dashboard page
3. Data source: aggregate queries on `profiles`, `bookings`, `transactions`

**Tables**: `profiles`, `bookings`, `transactions`
**File**: `src/app/(dashboard)/dashboard/page.tsx` (admin section)

---

### 4.3 Add feature flag UI for `mood_entries` and `ai_insights`

**Problem**: New features (mood quick-log, AI insights) should be gated behind
feature flags for gradual rollout.

**What to do**:
1. Insert rows into `tenant_features` (or `app_config`) table:
   ```sql
   INSERT INTO public.app_config (key, value, description)
   VALUES
     ('feature_mood_entries', 'true', 'Enable dedicated mood tracking widget'),
     ('feature_ai_insights_weekly', 'false', 'Enable weekly AI-generated insights')
   ON CONFLICT (key) DO NOTHING;
   ```
2. Read these flags in `FeatureContext` and gate the components.

**Tables**: `app_config` or `tenant_features`
**Files**: `src/context/platform/feature-context.tsx`

---

## PRIORITY 5 — Performance & Security

### 5.1 Add composite indexes for common query patterns

**Missing indexes** (run in Supabase SQL editor):
```sql
-- Bookings: therapist schedule queries
CREATE INDEX IF NOT EXISTS idx_bookings_therapist_status_starts
    ON public.bookings(therapist_id, status, starts_at);

-- Bookings: client upcoming queries
CREATE INDEX IF NOT EXISTS idx_bookings_client_status_starts
    ON public.bookings(client_id, status, starts_at);

-- Journal: user recent entries
CREATE INDEX IF NOT EXISTS idx_journal_user_created
    ON public.journal_entries(user_id, created_at DESC);

-- Goals: active goals by user
CREATE INDEX IF NOT EXISTS idx_goals_user_status
    ON public.goals(user_id, status);

-- Mood entries: daily aggregate queries
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_logged
    ON public.mood_entries(user_id, logged_at DESC);
```

---

### 5.2 Audit RLS policies on new tables

**Problem**: The new tables (`mood_entries`, `ai_insights`, `user_streaks`,
`user_activity_log`, `notifications`, `notification_preferences`) all have RLS
enabled but policies need to be validated.

**What to do**:
```sql
-- Run to see all policies on new tables:
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN (
    'mood_entries', 'ai_insights', 'user_streaks',
    'user_activity_log', 'notifications', 'notification_preferences'
)
ORDER BY tablename, cmd;
```

Verify:
- No user can read another user's data
- Service role can insert (for background jobs)
- Therapists can read patient mood entries only for their patients

---

### 5.3 Validate that `get_updated_at` trigger exists before re-creating

**Problem**: Migration `20260318000000` defines `set_updated_at()` function
but earlier migrations may have already defined it, causing a conflict.

**What to do**:
```sql
-- Check if function already exists:
SELECT proname, prosrc FROM pg_proc WHERE proname = 'set_updated_at';

-- If it exists from an older migration, the CREATE OR REPLACE in the new
-- migration handles it. But verify the function signature matches.
```

---

## PRIORITY 6 — Translations (i18n)

### 6.1 Extract all hardcoded English strings from dashboard pages

**Scope** (from prior audit):
- `src/app/telegram/page.tsx` — Catalan strings
- `src/app/(dashboard)/therapist/resources/page.tsx` — Spanish resource descriptions
- `src/app/(marketing)/layout.tsx` — mixed locale metadata

**What to do**:
1. Create `src/lib/i18n/en.ts`, `es.ts`, `ca.ts` dictionaries
2. Replace hardcoded strings with `t('key')` calls
3. Use Next.js `params.locale` routing or a simple context

---

## COMPLETED (reference)

- [x] Created `assignments`, `channels`, `channel_messages`, `form_templates` tables
- [x] Created `resources` table with `url` + `is_published` columns
- [x] Created `ai_insights` table with RLS
- [x] Created `mood_entries` table (standalone, decoupled from journal)
- [x] Created `user_streaks` + `increment_streak()` RPC
- [x] Created `user_activity_log` + `log_user_activity()` RPC
- [x] Created `notifications` table with proper shape
- [x] Created `notification_preferences` table + `get_unread_notification_count()` RPC
- [x] Added `MoodQuickLog` widget to dashboard home
- [x] Added `mood-actions.ts` server actions (logMoodEntry, getTodayMood, getMoodHistory)
- [x] Improved bookings page (stats, grouped upcoming, history tab)
- [x] Improved goals page (create, check-in, delete, category badges)
- [x] Improved assignments page (submit dialog, status badges, due date formatting)
- [x] Improved resources page (type filter chips, search, fallback content)
- [x] Improved AI insights page (mood trend, recommendations, action blocks)
- [x] Improved wellness page (tabbed: journal, progress, resources)

---

_Last updated: 2026-03-17 by claude/polish-dashboard-ux-sG9FM_
