# EKA Account - Mental Health & Wellness Platform

> A comprehensive Next.js application for mental health and wellness management with AI-powered insights, therapist booking, and personalized care.

## 🌟 Features

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

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Supabase account (for database)
- Stripe account (for payments)
- Square account (for bookings, optional)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Mykola-08/ekaacc.git
cd ekaacc
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:
- Supabase URL and keys
- Stripe API keys
- AI service API keys (OpenAI, Anthropic, Google AI)
- Optional: Square, email, monitoring services

4. **Set up the database:**

Follow the [Database Setup Guide](./DATABASE_SETUP_GUIDE.md) to:
- Run migrations
- Seed initial data
- Configure Row Level Security (RLS)

5. **Start the development server:**
```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see the application.

## 📁 Project Structure

```
ekaacc/
├── src/
│   ├── app/                      # Next.js 13+ App Router
│   │   ├── (app)/               # Protected app routes
│   │   │   ├── home/            # User dashboard
│   │   │   ├── sessions/        # Booking management
│   │   │   ├── journal/         # Journal entries
│   │   │   ├── goals/           # Goal tracking
│   │   │   ├── messages/        # Messaging
│   │   │   ├── therapist/       # Therapist portal
│   │   │   └── ...              # Other features
│   │   ├── admin/               # Admin panel
│   │   ├── api/                 # API routes
│   │   ├── auth/                # Auth pages
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── eka/                 # Custom components
│   │   ├── navigation/          # Navigation components
│   │   └── layout/              # Layout components
│   ├── lib/                     # Utilities and helpers
│   │   ├── supabase.ts          # Supabase client
│   │   ├── stripe.ts            # Stripe integration
│   │   └── utils.ts             # General utilities
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # Business logic services
│   ├── context/                 # React context providers
│   ├── store/                   # State management (Zustand)
│   └── types/                   # TypeScript type definitions
├── supabase/
│   └── migrations/              # Database migration files
├── public/                      # Static assets
├── e2e/                         # End-to-end tests (Playwright)
├── __tests__/                   # Unit tests (Jest)
└── docs/                        # Additional documentation
```

## 🔧 Extended Environment Variables

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

## 🔐 Authentication & Security

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

## 🎨 UI/UX

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

## 🧪 Testing

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

## 📦 Building for Production

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

## 🚢 Deployment

See the [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Vercel:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Environment Setup:
1. Set all environment variables in your hosting platform
2. Run database migrations
3. Configure custom domain and SSL
4. Set up monitoring and error tracking
5. Configure webhooks for Stripe and Square

## 🔌 API Integrations

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

## 📊 Database Schema

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

## 🔧 Configuration

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

## 🛣️ Roadmap

### Current Version: 0.1.0
- ✅ Core authentication and user management
- ✅ Basic dashboard and navigation
- ✅ Therapist booking system
- ✅ Journal and mood tracking
- ✅ Goal setting and progress tracking
- ✅ Subscription management
- ✅ Admin panel

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Video call integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Wearable device integration
- [ ] Group therapy sessions
- [ ] Insurance integration

## 👥 Contributing

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

## 📝 Documentation

- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md) - Complete database setup instructions
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Deploy to production
- [Database Requirements](./DATABASE_REQUIREMENTS.md) - Detailed schema documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Component migration to shadcn/ui
- [Implementation Progress](./IMPLEMENTATION_PROGRESS.md) - Current project status

## 🐛 Known Issues

- TypeScript warnings in some component files (non-blocking)
- Some pages still using legacy keep-react components
- AI service needs rate limiting for production

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [documentation](./docs)
- Review [closed issues](https://github.com/Mykola-08/ekaacc/issues?q=is%3Aissue+is%3Aclosed)
- Open a [new issue](https://github.com/Mykola-08/ekaacc/issues/new)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Stripe](https://stripe.com/) - Payment processing
- [OpenAI](https://openai.com/) - AI capabilities
- [Vercel](https://vercel.com/) - Hosting platform

---

**Built with ❤️ for mental health and wellness**

Last Updated: 2024-11-17
