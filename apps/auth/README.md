# EKA Auth Service

This is the centralized authentication service for the EKA ecosystem.

## Purpose

- Handles User Login and Signup
- Manages Passkey authentication
- Provides centralized session management
- Redirects users back to the calling application (Web, Admin, Therapist)

## Tech Stack

- Next.js 14 (App Router)
- Supabase Auth
- Shadcn UI
- Tailwind CSS

## Running Locally

```bash
npm run dev
# Runs on http://localhost:9005
```

## Integration

Applications should redirect to:
- Login: `http://localhost:9005/login?returnTo=<callback_url>`
- Signup: `http://localhost:9005/signup?returnTo=<callback_url>`
