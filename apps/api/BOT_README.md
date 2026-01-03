# Telegram Bot Setup

## Prerequisites

1.  **Supabase**: Apply the migration `supabase/migrations/20250614000000_telegram_bot_schema.sql`.
2.  **Environment Variables**:
    Add the following to `apps/api/.env.local`:
    ```
    TELEGRAM_BOT_TOKEN=your_bot_token
    SUPABASE_URL=your_supabase_url
    SUPABASE_SECRET_KEY=your_secret_key
    WEBAPP_BASE_URL=https://your-app.vercel.app
    ```

## Running the Bot

The bot runs as part of the Next.js API routes.
To set up the webhook, you need to call the Telegram API:

```bash
curl -F "url=https://your-app.vercel.app/api/telegram" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

## Development

For local development, use `ngrok` or similar to expose your local server:

```bash
ngrok http 3001
```

Then set the webhook to your ngrok URL:

```bash
curl -F "url=https://<your-ngrok-id>.ngrok.io/api/telegram" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```
