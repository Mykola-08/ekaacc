# EKA Balance Application Architecture

The application has been split into multiple micro-apps to ensure scalability, security, and separation of concerns.

## Applications

### 1. User App (`apps/web`)
- **Port**: 9002
- **Audience**: End users, patients, public visitors.
- **Features**: Marketing pages, User Dashboard, Booking flow, Profile management.
- **URL**: `http://localhost:9002`

### 2. Admin App (`apps/admin`)
- **Port**: 9003
- **Audience**: System administrators, support staff.
- **Features**: User management, Analytics, Content moderation, System configuration.
- **URL**: `http://localhost:9003` (Redirects to `/admin`)

### 3. Therapist App (`apps/therapist`)
- **Port**: 9004
- **Audience**: Therapists, practitioners.
- **Features**: Session management, Patient notes, Availability scheduling, Earnings view.
- **URL**: `http://localhost:9004` (Redirects to `/therapist`)

### 4. API Service (`apps/api`)
- **Port**: 9005
- **Audience**: Internal services, Webhooks.
- **Features**: Centralized integrations (Stripe, Zoom), Webhook handling, Backend logic.
- **URL**: `http://localhost:9005`

## Development

To run all apps simultaneously:
```bash
npx turbo run dev
```

To run a specific app:
```bash
npx turbo run dev --filter=admin
```

## Deployment

Each app is configured to be deployed as a separate project on Vercel.
- `apps/web` -> `eka-web`
- `apps/admin` -> `eka-admin`
- `apps/therapist` -> `eka-therapist`
- `apps/api` -> `eka-api`
