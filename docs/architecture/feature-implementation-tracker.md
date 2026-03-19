# Feature Implementation Tracker (Blueprint Execution)

This tracker breaks the product-sharpening blueprint into executable batches and
tracks what is already implemented versus in progress.

## Phase 1 — Foundation (in progress)

- [x] Plan & benefits page (`/plan`) + entitlement summary action
- [x] Therapist Today operational page (`/therapist/today`)
- [x] Settings section search/filter UX
- [x] Resource progress tracking (opened/completed state)
- [x] Resource hide-completed default filter
- [x] Inbox and Operations module entry routes
- [x] Global command palette (`Cmd/Ctrl + K`) with module navigation
- [ ] Entitlement-aware booking guardrails (credits/eligibility)
- [ ] Unified assignment schema implementation
- [ ] Session mode deep workflow improvements

## Phase 2 — Connected care

- [ ] Community spaces/channels/event model and moderation escalation queue
- [ ] Resource layering (global/therapist/assigned/saved/program/community)
- [ ] Assignment engine expansion (repeat/snooze/feedback/adherence)
- [ ] Shop-to-careflow integration (plan-aware bundles/recommendations)
- [ ] Inline AI actions in notes/resources/community/admin queues

## Phase 3 — Scale and operations

- [ ] Educator/cohort workflows (release rules, progress, alerts)
- [ ] Advanced family/dependent controls and policies
- [ ] Automation builder and notification orchestration
- [ ] Advanced analytics and anomaly detection surfaces
- [ ] Permission bundle management UX and sensitive-action controls

## Current implementation notes

- Prioritize “one product” behavior by reusing shared engines (identity,
  permissions, entitlements, scheduling, content, communication, commerce, AI,
  analytics).
- Avoid isolated pages without module ownership.
- Every new page should answer: what is happening now, what matters now, and
  what should the user do next.
