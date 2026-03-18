# EKA Balance — Codex Implementation Plan

This document defines the remaining implementation work for Codex to complete.
Each section is ordered by priority. All code must follow the existing stack:
**Next.js 16 App Router · React 19 · TypeScript 5.9 · Tailwind v4 · Supabase · shadcn/ui**

---

## 1. ONBOARDING IMPROVEMENT (High Priority)

### Goal
Replace the bare role-selection page with a multi-step onboarding wizard.

### Steps to implement
**File**: `src/app/(dashboard)/onboarding/page.tsx`

1. **Step 1 — Welcome**: Greeting with name, brief intro to EKA Balance features.
2. **Step 2 — Role selection**: Patient vs Therapist cards (visual, not just buttons).
3. **Step 3 — Profile completion**: Full name, phone, preferred language, timezone.
4. **Step 4 — Goals setup** (patients only): Pick 1–3 wellness goals from a preset list:
   - Stress reduction, Better sleep, Pain management, Emotional balance, Fitness, Other.
   - Save selected goals to `goals` table with `status='active'` and `progress_percentage=0`.
5. **Step 5 — Book first session** (patients only): CTA to `/book` with "Skip for now" option.
6. **Step 6 — Therapist profile** (therapists only): Bio, specializations, working hours, location.

### Schema needed
- `onboarding_completed` boolean on `profiles` table (migration needed).
- Migration: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;`

### UX requirements
- Progress indicator (step X of Y) using `BookingStepIndicator` pattern or custom.
- Each step has a "Next" / "Back" button.
- All strings must use the translation system (`useLanguage()` from `@/context/LanguageContext`).
- After completion: set `onboarding_completed=true` on profile, redirect to `/dashboard`.

---

## 2. PERSONALIZATION & AI IMPROVEMENTS (High Priority)

### 2a. Personalized Dashboard Welcome
**File**: `src/app/(dashboard)/dashboard/page.tsx`

- Show personalized greeting based on time of day + user first name.
- Pull user's active goals count, upcoming booking count, mood trend from DB.
- Display a "streak" counter for consecutive days with a journal entry or wellness log.

### 2b. AI Insights auto-generation
**File**: `src/app/api/ai/insights/route.ts` (POST handler)

- When a user has > 3 journal entries but no AI insights yet, auto-trigger insight generation.
- Schedule: call insight generation after login if last generated > 7 days ago.
- Implement in `src/app/(dashboard)/layout.tsx` as a background fetch (fire-and-forget).

### 2c. Mood trend visualization
**File**: `src/components/dashboard/widgets/MoodTrendWidget.tsx` (NEW)

- Fetch last 14 days of `wellness_entries` moods.
- Render a simple sparkline using shadcn's `ChartArea` or a minimal SVG path.
- Show average mood, trend arrow (up/down/stable), and a color-coded badge.
- Add to dashboard page for non-admin/non-therapist users.

---

## 3. SETTINGS COMPLETION (Medium Priority)

### 3a. Identity settings page
**File**: `src/app/(dashboard)/settings/identity/page.tsx`

Currently just a page shell. Implement:
- Full legal name, date of birth, nationality fields.
- Preferred language selector (reuse `LanguageTab` pattern from main settings).
- Avatar upload using Supabase Storage (`avatars` bucket).

### 3b. Privacy settings page
**File**: `src/app/(dashboard)/settings/privacy/page.tsx`

Implement:
- Data export request button (triggers email to admin with user ID).
- Account deletion request (AlertDialog confirmation, soft-delete via `is_deleted` flag).
- Visibility toggles: "Show my profile in community", "Allow therapist to view my journal entries".

### 3c. Notifications settings page
**File**: `src/app/(dashboard)/settings/notifications/page.tsx`

Currently a shell. Move the `NotificationsTab` content from `settings-client.tsx` into this dedicated page.

### 3d. Family settings page
**File**: `src/app/(dashboard)/settings/family/page.tsx`

- List linked family accounts (query `family_links` table if it exists, else create it).
- Add family member form: email + relationship (parent, child, partner).
- Schema: `CREATE TABLE IF NOT EXISTS family_links (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid REFERENCES auth.users(id), linked_user_id uuid REFERENCES auth.users(id), relationship text, created_at timestamptz DEFAULT now());`

### 3e. Referral page
**File**: `src/app/(dashboard)/settings/referral/page.tsx`

- Show user's referral code (generate one if missing: 8-char alphanumeric from `user.id`).
- Share buttons: Copy link, WhatsApp, Email.
- Track referral count from `profiles` table `referred_by` field.

---

## 4. MISSING FEATURES (Medium Priority)

### 4a. Resources page improvements
**File**: `src/components/resources/ResourcesPage.tsx`

- Add search/filter bar (by category, type, tags).
- Add "Saved" toggle to bookmark resources (needs `saved_resources` table).
- Schema: `CREATE TABLE IF NOT EXISTS saved_resources (user_id uuid REFERENCES auth.users(id), resource_id uuid REFERENCES resources(id), PRIMARY KEY (user_id, resource_id));`

### 4b. Community page improvements
**File**: `src/app/(dashboard)/community/community-client.tsx`

- Add reactions (👍 ❤️ 🙏) to community posts.
- Add comment threading (reply to a post).
- Schema: Add `parent_id uuid REFERENCES community_posts(id)` to `community_posts` table.

### 4c. Goals page — progress tracking
**File**: `src/app/(dashboard)/goals/goals-client.tsx`

- Add "Update progress" button on each goal card that opens a slider (0–100%).
- Add goal history: track `goal_progress_history` with timestamp + percentage.
- Schema: `CREATE TABLE IF NOT EXISTS goal_progress_history (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), goal_id uuid REFERENCES goals(id), progress_percentage integer, note text, recorded_at timestamptz DEFAULT now(), user_id uuid REFERENCES auth.users(id));`

### 4d. Journal — mood chart
**File**: `src/app/(dashboard)/journal/journal-client.tsx`

- Add a 7-day mood sparkline above the journal entry list.
- Use data from existing `journal_entries.mood` field.

### 4e. Wellness page — progress tab
**File**: `src/app/(dashboard)/wellness/tabs/ProgressTab.tsx`

- Currently shows text stats. Add:
  - Bar chart of mood over last 30 days.
  - Completion rate for assignments.
  - Goals progress bars.

---

## 5. TRANSLATION COMPLETION (Medium Priority)

### Missing translation keys to add (all 4 languages: ca, en, es, ru)

Add to `src/context/translations.ts` for each language:

**Settings strings:**
- `settings.title`, `settings.description`
- `settings.tabs.profile`, `settings.tabs.notifications`, `settings.tabs.security`, `settings.tabs.language`
- `settings.profile.picture`, `settings.profile.personalInfo`, `settings.profile.fullName`, etc.
- `settings.notifications.*` (all toggle labels and descriptions)
- `settings.security.*` (password change, MFA labels)
- `settings.language.title`, `settings.language.description`, `settings.language.apply`

**Dashboard widgets strings:**
- `dashboard.aiDailyBriefing`, `dashboard.aiInsights`, `dashboard.aiActions`
- `dashboard.generateFirstInsight`, `dashboard.moodTrend`
- `dashboard.quickActions.*`

**Goals strings:**
- `goals.title`, `goals.addGoal`, `goals.editGoal`, `goals.deleteGoal`
- `goals.status.active`, `goals.status.completed`, `goals.status.paused`

**Journal strings:**
- `journal.title`, `journal.newEntry`, `journal.mood.*`

Then wire these strings in the components using `useLanguage()`.

---

## 6. DATABASE MIGRATIONS NEEDED (Apply via Supabase MCP)

Run these in order:

```sql
-- Migration 1: onboarding_completed flag
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Migration 2: goal progress history
CREATE TABLE IF NOT EXISTS public.goal_progress_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  progress_percentage integer NOT NULL CHECK (progress_percentage BETWEEN 0 AND 100),
  note text,
  recorded_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goal history" ON public.goal_progress_history
  FOR ALL USING (auth.uid() = user_id);

-- Migration 3: saved resources
CREATE TABLE IF NOT EXISTS public.saved_resources (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved resources" ON public.saved_resources
  FOR ALL USING (auth.uid() = user_id);

-- Migration 4: family links
CREATE TABLE IF NOT EXISTS public.family_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_email text NOT NULL,
  relationship text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.family_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own family links" ON public.family_links
  FOR ALL USING (auth.uid() = owner_id);

-- Migration 5: community reactions
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{"like":0,"heart":0,"pray":0}';

-- Migration 6: community post threading
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE;
```

---

## 7. MARKETING ↔ DASHBOARD INTEGRATION (Lower Priority)

### 7a. Shared navigation header for booking flow
Already implemented via `src/app/(booking)/layout.tsx`.

### 7b. Marketing CTAs to dashboard
In marketing components, when user is logged in (check via Supabase client), change "Book Now" CTA to "Go to Dashboard" or show a "Continue your session" banner.

**File**: `src/marketing/components/MainLayout.tsx` or `src/marketing/components/HomeContent.tsx`
- Import `createClient` from `@/lib/supabase/client`
- Check session on mount
- If logged in: show "Welcome back, {name}" banner with links to `/dashboard` and `/book`

### 7c. Consistent cookie/legal consent
The marketing site has a cookie consent banner. Ensure it respects the dashboard's theme when the booking flow is active.

---

## 8. PERFORMANCE & UX POLISH (Lower Priority)

### 8a. Page loading states
Add `loading.tsx` files for pages that don't have them:
- `/goals/loading.tsx`
- `/journal/loading.tsx`
- `/wellness/loading.tsx`
- `/ai-insights/loading.tsx`

Pattern: use `Skeleton` components matching the page layout.

### 8b. Error boundaries
Add `error.tsx` files for dashboard route groups to catch and display errors gracefully.

### 8c. Empty states
Audit all pages for empty state handling. Every list/grid that can be empty should have:
- An icon (HugeIcons)
- A descriptive message
- A CTA button (e.g., "Create your first goal", "Book a session")

---

## Implementation Order for Codex

1. **Migrations** (Section 6) — apply via MCP first so tables exist
2. **Onboarding wizard** (Section 1) — most impactful UX improvement
3. **Settings completion** (Section 3) — complete existing shells
4. **Missing features** (Section 4) — goals progress, journal mood chart
5. **Personalization** (Section 2) — AI improvements
6. **Translation completion** (Section 5) — wire strings in components
7. **Polish** (Section 8) — loading states, error boundaries, empty states

---

*Generated: 2026-03-18 | Branch: claude/polish-dashboard-ux-sG9FM*
