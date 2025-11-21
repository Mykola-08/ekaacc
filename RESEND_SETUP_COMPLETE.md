# Resend Integration - Complete Setup Guide

## Overview
This app is now fully integrated with Resend for transactional and broadcast email delivery.

## Features Implemented

### 1. Email Services
- **Transactional Emails**: Individual emails for specific user events
  - Notifications
  - Reminders
  - Results/Reports
  - Homework Assignments
  - Session Notes
  - Check-ins

- **Broadcast Emails**: Mass emails to user groups
  - General announcements
  - Marketing campaigns
  - Product launches
  - Promotional offers

- **Email Integration**: Pre-built flows for common events
  - User registration (welcome emails)
  - Booking confirmations
  - Appointment reminders
  - Session notes delivery
  - Payment confirmations
  - Assessment results
  - Password resets

### 2. API Routes Created

#### Email Sending
- `POST /api/email/send` - Send transactional email to a user
- `POST /api/email/broadcast` - Send broadcast to a group (admin only)

#### Email Verification
- `POST /api/email/verify/send` - Send/resend verification email
- `GET /api/email/verify?token=xxx` - Verify email with token

#### Preview & Testing
- `GET/POST /api/email/preview` - Preview email templates
  - Preview URLs available at `/api/email/preview?type={type}`

#### Webhooks
- `POST /api/webhooks/resend` - Handle Resend webhook events
  - Tracks: sent, delivered, bounced, complained, opened, clicked

### 3. Database Tables

#### `email_events`
Tracks all email interactions from Resend webhooks:
- Event type (sent, delivered, bounced, etc.)
- Recipient, sender, subject
- Bounce/spam details
- Click/open tracking
- Full webhook payload

#### `email_verification_tokens`
Manages email verification:
- User ID and email
- Unique token
- Expiration timestamp

#### Updated `user_notification_settings`
New columns:
- `email_bounced` - Email hard bounced
- `email_bounce_reason` - Why it bounced
- `spam_complaint` - User marked as spam
- `last_email_sent_at` - Last email sent timestamp
- `last_email_opened_at` - Last email opened timestamp

### 4. Email Templates
All templates use React Email components:
- `WelcomeEmail` - User registration
- `NotificationEmail` - General notifications
- `ReminderEmail` - Appointments/deadlines
- `ResultEmail` - Assessment results
- `HomeworkEmail` - Therapy assignments
- `SessionNotesEmail` - Post-session summaries
- `CheckInEmail` - Weekly check-ins
- `BroadcastEmail` - General announcements
- `ProductLaunchEmail` - New features
- `PromotionalEmail` - Special offers

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=Ekaacc <noreply@yourdomain.com>
RESEND_WEBHOOK_SECRET=whsec_your_webhook_secret
RESEND_AUDIENCE_ID=your_audience_id (optional)
```

### 2. Domain Verification

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `ekaacc.com`)
3. Add DNS records to your domain provider:
   - SPF record
   - DKIM records
4. Wait for verification (usually < 1 hour)
5. Update `RESEND_FROM_EMAIL` with your verified domain

### 3. Webhook Setup

1. Go to [Resend Webhooks](https://resend.com/webhooks)
2. Create webhook with URL: `https://yourdomain.com/api/webhooks/resend`
3. Select events:
   - `email.sent`
   - `email.delivered`
   - `email.delivery_delayed`
   - `email.bounced`
   - `email.complained`
   - `email.opened` (optional, requires click tracking)
   - `email.clicked` (optional, requires click tracking)
4. Copy the webhook secret to `RESEND_WEBHOOK_SECRET`

### 4. Database Migration

Run the migration to create email tracking tables:

```bash
npx supabase migration up
```

Or apply manually:
```bash
npx supabase db push
```

### 5. Test the Integration

Run the test script:
```bash
npx tsx scripts/test-resend-emails.ts
```

Or preview emails in browser:
```bash
npm run dev
# Visit http://localhost:3000/api/email/preview?type=notification
```

## Usage Examples

### Send Transactional Email

```typescript
import { TransactionalEmailService } from '@/services/transactional-email-service';

await TransactionalEmailService.send({
  userId: 'user-123',
  type: 'notification',
  subject: 'New Message',
  data: {
    title: 'You have a new message',
    message: 'Your therapist sent you a message.',
    actionLabel: 'Read Message',
    actionUrl: 'https://app.com/messages'
  }
});
```

### Send Booking Confirmation

```typescript
import { EmailIntegrationService } from '@/services/email-integration-service';

await EmailIntegrationService.sendBookingConfirmation('user-123', {
  serviceName: 'Therapy Session',
  date: '2025-11-25',
  time: '2:00 PM',
  location: 'Virtual',
  therapistName: 'Dr. Smith'
});
```

### Send Broadcast Email

```typescript
import { BroadcastService } from '@/services/broadcast-service';

await BroadcastService.sendBroadcast(
  'New Feature Launch!',
  'Check out our new mood tracking feature.',
  'product_launch',
  'all-users-group-id',
  'admin-user-id',
  {
    productName: 'Mood Tracker',
    features: ['Track daily mood', 'View trends', 'Share with therapist'],
    launchDate: '2025-12-01',
    ctaLink: 'https://app.com/mood-tracker'
  }
);
```

### Via API

```bash
# Send transactional email
curl -X POST https://yourdomain.com/api/email/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "type": "reminder",
    "subject": "Appointment Tomorrow",
    "data": {
      "details": "Your session is tomorrow",
      "date": "2025-11-22",
      "time": "2:00 PM",
      "location": "Zoom",
      "actionUrl": "https://zoom.us/j/123"
    }
  }'
```

## User Preferences

Users can opt out of certain email types via `user_notification_settings`:

- `updates_email` - System updates and notifications
- `marketing_email` - General marketing emails
- `product_updates_email` - New feature announcements
- `promotional_email` - Special offers and promotions

Critical emails (password reset, booking confirmations) use `force: true` to bypass preferences.

## Monitoring

### Email Events Dashboard
View email delivery status in Supabase:
```sql
SELECT 
  event_type,
  recipient,
  subject,
  created_at
FROM email_events
ORDER BY created_at DESC
LIMIT 100;
```

### Bounce Tracking
Check for bounced emails:
```sql
SELECT 
  users.email,
  user_notification_settings.email_bounced,
  user_notification_settings.email_bounce_reason
FROM users
JOIN user_notification_settings ON users.id = user_notification_settings.user_id
WHERE user_notification_settings.email_bounced = true;
```

### Resend Dashboard
Monitor deliverability, opens, and clicks at [Resend Dashboard](https://resend.com/emails)

## Testing

### Preview Templates
Visit: `http://localhost:3000/api/email/preview?type={type}`

Available types:
- `notification`
- `reminder`
- `result`
- `homework`
- `session_notes`
- `check_in`

### Send Test Emails
Run: `npx tsx scripts/test-resend-emails.ts`

### Check Integration
Run: `npm run check:resend`

## Troubleshooting

### Emails Not Sending
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is verified in Resend
3. Check Resend dashboard for errors
4. Review `email_events` table for failures

### Emails Going to Spam
1. Ensure SPF and DKIM records are configured
2. Use verified domain (not `resend.dev`)
3. Avoid spammy content
4. Enable DMARC

### Bounced Emails
- Check `user_notification_settings.email_bounced`
- Hard bounces prevent future sends
- Soft bounces retry automatically

## Best Practices

1. **Always use templates** - Don't send raw HTML
2. **Respect user preferences** - Check opt-out settings
3. **Use force sparingly** - Only for critical emails
4. **Monitor deliverability** - Check bounce rates
5. **Test before launch** - Use preview and test scripts
6. **Track events** - Use webhooks for analytics
7. **Clean email list** - Remove bounced addresses
8. **Personalize content** - Use user names and relevant data

## Next Steps

1. Set up custom email domain
2. Configure webhooks in production
3. Create additional email templates as needed
4. Integrate emails into user flows (registration, bookings, etc.)
5. Set up email analytics dashboard
6. Configure automated email campaigns
7. Implement A/B testing for emails

## Support

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- Internal: Check `/wiki/RESEND_INTEGRATION.md`
