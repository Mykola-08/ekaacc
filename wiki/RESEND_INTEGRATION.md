# Resend Integration & Broadcast System

## Overview
This system allows sending transactional and marketing emails using Resend, with support for:
- **Audiences**: Managed via `user_groups` in Supabase.
- **Topics**: General, Marketing, Product Launch, Promotional.
- **Templates**: React Email templates for consistent branding.
- **Preferences**: Granular user opt-in/out settings.

## Features

### 1. Email Templates
Located in `src/emails/`:
- `BroadcastEmail.tsx`: General purpose updates.
- `ProductLaunchEmail.tsx`: For new feature announcements.
- `PromotionalEmail.tsx`: For offers and discounts.
- `NotificationEmail.tsx`: Generic system notifications.
- `ReminderEmail.tsx`: Appointment or task reminders.
- `ResultEmail.tsx`: For displaying results, scores, or reports.

### 2. Broadcast Topics
When sending a broadcast, you can select a topic:
- **General**: Uses `marketing_email` preference.
- **Marketing**: Uses `marketing_email` preference.
- **Product Launch**: Uses `product_updates_email` preference.
- **Promotional**: Uses `promotional_email` preference.

### 3. Transactional Emails
Use `TransactionalEmailService` to send individual notifications.
Supported types:
- **notification**: General alerts (checks `updates_email` preference).
- **reminder**: Time-sensitive reminders (checks `updates_email` preference).
- **result**: Outcome reports (checks `product_updates_email` preference).

### 4. Sending Broadcasts
Use the Admin UI (`<BroadcastForm />`) to send emails.
- Select a **Target Group** (Audience).
- Select a **Topic**.
- Fill in the required fields (Subject, Content, plus template-specific fields like Product Name or Promo Code).

### 5. Database Integration
- **User Preferences**: Stored in `user_notification_settings`.
- **Broadcast Log**: Sent broadcasts are logged in the `broadcasts` table with `topic` and `metadata`.

## Setup

### Environment Variables
Ensure these are set in `.env.local`:
```bash
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://your-app.com
RESEND_AUDIENCE_ID=... (Optional, for Resend Contacts sync)
```

### Database Schema
The following columns were added to `user_notification_settings`:
- `product_updates_email` (boolean, default true)
- `promotional_email` (boolean, default true)

The `broadcasts` table now includes:
- `topic` (text)
- `metadata` (jsonb)

## Usage Examples (Code)

### Broadcast
```typescript
import { BroadcastService } from '@/services/broadcast-service';

await BroadcastService.sendBroadcast(
  'Big Summer Sale!',
  'Get 50% off everything.',
  'promotional',
  'all-users-group-id',
  'admin-user-id',
  {
    promoCode: 'SUMMER50',
    validUntil: '2025-08-31',
    ctaLink: 'https://ekaacc.com/sale'
  }
);
```

### Transactional Notification
```typescript
import { TransactionalEmailService } from '@/services/transactional-email-service';

await TransactionalEmailService.send({
  userId: 'user-123',
  type: 'notification',
  subject: 'New Message Received',
  data: {
    message: 'You have a new private message from Alice.',
    actionLabel: 'Read Message',
    actionUrl: 'https://ekaacc.com/messages/1'
  }
});
```

### Reminder
```typescript
await TransactionalEmailService.send({
  userId: 'user-123',
  type: 'reminder',
  subject: 'Upcoming Appointment',
  data: {
    details: 'Consultation with Dr. Smith',
    date: '2025-11-20',
    time: '10:00 AM',
    location: 'Online Zoom Link',
    actionLabel: 'Join Meeting',
    actionUrl: 'https://zoom.us/j/...'
  }
});
```

### Result
```typescript
await TransactionalEmailService.send({
  userId: 'user-123',
  type: 'result',
  subject: 'Your Weekly Report',
  data: {
    summary: 'Here is a summary of your activity this week.',
    results: [
      { label: 'Sessions Completed', value: 5, status: 'success' },
      { label: 'Average Score', value: '92%', status: 'success' },
      { label: 'Missed Tasks', value: 1, status: 'warning' }
    ],
    actionLabel: 'View Dashboard',
    actionUrl: 'https://ekaacc.com/dashboard'
  }
});
```
