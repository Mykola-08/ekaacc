# Requirements Document

## Introduction

This document captures requirements for a comprehensive UX/UI improvement initiative across the EKA Balance mental health and wellness platform. EKA Balance is a Next.js 16 App Router application backed by Supabase, Stripe, and AI services, serving three user roles: Client/Patient, Therapist, and Admin.

The initiative addresses five priority tiers: critical bugs and dead code (P0), premium minimalist UI polish (P1), interaction quality improvements (P2), mobile responsiveness (P3), and performance and code quality (P4/P5). All changes must preserve existing `.marketing`-scoped styles in `globals.css`.

---

## Glossary

- **Dashboard_Shell**: The `UnifiedDashboardShell` component that wraps all authenticated dashboard pages.
- **Booking_Wizard**: The multi-step `BookingWizard` component used to schedule therapy sessions.
- **Step_Indicator**: The `BookingStepIndicator` component that renders step progress within the Booking_Wizard.
- **Therapist_Step**: The `TherapistStep` component (step 2 of the Booking_Wizard) for selecting a practitioner.
- **DateTime_Step**: The `DateTimeStep` component (step 3 of the Booking_Wizard) for selecting date and time.
- **Confirm_Step**: The `ConfirmStep` component (step 4 of the Booking_Wizard) for entering details and submitting.
- **Community_Feed**: The `CommunityFeed` component rendering the community channel posts.
- **Permission_Helper**: The `can()` function that evaluates whether a user's permissions include a given group/action pair.
- **Mood_Trend_Widget**: The `MoodTrendWidget` server component that renders a 14-day mood sparkline.
- **AI_Daily_Summary**: The `AIDailySummary` client component that fetches and displays the AI-generated daily briefing.
- **Dash_Stats_Card**: The `DashStatsCard` sub-component in `dashboard/page.tsx` that renders a numeric stat tile.
- **Router**: The Next.js App Router (`useRouter` from `next/navigation`).
- **Permissions_Module**: The centralized `src/lib/permissions.ts` module.
- **Step_Config**: The array of step definitions that drives the Booking_Wizard step count and labels.

---

## Requirements

### Requirement 1: Centralize the Permission Helper

**User Story:** As a developer, I want a single authoritative `can()` helper, so that permission logic is consistent and maintainable across the entire codebase.

#### Acceptance Criteria

1. THE Permissions_Module SHALL export a `can(permissions: PermissionRecord[], group: string, action: string): boolean` function.
2. WHEN the `can` function is called with any valid permissions array, group, and action, THE Permissions_Module SHALL return a value that is strictly `true` or `false` (never `undefined`, `null`, or a truthy/falsy non-boolean).
3. WHEN the `action` argument equals `"manage"`, THE Permissions_Module SHALL return `true` for any action query against the same group.
4. THE `dashboard/page.tsx` file SHALL NOT define a local `can` function; it SHALL import `can` from the Permissions_Module.
5. THE `UnifiedDashboardShell` component SHALL NOT define a local `can` function; it SHALL import `can` from the Permissions_Module.
6. FOR ALL valid inputs `(permissions, group, action)`, calling `can` twice with the same arguments SHALL return the same result (idempotence).

---

### Requirement 2: Remove Dead Code Directories

**User Story:** As a developer, I want dead backup directories removed from the repository, so that the codebase is clean and build times are not inflated.

#### Acceptance Criteria

1. THE codebase SHALL NOT contain the directory `src/app/dashboard-shadcn-backup/`.
2. THE codebase SHALL NOT contain the directory `src/styles/backup/`.
3. WHEN the Next.js build runs after removal, THE build SHALL complete without errors related to the removed directories.

---

### Requirement 3: Booking Wizard Step Auto-Advance

**User Story:** As a client, I want the booking wizard to advance to the next step reliably after I make a selection, so that the flow feels responsive and never gets stuck.

#### Acceptance Criteria

1. WHEN a user selects a service in step 1, THE Booking_Wizard SHALL advance to step 2 only after the selection state has been committed (not via a fixed-duration `setTimeout`).
2. WHEN a user selects a therapist in step 2, THE Booking_Wizard SHALL advance to step 3 only after the selection state has been committed.
3. THE Booking_Wizard SHALL NOT use `setTimeout` as the sole mechanism for triggering step advancement.
4. FOR ALL step transitions triggered by selection, THE Booking_Wizard SHALL advance to `currentStep + 1` and SHALL NOT skip or repeat steps.

---

### Requirement 4: Derive Step Count from Configuration

**User Story:** As a developer, I want the booking wizard step count to be derived from the step configuration array, so that adding or removing steps never requires updating a separate constant.

#### Acceptance Criteria

1. THE Booking_Wizard SHALL derive its total step count from the length of the Step_Config array rather than a hardcoded constant.
2. WHEN a step is added to or removed from the Step_Config array, THE Booking_Wizard SHALL reflect the correct total step count without any other code changes.
3. FOR ALL valid Step_Config arrays of length N, the Step_Indicator SHALL render exactly N step bubbles.

---

### Requirement 5: Replace Plain `<img>` with Next.js `<Image>`

**User Story:** As a user, I want avatar images to load efficiently with proper optimization, so that the page loads faster and images are not oversized.

#### Acceptance Criteria

1. THE `BookingWizard` summary sidebar SHALL render therapist avatars using the Next.js `<Image>` component instead of a plain `<img>` element.
2. THE `TherapistStep` component SHALL render therapist avatars using the Next.js `<Image>` component instead of a plain `<img>` element.
3. WHEN an avatar URL is unavailable, THE `<Image>` component SHALL fall back to `/assets/avatar-placeholder.png`.

---

### Requirement 6: Mood Trend Widget Suspense Boundary

**User Story:** As a client, I want the dashboard to load progressively, so that a slow mood data fetch does not block the entire page from rendering.

#### Acceptance Criteria

1. THE `MoodTrendWidget` server component SHALL be wrapped in a `<Suspense>` boundary at its usage site in `dashboard/page.tsx`.
2. WHILE the `MoodTrendWidget` is loading, THE dashboard page SHALL render a skeleton placeholder in place of the widget.
3. IF the `MoodTrendWidget` fetch fails, THE dashboard page SHALL render the remaining dashboard content without interruption.

---

### Requirement 7: Community Feed Pagination

**User Story:** As a community member, I want posts to load in pages, so that the feed is fast even when there are hundreds of posts.

#### Acceptance Criteria

1. THE Community_Feed SHALL load posts in pages of at most 20 items per request.
2. WHEN the user scrolls to the bottom of the feed or activates a "Load more" control, THE Community_Feed SHALL fetch the next page of posts and append them to the existing list.
3. WHEN no more posts are available, THE Community_Feed SHALL display a message indicating the end of the feed and SHALL NOT make additional fetch requests.
4. THE Community_Feed SHALL display the total post count badge based on the channel's actual post count, not the count of currently loaded posts.

---

### Requirement 8: Consistent Dashboard Section Spacing

**User Story:** As a user, I want the dashboard layout to feel visually consistent, so that the interface looks polished and professional.

#### Acceptance Criteria

1. THE dashboard page SHALL apply a consistent horizontal padding wrapper (`px-4 lg:px-6`) to every top-level section.
2. THE dashboard page SHALL NOT mix padded and unpadded sections at the same layout level.

---

### Requirement 9: Booking Wizard Mobile Navigation

**User Story:** As a mobile user, I want a clear way to go back or close the booking wizard, so that I can navigate without confusion.

#### Acceptance Criteria

1. THE Booking_Wizard top bar SHALL render a back/close affordance (button or icon) that is visible on mobile viewports (below `sm` breakpoint).
2. WHEN the back/close affordance is activated on step 1, THE Booking_Wizard SHALL navigate the user back to the previous page using the Router.
3. WHEN the back/close affordance is activated on steps 2–4, THE Booking_Wizard SHALL navigate to the previous step.

---

### Requirement 10: Booking Step Indicator Mobile Labels

**User Story:** As a mobile user, I want to see which step I am on in the booking flow, so that I always know my progress.

#### Acceptance Criteria

1. THE Step_Indicator SHALL display the current step label at all viewport sizes, including below the `sm` breakpoint.
2. THE Step_Indicator MAY hide non-current step labels on mobile to conserve space, but SHALL always show the label for the active step.

---

### Requirement 11: Therapist Rating Display Accuracy

**User Story:** As a client, I want to see accurate therapist ratings, so that I can make an informed choice.

#### Acceptance Criteria

1. WHEN a therapist record includes a `rating` value, THE Therapist_Step SHALL display that rating value alongside the star icons.
2. WHEN a therapist record does not include a `rating` value, THE Therapist_Step SHALL NOT render star icons or a rating display for that therapist.
3. THE Therapist_Step SHALL NOT render a hardcoded 5-star rating for therapists that lack rating data.
4. FOR ALL therapists with a `rating` field, the displayed rating SHALL equal the value from the data source.

---

### Requirement 12: Confirm Step Navigation Uses Router

**User Story:** As a client, I want the post-booking redirect to work correctly within the Next.js app, so that the page transition is smooth and client-side state is preserved.

#### Acceptance Criteria

1. WHEN a booking is successfully confirmed, THE Confirm_Step SHALL navigate to `/bookings` using `router.push('/bookings')` from the Next.js Router.
2. THE Confirm_Step SHALL NOT use `window.location.href` for post-confirmation navigation.

---

### Requirement 13: Community Feed Header Visual Separation

**User Story:** As a user, I want the community feed header to remain visually distinct when I scroll, so that I always know which channel I am viewing.

#### Acceptance Criteria

1. THE Community_Feed sticky header SHALL include a bottom border that is visible when the page is scrolled.
2. WHILE the feed is scrolled past the top, THE Community_Feed header SHALL remain visually separated from the content below it.

---

### Requirement 14: Consistent Empty States

**User Story:** As a user, I want empty states to be consistent and actionable, so that I always know what to do next when there is no content.

#### Acceptance Criteria

1. THE Community_Feed empty state SHALL include an icon, a descriptive message, and a call-to-action button.
2. FOR ALL empty states across the dashboard, each empty state SHALL include at minimum an icon and a descriptive message.
3. WHERE a primary action is available to resolve the empty state, THE empty state SHALL include a call-to-action button linking to that action.

---

### Requirement 15: Dash Stats Card Loading Skeleton

**User Story:** As a user, I want stat cards to show a loading skeleton while data is being fetched, so that the layout does not shift and the interface feels responsive.

#### Acceptance Criteria

1. WHEN the `value` prop of a Dash_Stats_Card is `undefined` or `null`, THE Dash_Stats_Card SHALL render a skeleton placeholder instead of the numeric value.
2. WHEN the `value` prop becomes defined, THE Dash_Stats_Card SHALL replace the skeleton with the actual value.

---

### Requirement 16: Community Feed Like Optimistic Update

**User Story:** As a community member, I want the like button to respond instantly, so that the interaction feels immediate and not laggy.

#### Acceptance Criteria

1. WHEN a user activates the like button on a post, THE Community_Feed SHALL optimistically update the like count in local state before the server response is received.
2. IF the server request to toggle the like fails, THE Community_Feed SHALL revert the like count to its previous value and display an error indicator.

---

### Requirement 17: Date Time Step Error Recovery

**User Story:** As a client, I want to retry loading time slots if they fail to load, so that a transient error does not block me from completing my booking.

#### Acceptance Criteria

1. WHEN the time slot fetch fails, THE DateTime_Step SHALL display an error message describing the failure.
2. WHEN the time slot fetch fails, THE DateTime_Step SHALL render a "Retry" button.
3. WHEN the user activates the "Retry" button, THE DateTime_Step SHALL re-fetch available slots for the currently selected date.

---

### Requirement 18: AI Daily Summary Error Clarity

**User Story:** As a client, I want the AI summary error state to tell me what went wrong, so that I understand whether to retry or wait.

#### Acceptance Criteria

1. WHEN the AI_Daily_Summary fails to load, THE AI_Daily_Summary SHALL display an error message that identifies the failed operation (e.g., "Could not load your daily briefing").
2. WHEN the AI_Daily_Summary fails to load, THE AI_Daily_Summary SHALL render a "Try again" button that re-triggers the fetch.
3. THE AI_Daily_Summary error message SHALL NOT be a generic "Something went wrong" string without context.

---

### Requirement 19: Skip-to-Main-Content Accessibility Link

**User Story:** As a keyboard or screen reader user, I want a skip-to-main-content link at the top of every dashboard page, so that I can bypass navigation and reach the main content quickly.

#### Acceptance Criteria

1. THE Dashboard_Shell SHALL render a skip-to-main-content anchor element as the first focusable element in the DOM.
2. THE skip link SHALL target the `#main-content` element that already exists in the shell's main area.
3. WHILE the skip link does not have focus, THE skip link SHALL be visually hidden.
4. WHEN the skip link receives keyboard focus, THE skip link SHALL become visible and positioned at the top of the viewport.
5. THE Dashboard_Shell SHALL use the existing `.ux-skip-link` CSS class from `globals.css` for the skip link styling.

---

### Requirement 20: Booking Wizard Mobile Summary Access

**User Story:** As a mobile user, I want to see my booking selections without scrolling back through previous steps, so that I can review my choices before confirming.

#### Acceptance Criteria

1. THE Booking_Wizard summary sidebar SHALL be accessible on mobile viewports.
2. WHERE the viewport is below the `lg` breakpoint, THE Booking_Wizard SHALL render the summary as a collapsible panel or position it above the main step card.
3. WHEN the summary panel is collapsed on mobile, THE Booking_Wizard SHALL display a toggle control to expand it.

---

### Requirement 21: Date Time Step Mobile Calendar Layout

**User Story:** As a mobile user, I want the date picker and time slots to be usable without excessive scrolling, so that I can complete the date/time step efficiently.

#### Acceptance Criteria

1. THE DateTime_Step SHALL render the calendar and time slot grid in a layout that does not require the user to scroll past the full calendar height to reach the time slots on mobile.
2. WHERE the viewport is below the `sm` breakpoint, THE DateTime_Step SHALL render the time slot grid immediately below the calendar with minimal vertical gap.

---

### Requirement 22: Community Feed Comment Input Mobile Keyboard

**User Story:** As a mobile user, I want the comment input to trigger the correct keyboard type, so that typing comments is comfortable on a touchscreen.

#### Acceptance Criteria

1. THE Community_Feed comment input field SHALL include `inputMode="text"` to hint the mobile keyboard type.
2. THE Community_Feed comment input field SHALL include `autoComplete="off"` to prevent unwanted autocomplete popups during comment entry.

---

### Requirement 23: Dashboard Query Grouping and Caching

**User Story:** As a user, I want the dashboard to load quickly, so that I can access my information without waiting.

#### Acceptance Criteria

1. THE dashboard page SHALL group related Supabase queries using `Promise.all` where queries are independent and can run in parallel.
2. WHERE Next.js fetch caching or Supabase query deduplication is applicable, THE dashboard page SHALL apply appropriate cache hints to avoid redundant round-trips on repeated renders.
3. THE dashboard page SHALL NOT fire more than 12 independent Supabase queries on a single page load for any user role.

---

### Requirement 24: Plate Editor Dynamic Import

**User Story:** As a user, I want the dashboard and journal pages to load quickly, so that the heavy editor bundle does not delay the initial render.

#### Acceptance Criteria

1. THE `plate-editor` component and its associated editor kit files SHALL be imported using `next/dynamic` with `{ ssr: false }` at all usage sites.
2. WHILE the editor is loading, THE page SHALL render a skeleton or loading indicator in place of the editor.

---

### Requirement 25: Remove Dead Booking Wizard Props

**User Story:** As a developer, I want the BookingWizard component interface to be clean and accurate, so that consumers are not confused by unused props.

#### Acceptance Criteria

1. THE `BookingWizard` component interface SHALL NOT include an `onConfirm` prop that is always passed as a no-op.
2. THE `ConfirmStep` component interface SHALL NOT include an `onLoad` prop if the `isSubmitting` state it drives is not used for any visible UI effect in the parent.
3. IF the `isSubmitting` state in `BookingWizard` is retained, THE Booking_Wizard SHALL use it to disable the navigation footer or show a loading indicator during submission.

---

### Requirement 26: Correctness Properties for Permission Helper

**User Story:** As a developer, I want the permission helper to be provably correct, so that authorization bugs cannot be introduced by refactoring.

#### Acceptance Criteria

1. FOR ALL inputs `(permissions, group, action)`, THE `can` function SHALL return a value of type `boolean` (strictly `true` or `false`).
2. FOR ALL inputs where `permissions` is an empty array, THE `can` function SHALL return `false`.
3. FOR ALL inputs where a permission entry has `action === "manage"` and `group` matches the queried group, THE `can` function SHALL return `true` regardless of the queried action.
4. FOR ALL inputs, calling `can(permissions, group, action)` SHALL produce the same result as calling it again with identical arguments (pure function, no side effects).
5. FOR ALL inputs where no permission entry matches the queried group, THE `can` function SHALL return `false`.

---

### Requirement 27: Correctness Properties for Booking Step Sequencing

**User Story:** As a developer, I want the booking wizard step transitions to be provably correct, so that users can never reach an invalid step state.

#### Acceptance Criteria

1. FOR ALL step transitions, THE Booking_Wizard SHALL only advance to `currentStep + 1` and SHALL NOT advance when `canProceed()` returns `false`.
2. FOR ALL step transitions, THE Booking_Wizard SHALL only retreat to `currentStep - 1` and SHALL NOT retreat below step 1.
3. FOR ALL valid Step_Config arrays of length N, THE Booking_Wizard SHALL never set `currentStep` to a value less than 1 or greater than N.
4. THE total step count derived from Step_Config SHALL always equal `Step_Config.length` (invariant).

---

### Requirement 28: Correctness Properties for Mood Score

**User Story:** As a developer, I want mood scores to always be within the valid range, so that the trend widget and mood log never display nonsensical values.

#### Acceptance Criteria

1. FOR ALL mood entries stored or displayed, THE mood score SHALL be an integer or decimal value in the range [1, 5] inclusive.
2. WHEN a mood entry with a score outside [1, 5] is received from the database, THE Mood_Trend_Widget SHALL exclude that entry from the trend calculation.
3. FOR ALL valid mood entry arrays, the average mood score computed by the Mood_Trend_Widget SHALL be in the range [1, 5] inclusive.
