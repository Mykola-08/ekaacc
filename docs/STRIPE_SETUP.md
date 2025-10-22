# Stripe Integration Setup Guide

## Overview

This guide will help you set up Stripe payment processing for Ekaacc subscriptions (Loyal and VIP memberships).

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Node.js Package**: Install the Stripe npm package
3. **Environment Variables**: Configure Stripe keys

## Installation

### 1. Install Stripe Package

```bash
npm install stripe @stripe/stripe-js
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root and add:

```bash
# Copy from .env.stripe.example
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LOYALTY_MONTHLY=price_...
STRIPE_PRICE_LOYALTY_YEARLY=price_...
STRIPE_PRICE_VIP_MONTHLY=price_...
STRIPE_PRICE_VIP_YEARLY=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Dashboard Setup

### 1. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Add to `.env.local` as `STRIPE_SECRET_KEY`

### 2. Create Products and Prices

#### Loyal Membership

1. Go to **Products** → **Create product**
2. **Name**: Loyal Membership
3. **Description**: Enhanced rewards and exclusive benefits
4. **Pricing model**: Recurring
5. Create two prices:
   - **Monthly**: €9.99/month (copy price ID: `price_...`)
   - **Yearly**: €99.99/year (copy price ID: `price_...`)
6. Add price IDs to `.env.local`

#### VIP Membership

1. **Name**: VIP Membership
2. **Description**: Premium access with unlimited features
3. Create two prices:
   - **Monthly**: €49.99/month
   - **Yearly**: €499.99/year
4. Add price IDs to `.env.local`

### 3. Configure Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - For local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) or [ngrok](https://ngrok.com/)
4. **Events to listen for**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy **Signing secret** (starts with `whsec_`)
6. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Local Development Testing

### Option 1: Stripe CLI (Recommended)

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret shown (whsec_...)
# Add to .env.local as STRIPE_WEBHOOK_SECRET

# Test checkout flow
npm run dev
```

### Option 2: ngrok

```bash
# Install ngrok
# Run ngrok
ngrok http 3000

# Use the https URL for webhook endpoint in Stripe Dashboard
# Example: https://abc123.ngrok.io/api/webhooks/stripe
```

## Testing Checkout Flow

### Test Card Numbers

```text
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### Test Subscription Flow

1. Navigate to `/account/subscriptions`
2. Click "Subscribe" on Loyal or VIP tier
3. Enter test card details
4. Complete checkout
5. Verify webhook received in terminal
6. Check subscription created in database

## Implementation Files

### Backend

- `src/lib/stripe.ts` - Stripe utilities and helpers
- `src/app/api/checkout/route.ts` - Checkout session creation
- `src/app/api/portal/route.ts` - Customer portal access
- `src/app/api/webhooks/stripe/route.ts` - Webhook event handling

### Frontend

- `src/hooks/use-stripe-checkout.ts` - Checkout flow hook
- Update subscription pages to use checkout hook

### Database

- Update `subscription-service.ts` to:
  - Store `stripeCustomerId` on User
  - Store `stripeSubscriptionId` on Subscription
  - Handle webhook events

## Security Checklist

- [ ] Use test keys during development (starts with `sk_test_`)
- [ ] Never commit `.env.local` file
- [ ] Verify webhook signatures in production
- [ ] Use HTTPS in production
- [ ] Implement proper authentication for API routes
- [ ] Validate user permissions before checkout
- [ ] Handle subscription status changes correctly

## Production Deployment

### 1. Switch to Live Mode

1. Go to Stripe Dashboard → **Enable live mode**
2. Create new products and prices in live mode
3. Update `.env` with live keys:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - Update all `STRIPE_PRICE_*` with live price IDs
4. Update webhook endpoint to production URL
5. Get new webhook secret for production

### 2. Update Environment Variables

```bash
# Production .env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LOYALTY_MONTHLY=price_live_...
STRIPE_PRICE_LOYALTY_YEARLY=price_live_...
STRIPE_PRICE_VIP_MONTHLY=price_live_...
STRIPE_PRICE_VIP_YEARLY=price_live_...
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### 3. Configure Webhook in Production

1. Add production webhook endpoint
2. Select same events as test mode
3. Update `STRIPE_WEBHOOK_SECRET` with production secret

## Customer Portal Configuration

1. Go to **Settings** → **Customer portal**
2. Configure:
   - **Payment methods**: Allow updates
   - **Subscriptions**: Allow cancellation (at period end)
   - **Invoice history**: Show all invoices
3. Customize branding and messaging

## Troubleshooting

### Webhook Not Receiving Events

- Check webhook endpoint is publicly accessible
- Verify webhook secret matches
- Check Stripe Dashboard → Webhooks → Logs
- Ensure Next.js API route is configured correctly

### Checkout Session Errors

- Verify price IDs are correct
- Check API keys are valid
- Ensure customer email is provided
- Check browser console for errors

### Payment Failures

- Test with different test cards
- Check Stripe Dashboard → Payments → Logs
- Verify SCA (3D Secure) is handled
- Check customer's payment method

## Support

- **Stripe Documentation**: <https://stripe.com/docs>
- **Stripe Support**: <https://support.stripe.com>
- **Test Mode**: Use liberally during development
- **Stripe CLI**: Essential for local webhook testing

## Next Steps

1. Install Stripe package: `npm install stripe @stripe/stripe-js`
2. Configure environment variables
3. Create products and prices in Stripe Dashboard
4. Set up webhook endpoint
5. Test checkout flow with test cards
6. Implement subscription management UI
7. Test cancellation and updates
8. Deploy to production with live keys
