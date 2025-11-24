# Supabase Email & Notification Integration Guide

## 1. Update Supabase Email Templates

We have generated branded HTML templates for your Supabase Auth emails.

1.  Go to your **Supabase Dashboard** -> **Authentication** -> **Email Templates**.
2.  For each template type, copy the content from the generated files in `supabase/templates/` and paste it into the "Message Body" field in Supabase.

*   **Confirm Email**: `supabase/templates/confirm_email.html`
*   **Reset Password**: `supabase/templates/reset_password.html`
*   **Magic Link**: `supabase/templates/magic_link.html`
*   **Change Email Address**: `supabase/templates/change_email.html`

> **Note**: Ensure the Subject lines in Supabase match what you want (e.g., "Confirm your email address").

## 2. Deploy the Welcome Email Function

We created an Edge Function `on-confirmation` that sends a branded Welcome Email when a user confirms their email address. This prevents duplicate emails (one from Supabase "Confirm", one from us "Welcome").

1.  **Deploy the function**:
    ```bash
    supabase functions deploy on-confirmation --no-verify-jwt
    ```
    *(The `--no-verify-jwt` flag is used because the database webhook might not sign the request with a user JWT, or we want to allow internal calls. Actually, for webhooks, we usually verify the service role key if passed, but for simplicity, ensure you set secrets.)*

2.  **Set Environment Variables**:
    ```bash
    supabase secrets set RESEND_API_KEY=re_123...
    ```

## 3. Set Up the Welcome Email Trigger

To trigger the Welcome Email only after the user confirms their email:

1.  Go to **Supabase Dashboard** -> **Database** -> **Webhooks**.
2.  Click **Create a new webhook**.
3.  **Name**: `send-welcome-email`
4.  **Table**: `auth.users`
5.  **Events**: `UPDATE`
6.  **Conditions**:
    *   Click "Add condition".
    *   `old.email_confirmed_at` IS `NULL`
    *   `new.email_confirmed_at` IS NOT `NULL`
    *(If the UI doesn't support this specific condition easily, you can just trigger on UPDATE and handle the logic in the function, but checking in the trigger is better. Alternatively, use the SQL below.)*

**SQL Alternative (Run in SQL Editor):**

```sql
-- Enable pg_net if not already enabled
create extension if not exists pg_net;

-- Create the trigger function
create or replace function public.handle_user_confirmation()
returns trigger as $$
declare
  -- REPLACE WITH YOUR PROJECT URL AND SERVICE KEY
  project_url text := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/on-confirmation';
  service_key text := 'YOUR_SERVICE_ROLE_KEY';
begin
  -- Check if email was just confirmed
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    perform net.http_post(
      url := project_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object(
        'record', row_to_json(new)
      )
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_confirmed
  after update on auth.users
  for each row execute procedure public.handle_user_confirmation();
```

## 4. Notification Preferences

We created a `user_notification_settings` table to store user preferences.
The `NotificationService` automatically checks these preferences before sending emails or push notifications.

### Managing Preferences in Frontend

You can create a settings page that updates this table.

```typescript
const { data, error } = await supabase
  .from('user_notification_settings')
  .update({ marketing_email: false })
  .eq('user_id', userId);
```
