# Services Documentation

## Overview

This document provides comprehensive documentation for all services in the Ekaacc application. Each service is designed with specific responsibilities, best practices, and clear interfaces.

---

## Table of Contents

1. [Email Services](#email-services)
   - [EmailService](#emailservice)
   - [TransactionalEmailService](#transactionalemailservice)
   - [EmailIntegrationService](#emailintegrationservice)
2. [Notification Services](#notification-services)
   - [NotificationService](#notificationservice)
3. [Best Practices](#best-practices)
4. [Error Handling](#error-handling)
5. [Testing](#testing)

---

## Email Services

### EmailService

**Location:** `apps/web/src/services/email-service.ts`

#### Purpose
Core email service for sending branded emails via Resend. Provides centralized email delivery with automatic error handling, retry logic, and consistent response format.

#### Key Features
- ✅ Automatic retry logic (3 attempts with exponential backoff)
- ✅ Input validation (email format checking)
- ✅ HTML escaping for security
- ✅ Comprehensive error logging
- ✅ Safe client initialization
- ✅ Template rendering support

#### Methods

##### `sendWelcomeEmail(to, name, actionUrl)`

Send a welcome email to new users with a call-to-action.

**Parameters:**
- `to: string` - Recipient email address
- `name: string` - User's display name
- `actionUrl: string` - URL for the call-to-action button

**Returns:** `Promise<EmailServiceResponse>`

**Example:**
```typescript
import { EmailService } from '@/services/email-service';

const result = await EmailService.sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'https://app.ekaacc.com/dashboard'
);

if (result.success) {
  console.log('Welcome email sent:', result.data?.id);
} else {
  console.error('Failed to send:', result.error);
}
```

##### `sendNotificationEmail(to, subject, message, actionUrl?)`

Send a generic notification email with optional action button.

**Parameters:**
- `to: string` - Recipient email address
- `subject: string` - Email subject line
- `message: string` - Email message body (plain text, will be HTML-escaped)
- `actionUrl?: string` - Optional URL for action button

**Returns:** `Promise<EmailServiceResponse>`

**Example:**
```typescript
const result = await EmailService.sendNotificationEmail(
  'user@example.com',
  'Important Update',
  'Your profile has been updated successfully.',
  'https://app.ekaacc.com/profile'
);
```

#### Response Type

```typescript
interface EmailServiceResponse {
  success: boolean;
  data?: CreateEmailResponse;  // Resend response data
  error?: Error | unknown;     // Error if failed
  skipped?: boolean;           // True if skipped (e.g., no API key)
  reason?: string;             // Reason for skipping
}
```

#### Configuration

Required environment variables:
- `RESEND_API_KEY` - Resend API key (required for sending)
- `RESEND_FROM_EMAIL` - Sender email address (optional, defaults to 'Ekaacc <noreply@ekaacc.com>')

---

### TransactionalEmailService

**Location:** `apps/web/src/services/transactional-email-service.ts`

#### Purpose
Specialized service for sending transactional emails with user preference management and multiple template types.

#### Supported Email Types

1. **Notification** - General notifications
2. **Reminder** - Appointment/session reminders
3. **Result** - Assessment or test results
4. **Homework** - Therapy homework assignments
5. **Session Notes** - Post-session summaries
6. **Check-in** - Regular check-in prompts

#### Methods

##### `send(options)`

Send a transactional email with preference checking.

**Parameters:**
```typescript
interface SendOptions {
  userId: string;                    // Target user ID
  type: TransactionalEmailType;      // Email template type
  subject: string;                   // Email subject
  data: any;                         // Template-specific data
  force?: boolean;                   // Bypass user preferences
}
```

**Returns:** `Promise<{ success: boolean; error?: string; skipped?: boolean }>`

**Example:**
```typescript
import { TransactionalEmailService } from '@/services/transactional-email-service';

const result = await TransactionalEmailService.send({
  userId: 'user-123',
  type: 'reminder',
  subject: 'Upcoming Therapy Session',
  data: {
    details: 'Your weekly session is scheduled',
    date: '2025-11-25',
    time: '2:00 PM',
    location: 'Virtual Session',
    actionLabel: 'Join Session',
    actionUrl: 'https://app.ekaacc.com/sessions/123'
  }
});
```

##### `renderOnly(params)`

Render email template without sending (for previews).

**Parameters:**
```typescript
{
  type: TransactionalEmailType;
  data: any;
  userName: string;
}
```

**Returns:** `Promise<string>` - Rendered HTML

---

### EmailIntegrationService

**Location:** `apps/web/src/services/email-integration-service.ts`

#### Purpose
Integration layer for sending emails triggered by user events (assessments, bookings, etc.).

#### Methods

##### `sendAssessmentResults(userId, results)`

Send assessment results to a user.

**Example:**
```typescript
import { EmailIntegrationService } from '@/services/email-integration-service';

await EmailIntegrationService.sendAssessmentResults('user-123', {
  title: 'Weekly Assessment Results',
  summary: 'Your mental health assessment is complete.',
  scores: [
    { label: 'Mood Score', value: '8/10', status: 'success' },
    { label: 'Anxiety Level', value: '3/10', status: 'success' }
  ]
});
```

---

## Notification Services

### NotificationService

**Location:** `apps/web/src/services/notification-service.ts`

#### Purpose
Multi-channel notification delivery system supporting in-app, email, and push notifications with user preference management.

#### Architecture

```
┌─────────────────────────────────┐
│   NotificationService.send()    │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │ Check User Prefs │
    └────────┬────────┘
             │
    ┌────────┴────────────────────┐
    │                             │
    │  Parallel Delivery:         │
    │  1. In-App (Database)       │
    │  2. Email (EmailService)    │
    │  3. Push (Web Push API)     │
    │                             │
    └─────────────────────────────┘
```

#### Methods

##### `send(payload)`

Send a notification through all enabled channels based on user preferences.

**Parameters:**
```typescript
interface NotificationPayload {
  userId: string;                      // Target user ID
  type: NotificationType;              // 'info' | 'success' | 'warning' | 'error'
  category: NotificationCategory;      // 'marketing' | 'security' | 'updates'
  title: string;                       // Notification title
  message: string;                     // Notification message
  link?: string;                       // Optional action link
  metadata?: any;                      // Additional data
  force?: boolean;                     // Bypass preferences
}
```

**Returns:** `Promise<Result<NotificationResult, Error>>`

**Example:**
```typescript
import { NotificationService } from '@/services/notification-service';
import { Result } from '@/lib/result';

const result = await NotificationService.send({
  userId: 'user-123',
  type: 'info',
  category: 'updates',
  title: 'New Feature Available',
  message: 'Check out our new AI insights feature!',
  link: '/ai-insights'
});

if (Result.isOk(result)) {
  const { successCount, channels } = result.value;
  console.log(`Sent via ${successCount} channels:`, channels);
} else {
  console.error('Notification failed:', result.error);
}
```

#### Response Type

```typescript
interface NotificationResult {
  successCount: number;           // Number of successful deliveries
  failureCount: number;           // Number of failed deliveries
  channels: {
    inApp: boolean;              // In-app delivery status
    email: boolean;              // Email delivery status
    push: boolean;               // Push delivery status
  };
  errors: Array<{
    channel: 'inApp' | 'email' | 'push';
    error: Error;
  }>;
}
```

#### User Preferences

Notifications respect user preferences stored in `user_notification_settings`:

```sql
-- Example preference structure
{
  marketing_email: boolean,
  marketing_push: boolean,
  marketing_in_app: boolean,
  security_email: boolean,
  security_push: boolean,
  security_in_app: boolean,
  updates_email: boolean,
  updates_push: boolean,
  updates_in_app: boolean
}
```

Use `force: true` to bypass preferences for critical notifications.

---

## Best Practices

### 1. Error Handling

All services use the `Result` pattern for type-safe error handling:

```typescript
import { Result } from '@/lib/result';

const result = await someService.operation();

if (Result.isOk(result)) {
  // Success path
  console.log(result.value);
} else {
  // Error path
  console.error(result.error);
}
```

**Benefits:**
- No try-catch blocks needed
- Type-safe error handling
- Explicit error states
- Composable operations

### 2. Logging

All services use structured logging:

```typescript
import { createLogger } from '@/lib/logger';

const logger = createLogger({ service: 'YourService' });

logger.info('Operation completed', { userId, duration });
logger.error('Operation failed', { error, userId });
logger.warn('Potential issue detected', { details });
```

### 3. Input Validation

Always validate inputs before processing:

```typescript
// Email validation
if (!email || !isValidEmail(email)) {
  throw new Error('Invalid email address');
}

// Required field validation
if (!userId || !title || !message) {
  throw new Error('Missing required fields');
}
```

### 4. Retry Logic

Implement retry logic for external API calls:

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    return await externalApi.call();
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS * attempt);
    } else {
      throw error;
    }
  }
}
```

### 5. Configuration

Use environment variables with fallbacks:

```typescript
const API_KEY = process.env.SERVICE_API_KEY;
const DEFAULT_FROM = 'Ekaacc <noreply@ekaacc.com>';
const FROM_EMAIL = process.env.FROM_EMAIL || DEFAULT_FROM;
```

### 6. Type Safety

Define clear interfaces for all data structures:

```typescript
interface ServiceRequest {
  userId: string;
  action: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
}

interface ServiceResponse {
  success: boolean;
  data?: any;
  error?: Error;
}
```

---

## Error Handling

### Common Error Scenarios

#### 1. Missing Configuration

```typescript
const client = safeResend();
if (!client) {
  return { 
    success: false, 
    skipped: true, 
    reason: 'Resend not configured' 
  };
}
```

#### 2. User Not Found

```typescript
const user = await getUserById(userId);
if (!user) {
  return Result.err(new Error('User not found'));
}
```

#### 3. External API Failure

```typescript
try {
  const response = await externalApi.call();
  return Result.ok(response);
} catch (error) {
  logger.error('External API call failed', { error });
  return Result.err(error);
}
```

#### 4. Validation Errors

```typescript
if (!isValidEmail(email)) {
  return Result.err(new Error(`Invalid email: ${email}`));
}
```

---

## Testing

### Unit Testing Example

```typescript
import { EmailService } from '@/services/email-service';

describe('EmailService', () => {
  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const result = await EmailService.sendWelcomeEmail(
        'test@example.com',
        'Test User',
        'https://example.com'
      );
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle invalid email', async () => {
      const result = await EmailService.sendWelcomeEmail(
        'invalid-email',
        'Test User',
        'https://example.com'
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing API key gracefully', async () => {
      // Mock safeResend to return null
      const result = await EmailService.sendWelcomeEmail(
        'test@example.com',
        'Test User',
        'https://example.com'
      );
      
      expect(result.skipped).toBe(true);
      expect(result.reason).toBe('Resend not configured');
    });
  });
});
```

### Integration Testing

```typescript
describe('NotificationService Integration', () => {
  it('should send multi-channel notification', async () => {
    const result = await NotificationService.send({
      userId: 'test-user-id',
      type: 'info',
      category: 'updates',
      title: 'Test Notification',
      message: 'This is a test',
      force: true // Bypass preferences in tests
    });

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.value.successCount).toBeGreaterThan(0);
    }
  });
});
```

---

## Performance Optimization Tips

### 1. Parallel Operations

When sending to multiple channels, use parallel execution:

```typescript
const [inAppResult, emailResult, pushResult] = await Promise.all([
  sendInApp(payload),
  sendEmail(payload),
  sendPush(payload)
]);
```

### 2. Caching

Cache user preferences to reduce database queries:

```typescript
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const prefsCache = new Map<string, { data: any; expires: number }>();

function getCachedPrefs(userId: string) {
  const cached = prefsCache.get(userId);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
}
```

### 3. Batch Operations

When sending to multiple users, batch the operations:

```typescript
async function sendBulkNotifications(userIds: string[], payload: Omit<NotificationPayload, 'userId'>) {
  const batch = userIds.map(userId => 
    NotificationService.send({ ...payload, userId })
  );
  return Promise.allSettled(batch);
}
```

---

## Migration Guide

### Upgrading from Old Email Service

**Before:**
```typescript
await sendEmail(to, subject, message);
```

**After:**
```typescript
const result = await EmailService.sendNotificationEmail(
  to,
  subject,
  message,
  actionUrl
);

if (!result.success) {
  console.error('Email failed:', result.error);
}
```

### Benefits of Migration

1. ✅ Better error handling
2. ✅ Retry logic
3. ✅ Input validation
4. ✅ HTML escaping
5. ✅ Structured logging
6. ✅ Type safety

---

## Support

For questions or issues:
- Check the [API Reference](./API_REFERENCE.md)
- Review [Testing Guide](../wiki/TESTING.md)
- See [Architecture Documentation](../wiki/Architecture.md)

---

**Last Updated:** November 23, 2025
**Version:** 1.0.0
