# Feature Documentation & Unified System Overview

This document serves as the comprehensive registry of all features, roles, and design patterns within the EKA Balance Unified System.

## 1. User Roles & Feature Matrix

### **Admin (Super User)**
*   **Deep Control Dashboard** (`/admin`)
    *   **Feature Matrix**: Visual tree to toggle system capabilities globally or per-role.
    *   **User Management**: Deep dive into user profiles, impersonation, and manual overrides.
    *   **Audit Logs**: Unified stream of all system events (`audit_events`).
    *   **External Purchases**: Log manual orders (Agency/Supplements) for users.
*   **Console Tools** (`/console`)
    *   **CMS**: Content management for marketing pages.
    *   **Analytics**: Business intelligence dashboards.

### **Therapist**
*   **Workspace** (`/therapist`)
    *   **Patient Manager** (`/therapist/patients`):
        *   Directory of assigned clients.
        *   Deep View: Inspect Client Journal & History.
    *   **Assignment System** (`/therapist/assignments`):
        *   Create & Distribute Homework/Exercises.
        *   Track Completion status.
    *   **Session Management**:
        *   Upcoming Appointments view.
        *   Session Notes & History.

### **Client (User)**
*   **Dashboard** (`/dashboard`)
    *   **Role-Aware View**: Shows Next Session, Wallet Balance, Wellness Goals.
    *   **Progressive Disclosure**: Advanced features appear as they are enabled.
*   **Booking System** (`/book`)
    *   **Wizard Flow**: Multi-step booking (Service -> Therapist -> Date -> Confirm).
    *   **Priority Access**: Feature-flagged priority slots for VIPs.
*   **Wellness Tools**:
    *   **Journal** (`/journal`): Private reflection log (visible to therapist).
    *   **Assignments** (`/assignments`): "My Homework" checklist with completion tracking.
*   **Community Hub** (`/community`):
    *   Channel-based discussions (General, Anxiety Support, Wins).
    *   Post, Like, and Reply functionality.
*   **Settings** (`/settings`):
    *   Profile Management.
    *   **Telegram Integration**: Link account via Bot for notifications.
    *   Notification Preferences.

---

## 2. Global Design & UX Patterns (Nova System)

### **Visual Language**
*   **Design Tokens**: Centralized in `globals.css` and `design-tokens.ts`.
*   **Radius**: `1.25rem` (20px) base radius for Apple-style cards.
*   **Colors**: `oklch` color space for vibrant, accessible palettes.
*   **Typography**: Geist Sans / Geist Mono.

### **Interaction Patterns**
1.  **Morphing Actions**:
    *   *Concept*: Buttons transform into status indicators (Loading Spinner -> Checkmark/Error) instead of intrusive popups.
    *   *Usage*: "Save", "Confirm Booking", "Mark Complete".
    *   *Component*: `<MorphingActionButton />`
2.  **Morphing Toaster**:
    *   *Concept*: Notifications stack gracefully at the bottom-right, morphing in height/width.
    *   *Component*: `<MorphingToaster />`
3.  **Confirmation Askers**:
    *   *Concept*: Destructive actions trigger a focused Alert Dialog, requiring explicit confirmation.
    *   *Usage*: Delete Account, Cancel Session.
4.  **Wizard Flows**:
    *   *Concept*: Complex tasks are broken into stepped screens with progress indicators.
    *   *Usage*: Booking, Onboarding.

### **Technical Patterns**
*   **Feature Flags**:
    *   Hierarchical resolution: **User Override > Role Override > Parent Feature > System Default**.
    *   Client Hook: `useFeature('key')`.
*   **Unified Logging**:
    *   All write actions log to `audit_events` via `log_event` RPC.
*   **Secure Mutations**:
    *   Server Actions used for all data modification.
    *   Strict RLS policies on all tables.
