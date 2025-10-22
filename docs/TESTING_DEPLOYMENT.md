# Subscription System Testing & Deployment Guide

## Overview

This guide covers testing procedures and deployment steps for the Ekaacc subscription system (Loyal and VIP memberships).

## Testing Checklist

### 1. Unit Testing

#### Subscription Service Tests
```bash
# Run subscription service tests
npm test -- subscription-service

# Test coverage
- ✅ Create subscription
- ✅ Cancel subscription (immediate and at period end)
- ✅ Renew subscription
- ✅ Get user subscriptions
- ✅ Check active subscription status
- ✅ Update usage tracking
```

#### Theme Service Tests
```bash
# Run theme service tests
npm test -- theme-service

# Test coverage
- ✅ Get available themes based on subscription
- ✅ Check theme access permissions
- ✅ Set user theme preferences
- ✅ Get user theme preferences
```

### 2. Integration Testing

#### Stripe Integration
```bash
# Test with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test scenarios:
1. ✅ Create checkout session
2. ✅ Complete payment with test card
3. ✅ Webhook receives subscription.created event
4. ✅ Subscription created in database
5. ✅ Usage tracking initialized
6. ✅ User gains access to premium features
```

**Test Cards**:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

#### Subscription Flows

**1. Subscribe to Loyal**
```
Steps:
1. Navigate to /account/subscriptions
2. Click "Subscribe" on Loyal tier
3. Complete Stripe checkout
4. Verify redirect to success page
5. Check subscription appears in /loyal dashboard
6. Verify badge shows in header
7. Check theme access updated
```

**2. Subscribe to VIP**
```
Steps:
1. Navigate to /account/subscriptions
2. Click "Subscribe" on VIP tier
3. Complete checkout
4. Verify VIP dashboard access
5. Check unlimited sessions feature
6. Verify all VIP themes unlocked
```

**3. Cancel Subscription**
```
Steps:
1. Navigate to subscription page
2. Click "Manage Subscription"
3. Cancel via customer portal
4. Verify webhook receives cancellation
5. Check subscription marked for cancellation
6. Verify access continues until period end
```

**4. Admin Grant Subscription**
```
Steps:
1. Login as admin
2. Navigate to /admin/subscriptions
3. Select user from table
4. Click "Grant Subscription"
5. Choose Loyal or VIP
6. Verify subscription created
7. Check user has immediate access
```

### 3. UI/UX Testing

#### Badge System
- ✅ Loyal badge shows in header for loyal members
- ✅ VIP badge shows in header for VIP members
- ✅ Both badges show if user has both subscriptions
- ✅ No badge shows for non-subscribers
- ✅ Badges visible on user profile

#### Theme Selector
- ✅ Public theme accessible to all users
- ✅ Loyal themes locked for non-loyal users
- ✅ VIP themes locked for non-VIP users
- ✅ Lock icon shows on restricted themes
- ✅ Theme preview shows correct colors
- ✅ Apply button works and saves preference
- ✅ Selected theme persists across sessions

#### Dashboard Pages
- ✅ Loyal dashboard shows correct tier info
- ✅ VIP dashboard displays all features
- ✅ Usage stats display correctly
- ✅ Points earned/spent tracked accurately
- ✅ Themes unlocked count correct
- ✅ Renewal date displays properly

#### Admin Interface
- ✅ User table loads with subscriptions
- ✅ Search filters users correctly
- ✅ Type filter works (All/Loyal/VIP)
- ✅ Grant dialog creates subscription
- ✅ Revoke dialog cancels immediately
- ✅ Stats cards show accurate counts

### 4. Security Testing

#### Firestore Rules
```bash
# Test Firestore security rules
npm run test:rules

# Test scenarios:
1. ✅ User can read own subscriptions only
2. ✅ User cannot read other users' subscriptions
3. ✅ User cannot create/update subscriptions directly
4. ✅ Admin can read all subscriptions
5. ✅ Admin can grant/revoke subscriptions
6. ✅ User can update own theme preferences
7. ✅ User cannot access usage data of others
```

#### API Route Protection
```
Test scenarios:
1. ✅ Unauthenticated requests rejected
2. ✅ Users cannot access admin endpoints
3. ✅ Checkout requires valid user session
4. ✅ Portal requires valid customer ID
5. ✅ Webhook signature verification works
```

### 5. Performance Testing

#### Load Testing
```bash
# Test concurrent subscriptions
# Simulate 100 concurrent checkouts
artillery run subscription-load-test.yml

# Metrics to monitor:
- Response time < 2s for checkout
- Webhook processing < 500ms
- Database queries < 100ms
- No failed transactions
```

#### Database Queries
```
Optimize:
- ✅ Index on userId + status + createdAt
- ✅ Index on type + status + createdAt
- ✅ Limit query results appropriately
- ✅ Use pagination for large datasets
```

## Deployment Steps

### 1. Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Stripe live mode configured
- [ ] Environment variables set in production
- [ ] Firestore indexes deployed
- [ ] Security rules deployed
- [ ] Webhook endpoint configured with live keys

### 2. Environment Configuration

#### Production Environment Variables
```bash
# Required in production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LOYALTY_MONTHLY=price_live_...
STRIPE_PRICE_LOYALTY_YEARLY=price_live_...
STRIPE_PRICE_VIP_MONTHLY=price_live_...
STRIPE_PRICE_VIP_YEARLY=price_live_...
NEXT_PUBLIC_APP_URL=https://ekaacc.com
```

### 3. Stripe Configuration

#### A. Switch to Live Mode
1. Go to Stripe Dashboard
2. Toggle to **Live mode**
3. Create products and prices in live mode
4. Copy live price IDs
5. Update environment variables

#### B. Configure Webhook
1. Go to Developers → Webhooks
2. Add endpoint: `https://ekaacc.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy signing secret
5. Add to production environment

#### C. Customer Portal Settings
1. Go to Settings → Customer portal
2. Enable features:
   - Update payment methods
   - Cancel subscriptions (at period end)
   - View invoice history
3. Customize branding
4. Save settings

### 4. Firebase Deployment

#### A. Deploy Firestore Rules
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Verify deployment
firebase firestore:rules:get
```

#### B. Deploy Firestore Indexes
```bash
# Deploy indexes
firebase deploy --only firestore:indexes

# Monitor index creation in Firebase Console
# Indexes may take a few minutes to build
```

#### C. Deploy Cloud Functions (if any)
```bash
# Deploy functions
firebase deploy --only functions

# Test functions after deployment
```

### 5. Application Deployment

#### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
# ... add all other variables

# Redeploy after adding env vars
vercel --prod
```

#### Alternative: Docker Deployment
```bash
# Build Docker image
docker build -t ekaacc:latest .

# Run container
docker run -p 3000:3000 \
  -e STRIPE_SECRET_KEY=sk_live_... \
  -e STRIPE_WEBHOOK_SECRET=whsec_... \
  ekaacc:latest
```

### 6. Post-Deployment Verification

#### A. Smoke Tests
```
1. ✅ Homepage loads
2. ✅ User can login
3. ✅ Subscription page displays tiers
4. ✅ Checkout flow works with live mode
5. ✅ Webhooks receive events
6. ✅ Admin panel accessible
7. ✅ Theme selector functions
8. ✅ Badges display correctly
```

#### B. Monitor Stripe Events
```
1. Check Stripe Dashboard → Events
2. Verify webhooks delivering successfully
3. Monitor payment success rate
4. Check for any failed events
5. Review error logs
```

#### C. Database Monitoring
```
1. Check Firestore usage
2. Verify indexes are active
3. Monitor read/write operations
4. Check for any security rule violations
5. Review query performance
```

### 7. Monitoring & Alerts

#### Setup Monitoring
```bash
# Set up error tracking (e.g., Sentry)
npm install @sentry/nextjs

# Configure in next.config.js
```

#### Key Metrics to Monitor
- Subscription creation rate
- Payment success/failure rate
- Webhook delivery success rate
- API response times
- Database query performance
- Error rates per endpoint

#### Alert Thresholds
- Payment failure rate > 5%
- Webhook delivery failure > 2%
- API response time > 3s
- Error rate > 1%

### 8. Rollback Plan

If issues arise:
```bash
# 1. Revert to previous deployment
vercel rollback

# 2. Disable webhook endpoint temporarily
# In Stripe Dashboard → Webhooks → Disable

# 3. Revert Firestore rules if needed
firebase deploy --only firestore:rules

# 4. Notify users if subscription access affected
```

## Testing Scenarios

### Scenario 1: New User Subscribes to Loyal
1. User visits /account/subscriptions
2. Clicks "Subscribe" on Loyal tier
3. Redirected to Stripe checkout
4. Enters payment details
5. Completes payment
6. Webhook creates subscription in DB
7. User redirected to success page
8. User sees Loyal badge in header
9. User can access Loyal dashboard
10. User can select Loyal themes

**Expected**: Full access to Loyal features within 30 seconds

### Scenario 2: Existing Loyal Member Upgrades to VIP
1. User with Loyal subscription
2. Navigates to /account/subscriptions
3. Clicks "Subscribe" on VIP tier
4. Completes checkout
5. Now has both Loyal and VIP subscriptions
6. Both badges show in header
7. Access to all VIP features
8. All themes unlocked

**Expected**: Immediate access to VIP features, Loyal subscription unaffected

### Scenario 3: Admin Grants Free Subscription
1. Admin logs in
2. Goes to /admin/subscriptions
3. Finds user in table
4. Clicks actions → Grant Subscription
5. Selects VIP membership
6. Confirms grant
7. Subscription created without Stripe
8. User immediately gains access

**Expected**: User has VIP access without payment

### Scenario 4: User Cancels Subscription
1. User navigates to subscription page
2. Clicks "Manage Subscription"
3. Redirected to Stripe customer portal
4. Clicks "Cancel subscription"
5. Confirms cancellation
6. Webhook updates subscription to cancel_at_period_end
7. User retains access until period end
8. After period ends, access revoked

**Expected**: Access continues until end of billing period

## Maintenance

### Regular Tasks
- **Daily**: Monitor Stripe dashboard for failed payments
- **Weekly**: Review subscription metrics and revenue
- **Monthly**: Analyze churn rate and popular tiers
- **Quarterly**: Review and update pricing if needed

### Updates
- Keep Stripe SDK updated
- Monitor Stripe API changelog
- Test webhook changes in staging
- Update Firestore rules as features evolve

## Support

### Common Issues

**1. Webhook Not Receiving Events**
- Check webhook URL is correct
- Verify webhook secret matches
- Ensure endpoint is publicly accessible
- Check Stripe logs for delivery attempts

**2. Subscription Not Creating**
- Verify Firestore rules allow writes
- Check admin permissions
- Review API error logs
- Ensure tier IDs are correct

**3. Theme Access Not Working**
- Verify subscription is active
- Check theme requirements match subscription type
- Clear user session and re-login
- Review theme service logic

**4. Badge Not Showing**
- Check subscription status in database
- Verify badge component loaded
- Clear browser cache
- Check hook returning correct data

## Success Metrics

### KPIs to Track
- Monthly Recurring Revenue (MRR)
- Churn Rate
- Customer Lifetime Value (CLV)
- Conversion Rate (visitors → subscribers)
- Average Revenue Per User (ARPU)
- Subscription Growth Rate

### Target Benchmarks
- Churn Rate: < 5% monthly
- Conversion Rate: > 2%
- Payment Success Rate: > 95%
- Webhook Delivery: > 99%
- Page Load Time: < 2s

## Conclusion

This comprehensive testing and deployment guide ensures a smooth rollout of the subscription system. Follow each step carefully and verify all checkpoints before proceeding to production.

**Remember**: Always test thoroughly in staging with Stripe test mode before deploying to production with live keys!
