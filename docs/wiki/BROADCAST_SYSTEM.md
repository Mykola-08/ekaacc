# Broadcast & Email System

This system allows you to send branded, personalized emails to groups of users, with built-in unsubscribe management.

## Features

1.  **User Groups**: Organize users into groups (e.g., "Newsletter", "Beta Testers").
2.  **Broadcasting**: Send emails to all users in a group.
3.  **Personalization**: Emails automatically include the user's name.
4.  **Unsubscribe**: Users can opt-out via a link in the footer.
5.  **Markdown Support**: Write email content using Markdown.

## Setup

1.  **Database**: Ensure migrations are applied (`supabase/migrations/20251120110000_groups_and_broadcasts.sql`).
2.  **Environment**: `RESEND_API_KEY` must be set.

## Usage

### Sending a Broadcast (Admin UI)

1.  Import `<BroadcastForm />` into your Admin Dashboard page.
2.  Select a group, write a subject and content (Markdown supported).
3.  Click Send.

### Sending Programmatically

```typescript
import { BroadcastService } from '@/services/broadcast-service';

await BroadcastService.sendBroadcast(
  'Weekly Update',
  '# Hello!\n\nHere is the news...',
  'group-uuid',
  'admin-uuid'
);
```

### Managing Groups

You can manage groups directly in Supabase or create a UI for it.
Tables: `user_groups`, `user_group_members`.

### Unsubscribe Flow

1.  Emails contain a link: `https://your-app.com/unsubscribe?uid=USER_ID`.
2.  User lands on `/unsubscribe` page.
3.  Clicking confirm updates `user_notification_settings` table (`marketing_email = false`).
4.  Future broadcasts automatically exclude this user.

## Customization

*   **Layout**: Edit `src/emails/components/EmailLayout.tsx` to change logo, colors, footer.
*   **Template**: Edit `src/emails/BroadcastEmail.tsx` to change the structure of the broadcast email.
