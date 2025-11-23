# Auth0 & Supabase Integration Status

## Overview
This document tracks the configuration status of the Auth0 and Supabase integration.

## Auth0 Configuration
- **Application**: EKA Balance Web App
- **Client ID**: `BxIHsLzhzXlyM6RNbavObTrYIhTgGTq2`
- **Domain**: `dev-adijdczrcqg13gp8.eu.auth0.com`
- **Callback URLs**:
  - `http://localhost:3000/api/auth/callback` (Web Dev)
  - `http://localhost:9002/api/auth/callback` (Web)
  - `http://localhost:9003/api/auth/callback` (Admin) **[ADDED]**
  - `http://localhost:9004/api/auth/callback` (Therapist)
  - `http://localhost:9005/api/auth/callback` (API)
  - `https://app.ekabalance.com/api/auth/callback` (Production)

## Auth0 Action: Sync User to Supabase
- **Status**: Deployed (Version 1)
- **ID**: `6c80106b-7cd1-4f4f-95e9-41b5d8e370a9`
- **Trigger**: Post-Login
- **Function**: Adds Supabase-compatible custom claims (`https://supabase.io/jwt/claims`) to the ID and Access Tokens.
- **Verification**: Logic verified via unit test `apps/api/src/__tests__/auth0-action.test.ts`.

## Supabase Configuration (Pending Manual Action)
You must manually configure Supabase to accept the Auth0 JWTs.

1.  **Go to Supabase Dashboard** -> Authentication -> Settings -> JWT Settings.
2.  **Add Provider**:
    ```json
    {
      "jwt_aud": "https://rbnfyxhewsivofvwdpuk.supabase.co",
      "jwt_secret": "Use RS256 verification with JWKS",
      "jwt_exp": 36000,
      "jwks_uri": "https://dev-adijdczrcqg13gp8.eu.auth0.com/.well-known/jwks.json"
    }
    ```

## Next Steps
1.  **Bind Action**: Ensure the "Sync User to Supabase" action is added to the "Login" flow in the Auth0 Dashboard (Actions -> Flows -> Login).
2.  **Verify Login**: Log in to the application and check if the user is correctly authenticated and can access Supabase resources.
