# Notifications & Email System Setup

## 1. Environment Variables

Add the following to your `.env.local` file:

```bash
# Resend (Email Service)
RESEND_API_KEY=re_123456789

# Web Push (Browser Notifications)
# Generate keys with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key

# Supabase (Already likely configured, but ensure Service Role Key is present for backend operations)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Database Migrations

Run the new migration to create the `push_subscriptions` table:

```bash
supabase db push
# or manually run the SQL in supabase/migrations/20251120_push_notifications.sql
```

## 3. Usage

### Sending Emails

Use the `EmailService` to send branded emails.

```typescript
import { EmailService } from '@/services/email-service';

await EmailService.sendWelcomeEmail('user@example.com', 'John Doe', 'https://ekaacc.com/dashboard');
```

### Sending Notifications (In-App, Email, Push)

Use the `NotificationService` to send notifications across multiple channels.

```typescript
import { NotificationService } from '@/services/notification-service';

await NotificationService.send({
  userId: 'user_uuid',
  type: 'info',
  title: 'New Message',
  message: 'You have received a new message.',
  link: '/messages/123',
  sendEmail: true, // Sends an email notification
  sendPush: true,  // Sends a browser push notification (if subscribed)
});
```

### Client-Side Push Subscription

Use the `usePushNotifications` hook in your React components to allow users to subscribe.

```tsx
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function NotificationButton() {
  const { isSubscribed, subscribeToPush } = usePushNotifications();

  return (
    <button onClick={subscribeToPush} disabled={isSubscribed}>
      {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
    </button>
  );
}
```

## 4. Customizing Emails

Edit the templates in `src/emails/`.
- `src/emails/components/EmailLayout.tsx`: Main layout with logo and footer.
- `src/emails/WelcomeEmail.tsx`: Example welcome email.

You can preview emails by creating a simple page that renders the component, or using the React Email preview tool (requires separate setup).
