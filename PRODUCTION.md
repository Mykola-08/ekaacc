Production setup
=================

This project can run in two modes: demo (mock) and production (Firestore + real services).

1) Toggle mock vs production

- The environment variable `NEXT_PUBLIC_USE_MOCK_DATA` controls behavior.
  - For demo/mock mode (default for local development), set `NEXT_PUBLIC_USE_MOCK_DATA` to `true` or leave undefined.
  - For production mode (use Firestore and real backends), set `NEXT_PUBLIC_USE_MOCK_DATA=false`.

  Example (PowerShell):

  $env:NEXT_PUBLIC_USE_MOCK_DATA = 'false'; npm run dev

2) Firebase / Firestore configuration (production)

- Provide Firebase credentials and configuration via environment variables or a local `firebase` config. The project expects a Firestore client helper at `src/lib/firebase-client.ts` which reads configuration from environment variables.

Common env variables expected (project-specific code may reference these names):

- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- GOOGLE_APPLICATION_CREDENTIALS  (path to a service account JSON file) — used by server-side scripts or Node processes that need admin privileges.

Make sure the service account used has permissions for Firestore read/write operations and (if used) Firebase Auth user management.

3) AI / External services

- The AI integration is not preconfigured. If you plan to enable AI features in production, implement and configure an AI provider wrapper and set required env vars (for example: OPENAI_API_KEY).
- The project currently guards AI calls with error handling; if not configured, calls will fail gracefully.

4) Stripe / Billing

- If billing is enabled, configure Stripe keys (publishable and secret) using:
  - STRIPE_PUBLISHABLE_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET (optional for webhooks)

5) Deployment

- Use your preferred hosting (Vercel, Azure, Netlify, or self-hosted). Ensure environment variables are set in the deployment environment and `NEXT_PUBLIC_USE_MOCK_DATA` is set to `false` in production.

6) Troubleshooting

- If pages 404 after switching to production, confirm the project was built and deployed (Next App Router routes must be built). Run locally with production flags:

  $env:NEXT_PUBLIC_USE_MOCK_DATA = 'false'; npm run build; npm start

- Check the server logs and ensure Firestore rules allow the authenticated service account or signed-in users to perform the intended operations.

If you want, I can add a small `example.env` or `README` snippet into the repository with an annotated list of env vars and where to place the service account JSON. Let me know which hosting provider you plan to use and I can add provider-specific notes.
