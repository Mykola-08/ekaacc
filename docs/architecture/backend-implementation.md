# Backend Implementation Specification
This document outlines the backend data models, server actions, and services required to support the frontend feature stubs added across the dashboard, settings, and other app interfaces.

## 1. Feature Stubs to Implement

### Settings & Identity
*   **Profile Updates**: Users need to be able to save their name, email, phone number, and avatar.
*   **Privacy & Security**: Endpoints to manage 2FA, change passwords, and update visibility settings.
*   **Notification Preferences**: Save preferences for email, push, and Telegram notifications.

### Finances & Wallet
*   **Add Funds/Cards**: Endpoints to handle Stripe integrations for adding cards and paying.
*   **Transaction History**: Retrieve payment history, subscriptions data, and wallet balances.

### Bookings & Sessions
*   **Booking Management**: Actions for rescheduling, canceling, or confirming a booking.
*   **Assignments & Notes**: Endpoints for therapists to assign tasks, and securely save private session notes.
*   **Availability**: Endpoints for setting available hours and linking external calendars.

### Console (Admin)
*   **User Management**: Actions to change user roles, suspend users, and view audit logs.
*   **System Settings**: Managing global features, UI toggles, and Telegram bot configuration directly from the dashboard.

## 2. Recommended Database Schema Additions

```sql
-- Examples for required structures

-- Profile & Settings
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    privacy_settings JSONB DEFAULT '{}'::jsonb
);

-- Wallet & Transactions
CREATE TABLE wallet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    balance NUMERIC DEFAULT 0
);
```

## 3. Recommended Actions & Services

Implement the following within the `/server/` directory:

1.  **Platform Service:** Define `updateProfile`, `changePassword`, `toggle2FA`.
2.  **Booking Service:** `cancelBooking`, `rescheduleBooking`, `getUpcomingBookings`.
3.  **Finance Service:** `addWalletFunds`, `getTransactions`, `saveStripeMethod`.
4.  **Admin Service:** `updateSystemFeatureToggle`, `banUser`, `getUserAuditLog`.

## 4. Notes for Backend AI
*   Ensure all new actions include Zod validation matching the frontend form schemas.
*   Use standard Next.js Server Actions with proper try/catch and error formatting.
*   Verify RLS policies on all newly created tables to ensure tenant isolation.
