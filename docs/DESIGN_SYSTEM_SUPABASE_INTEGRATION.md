# EKA Wellness Platform - Design System & Supabase Integration Guide

## Overview

This document outlines the comprehensive design system and Supabase integration for the EKA wellness platform, ensuring consistent visual design and seamless data flow across all components.

## Design System Components

### Keep React Component Library

We use Keep React v1.6.1 as our primary component library with the following valid variants:

#### Button Variants
- `default` - Primary action button
- `outline` - Secondary/outline button  
- `link` - Link-style button
- `softBg` - Soft background button

**Note:** `ghost` and `destructive` variants are not supported. Use semantic classes for destructive styling:
```tsx
// ❌ Invalid
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Cancel</Button>

// ✅ Valid
<Button variant="default" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete
</Button>
<Button variant="outline">Cancel</Button>
```

#### Badge Variants
- `background` - Filled background badge
- `border` - Border-only badge
- `base` - Base style badge

**Note:** `default`, `secondary`, `outline`, and `destructive` variants are not supported. Use semantic classes:
```tsx
// ❌ Invalid
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="outline">New</Badge>

// ✅ Valid
<Badge variant="background" className="text-success bg-success/5 border-success/20">
  Active
</Badge>
<Badge variant="border" className="text-warning border-warning/20">
  Pending
</Badge>
```

### Color System

#### Semantic Colors
```tsx
// Success states
text-success bg-success/5 border-success/20

// Warning states  
text-warning bg-warning/5 border-warning/20

// Error states
text-destructive bg-destructive/5 border-destructive/20

// Info states
text-info bg-info/5 border-info/20
```

#### Status Mapping
```tsx
const statusConfig = {
  Upcoming: { 
    variant: "background" as const, 
    className: "text-info border-info/20" 
  },
  Completed: { 
    variant: "background" as const, 
    className: "text-success border-success/20" 
  },
  Canceled: { 
    variant: "border" as const, 
    className: "text-destructive border-destructive/20" 
  },
};
```

## Supabase Integration

### Authentication

#### User Object Structure
```tsx
// Supabase User type extensions
interface User {
  id: string;                    // Use this instead of uid
  email: string;
  user_metadata: {
    displayName?: string;
    avatarUrl?: string;
    // Custom properties
    donationSeekerApproved?: boolean;
    totalReceived?: number;
    isDonationSeeker?: boolean;
    donationSeekerReason?: string;
    activityData?: any;
    personalizationCompleted?: boolean;
    personalization?: any;
    loyaltyPoints?: number;
  };
}
```

#### Safe User Property Access
```tsx
// ❌ Invalid (Firebase style)
const userId = user.uid;
const displayName = user.displayName;
const initials = user.initials;

// ✅ Valid (Supabase style)
const userId = user.id;
const displayName = user.user_metadata?.displayName || user.email;
const initials = (user.user_metadata?.displayName || user.email)
  .split(' ')
  .map(n => n[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();
```

### Database Schema

#### Core Tables

**users** (managed by Supabase Auth)
- `id` (UUID, primary key)
- `email` (text, unique)
- `user_metadata` (JSONB)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**sessions**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `therapist` (text)
- `date` (timestamp)
- `time` (text)
- `duration` (integer)
- `status` (text: 'Upcoming', 'Completed', 'Canceled')
- `type` (text: 'Individual', 'Group')
- `location` (text)
- `notes` (text)
- `created_at` (timestamp)

**subscriptions**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `stripe_subscription_id` (text, unique)
- `status` (text: 'active', 'canceled', 'past_due')
- `plan_id` (text)
- `current_period_start` (timestamp)
- `current_period_end` (timestamp)
- `created_at` (timestamp)

**donations**
- `id` (UUID, primary key)
- `donor_id` (UUID, foreign key to auth.users)
- `recipient_id` (UUID, foreign key to auth.users)
- `amount` (numeric)
- `currency` (text, default 'EUR')
- `status` (text: 'pending', 'completed', 'failed')
- `stripe_payment_intent_id` (text)
- `created_at` (timestamp)

### Storage Buckets

#### Profile Images
- **Bucket:** `profiles`
- **Path:** `profiles/{user_id}/avatar.{ext}`
- **Access:** Public read, authenticated write

#### Session Documents
- **Bucket:** `sessions`
- **Path:** `sessions/{session_id}/documents/{filename}`
- **Access:** Private, owner and therapist read/write

#### Donation Receipts
- **Bucket:** `donations`
- **Path:** `donations/{donation_id}/receipts/{filename}`
- **Access:** Private, donor and recipient read

### Real-time Subscriptions

#### Session Status Updates
```tsx
const subscription = supabase
  .channel('session-status')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'sessions' },
    (payload) => {
      // Handle session status update
      console.log('Session updated:', payload.new);
    }
  )
  .subscribe();
```

#### Donation Notifications
```tsx
const donationSubscription = supabase
  .channel('donation-notifications')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'donations' },
    (payload) => {
      // Handle new donation
      console.log('New donation:', payload.new);
    }
  )
  .subscribe();
```

## Stripe Integration

### Products and Pricing

Based on the Stripe integration, we have these products:

- **Free Consultation** - €0.00 (one-time)
- **Massage Rubí Basic** - €50.00-€180.00 (1-5 sessions)
- **Massage Rubí Full** - €65.00-€275.00 (1-5 sessions)  
- **Massage Rubí Premium** - €80.00 (1 session)
- **360° Revision** - €150.00 (comprehensive wellness assessment)
- **Kinesiology Barcelona** - €75.00 (specialized session)

### Webhook Events

The application handles these Stripe webhook events:

- `checkout.session.completed` - Subscription purchase completed
- `customer.subscription.updated` - Subscription status changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment processed successfully
- `invoice.payment_failed` - Payment failed

### Environment Variables

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs for each product/tier combination
STRIPE_PRICE_FREE_CONSULTATION_1=price_...
STRIPE_PRICE_MASSAGE_RUBI_BASIC_1=price_...
STRIPE_PRICE_MASSAGE_RUBI_BASIC_3=price_...
STRIPE_PRICE_MASSAGE_RUBI_BASIC_5=price_...
# ... additional price IDs
```

## Component Usage Examples

### Session Card with Status Badge
```tsx
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/keep';

function SessionCard({ session }) {
  const statusConfig = {
    Upcoming: { 
      variant: "background", 
      className: "text-info border-info/20" 
    },
    Completed: { 
      variant: "background", 
      className: "text-success border-success/20" 
    },
    Canceled: { 
      variant: "border", 
      className: "text-destructive border-destructive/20" 
    },
  };

  const config = statusConfig[session.status];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{session.type}</CardTitle>
        <Badge variant={config.variant} className={config.className}>
          {session.status}
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Session details */}
      </CardContent>
    </Card>
  );
}
```

### User Profile with Supabase
```tsx
import { useAuth } from '@/lib/supabase-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/keep';

function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const displayName = user.user_metadata?.displayName || user.email;
  const initials = (user.user_metadata?.displayName || user.email)
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage 
          src={user.user_metadata?.avatarUrl || ''} 
          alt={displayName}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{displayName}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
```

### Donation Form with Stripe
```tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

async function handleDonation(amount: number) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      userEmail: user.email,
      tierId: 'donation',
      subscriptionType: 'donation',
      interval: 'one_time',
    }),
  });

  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId });
}
```

## Testing Guidelines

### Authentication Flow
1. User registration via Supabase Auth
2. Email verification (if enabled)
3. Profile completion with user_metadata
4. Role-based access control

### Data Flow Testing
1. Session booking and management
2. Subscription purchase and management
3. Donation processing
4. Real-time updates via Supabase subscriptions

### Visual Consistency
1. All components use Keep React valid variants
2. Semantic color classes for status indicators
3. Consistent spacing and typography
4. Responsive design across all breakpoints

## Deployment Checklist

- [ ] Supabase project configured with proper RLS policies
- [ ] Stripe webhook endpoints configured and tested
- [ ] Environment variables set for production
- [ ] Storage buckets configured with proper access rules
- [ ] Database migrations applied
- [ ] TypeScript errors resolved (target: < 50 errors)
- [ ] Build process successful
- [ ] Core functionality tested with real data
- [ ] Visual consistency verified across all pages

## Support

For issues related to:
- **Keep React components**: Check valid variants and semantic classes
- **Supabase integration**: Verify user_metadata structure and RLS policies
- **Stripe integration**: Confirm webhook configuration and price IDs
- **Design consistency**: Reference this guide for component usage patterns