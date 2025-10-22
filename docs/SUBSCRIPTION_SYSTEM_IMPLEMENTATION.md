# 🎯 Subscription & Theme System - Implementation Guide

## ✅ Completed (Tasks 2-5 Partial)

### **Core Services & Types** ✅

1. **`src/lib/subscription-types.ts`** (650+ lines) - COMPLETE
   - Subscription types (Loyalty, VIP)
   - Subscription tiers with pricing
   - Theme system types
   - Stripe integration types
   - Admin management types
   - Default tier configurations
   - Default theme definitions

2. **`src/services/subscription-service.ts`** (350+ lines) - COMPLETE
   - Full CRUD operations for subscriptions
   - User subscription summary
   - Admin grant/revoke functionality
   - Usage tracking
   - Mock implementation with sample data
   - Firestore stubs (requires Cloud Functions)

3. **`src/services/theme-service.ts`** (250+ lines) - COMPLETE
   - Theme management
   - User theme preferences
   - Subscription-locked themes
   - Theme access validation
   - 6 themes initialized (1 default, 5 premium)

4. **`src/app/(app)/account/subscriptions/page.tsx`** (300+ lines) - COMPLETE
   - Main subscriptions page
   - Tier comparison
   - Pricing display (monthly/yearly)
   - Active subscription banner
   - FAQ section
   - Subscribe buttons (Stripe integration pending)

---

## 🚧 Remaining Work

### **Priority 1: Subscription Management Pages**

#### **1. Loyalty Subscription Detail Page**

**File**: `src/app/(app)/account/subscriptions/loyalty/page.tsx`

**Features**:

- Current subscription status (active, expires on date)
- Usage statistics:
  - Loyalty points earned this period
  - Loyalty points spent
  - Total discount saved (EUR)
  - Themes used
  - Rewards claimed
- Subscription details:
  - Billing cycle (monthly/yearly)
  - Next billing date
  - Amount
  - Cancel/Renew buttons
- Benefits list with checkmarks
- Upgrade to VIP option

#### **2. VIP Subscription Detail Page**

**File**: `src/app/(app)/account/subscriptions/vip/page.tsx`

**Features**:

- Current subscription status
- Usage statistics:
  - Sessions used/remaining
  - Group sessions attended
  - Reports generated
  - Premium themes unlocked
  - Rewards claimed
- Personal therapist assignment (if applicable)
- Subscription details (billing, cancel, renew)
- Benefits showcase
- Downgrade option (if needed)

### **Priority 2: Subscription-Specific Pages**

#### **3. Loyal Member Dashboard**

**File**: `src/app/(app)/loyal/page.tsx`

**Features**:

- Welcome banner with Loyal badge
- Loyalty points summary card
- 2x multiplier visualization
- Exclusive loyal rewards catalog
- Theme preview (5 premium themes)
- Recent activity (points earned, rewards claimed)
- Monthly summary
- Quick actions (redeem rewards, change theme, view benefits)

**Conditional Display**: Only show in sidebar if user has active Loyalty subscription

#### **4. VIP Member Dashboard**

**File**: `src/app/(app)/vip/page.tsx`

**Features**:

- VIP welcome banner with animated crown badge
- Unlimited sessions showcase
- Personal therapist card (name, photo, book button)
- VIP events calendar
- All premium themes gallery
- Advanced AI insights dashboard
- Monthly progress report download
- VIP community access
- Priority support quick contact

**Conditional Display**: Only show in sidebar if user has active VIP subscription

### **Priority 3: Badge System**

#### **5. Subscription Badge Component**

**File**: `src/components/eka/subscription-badge.tsx`

**Features**:

- Display Loyal/VIP/Both badges
- Gradient backgrounds
- Animated pulse for VIP
- Icon support (star, crown)
- Tooltip with benefits
- Multiple sizes (sm, md, lg)

**Usage**:

- User profile header
- User menu dropdown
- Community posts
- Session bookings
- Anywhere user name is displayed

#### **6. Profile Badge Integration**

**Files to Update**:

- `src/components/eka/app-header.tsx` - Add badge next to username
- User profile page - Add badge prominently
- Community posts - Show badge on author name
- Therapist booking - Show badge on patient list

### **Priority 4: Theme System UI**

#### **7. Theme Selector Component**

**File**: `src/components/eka/theme-selector.tsx`

**Features**:

- Grid of available themes
- Theme previews (color swatches)
- Locked themes with subscription requirement
- Current theme indicator
- Apply theme button
- Light/Dark/Auto mode toggle
- Preview mode before applying
- "Upgrade to unlock" CTA for premium themes

#### **8. Settings Theme Tab**

**File**: `src/app/(app)/account/settings/page.tsx` (update existing)

**Add Theme Section**:

- Theme selector integration
- Auto-switch settings
- Light theme selection
- Dark theme selection
- Reset to default button

### **Priority 5: Admin Management**

#### **9. Admin Subscriptions Management**

**File**: `src/app/admin/subscriptions/page.tsx`

**Features**:

- All users subscriptions table
  - User name, email, subscription type, status, expires
  - Filter by status, type
  - Search by user
- Summary cards:
  - Total active subscriptions
  - Total revenue (MRR, ARR)
  - Loyalty vs VIP split
  - Churn rate
- Actions per user:
  - Grant subscription (modal with duration picker)
  - Revoke subscription (with reason)
  - Extend subscription
  - View usage details
  - View subscription history
- Bulk actions:
  - Export to CSV
  - Send renewal reminders

#### **10. Admin Subscription Tiers Management**

**File**: `src/app/admin/subscriptions/tiers/page.tsx`

**Features**:

- List of all tiers (Loyalty, VIP)
- Edit tier details:
  - Pricing (monthly, yearly)
  - Benefits list
  - Features toggle
  - Badge customization
  - Theme unlocks
- Stripe price ID management
- Active/Inactive toggle
- Create new custom tier

#### **11. Admin Themes Management**

**File**: `src/app/admin/themes/page.tsx`

**Features**:

- All themes table
- Theme editor:
  - Name, description
  - Color picker for all theme variables
  - Preview panel
  - Subscription requirement
  - Public/Premium toggle
  - Featured toggle
- Create new theme
- Duplicate theme
- Delete theme
- Preview theme on site

### **Priority 6: Sidebar Updates**

#### **12. Dynamic Sidebar Items**

**File**: `src/components/eka/app-sidebar.tsx` (update existing)

**Changes**:

- Add conditional navigation items:

  ```tsx
  {hasLoyalty && (
    <SidebarItem href="/loyal" icon={Star}>
      Loyal Member
    </SidebarItem>
  )}
  
  {hasVIP && (
    <SidebarItem href="/vip" icon={Crown}>
      VIP Premium
    </SidebarItem>
  )}
  ```

- Add subscription badge to user menu
- Show "Upgrade" button if no subscriptions

### **Priority 7: Stripe Integration**

#### **13. Stripe Service**

**File**: `src/services/stripe-service.ts`

**Features**:

- Create Checkout Session
- Handle webhook events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Customer portal redirect
- Subscription management via Stripe

#### **14. Stripe Webhook Endpoint**

**File**: `src/app/api/webhooks/stripe/route.ts`

**Features**:

- Verify Stripe signature
- Handle all subscription events
- Update Firestore subscriptions
- Send confirmation emails
- Log all events

#### **15. Stripe Checkout Flow**

**Update**: `src/app/(app)/account/subscriptions/page.tsx`

**Add**:

- Create Checkout Session on subscribe button
- Redirect to Stripe Checkout
- Handle success/cancel redirects
- Success page with confirmation

### **Priority 8: Database & Security**

#### **16. Firestore Schema**

**File**: `docs/firestore-subscription-schema.md`

**Collections**:

1. `/subscriptions/{subscriptionId}` - User subscriptions
2. `/subscriptionTiers/{tierId}` - Tier configurations
3. `/subscriptionUsage/{usageId}` - Usage tracking
4. `/themes/{themeId}` - Theme definitions
5. `/userThemePreferences/{userId}` - User theme settings
6. `/subscriptionActions/{actionId}` - Admin action log

**Indexes**:

- `subscriptions`: `userId` ASC, `status` ASC, `type` ASC
- `subscriptionUsage`: `userId` ASC, `subscriptionId` ASC
- `subscriptionActions`: `userId` ASC, `performedAt` DESC

#### **17. Security Rules**

**File**: `firestore.rules` (update)

**Rules**:

```javascript
// Subscriptions - users read own, admins manage
match /subscriptions/{subId} {
  allow read: if request.auth.uid == resource.data.userId || isAdmin();
  allow write: if false; // Cloud Functions only
}

// Themes - all can read, admins manage
match /themes/{themeId} {
  allow read: if true;
  allow write: if isAdmin();
}

// User Theme Preferences - users manage own
match /userThemePreferences/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

### **Priority 9: Cloud Functions**

#### **18. Required Cloud Functions**

1. **`createStripeCheckoutSession`** (HTTP Callable)
   - Input: userId, tierId, interval
   - Creates Stripe Checkout Session
   - Returns session URL

2. **`handleStripeWebhook`** (HTTP)
   - Processes Stripe webhook events
   - Updates subscriptions in Firestore
   - Sends confirmation emails

3. **`grantSubscription`** (HTTP Callable)
   - Admin only
   - Input: userId, type, duration, reason
   - Creates subscription without payment

4. **`revokeSubscription`** (HTTP Callable)
   - Admin only
   - Input: subscriptionId, reason
   - Cancels subscription immediately

5. **`checkSubscriptionExpiry`** (Scheduled - Daily)
   - Finds expired subscriptions
   - Updates status to 'expired'
   - Resets theme if required

6. **`updateSubscriptionUsage`** (Firestore Trigger)
   - Triggered on relevant events
   - Updates usage statistics
   - Awards loyalty points

---

## 📊 Implementation Estimates

| Priority | Component | Files | Est. Time |
|----------|-----------|-------|-----------|
| 1 | Subscription detail pages | 2 | 3-4 hours |
| 2 | Loyal & VIP dashboards | 2 | 4-5 hours |
| 3 | Badge system | 5+ | 2-3 hours |
| 4 | Theme selector UI | 2 | 3-4 hours |
| 5 | Admin management | 3 | 5-6 hours |
| 6 | Sidebar updates | 1 | 1 hour |
| 7 | Stripe integration | 3 | 6-8 hours |
| 8 | Database schema | 2 | 2-3 hours |
| 9 | Cloud Functions | 6 | 8-10 hours |
| **TOTAL** | **26 files** | - | **35-45 hours** |

---

## 🎨 Design Specifications

### **Color Scheme**

- **Loyalty**: Amber/Gold (#f59e0b)
- **VIP**: Purple/Pink Gradient (#9333ea → #ec4899)

### **Badges**

- **Loyal**: Amber background, white text, star icon
- **VIP**: Gradient background, white text, crown icon, pulse animation

### **Theme Preview**

- Show 4-color palette preview
- Hover to see more colors
- Click to apply
- Lock icon on premium themes

---

## 🧪 Testing Checklist

### **Subscription Flow**

- [ ] Can view subscription tiers
- [ ] Can purchase Loyalty (monthly)
- [ ] Can purchase Loyalty (yearly)
- [ ] Can purchase VIP (monthly)
- [ ] Can purchase VIP (yearly)
- [ ] Can have both subscriptions
- [ ] Can cancel subscription
- [ ] Can renew subscription
- [ ] Sidebar updates with subscription

### **Theme System**

- [ ] Can view all available themes
- [ ] Cannot access premium themes without subscription
- [ ] Can switch theme with subscription
- [ ] Theme persists across sessions
- [ ] Theme reverts on cancellation
- [ ] Light/dark mode works

### **Admin Features**

- [ ] Can view all subscriptions
- [ ] Can grant subscription to user
- [ ] Can revoke subscription
- [ ] Can extend subscription
- [ ] Can manage tiers
- [ ] Can manage themes

### **Badge Components**

- [ ] Badge shows on profile
- [ ] Badge shows in sidebar
- [ ] Badge shows in community
- [ ] Badge shows correct tier
- [ ] Badge animates (VIP)

---

## 📝 Environment Variables

Add to `.env.local`:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Subscription
NEXT_PUBLIC_LOYALTY_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_LOYALTY_YEARLY_PRICE_ID=price_...
NEXT_PUBLIC_VIP_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_VIP_YEARLY_PRICE_ID=price_...
```

---

## 🚀 Next Steps

1. **Immediate**: Build subscription detail pages (Priority 1)
2. **Short-term**: Create Loyal/VIP dashboards (Priority 2)
3. **Medium-term**: Implement badge system and theme UI (Priority 3-4)
4. **Long-term**: Admin tools and Stripe integration (Priority 5-7)
5. **Production**: Cloud Functions and security (Priority 8-9)

---

## 📦 Package Dependencies

Install required packages:

```bash
npm install @stripe/stripe-js stripe
npm install lucide-react # Already installed
```

---

**Current Status**: Foundation complete (types, services, main page). Ready to build detail pages and dashboards.
