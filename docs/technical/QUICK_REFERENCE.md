# Quick Reference Guide

## 🎯 Common Tasks

### Email Operations

#### Send Welcome Email
```typescript
import { EmailService } from '@/services/email-service';

const result = await EmailService.sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'https://app.ekaacc.com/dashboard'
);
```

#### Send Notification Email
```typescript
const result = await EmailService.sendNotificationEmail(
  'user@example.com',
  'Important Update',
  'Your profile has been updated.',
  'https://app.ekaacc.com/profile'
);
```

#### Send Transactional Email
```typescript
import { TransactionalEmailService } from '@/services/transactional-email-service';

const result = await TransactionalEmailService.send({
  userId: 'user-123',
  type: 'reminder',
  subject: 'Upcoming Session',
  data: {
    details: 'Your session is scheduled',
    date: '2025-11-25',
    time: '2:00 PM',
    location: 'Virtual',
    actionLabel: 'Join',
    actionUrl: '/sessions/123'
  }
});
```

---

### Notification Operations

#### Send Multi-Channel Notification
```typescript
import { NotificationService } from '@/services/notification-service';
import { Result } from '@/lib/result';

const result = await NotificationService.send({
  userId: 'user-123',
  type: 'info',
  category: 'updates',
  title: 'New Feature',
  message: 'Check out our AI insights!',
  link: '/ai-insights'
});

if (Result.isOk(result)) {
  const { successCount, channels } = result.value;
  console.log(`Sent via ${successCount} channels`);
}
```

#### Force Critical Notification
```typescript
// Bypass user preferences for critical notifications
const result = await NotificationService.send({
  userId: 'user-123',
  type: 'warning',
  category: 'security',
  title: 'Security Alert',
  message: 'Suspicious login detected',
  force: true  // Ignores user preferences
});
```

---

### API Endpoint Patterns

#### POST Endpoint
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Auth
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Validate
  const body = await request.json();
  if (!body.required) return NextResponse.json({ error: 'Missing field' }, { status: 400 });

  // 3. Execute
  const result = await Service.operation(body);

  // 4. Respond
  if (Result.isOk(result)) {
    return NextResponse.json({ success: true, data: result.value });
  }
  return NextResponse.json({ error: result.error.message }, { status: 500 });
}
```

#### GET Endpoint with Pagination
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from('table')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1);

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit)
    }
  });
}
```

---

### Error Handling

#### Using Result Pattern
```typescript
import { Result } from '@/lib/result';

// Service function
async function fetchUser(id: string): Promise<Result<User, Error>> {
  return Result.wrap(async () => {
    const user = await db.users.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  });
}

// Calling code
const result = await fetchUser('123');

if (Result.isOk(result)) {
  console.log('User:', result.value.name);
} else {
  console.error('Error:', result.error.message);
}
```

#### Custom Error Types
```typescript
class ValidationError extends Error {
  constructor(public field: string, public reason: string) {
    super(`${field}: ${reason}`);
    this.name = 'ValidationError';
  }
}

// Usage
if (!isValidEmail(email)) {
  return Result.err(new ValidationError('email', 'Invalid format'));
}
```

---

### Database Operations

#### Query with Filter
```typescript
const { data, error } = await supabase
  .from('notifications')
  .select('id, title, created_at')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20);
```

#### Insert Record
```typescript
const { data, error } = await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    type: 'info',
    title: 'Notification',
    message: 'Message'
  })
  .select()
  .single();
```

#### Update Record
```typescript
const { data, error } = await supabase
  .from('notifications')
  .update({ read: true })
  .eq('id', notificationId)
  .select()
  .single();
```

#### Delete Record
```typescript
const { error } = await supabase
  .from('notifications')
  .delete()
  .eq('id', notificationId);
```

---

### Validation

#### Email Validation
```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

#### Required Fields
```typescript
function validateRequired<T extends object>(
  data: T,
  fields: Array<keyof T>
): void {
  for (const field of fields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${String(field)}`);
    }
  }
}

// Usage
validateRequired(body, ['userId', 'title', 'message']);
```

#### Type Guards
```typescript
function isNotificationPayload(data: unknown): data is NotificationPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    'userId' in data &&
    'type' in data &&
    'title' in data &&
    'message' in data
  );
}
```

---

### Security

#### HTML Escaping
```typescript
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
```

#### Safe Client Initialization
```typescript
function getSafeClient() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    logger.warn('API key not configured');
    return null;
  }
  return new Client(apiKey);
}

// Usage
const client = getSafeClient();
if (!client) {
  return { success: false, skipped: true };
}
```

---

### Logging

#### Structured Logging
```typescript
import { createLogger } from '@/lib/logger';

const logger = createLogger({ service: 'MyService' });

// Info
logger.info('Operation completed', { userId, duration: 123 });

// Error
logger.error('Operation failed', { error: error.message, userId });

// Warning
logger.warn('Retry attempt', { attempt: 2, maxRetries: 3 });
```

---

### Testing

#### Unit Test
```typescript
describe('EmailService', () => {
  it('should send email successfully', async () => {
    const result = await EmailService.sendWelcomeEmail(
      'test@example.com',
      'Test User',
      'https://example.com'
    );
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

#### Integration Test
```typescript
describe('POST /api/email/send', () => {
  it('should send email with valid auth', async () => {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId: 'test', type: 'notification', ... })
    });

    expect(response.status).toBe(200);
  });
});
```

---

### Performance

#### Parallel Operations
```typescript
// ❌ Sequential
const user = await fetchUser(id);
const prefs = await fetchPrefs(id);

// ✅ Parallel
const [user, prefs] = await Promise.all([
  fetchUser(id),
  fetchPrefs(id)
]);
```

#### Caching
```typescript
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;  // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}
```

#### Retry Logic
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await delay(1000 * attempt);
      }
    }
  }
  
  throw lastError!;
}
```

---

## 📋 Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SECRET_KEY=xxx
RESEND_API_KEY=re_xxx
```

### Optional
```env
RESEND_FROM_EMAIL=Ekaacc <noreply@ekaacc.com>
RESEND_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=https://app.ekaacc.com
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run typecheck    # Check types
npm run lint         # Lint code
npm test            # Run tests

# Production
npm run build       # Build for production
npm start           # Start production server

# Database
npm run migrate     # Run migrations
npm run seed        # Seed database
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Server error |

---

## 🎨 Code Style

### Naming Conventions
```typescript
// PascalCase for classes and types
class EmailService {}
interface NotificationPayload {}

// camelCase for variables and functions
const userId = 'user-123';
function sendEmail() {}

// UPPER_SNAKE_CASE for constants
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
```

### File Structure
```
service-name.ts          // Service implementation
service-name.test.ts     // Unit tests
service-name.types.ts    // Type definitions (if complex)
```

---

## 🔗 Useful Links

- [Full API Documentation](./API_ROUTES.md)
- [Services Documentation](./SERVICES_DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Optimization Report](./CODE_OPTIMIZATION_REPORT.md)

---

**Quick Tip:** Bookmark this page for fast reference during development!

**Last Updated:** November 23, 2025
