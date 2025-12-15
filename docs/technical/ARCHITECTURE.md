# Application Architecture & Best Practices

## Overview

This document outlines the architectural decisions, design patterns, and best practices implemented in the Ekaacc application.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Service Layer Design](#service-layer-design)
3. [Error Handling Patterns](#error-handling-patterns)
4. [Data Flow](#data-flow)
5. [Security Practices](#security-practices)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategy](#testing-strategy)
8. [Deployment](#deployment)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  (Next.js App Router, React Components, Client Hooks)      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                         │
│  (Next.js API Routes, Webhooks, Server Actions)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  (Business Logic, Email, Notifications, Payments)          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            
┌──────────┐  ┌──────────┐  
│ Supabase │  │  Resend  │  
│   (DB)   │  │ (Email)  │  
└──────────┘  └──────────┘  
```

### Key Components

1. **Client Layer** - React components and hooks
2. **API Layer** - Next.js API routes and server actions
3. **Service Layer** - Business logic and external integrations
4. **Data Layer** - Supabase (PostgreSQL + Auth)
5. **External Services** - Resend, Stripe, Square

---

## Service Layer Design

### Principles

1. **Single Responsibility** - Each service has one clear purpose
2. **Dependency Injection** - Services accept configuration, not hardcoded values
3. **Fail-Safe Defaults** - Graceful degradation when services unavailable
4. **Result Pattern** - Type-safe error handling without exceptions
5. **Comprehensive Logging** - All operations logged with context

### Service Structure

```typescript
/**
 * Standard service structure
 */
export class ExampleService {
  // Constants
  private static readonly CONFIG_KEY = 'value';
  private static readonly MAX_RETRIES = 3;

  /**
   * Public API method
   * @param params - Method parameters
   * @returns Result<T, E> - Type-safe result
   */
  public static async operation(
    params: OperationParams
  ): Promise<Result<ReturnType, ErrorType>> {
    return Result.wrap(async () => {
      // 1. Validate inputs
      this.validateInputs(params);

      // 2. Execute operation
      const result = await this.executeWithRetry(params);

      // 3. Log success
      logger.info('Operation completed', { params });

      // 4. Return result
      return result;
    });
  }

  /**
   * Private helper methods
   */
  private static validateInputs(params: OperationParams): void {
    if (!params.required) {
      throw new Error('Required parameter missing');
    }
  }

  private static async executeWithRetry(
    params: OperationParams
  ): Promise<ReturnType> {
    // Implementation with retry logic
  }
}
```

### Service Categories

#### 1. Communication Services

**Purpose:** Handle email, notifications, and messaging

**Services:**
- `EmailService` - Core email sending
- `NotificationService` - Multi-channel notifications
- `TransactionalEmailService` - User-facing transactional emails
- `EmailIntegrationService` - Event-triggered emails

**Pattern:**
```typescript
// Single channel, simple operation
EmailService.sendWelcomeEmail(to, name, url)

// Multi-channel, preference-aware
NotificationService.send({
  userId,
  type,
  category,
  title,
  message
})
```

#### 2. Payment Services

**Purpose:** Handle subscriptions and payments

**Services:**
- `StripeService` - Stripe integration
- `PaymentService` - Payment processing
- `SubscriptionService` - Subscription management

#### 3. Data Services

**Purpose:** Data operations and caching

**Services:**
- `EnhancedDataService` - Data fetching and caching
- `WalletService` - User wallet operations
- `ReferralService` - Referral tracking

#### 4. Integration Services

**Purpose:** Third-party service integrations

**Services:**
- `ExternalServiceSync` - Multi-service synchronization
- `BidirectionalSyncService` - Two-way data sync
- `SquareService` - Square integration

---

## Error Handling Patterns

### The Result Pattern

**Why:** Type-safe error handling without try-catch

**Structure:**
```typescript
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };
```

**Usage:**
```typescript
// Service returns Result
async function fetchUser(id: string): Promise<Result<User, Error>> {
  return Result.wrap(async () => {
    const user = await db.users.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  });
}

// Caller handles Result
const result = await fetchUser('123');

if (Result.isOk(result)) {
  // TypeScript knows result.value is User
  console.log(result.value.name);
} else {
  // TypeScript knows result.error is Error
  console.error(result.error.message);
}
```

**Benefits:**
1. **Type Safety** - Compiler enforces error checking
2. **No Exceptions** - Predictable control flow
3. **Composable** - Easy to chain operations
4. **Explicit** - Errors are part of the signature

### Error Categories

#### 1. Validation Errors

```typescript
class ValidationError extends Error {
  constructor(
    public field: string,
    public reason: string
  ) {
    super(`Validation failed for ${field}: ${reason}`);
    this.name = 'ValidationError';
  }
}

// Usage
if (!isValidEmail(email)) {
  return Result.err(
    new ValidationError('email', 'Invalid format')
  );
}
```

#### 2. External Service Errors

```typescript
class ExternalServiceError extends Error {
  constructor(
    public service: string,
    public statusCode?: number,
    message?: string
  ) {
    super(message || `${service} request failed`);
    this.name = 'ExternalServiceError';
  }
}

// Usage
try {
  await resend.emails.send(params);
} catch (error) {
  return Result.err(
    new ExternalServiceError('Resend', error.statusCode)
  );
}
```

#### 3. Not Found Errors

```typescript
class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string
  ) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Error Logging

```typescript
import { createLogger } from '@/lib/logger';

const logger = createLogger({ service: 'EmailService' });

// Success logging
logger.info('Email sent', { 
  to: email, 
  subject,
  emailId: result.id 
});

// Error logging
logger.error('Email failed', { 
  error: error.message,
  stack: error.stack,
  context: { to, subject }
});

// Warning logging
logger.warn('Retrying operation', { 
  attempt,
  maxRetries,
  error: error.message 
});
```

---

## Data Flow

### Request Flow

```
1. Client Request
   ↓
2. API Route Handler
   ├─ Authentication Check
   ├─ Input Validation
   └─ Rate Limiting
   ↓
3. Service Layer
   ├─ Business Logic
   ├─ Data Validation
   └─ External API Calls
   ↓
4. Data Layer
   ├─ Database Queries
   ├─ Caching
   └─ Transaction Management
   ↓
5. Response
   ├─ Format Response
   ├─ Error Handling
   └─ Logging
```

### Example: Send Notification

```typescript
// 1. Client Request
const response = await fetch('/api/notifications', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-123',
    type: 'info',
    category: 'updates',
    title: 'New Feature',
    message: 'Check it out!'
  })
});

// 2. API Route Handler
export async function POST(request: NextRequest) {
  // Authentication
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Input validation
  const body = await request.json();
  if (!body.userId || !body.title || !body.message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // 3. Service Layer
  const result = await NotificationService.send(body);

  // 4. Response
  if (Result.isOk(result)) {
    return NextResponse.json({ success: true, data: result.value });
  } else {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }
}
```

### State Management

#### Client State
- React hooks for local state
- Context for shared state
- URL state for navigation

#### Server State
- Supabase for persistent data
- Redis for caching (if configured)
- Session storage for auth

---

## Security Practices

### 1. Input Validation

**Always validate and sanitize inputs:**

```typescript
// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// HTML escaping
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char] || char);
}

// SQL injection prevention (use Supabase parameterized queries)
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);  // Safe - parameterized
```

### 2. Authentication & Authorization

```typescript
// API route protection
async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error('Invalid token');
  }

  return user;
}

// Role-based access
async function requireAdmin(user: User) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required');
  }
}
```

### 3. Rate Limiting

```typescript
// Implement rate limiting for sensitive endpoints
const rateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 50             // 50 requests per hour
});

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  
  if (!await rateLimiter.check(userId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Process request
}
```

### 4. Environment Variables

```typescript
// Never expose secrets to client
// Use NEXT_PUBLIC_ prefix only for public values

// ❌ Bad
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// ✅ Good
const API_KEY = process.env.SECRET_KEY;  // Server-only
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;  // Client-safe
```

### 5. CORS Configuration

```typescript
// API route with CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## Performance Optimization

### 1. Caching Strategies

#### In-Memory Cache

```typescript
const cache = new Map<string, { data: any; expires: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expires: Date.now() + ttlMs
  });
}

// Usage
const CACHE_TTL = 5 * 60 * 1000;  // 5 minutes

async function getUserPreferences(userId: string) {
  const cached = getCached<Preferences>(`prefs:${userId}`);
  if (cached) return cached;

  const prefs = await fetchPreferencesFromDb(userId);
  setCache(`prefs:${userId}`, prefs, CACHE_TTL);
  return prefs;
}
```

#### React Query / SWR

```typescript
// Client-side caching
import useSWR from 'swr';

function useUserProfile(userId: string) {
  const { data, error, mutate } = useSWR(
    `/api/users/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000  // 1 minute
    }
  );

  return { profile: data, error, refresh: mutate };
}
```

### 2. Database Optimization

```typescript
// Use indexes for common queries
// Create index in migration:
-- CREATE INDEX idx_notifications_user_created 
-- ON notifications(user_id, created_at DESC);

// Select only needed fields
const { data } = await supabase
  .from('notifications')
  .select('id, title, created_at')  // Not SELECT *
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20);

// Use pagination
const PAGE_SIZE = 20;
const { data, count } = await supabase
  .from('notifications')
  .select('*', { count: 'exact' })
  .range(offset, offset + PAGE_SIZE - 1);
```

### 3. Parallel Operations

```typescript
// ❌ Sequential (slow)
const user = await fetchUser(userId);
const prefs = await fetchPreferences(userId);
const notifications = await fetchNotifications(userId);

// ✅ Parallel (fast)
const [user, prefs, notifications] = await Promise.all([
  fetchUser(userId),
  fetchPreferences(userId),
  fetchNotifications(userId)
]);
```

### 4. Code Splitting

```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <Spinner />,
    ssr: false  // Don't render on server
  }
);
```

---

## Testing Strategy

### Unit Tests

```typescript
// Service unit test
describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('should send email with valid inputs', async () => {
      const result = await EmailService.sendWelcomeEmail(
        'test@example.com',
        'Test User',
        'https://example.com'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const result = await EmailService.sendWelcomeEmail(
        'invalid',
        'Test User',
        'https://example.com'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

### Integration Tests

```typescript
// API route integration test
describe('POST /api/email/send', () => {
  it('should send email with valid auth', async () => {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      body: JSON.stringify({
        userId: 'test-user',
        type: 'notification',
        subject: 'Test',
        data: { message: 'Test' }
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should reject without auth', async () => {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });
});
```

### E2E Tests

```typescript
// Playwright E2E test
test('user can send notification', async ({ page }) => {
  await page.goto('/notifications');
  await page.fill('[name="title"]', 'Test Notification');
  await page.fill('[name="message"]', 'Test message');
  await page.click('button[type="submit"]');

  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## Deployment

### Environment Setup

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
RESEND_API_KEY=re_xxx

# Optional
RESEND_FROM_EMAIL=Ekaacc <noreply@ekaacc.com>
NEXT_PUBLIC_APP_URL=https://app.ekaacc.com
```

### Build Process

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Health Checks

```typescript
// /api/health endpoint
export async function GET() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkEmailService(),
    checkAuth()
  ]);

  const healthy = checks.every(
    result => result.status === 'fulfilled'
  );

  return NextResponse.json({
    status: healthy ? 'healthy' : 'degraded',
    checks: checks.map((result, i) => ({
      name: ['database', 'email', 'auth'][i],
      status: result.status
    }))
  });
}
```

---

## Best Practices Summary

### ✅ Do

1. Use the Result pattern for error handling
2. Validate all inputs
3. Escape HTML in user content
4. Log all operations with context
5. Use TypeScript strictly
6. Write tests for critical paths
7. Cache appropriately
8. Use environment variables
9. Document public APIs
10. Handle errors gracefully

### ❌ Don't

1. Expose secrets to client
2. Trust user input
3. Ignore errors
4. Use try-catch for control flow
5. Hardcode configuration
6. Skip input validation
7. Return stack traces to client
8. Use SELECT * queries
9. Block on sequential operations
10. Skip error logging

---

**Last Updated:** November 23, 2025  
**Maintainer:** Development Team  
**Version:** 1.0.0
