# EKA Account - Mental Health & Wellness Platform

A comprehensive Next.js application for mental health and wellness management with AI-powered insights, therapist booking, and personalized care.

## Architecture

This project is a monorepo managed with **TurboRepo**, consisting of two main applications:

1.  **Booking App** (`apps/booking-app`): The therapist booking and care management app.
2.  **SEO Website** (`apps/seowebsite`): The public-facing marketing and content site.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### For Users/Patients
- **AI-Powered Insights**: Personalized wellness recommendations using GPT, Claude, and Gemini
- **Mood & Journal Tracking**: Daily mood logging with private journaling
- **Goal Setting & Progress**: Track wellness goals with visual progress indicators
- **Therapist Booking**: Schedule sessions with certified therapists
- **Secure Messaging**: Direct communication with care providers
- **Subscription Tiers**: Flexible pricing with Free, Basic, Premium, and Enterprise plans
- **Loyalty Program**: Earn points and rewards for engagement
- **Community Features**: Connect with others on similar wellness journeys

### For Therapists
- **Client Management**: Comprehensive client dashboard and profiles
- **Session Scheduling**: Integrated booking system with Square
- **Session Notes**: Secure documentation and progress tracking
- **Billing Management**: Automated invoicing through Stripe
- **Availability Management**: Set custom schedules and time slots

### For Admins
- **User Management**: Complete user administration interface
- **Subscription Management**: Control tiers and billing
- **Analytics Dashboard**: Platform usage and performance metrics
- **Content Moderation**: Community post management
- **System Configuration**: Feature flags and settings

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

### Backend & Infrastructure
- **Database**: PostgreSQL (Supabase)
- **Payments**: Stripe
- **Booking System**: Square
- **Email**: Resend
- **File Storage**: Supabase Storage
- **Feature Flags**: Statsig

### AI Services
- **OpenAI**: GPT-4 for insights and chat
- **Anthropic**: Claude for advanced analysis
- **Google AI**: Gemini for multimodal capabilities

### Testing & Quality
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Load Testing**: k6
- **Linting**: ESLint + Prettier

### Deployment
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher (22.x recommended) - [Download](https://nodejs.org/)
- **npm** 10.x or higher (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

You'll also need accounts for the following services:

- **Supabase** - [Sign up](https://supabase.com/) for database and authentication
- **Stripe** - [Sign up](https://stripe.com/) for payment processing
- **Resend** - [Sign up](https://resend.com/) for transactional emails
- **Square** (Optional) - [Sign up](https://squareup.com/) for booking management

## Installation

Follow these steps to get the project running locally:

### 1. Clone the repository

```bash
git clone https://github.com/Mykola-08/ekaacc.git
cd ekaacc
```

### 2. Install dependencies

```bash
npm install
```

This installs all dependencies for the monorepo workspaces.

### 3. Configure environment variables

```bash
cd apps/seowebsite
cp .env.example .env.local
```

Edit `apps/seowebsite/.env.local` with your service credentials. See [Environment Variables](#environment-variables) for details.

### 4. Set up the database

Run Supabase migrations:

```bash
# For local development (recommended)
npx supabase start
npx supabase db reset

# For hosted Supabase
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 5. Start the development server

```bash
npm run dev
```

This will start all applications in parallel:
- **SEO Website**: [http://localhost:9002](http://localhost:9002)
- **Booking App**: [http://localhost:9004](http://localhost:9004)

## Project Structure

This is a Turborepo monorepo with the following structure:

```
ekaacc/
├── apps/
│   ├── booking-app/             # Booking application (Next.js)
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities and helpers
│   │   └── public/              # Static assets
│   └── seowebsite/              # Marketing & SEO site (Next.js)
│       ├── app/                 # Marketing routes
│       ├── components/          # Marketing UI components
│       ├── lib/                 # Utilities and helpers
│       └── public/              # Static assets
├── packages/
│   └── shared-ui/               # Shared UI primitives and styles
├── supabase/                    # Database migrations & edge functions
├── scripts/                     # Utility scripts
└── docs/                        # Additional documentation
```

## Extended Environment Variables

Add these to `.env.local` (or project secrets) as needed:

| Variable | Purpose |
|----------|---------|
| `PUBLIC_ROUTES` | Comma-separated list of additional unauthenticated routes |
| `RATE_LIMIT_MAX_REQUESTS` | Override per-minute in-memory rate limit (default 120) |
| `BOT_PROTECTION_ENABLED` | Set to `true` to enable UA-based bot blocking in middleware |
| `BOT_PROTECTION_BLOCK_LIST` | Comma list of substrings to match against `User-Agent` |
| `VERCEL_ANALYTICS_ENABLED` | Future flag for conditional analytics loading |
| `RESEND_API_KEY` | API key for Resend email service (required for email sending) |
| `RESEND_AUDIENCE_ID` | Optional audience ID for contact sync |
| `ACCESS_TOKEN_RATE_LIMIT` | Max requests per-minute to /api/auth/access-token (default 40) |
| `ACCESS_TOKEN_REFRESH_THRESHOLD_SECONDS` | Seconds before expiry to trigger automatic refresh (default 60) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL for distributed rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `RATE_LIMIT_WINDOW_SECONDS` | Global request rate limit window size (default 60) |
| `STATSIG_API_KEY` | Statsig console API key for feature flags/experiments |

Secrets for production should be pushed to Vercel (`vercel env add ...`) and Supabase (`supabase secrets set ...`). Refer to `wiki/RESEND_INTEGRATION.md` and security docs for details.

### Statsig Setup

1. Obtain a console API key from Statsig (format `console-xxxx`).
2. Add to local dev: append to `.env.local`:
	```bash
	STATSIG_API_KEY=console-your-key
	```
3. Add to Vercel:
	```powershell
	vercel env add STATSIG_API_KEY production
	vercel env add STATSIG_API_KEY preview
	vercel env add STATSIG_API_KEY development
	```
4. Add to Supabase secrets (for Edge Functions / server usage):
	```powershell
	supabase secrets set STATSIG_API_KEY=console-your-key
	```
5. Rotate every 90 days; update all scopes and redeploy.

Automated setup (script):
```powershell
./scripts/setup-statsig.ps1 -StatsigKey console-your-key
# or
$env:STATSIG_API_KEY="console-your-key"; ./scripts/setup-statsig.ps1
```

MCP Limitation: Current MCP tooling in this repo cannot directly write Vercel or Supabase secrets; the script wraps the respective CLIs.

#### Server vs Client Keys

| Key | Purpose | Exposure |
|-----|---------|----------|
| `STATSIG_API_KEY` | Console operations / MCP remote | Server only |
| `STATSIG_SERVER_SECRET` | Server-side gate/config evaluation | Server only (NEVER bundle) |
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | Client-side gating (optional) | Public |

#### Basic Usage (Server)
```ts
import { isFlagEnabled, getAllFlags } from './src/services/featureFlags';

const flags = await getAllFlags({ userId: 'user_123' });
if (flags.ai_insights_enabled) {
	// load AI insights module
}
```

#### Client Usage (Optional)
If you add `NEXT_PUBLIC_STATSIG_CLIENT_KEY`, you can evaluate gates client-side with `statsig-js`:
```ts
import Statsig from 'statsig-js';
await Statsig.initialize(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!, { userID: 'user_123' });
const enabled = Statsig.checkGate('ai_insights_enabled');
```

Provide graceful fallbacks for any client gating to avoid UI flicker.

### API Route Prefetch
Flags are available at `GET /api/flags`:
```bash
curl https://your-app-domain/api/flags
```
Returns:
```json
{ "flags": { "ai_insights_enabled": true, "wallet_enabled": false, ... } }
```

### Provider Integration
Use server component prefetch + client hydration:
```tsx
import { PrefetchedFlags } from '@/components/examples/FlagsStatus';

export default async function DashboardPage() {
	return <PrefetchedFlags userId="user_123" />;
}
```

### Comprehensive Flag List
| Flag | Purpose | Default Fallback |
|------|---------|------------------|
| ai_insights_enabled | AI recommendations | true |
| ai_chat_enabled | Conversational AI chat | true |
| journal_enabled | Mood & journal tracking | true |
| goals_enabled | Goal management UI | true |
| messaging_enabled | Secure user/provider messaging | true |
| community_enabled | Forums & community threads | true |
| therapist_portal_enabled | Therapist dashboard access | true |
| therapist_booking_enabled | Booking flow & scheduling | true |
| admin_dashboard_enabled | Administrative panels | true |
| analytics_enabled | Analytics dashboards | true |
| subscription_tiers_enabled | Tier gating logic | true |
| wallet_enabled | User wallet / stored value | false |
| loyalty_program_enabled | Engagement rewards program | true |
| referrals_enabled | Referral / invitations | true |
| square_integration_enabled | Square scheduling/payments | true |
| stripe_billing_enabled | Stripe billing flows | true |
| onboarding_flow_v2_enabled | New onboarding experiment | false |
| impersonation_enabled | Admin user impersonation | true |
| feature_flags_ui_enabled | Flag management UI surface | false |

Use `FeatureGate` for client-only sections:
```tsx
<FeatureGate flag="wallet_enabled" fallback={<div>Wallet coming soon" />}> <WalletPanel /> </FeatureGate>
```

## Authentication & Security

### Authentication Flow
1. User signs up via `/signup` (email/password)
2. Supabase handles authentication
3. User profile automatically created via database trigger
4. Default 'user' role assigned
5. JWT token stored in secure httpOnly cookie

### Security Features
- Row Level Security (RLS) on all database tables
- API route protection with middleware
- Rate limiting on sensitive endpoints
- CSRF protection
- XSS prevention
- Input validation with Zod
- Secure session management

## UI/UX

### Design System
- **Component Library**: shadcn/ui (Radix UI + Tailwind)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Themes**: Light/Dark mode support

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized for mobile devices
- Accessible navigation patterns

## Testing

### Unit Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### End-to-End Tests
```bash
npm run test:e2e        # Run Playwright tests
npm run test:e2e:ui     # Interactive UI mode
npm run test:e2e:debug  # Debug mode
```

### Load Testing
```bash
npm run test:load       # Basic load test
npm run test:load:api   # API stress test
npm run test:load:spike # Spike test
```

## Building for Production

### Build the application:
```bash
npm run build
```

### Type checking:
```bash
npm run typecheck
```

### Linting:
```bash
npm run lint
```

## Deployment

### Vercel Deployment (Recommended)

This is a Turborepo monorepo optimized for Vercel deployment. See the [Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) for comprehensive step-by-step instructions.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Important:** Before deploying, ensure you have:
- ✅ All environment variables configured in Vercel dashboard

- ✅ Supabase RLS policies configured
- ✅ Stripe/Square webhooks configured

### Environment Variables for Production

Required variables (see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for complete list):




**Supabase:**
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Stripe:**
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`

**Other:**
- `RESEND_API_KEY` - Email service
- `NEXT_PUBLIC_APP_URL` - Your app URL

### Deployment Verification

After deployment, run the health check:
```bash
node scripts/verify-deployment.js your-domain.vercel.app
```

### Manual Deployment Steps:
1. Set all environment variables in your hosting platform
2. Run database migrations (Supabase handles this automatically)
3. Configure custom domain and SSL in Vercel dashboard
4. Set up monitoring via Vercel Analytics
5. Configure webhooks for Stripe and Square with production URLs

## API Integrations

### Configured Services
- **Supabase**: Database, authentication, storage
- **Stripe**: Subscription management, payment processing
- **Square**: Booking management, payment processing
- **OpenAI**: GPT-4 for AI insights and chat
- **Anthropic**: Claude for advanced AI features
- **Google AI**: Gemini for multimodal AI capabilities

### Webhook Endpoints
- `/api/webhooks/stripe` - Stripe events
- `/api/webhooks/square` - Square booking events

## Database Schema

### Core Tables
- `user_profiles` - Extended user information
- `user_roles` / `user_role_assignments` - Role-based access control
- `permissions` / `role_permissions` - Granular permissions
- `user_preferences` - User settings

### Feature Tables
- `journal_entries` - Mood and journal tracking
- `goals` / `progress_entries` - Goal management
- `bookings` / `sessions` - Appointment scheduling
- `therapist_profiles` - Therapist information
- `messages` - User messaging
- `subscription_tiers` / `user_subscriptions` - Subscription management
- `loyalty_points` / `loyalty_transactions` - Rewards program
- `community_posts` - Community features

See [DATABASE_REQUIREMENTS.md](./DATABASE_REQUIREMENTS.md) for complete schema documentation.

## Configuration

### Feature Flags
Enable or disable features via environment variables:
```bash
FEATURE_FLAG_AI_INSIGHTS=true
FEATURE_FLAG_COMMUNITY=true
FEATURE_FLAG_BOOKINGS=true
FEATURE_FLAG_SUBSCRIPTIONS=true
```

### AI Service Selection
Configure which AI service to use for different features in your app logic.

## Roadmap

### Current Version: 0.1.0
- Core authentication and user management
- Basic dashboard and navigation
- Therapist booking system
- Journal and mood tracking
- Goal setting and progress tracking
- Subscription management
- Admin panel

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Video call integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Wearable device integration
- [ ] Group therapy sessions
- Insurance integration

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for new features
- Document complex logic

## Documentation

- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md) - Complete database setup instructions
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Deploy to production
- [Database Requirements](./DATABASE_REQUIREMENTS.md) - Detailed schema documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Component migration to shadcn/ui
- [Implementation Progress](./IMPLEMENTATION_PROGRESS.md) - Current project status

## Known Issues

- TypeScript warnings in some component files (non-blocking)
- Some pages still using legacy keep-react components
- AI service needs rate limiting for production

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [documentation](./docs)
- Review [closed issues](https://github.com/Mykola-08/ekaacc/issues?q=is%3Aissue+is%3Aclosed)
- Open a [new issue](https://github.com/Mykola-08/ekaacc/issues/new)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Stripe](https://stripe.com/) - Payment processing
- [OpenAI](https://openai.com/) - AI capabilities
- [Vercel](https://vercel.com/) - Hosting platform

---

Built for mental health and wellness

Last Updated: 2024-11-22
