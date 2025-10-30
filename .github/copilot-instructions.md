# EKA Account - Copilot Instructions

A Next.js 16+ therapy management system with mock/Firebase dual-mode architecture. This guide focuses on **non-obvious patterns** essential for productive development.

## 1. Critical: Service Abstraction Architecture

### The Pattern That Drives Everything

Every data operation flows through the **IDataService interface** (`src/services/data-service.ts`). This allows instant switching between mock (development) and Firebase (production) without changing application code.

**Switch Data Source (Requires Dev Server Restart):**
```typescript
// src/services/data-service.ts
export const USE_MOCK_DATA = true; // Change to false for Firebase
```

**Never Do This:**
```typescript
// ❌ Direct Firebase import
import { db } from '@/firebase/firebase';
// ❌ Direct mock data import
import { mockUsers } from '@/services/mock-data-service';
```

**Always Do This:**
```typescript
// ✅ Use abstraction layer
import { getDataService } from '@/services/data-service';
const service = await getDataService();
const users = await service.getAllUsers();
```

### Service Pattern Philosophy

This project uses **interface-first services** for all domain logic:
- `IPaymentService` → `MockPaymentService` / `FirestorePaymentService` 
- `ISubscriptionService` → `MockSubscriptionService` / `FirestoreSubscriptionService`
- `IWalletService`, `IReferralService`, `IThemeService`, etc.

When adding features, extend interfaces first, then implement both mock and Firebase versions.

## 2. Development Commands (Non-Standard Ports)

```bash
npm run dev          # Next.js dev server on PORT 9002 (not 3000)
npm run test         # Vitest with jsdom
npm run typecheck    # TSC with --noEmit
npm run genkit:dev   # Genkit AI flows development UI
```

**Why Port 9002?** Configured in `package.json` to avoid conflicts. Always use `http://localhost:9002`.

### Environment Setup

**Quick Start (Mock Data - No Firebase Required):**
```bash
# Ensure USE_MOCK_DATA is true in src/services/data-service.ts
export const USE_MOCK_DATA = true;

# Run immediately - no .env.local needed for mock mode
npm run dev
```

**Production Setup (Firebase Required):**

Create `.env.local` with Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Square Integration
SQUARE_ACCESS_TOKEN=your_square_token
SQUARE_ENV=Sandbox

# Optional: Stripe Integration  
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

# Optional: Google AI (Genkit)
GOOGLE_GENAI_API_KEY=your_google_ai_key
```

**Common Error:** `Firebase: Error (auth/invalid-api-key)` means:
1. Missing `.env.local` file, OR
2. You need to switch to mock data mode (set `USE_MOCK_DATA = true`)

## 3. Next.js App Router Structure

### Route Groups (Non-Standard)
- `src/app/(app)/` - Authenticated routes with shared layout (`AppHeader` + `AppSidebar`)
- `src/app/admin/` - Admin-only pages (role-based access)
- `src/app/therapist/` - Therapist dashboard
- `src/app/login/`, `src/app/onboarding/` - Public routes

### Critical Layout Hierarchy
```
src/app/(app)/layout.tsx
├── AuthProvider (Firebase auth context)
├── SidebarProvider (Radix UI sidebar state)
│   └── AppSidebar + AppHeader (nav components)
└── AIAssistant (floating chat widget)
```

**Client Components Pattern:** Most layouts/pages use `'use client'` because of Firebase auth state and Zustand stores.

### Data Access in Components
```typescript
// Server components or API routes
const service = await getDataService();
const sessions = await service.getSessions();

// Client components with caching
import { useOptimizedData } from '@/hooks/use-optimized-data';
const { data: sessions } = useOptimizedData({
  cacheKey: 'sessions',
  fetcher: async () => {
    const service = await getDataService();
    return service.getSessions();
  }
});
```

## 4. State Management Patterns

### Zustand for Global State
```typescript
// src/store/app-store.ts - Singleton pattern
export const useAppStore = create<AppState>()(
  devtools((set, get) => ({ ... }), { name: 'AppStore' })
);
```

### React Hooks for Data Fetching
```typescript
// src/hooks/use-optimized-data.ts - Built-in caching layer
useOptimizedData({
  cacheKey: 'sessions',
  fetcher: () => dataService.getSessions(),
  staleTime: 300000, // 5 min cache
});
```

**Pattern:** Prefer `useOptimizedData` over raw `useEffect` for data fetching—it provides request deduplication and cache management.

## 5. AI Integration (Genkit Flows)

AI features use Google's **Genkit framework** (not OpenAI SDK):

```typescript
// src/ai/genkit.ts - Single AI instance
export const ai = genkit({ plugins: [googleAI()] });

// src/ai/flows/*.ts - Reusable AI workflows
export const summarizeSessionFlow = ai.defineFlow({ ... });
```

**To Add AI Features:**
1. Create flow in `src/ai/flows/`
2. Call from API route: `POST /api/ai/your-feature`
3. Never call flows directly from client components

**Development:** Use `npm run genkit:dev` for flow testing UI.

## 6. Firebase Configuration (Critical for Production)

### Multi-Service Setup
```typescript
// src/firebase/firebase.ts
export { auth, db, storage, functions, database, remoteConfig, analytics };
```

**Non-Obvious:** This project uses **both** Firestore (`db`) and Realtime Database (`database`). Check schema docs before choosing.

### Security Rules Location
- `firestore.rules` - Firestore security (role-based access)
- Firestore indexes: `firestore.indexes.json`

## 7. Payment & Wallet System

### Dual Payment Providers
- **Square SDK** (`src/server/square-client.ts`) - Booking appointments
- **Stripe SDK** (`src/services/subscription-manager.ts`) - Subscription payments

**Square Pattern:** Server-side wrapper prevents client credential exposure:
```typescript
// ✅ Server Actions only
import { listBookings } from '@/server/square-client';
// ❌ Never import Square SDK in client components
```

### Wallet Architecture
- `src/services/wallet-service.ts` - Internal wallet balance system
- `src/services/payment-service.ts` - Bizum/Cash payment requests (manual confirmation workflow)
- See `docs/firestore-database-schema.md` for 12-collection Firestore structure

## 8. Testing Conventions

### Vitest with React Testing Library
```typescript
// Tests in: src/__tests__/ or src/components/__tests__/
// Mock Firebase: Always mock @/firebase/firebase in tests
vi.mock('@/firebase/firebase', () => ({ db: mockDb }));
```

**Path Alias:** Tests use `@/` imports (configured in `vitest.config.ts`).

## 9. Type System Notes

### Shared Types Location
- `src/lib/types.ts` - Core domain types (User, Session, Report)
- `src/lib/wallet-types.ts` - Payment/wallet-specific types
- `src/lib/subscription-types.ts` - Subscription tiers and status

**Timestamp Handling:** Firebase uses `Timestamp` objects; mocks use ISO strings. Services normalize this.

## 10. UI Component Library

- **Radix UI + Tailwind** primitives in `src/components/ui/`
- Custom components in `src/components/eka/`
- **No Global CSS Modules** - Tailwind utility classes only
- `cn()` helper from `@/lib/utils` for conditional classes

## 11. Documentation Structure

- `docs/` - Database schemas, feature specs, implementation guides
- `Documentation/` - Quick start guides, performance optimizations
- **Start Here:** `docs/QUICK_START_GUIDE.md` for wallet/payment system overview

## 12. Common Pitfalls

1. **Forgetting to restart after `USE_MOCK_DATA` change** - Next.js cache doesn't pick it up
2. **Missing Firebase credentials causing `auth/invalid-api-key`** - Either add `.env.local` OR switch to `USE_MOCK_DATA = true`
3. **Importing Firebase directly** - Always use `getDataService()` abstraction
4. **Wrong port (3000 vs 9002)** - Check `package.json` scripts
5. **Mixing Firestore and Realtime Database** - Verify schema docs first
6. **Client-side Square SDK usage** - Use `src/server/square-client.ts` wrapper only
7. **Running without environment setup** - Mock mode works out of the box; Firebase mode needs `.env.local`
