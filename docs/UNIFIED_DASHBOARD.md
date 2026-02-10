# Unified Dashboard Architecture

## Overview

The dashboard has been unified into a **single route group** `(dashboard)` that serves
all authenticated users — patients, therapists, admins, and custom roles alike.

Pages are gated by **permissions**, not roles. Roles are simply convenience bundles
that pre-populate a user's permission set via the `role_permissions` table.

## Architecture

```
src/app/(dashboard)/
├── layout.tsx                  ← Unified layout (auth check + shell)
├── dashboard/page.tsx          ← Home (any authenticated user)
├── bookings/                   ← appointment_management.create
├── journal/                    ← patient_data.view_own
├── wallet/                     ← financial_management.read
├── resources/                  ← content_management.read
├── subscriptions/              ← financial_management.read
├── availability/               ← appointment_management.manage
├── therapist/                  ← therapist_tools.*
├── console/                    ← system_settings.read (layout-level gate)
│   ├── layout.tsx              ← PermissionGate: system_settings.read
│   ├── analytics/              ← analytics.read
│   ├── cms/                    ← content_management.manage
│   ├── community/              ← communication.manage
│   ├── database/               ← system_settings.manage
│   ├── payments/               ← financial_management.manage
│   ├── services/               ← product_management.read
│   ├── settings/               ← system_settings.manage
│   ├── subscriptions/          ← product_management.manage
│   └── users/                  ← user_management.read
├── admin/                      ← system_settings.read
├── ai-insights/                ← analytics.read
├── billing/                    ← financial_management.manage
├── blog/                       ← content_management.create
├── business/                   ← system_settings.manage
├── tools/                      ← system_settings.read
├── forms/                      ← (uses inline permission checks)
├── profile/                    ← null (any authenticated user)
├── settings/                   ← null (any authenticated user)
└── notifications/              ← null (any authenticated user)
```

## Key Components

### Permission System

| File | Purpose |
|---|---|
| `src/lib/permissions/page-permissions.ts` | Maps routes → required permissions |
| `src/lib/permissions/server.ts` | Server-side permission resolution |
| `src/lib/permissions/index.ts` | Barrel export |

### Guards & UI

| File | Purpose |
|---|---|
| `src/components/dashboard/auth/PermissionGate.tsx` | Client-side permission gate component |
| `src/components/dashboard/layout/UnifiedSidebar.tsx` | Permission-aware sidebar navigation |
| `src/components/dashboard/layout/UnifiedDashboardShell.tsx` | Dashboard shell with providers |

### Permission Resolution

1. User's **role** is read from `app_metadata.role` / `user_metadata.role`
2. Role maps to default permissions via `SYSTEM_ROLES` config in `role-permissions.ts`
3. **Custom overrides** are fetched from `user_custom_permissions` table:
   - `is_granted = true` → adds permission
   - `is_granted = false` → revokes permission
4. Effective permissions = role defaults + custom grants - custom revocations

### Adding a New Page

1. Create the page under `src/app/(dashboard)/`
2. Add its permission to `PAGE_PERMISSIONS` in `page-permissions.ts`
3. Add it to `SIDEBAR_NAV` in `page-permissions.ts` (if it should appear in sidebar)
4. If it needs a layout-level gate, create a `layout.tsx` wrapping with `<PermissionGate>`

### Granting Custom Permissions

Insert into `user_custom_permissions`:

```sql
INSERT INTO user_custom_permissions (user_id, permission_key, is_granted)
VALUES ('user-uuid', 'system_settings.read', true);
```

This grants a Patient the ability to see the Console, even though their role
doesn't include that permission by default.

## Migration from `(platform)`

The `(platform)` route group still exists for non-dashboard routes:
- API routes, webhooks, cron jobs
- Auth flows (login, callback)
- Marketing pages
- Legal pages

Dashboard-relevant pages that were in `(platform)` have been **copied** to
`(dashboard)` with permission-based guards. The originals in `(platform)` remain
for backward compatibility but can be deprecated over time.
