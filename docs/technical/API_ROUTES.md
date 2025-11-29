# API Routes Documentation

## Overview

Comprehensive documentation for all API routes in the Ekaacc application.

---

## Table of Contents

1. [Email APIs](#email-apis)
2. [Notification APIs](#notification-apis)
3. [Webhook APIs](#webhook-apis)
4. [Admin APIs](#admin-apis)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Email APIs

### POST /api/email/send

Send a transactional email to a specific user.

**Authentication:** Required

**Request Body:**
```typescript
{
  userId: string;                    // Target user ID
  type: 'notification' | 'reminder' | 'result' | 'homework' | 'session_notes' | 'check_in';
  subject: string;                   // Email subject
  data: {                           // Template-specific data
    // For 'notification'
    message?: string;
    actionLabel?: string;
    actionUrl?: string;
    
    // For 'reminder'
    details?: string;
    date?: string;
    time?: string;
    location?: string;
    
    // For 'result'
    summary?: string;
    results?: Array<{
      label: string;
      value: string;
      status: 'success' | 'warning' | 'error';
    }>;
    
    // For 'homework'
    therapistName?: string;
    assignmentTitle?: string;
    description?: string;
    dueDate?: string;
    
    // For 'session_notes'
    sessionDate?: string;
    keyTakeaways?: string[];
    nextSessionDate?: string;
    
    // For 'check_in'
    message?: string;
  };
  force?: boolean;                  // Override user preferences (default: false)
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    id: string;                     // Email ID from provider
  };
  error?: string;
}
```

**Example:**
```bash
curl -X POST https://app.ekaacc.com/api/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "user-123",
    "type": "reminder",
    "subject": "Upcoming Session Reminder",
    "data": {
      "details": "Your therapy session is scheduled",
      "date": "2025-11-25",
      "time": "2:00 PM",
      "location": "Virtual Session",
      "actionLabel": "Join Session",
      "actionUrl": "https://app.ekaacc.com/sessions/123"
    }
  }'
```

**Status Codes:**
- `200` - Email sent successfully
- `400` - Invalid request body
- `401` - Unauthorized
- `403` - Insufficient permissions
- `500` - Server error

---

### POST /api/email/preview

Preview an email template without sending.

**Authentication:** Not required

**Request Body:**
```typescript
{
  type: 'notification' | 'reminder' | 'result' | 'homework' | 'session_notes' | 'check_in';
  data: object;                     // Template-specific data
  userName?: string;                // Optional user name for preview
}
```

**Response:**
- Content-Type: `text/html`
- Body: Rendered HTML email

**Example:**
```bash
curl -X POST https://app.ekaacc.com/api/email/preview \
  -H "Content-Type: application/json" \
  -d '{
    "type": "notification",
    "data": {
      "title": "Test Notification",
      "message": "This is a preview",
      "actionLabel": "View",
      "actionUrl": "#"
    },
    "userName": "John Doe"
  }'
```

---

### GET /api/email/preview

Preview with example data for testing.

**Query Parameters:**
- `type` - Email type (default: 'notification')

**Example:**
```bash
curl https://app.ekaacc.com/api/email/preview?type=reminder
```

---

### POST /api/email/verify/send

Send or resend email verification.

**Authentication:** Not required

**Request Body:**
```typescript
{
  email: string;                    // User's email address
  userId?: string;                  // Optional user ID
}
```

**Response:**
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

**Example:**
```bash
curl -X POST https://app.ekaacc.com/api/email/verify/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### GET /api/email/verify

Verify email address using token.

**Query Parameters:**
- `token` - Verification token

**Response:**
- Redirects to app with status

**Example:**
```bash
curl https://app.ekaacc.com/api/email/verify?token=abc123
```

---

### POST /api/email/broadcast

Send a broadcast email to a group of users.

**Authentication:** Required (Admin only)

**Request Body:**
```typescript
{
  subject: string;                  // Email subject
  content: string;                  // Email content
  topic: 'general' | 'marketing' | 'product_launch' | 'promotional';
  groupId: string;                  // Target group ID
  templateData?: object;            // Additional template data
}
```

**Response:**
```typescript
{
  success: boolean;
  sent: number;                     // Number of emails sent
  failed: number;                   // Number of failures
  errors?: Array<{
    userId: string;
    error: string;
  }>;
}
```

---

## Notification APIs

### POST /api/notifications

Send a notification through multiple channels.

**Authentication:** Required

**Request Body:**
```typescript
{
  userId: string;                   // Target user ID
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'marketing' | 'security' | 'updates';
  title: string;                    // Notification title
  message: string;                  // Notification message
  link?: string;                    // Optional action link
  metadata?: object;                // Additional data
  force?: boolean;                  // Bypass user preferences
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    successCount: number;
    failureCount: number;
    channels: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
  };
  error?: string;
}
```

**Example:**
```typescript
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    userId: 'user-123',
    type: 'info',
    category: 'updates',
    title: 'New Feature',
    message: 'Check out our new AI insights!',
    link: '/ai-insights'
  })
});

const result = await response.json();
console.log(`Sent via ${result.data.successCount} channels`);
```

---

## Webhook APIs

### POST /api/webhooks/resend

Resend email event webhook handler.

**Authentication:** Webhook signature verification

**Request Headers:**
- `svix-signature` - Webhook signature
- `svix-timestamp` - Request timestamp
- `svix-id` - Request ID

**Request Body:**
```typescript
{
  type: 'email.sent' | 'email.delivered' | 'email.delivery_delayed' | 
        'email.complained' | 'email.bounced' | 'email.opened' | 'email.clicked';
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    // Additional event-specific data
  };
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

**Events Handled:**
- `email.sent` - Email was accepted by Resend
- `email.delivered` - Email successfully delivered
- `email.delivery_delayed` - Delivery delayed
- `email.complained` - Marked as spam
- `email.bounced` - Email bounced
- `email.opened` - Email opened
- `email.clicked` - Link clicked

**Configuration:**
```env
RESEND_WEBHOOK_SECRET=your_webhook_secret
```

---

### GET /api/webhooks/resend

Webhook verification endpoint.

**Response:**
```typescript
{
  status: 'ok';
  endpoint: 'Resend webhook handler';
}
```

---

## Admin APIs

### GET /api/admin/notifications

Get all notifications (admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset
- `userId` - Filter by user ID

**Response:**
```typescript
{
  notifications: Array<{
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
  }>;
  total: number;
}
```

---

### POST /api/admin/notifications

Create admin notification.

**Authentication:** Required (Admin role)

**Request Body:**
```typescript
{
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  recipients: 'all' | 'admins' | 'users' | string[];  // User IDs
}
```

---

## Authentication

### Authentication Methods

All protected endpoints use Bearer token authentication:

```typescript
headers: {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}
```

### Getting a Token

Use Auth0 or Supabase authentication:

```typescript
// Auth0
const token = await auth0.getAccessTokenSilently();

// Supabase
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

### Role-Based Access

Some endpoints require specific roles:

- **Admin APIs:** Require `admin` role
- **User APIs:** Require authenticated user
- **Public APIs:** No authentication required

---

## Error Handling

### Error Response Format

All errors follow this format:

```typescript
{
  error: string;                    // Error message
  code?: string;                    // Error code
  details?: object;                 // Additional details
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Error Handling Example

```typescript
try {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    
    switch (response.status) {
      case 401:
        // Redirect to login
        break;
      case 403:
        // Show permission error
        break;
      case 429:
        // Show rate limit message
        break;
      default:
        // Show generic error
    }
  }

  const result = await response.json();
  return result;
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Rate Limiting

### Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/email/send` | 50 | 1 hour |
| `/api/email/broadcast` | 5 | 1 hour |
| `/api/notifications` | 100 | 1 hour |
| `/api/email/preview` | 200 | 1 hour |

### Rate Limit Headers

Responses include rate limit information:

```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1700000000
```

### Handling Rate Limits

```typescript
async function sendEmailWithBackoff(data: EmailData) {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitTime = Number(resetTime) * 1000 - Date.now();
      
      console.log(`Rate limited. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Retry
      return sendEmailWithBackoff(data);
    }

    return response;
  } catch (error) {
    console.error('Send failed:', error);
    throw error;
  }
}
```

---

## SDK Usage Examples

### TypeScript/JavaScript

```typescript
import { EmailClient } from '@ekaacc/sdk';

const client = new EmailClient({
  apiKey: process.env.EKAACC_API_KEY
});

// Send email
const result = await client.emails.send({
  userId: 'user-123',
  type: 'notification',
  subject: 'Test Email',
  data: {
    message: 'Hello, World!',
    actionUrl: 'https://example.com'
  }
});

if (result.success) {
  console.log('Email sent:', result.data.id);
}
```

### cURL Examples

```bash
# Send notification email
curl -X POST https://app.ekaacc.com/api/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "user-123",
    "type": "notification",
    "subject": "Test",
    "data": {
      "message": "Test message",
      "actionUrl": "https://example.com"
    }
  }'

# Preview email
curl https://app.ekaacc.com/api/email/preview?type=notification

# Send broadcast (admin)
curl -X POST https://app.ekaacc.com/api/email/broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "subject": "New Feature Launch",
    "content": "Check out our new features!",
    "topic": "product_launch",
    "groupId": "all-users"
  }'
```

---

## Testing

### Test Endpoints

Use preview endpoints for testing without sending:

```bash
# Preview notification
GET /api/email/preview?type=notification

# Preview with custom data
POST /api/email/preview
{
  "type": "reminder",
  "data": { ... },
  "userName": "Test User"
}
```

### Test Mode

Set environment variable to enable test mode:

```env
EMAIL_TEST_MODE=true
```

In test mode:
- Emails are not actually sent
- Preview HTML is returned instead
- All API calls succeed

---

## Support

For API support:
- Documentation: `/docs/API_ROUTES.md`
- Service Docs: `/docs/SERVICES_DOCUMENTATION.md`
- Issues: GitHub Issues

---

**Last Updated:** November 23, 2025  
**Version:** 1.0.0
