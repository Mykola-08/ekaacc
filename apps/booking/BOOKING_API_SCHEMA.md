# Booking API Schema

This document outlines the public booking micro-app endpoints and their request/response bodies aligned with `BOOKING_SYSTEM_PROMPT.md`.

## Conventions
- Times: ISO-8601 UTC strings.
- Currency: minor units (cents) for amounts in payloads.
- Authentication: tokenized manage link via signed JWT (see `lib/bookingToken.ts`).
- Errors: JSON `{ error: string }` with appropriate HTTP status.

## Endpoints

### GET /api/services
Returns minimal list of services.
Response:
```
{ services: [ { id, name, price, duration, description, image_url } ] }
```

### GET /api/services/{id}/availability?date=YYYY-MM-DD
Generates slots per active staff schedule for the weekday, excluding overlapping pending/authorized/captured bookings.
Response:
```
{
  serviceId,
  date,
  durationMinutes,
  generatedAt,
  slots: [ { startTime, endTime, staffId } ]
}
```

### POST /api/booking
Creates a pending booking and reserves slot for TTL (5 minutes).
Request:
```
{
  serviceId: string,
  startTime: string (ISO),
  email: string,
  phone?: string,
  displayName?: string,
  paymentMode: 'full' | 'deposit',
  depositCents?: number,
  addons?: [ { addonId, name, priceCents } ],
  staffId?: string  // optional; if omitted auto-assigned
}
```
Response:
```
{
  bookingId,
  manageToken,
  totalCents,
  basePriceCents,
  addonsTotalCents,
  depositCents?,
  reservationExpiresAt
    staffId,
}
```

### POST /api/booking/{id}/pay
Initiates Stripe Checkout for full or deposit amount.
Request:
```
{ manageToken }
```
Response:
```
{ sessionId, url }
```

### POST /api/booking/{id}/cancel
Applies cancellation policy; may issue refund.
Request:
```
{ manageToken }
```
Response:
```
{ bookingId, status: 'canceled', refundCents, manageToken }
```

### POST /api/booking/{id}/reschedule
Reschedules booking if within policy window.
Request:
```
{ manageToken, newStartTime: ISO }
```
Response:
```
{ bookingId, newStartTime, newEndTime, priceDeltaCents, manageToken }
```

### POST /api/booking/{id}/request-manage-link
Issues a new manage token if email matches.
Request:
```
{ email }
```
Response:
```
{ bookingId, manageToken }
```

### GET /api/booking/{id}?token=...
Fetches public booking view.
Response:
```
{ booking: { id, start_time, end_time, status, payment_status, email, display_name, service_id, staff_id, addons_json, payment_mode, deposit_cents, base_price_cents, currency, cancellation_policy } }
```

## Booking Object (Database Projection)
```
id (uuid)
service_id (uuid)
staff_id? (uuid)
start_time (timestamptz)
end_time (timestamptz)
duration_minutes (int)
base_price_cents (int)
currency (text)
email (text)
phone? (text)
display_name? (text)
addons_json (jsonb array)
payment_mode ('full'|'deposit')
deposit_cents (int)
payment_status enum
status enum
cancellation_policy jsonb
reservation_expires_at timestamptz
manage_token_hash (text)
stripe_payment_intent (text)
```

## Cancellation Policy Example
```
{ deadlineOffsetHours: 24, refundPercent: 50, feeCents: 0 }
```

## Manage Token
- JWT signed with `BOOKING_TOKEN_SECRET`.
- Scope: `manage` or `view` (currently only `manage` used).
- Rotation performed after destructive actions (cancel/reschedule) or manual request.

## Stripe Integration
- Charge = full or deposit_cents depending on payment_mode.
- Webhook (`/api/stripe/webhook`) updates `payment_status` to `captured` and stores `stripe_payment_intent`.
- Cancel endpoint issues partial refund via Stripe if eligible.

## Future Enhancements
- Staff assignment & availability.
- Waitlist endpoint.
 - Notification dispatcher to email users when slot freed.
- Promo codes & price adjustments.
- Webhook emitter for internal systems.
- Buffer times + dynamic exclusions in availability generation.
