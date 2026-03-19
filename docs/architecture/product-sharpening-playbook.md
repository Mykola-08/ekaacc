# Product Sharpening Playbook

This playbook translates architecture into practical product direction so the
platform behaves like **one coherent system** instead of disconnected feature
clusters.

## 1) Product shape: module-first, not route-first

Use route groups for implementation, but drive UX and roadmap using product
modules:

1. Home
2. Bookings / Calendar
3. Clients / People
4. Sessions
5. Plans & Billing
6. Resources
7. Assignments / Programs
8. Community
9. Shop
10. Inbox / Messages
11. Analytics / Insights
12. Settings
13. Admin / Operations

## 2) Shared engines (cross-role)

Build once, reuse across all roles:

- Identity engine
- Permissions engine
- Entitlements engine
- Scheduling engine
- Session engine
- Content/Resources engine
- Communication engine
- Commerce engine
- AI orchestration engine
- Analytics + audit engine

### 2.1 Entitlements engine (highest priority)

The entitlement layer must drive access and counters consistently:

- active/inactive subscription
- sessions included/used/remaining
- credits and bonus counters
- discounts and upgrades
- unlocked communities/resources/courses
- family/dependent access
- priority booking windows
- shop and bundle benefits

## 3) Navigation model by role

### Client

- Home
- Bookings
- Plan
- Resources
- Community
- Shop
- Inbox
- Settings

### Therapist

- Home
- Calendar
- Clients
- Sessions
- Assignments
- Resources
- Community
- Earnings
- Inbox
- Settings

### Admin

- Home
- Operations
- Users
- Bookings
- Catalog
- Resources
- Community
- Billing
- Analytics
- AI
- Settings

## 4) Role experience requirements

## 4.1 Client

Client home should be constrained to 6–8 primary cards:

- next booking
- plan status and sessions remaining
- today’s assignments
- recommended resource
- therapist follow-up message
- community highlights
- quick actions

Client quality-of-life details:

- continue where you left off
- last visited / unread markers
- one-tap rebook
- pending forms before booking
- clear plan inclusion page
- invoice/receipt center
- dependent switcher for family accounts

## 4.2 Therapist

Therapist home should be operational, not vanity analytics:

- today sessions timeline
- follow-up due clients
- incomplete notes
- assignment review queue
- payment summary

### Therapist Today view (must-have)

- timeline + prep context
- one-click launch session mode
- one-click message/reschedule/mark complete
- outstanding tasks panel

### Session Mode (flagship workflow)

- client context header
- session goal + timer
- alerts/flags + previous summary
- structured notes + templates
- private/shareable switch
- assignment builder
- resource/product recommendations
- follow-up builder
- AI summarize/suggest next steps

## 4.3 Admin

Admin home should operate as a control center:

- revenue + bookings health
- failed payments and no-show trends
- moderation and report queues
- therapist utilization
- unresolved support items
- AI usage/cost + anomalies

Admin workflow essentials:

- saved table views and bulk actions
- filter persistence in URL
- CSV export
- strict impersonation audit logs
- temporary grants/manual adjustments
- moderation action history

## 4.4 Educator

If educator role is active, support it as a real workflow:

- course builder and lesson sequencing
- cohort enrollment and progress
- prerequisites and release rules
- lesson-level comments/announcements
- stuck learner alerts
- course/community linking

## 5) Community maturity model

Current baseline (threading, reactions, reporting, moderation) should evolve to:

- spaces + channels + threads + events + pinned resources
- channel types (announcement, discussion, Q&A, cohort, premium)
- moderation escalation with severity and history
- post save/follow/mute/unread controls
- AI summaries for missed discussions
- plan/cohort-gated channel access

Channel settings should include:

- posting/comment permissions
- file uploads
- slow mode
- approval requirements
- reports on/off
- welcome message and pinned items
- linked resources and events

## 6) Resources architecture

Move from “saved resources” to layered resource ownership:

- global library
- therapist library
- assigned resources
- saved resources
- program/lesson resources
- community-linked resources

Resource metadata should include:

- type, category, tags
- audience and visibility scope
- plan access level
- duration/difficulty
- author and updated date
- completion mode/progress
- language and version

## 7) Assignments, programs, goals

Define a single assignment model covering:

- exercise
- reflection/check-in
- protocol
- lesson
- habit tracker
- form/follow-up task

Assignment capabilities:

- due dates + repeat schedule
- snooze/remind later
- comments + attachments
- completion proof and therapist feedback
- bundle into reusable programs

Goal system enhancements:

- milestones + weekly review
- therapist comments
- linked assignments and mood/check-in context
- trend and risk indicators

## 8) Booking, billing, and shop integration

### Booking

- waitlist + smart rebook
- credit auto-application
- eligibility checks + upgrade paths
- preparation instructions
- no-show tracking + policy clarity
- timezone-safe confirmations and ICS export

### Billing and plans

Client-facing plan pages must clearly show:

- included/used/remaining sessions
- renewal/status
- unlocked benefits
- savings and upgrade suggestions

### Shop

Connect shop to care workflows:

- therapist/session recommendations
- plan-aware pricing
- post-session kits
- resource-linked products
- reorder and subscriptions

## 9) AI placement strategy

AI should be inline and contextual, not isolated:

- home summary cards
- session mode assistant
- notes and assignment composer
- community summarization
- resource search and recommendation
- admin anomaly and queue summaries

AI UX rules:

- draft/final markers
- clear source provenance where available
- one-click insert/edit/send flows
- explicit role boundaries for memory and permissions

## 10) Settings information architecture

Shared shell for all roles:

- Account
- Profile
- Notifications
- Connected apps
- Security
- Preferences

Role-specific extensions:

- Client: Billing & plan, Family, Communication preferences
- Therapist: Availability, Services, Session workflow, Templates, Calendar sync,
  Payouts
- Admin: Organization, Permissions, Plans, Bookings, Community, Resources, Shop,
  AI, Integrations, Audit/Security

Settings UX requirements:

- search in settings
- section-level saves
- unsaved change warnings
- restore defaults
- critical-change history
- validation + integration test actions

## 11) Design and UX polish guardrails

Visual direction:

- calm premium neutrals
- restrained accent system
- strong spacing rhythm
- readable type hierarchy

Interaction direction:

- fast, subtle spring transitions
- skeletons over spinners when possible
- keyboard support in therapist/admin surfaces
- preserve filters/search state when navigating back
- autosave drafts and recover unsent work

## 12) Immediate execution order

### Phase 1 (foundation)

1. Entitlements engine hardening
2. Session Mode depth and Therapist Today view
3. Client plan benefits/counters UX
4. Booking/credit logic cleanup
5. Settings IA cleanup

### Phase 2 (connected care)

1. Resource layering architecture
2. Assignments/programs standardization
3. Structured community expansion
4. Shop integration into care workflows
5. Inline AI rollout across modules

### Phase 3 (scale)

1. Educator/cohort depth
2. Advanced family/dependent workflows
3. Moderation operations expansion
4. Automation builder
5. Advanced analytics and anomaly detection

## 13) Extended implementation checklist (full requested scope)

This section captures the remaining detailed requirements so teams can implement
the full product vision without losing smaller high-impact UX details.

### 13.1 Client details checklist

- “Last visited” marker on resources
- “Continue where you left off”
- “X sessions left this month”
- plan savings counters (“You saved X this month”)
- renewal countdown and plan-change nudges
- plan-tier unlock previews
- one-tap rebook with same therapist/service
- “recommended after your last session” labels
- “new in your plan” labels
- pending forms banner before next booking
- therapist-updated notes/resources indicators
- save/favorite/complete actions on resources
- optional adherence streaks where clinically useful
- hide completed resources by default
- add-to-device calendar actions
- single clear reschedule CTA
- reminder + preparation notes before booking
- dependent switcher in-family accounts
- invoice and receipt center
- clear “what your plan includes” page

### 13.2 Therapist details checklist

- keyboard shortcuts in high-frequency views
- slash command palette inside notes
- duplicate previous session structure
- reusable note templates and pinned templates
- recent clients list
- “last seen X days ago” marker
- “plan expires soon” chip
- “unpaid invoice” chip
- “adherence low” chip
- draft autosave for notes
- split-view (notes + client history)
- quick assign from session
- quick product recommendation from session
- one-click send summary
- “client waiting” check-in marker
- “needs attention” escalation flag
- guardian involvement badge for child profiles

### 13.3 Admin details checklist

- strict impersonation + immutable audit trail
- bulk actions across queues/tables
- saved table views
- URL-persistent filters
- CSV export on operational data pages
- “recently changed by” metadata
- schedule conflicts panel
- temporary/manual entitlement controls
- manual credit adjustments with reason
- manual unlocks for resources/channels
- invoice adjustment/forgiveness workflow
- duplicate account detection + merge tooling
- therapist utilization heatmap
- moderation/report queue health indicators
- draft/publish/archive content statuses
- rollback-friendly content versioning

### 13.4 Educator details checklist

- duplicate lesson action
- prerequisite lesson chains
- release-on-date scheduling
- release-after-completion gates
- embedded quiz/check-in blocks
- lesson comment threads
- featured resources inside lessons
- course-level announcements
- student progress overview
- “stuck learner” alerts
- cohort calendar linking

## 14) Permissions hardening and governance

### 14.1 Permission bundles

Support both granular permissions and operator-friendly bundles:

- therapist_basic
- therapist_senior
- educator
- moderator
- finance_admin
- content_admin
- operations_admin
- support_staff

### 14.2 Permission UX and audit requirements

- inheritance view (effective permission trace)
- “why user has access” explanation panel
- direct grant/revocation audit feed
- temporary grants with expiry
- compare two users’ permission sets
- sensitive action confirmation paths

### 14.3 Sensitive action protection matrix

Require elevated permission checks and audit logs for:

- billing and plan changes
- refunds/adjustments
- role and permission changes
- moderation decisions
- internal therapist-note visibility
- AI configuration changes
- product pricing updates
- entitlement model changes
- user deletion/export actions
- guardian/child visibility overrides

## 15) Community, resources, assignments, and AI “done” criteria

### 15.1 Community done criteria

- spaces/channels/events/pinned resources modeled explicitly
- channel type templates (announcement/Q&A/discussion/cohort/premium)
- moderation escalation with action history and outcomes
- save/follow/mute/unread UX in place
- AI missed-discussion summary available
- plan/cohort-gated access enforced by entitlement engine

### 15.2 Resources done criteria

- layered ownership (global, therapist, assigned, saved, program,
  community-linked)
- metadata completeness (audience, tier, duration, version, visibility, etc.)
- progress and completion semantics defined
- assignment/session/community linkage implemented
- analytics for usage, completion, and stale content

### 15.3 Assignments done criteria

- one canonical assignment schema across types
- recurrence, due/snooze/reminder semantics
- comments, attachments, and therapist feedback loops
- template/program bundling model
- adherence and confidence signal surfaces

### 15.4 AI done criteria

- inline placement across key workflows (home, session, assignments, community,
  admin)
- draft/final + provenance labeling
- explicit edit/approve/send UX
- role-boundary and memory-boundary enforcement
- safe fallback and low-confidence handling paths

## 16) UX quality bars and overlooked essentials

### 16.1 Cross-role polish requirements

- command palette
- recent items and pinned items
- saved filters/views
- autosave drafts
- archive over hard-delete where possible
- duplicate action on common entities
- activity timeline on major entities
- undo toasts for reversible actions
- retry and degraded-network states
- skeleton loading states
- conflict warning UI
- empty states with next action
- sticky breadcrumbs on deep pages

### 16.2 Trust and operational clarity markers

- visible audit trails for sensitive edits
- “AI-generated” markers
- integration “last synced” status
- payment and moderation status badges
- system-message vs human-message distinction
- file upload progress + recovery
- calendar sync health indicator

## 17) Product operating principles

Every major page should answer three questions immediately:

1. What is happening now?
2. What matters most right now?
3. What should I do next?

If a feature cannot support those answers, it should be redesigned before
shipping.
