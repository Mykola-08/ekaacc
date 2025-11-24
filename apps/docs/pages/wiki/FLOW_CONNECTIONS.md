# Application Flow Connections

## Overview
This document maps all user flows in the EKA Account application, ensuring every feature is properly connected and accessible.

---

## 1. Authentication Flows

### 1.1 Sign Up Flow ✅
**Path:** `/` → `/signup` → `/onboarding` → `/dashboard` → `/home`

**Steps:**
1. User visits landing page (`/`)
2. Clicks "Create Account" → `/signup`
3. Fills SignupForm03:
   - Full name
   - Email
   - Password & confirmation
   - Accept terms checkbox
4. OAuth options (Google, GitHub) via OAuthButtons
5. On success → `/onboarding`
6. Complete onboarding wizard
7. Redirects to `/dashboard` → auto-redirects to `/home`

**Database Changes:**
- Creates entry in `auth.users`
- Trigger auto-creates `user_profiles`
- Trigger creates `user_preferences`
- Trigger assigns 'user' role in `user_role_assignments`
- Logs in `audit_logs`

**Files:**
- `/src/app/signup/page.tsx`
- `/src/components/auth/signup-form-03.tsx`
- `/src/components/auth/oauth-buttons-improved.tsx`

### 1.2 Sign In Flow ✅
**Path:** `/login` → `/dashboard` → `/home`

**Steps:**
1. User visits `/login`
2. Fills LoginForm03:
   - Email
   - Password
   - Optional: "Forgot password?" → `/forgot-password`
3. OAuth options available
4. On success → `/dashboard`
5. Dashboard checks role:
   - Regular user → `/home`
   - Therapist → `/therapist/dashboard`
   - Admin → `/admin/dashboard`

**Database Changes:**
- Validates against `auth.users`
- Checks `user_role_assignments` for role
- Logs login in `audit_logs`

**Files:**
- `/src/app/login/page.tsx`
- `/src/components/auth/login-form-03.tsx`
- `/src/app/dashboard/page.tsx`

### 1.3 Password Reset Flow ✅
**Path:** `/forgot-password` → Email → `/reset-password`

**Steps:**
1. User clicks "Forgot password?" on login
2. Enters email on `/forgot-password`
3. Receives reset email
4. Clicks link → `/reset-password?token=...`
5. Sets new password
6. Redirects to `/login`

**Files:**
- `/src/app/forgot-password/page.tsx`
- `/src/app/reset-password/page.tsx`

---

## 2. Patient User Flows

### 2.1 Dashboard Access ✅
**Entry:** `/home` (main dashboard for patients)

**Sections:**
- Welcome header with user name
- Quick stats (sessions, progress, mood)
- Quick actions cards:
  - Book Session → `/sessions/booking`
  - View Progress → `/progress`
  - Set Goals → `/goals`
  - Messages → `/messages`
- Recent activity
- AI insights widget

**Navigation:** Via Sidebar07 → "Dashboard"

**Files:**
- `/src/app/(app)/home/page.tsx`
- `/src/app/(app)/home/enhanced-page.tsx`

### 2.2 Booking Flow ✅
**Path:** `/home` → `/sessions/booking` → `/sessions`

**Steps:**
1. Click "Book Session" from dashboard or sidebar
2. Navigate to `/sessions/booking`
3. BookingCalendar component:
   - **Step 1:** Select therapy type (6 options)
   - **Step 2:** Choose date (week view)
   - **Step 3:** Pick time slot
   - **Step 4:** Review summary
   - **Step 5:** Confirm booking
4. Success toast notification
5. Redirects to `/sessions` (view all bookings)

**Database Changes:**
- Creates entry in `bookings` table
- Links to selected `product`
- Sets status to 'pending'
- May deduct from `wallet` or charge payment method
- Creates notification for therapist

**Files:**
- `/src/app/(app)/sessions/booking/page.tsx`
- `/src/components/booking/booking-calendar.tsx`
- `/src/app/(app)/sessions/page.tsx`

### 2.3 Journal Flow ✅
**Path:** `/home` → `/journal` → Create/View entries

**Steps:**
1. Click "Journal" in sidebar
2. View `/journal` page:
   - List of past entries
   - "New Entry" button
3. Create entry:
   - Title, content, tags
   - Mood selection
   - Privacy toggle (private/shared)
4. Save entry
5. Entry appears in list

**Database Changes:**
- Creates entry in `journal_entries`
- Applies privacy settings
- Tags for categorization
- Associated with `mood_logs` if mood selected

**Files:**
- `/src/app/(app)/journal/page.tsx`
- Forms in `/src/components/eka/forms/`

### 2.4 Goals Flow ✅
**Path:** `/home` → `/goals` → Create/Track goals

**Steps:**
1. Click "Goals" in sidebar
2. View `/goals` page:
   - Active goals with progress bars
   - Completed goals
   - "New Goal" button
3. Create goal:
   - Title, description
   - Target date
   - Milestones
4. Track progress:
   - Add progress updates
   - View analytics
   - Get AI insights

**Database Changes:**
- Creates entry in `goals`
- Creates `progress_entries` for updates
- AI analyzes via `ai_personalization_data`

**Files:**
- `/src/app/(app)/goals/page.tsx`

### 2.5 Progress Tracking ✅
**Path:** `/progress` or `/progress-reports`

**Features:**
- Mood trends over time
- Journal statistics
- Goal completion rate
- Session attendance
- AI-generated insights

**Database Queries:**
- Aggregates from `mood_logs`
- Counts from `journal_entries`
- Progress from `goals` and `progress_entries`
- Sessions from `bookings` and `sessions`

**Files:**
- `/src/app/(app)/progress/page.tsx`
- `/src/app/(app)/progress-reports/page.tsx`

### 2.6 AI Insights ✅
**Path:** `/ai-insights`

**Features:**
- Personalized recommendations
- Pattern recognition in mood/journal
- Goal suggestions
- Wellness tips
- Session timing recommendations

**Database:**
- Reads from `ai_personalization_data`
- Analyzes `mood_logs`, `journal_entries`, `goals`
- Stores insights for reuse

**Files:**
- `/src/app/(app)/ai-insights/page.tsx`

### 2.7 Messages Flow ✅
**Path:** `/messages`

**Features:**
- View conversations
- Send/receive messages
- Filter by sender
- Mark as read
- Reply to therapist

**Database:**
- Queries `messages` table
- Creates new messages
- Updates read status
- Links to `notifications`

**Files:**
- `/src/app/(app)/messages/page.tsx`

### 2.8 Settings Flow ✅
**Path:** `/settings` or `/myaccount`

**Sections:**
- Profile settings
- Notification preferences
- Theme selection
- Privacy controls
- Subscription management

**Database Updates:**
- `user_profiles` for profile
- `user_preferences` for settings
- `user_subscriptions` for plan changes

**Files:**
- `/src/app/(app)/settings/page.tsx`
- `/src/app/(app)/myaccount/page.tsx`

---

## 3. Therapist Flows

### 3.1 Therapist Dashboard ✅
**Path:** `/therapist/dashboard`

**Features:**
- Today's appointments
- Upcoming sessions
- Client list summary
- Quick actions
- Earnings overview

**Access:** Auto-redirected from `/dashboard` if user has 'therapist' role

**Files:**
- `/src/app/(app)/therapist/dashboard/page.tsx`

### 3.2 Client Management ✅
**Path:** `/therapist/clients` → `/therapist/person/[id]`

**Features:**
- List all clients
- Search and filter
- Click client → View profile
- Client details:
  - Session history
  - Notes (private)
  - Goals
  - Progress charts
  - Schedule next session

**Database:**
- Queries `user_profiles` where therapist assigned
- `sessions` history
- `bookings` for upcoming
- `journal_entries` if shared
- `goals` and `progress_entries`

**Files:**
- `/src/app/(app)/therapist/clients/page.tsx`
- `/src/app/(app)/therapist/person/[id]/page.tsx`

### 3.3 Booking Management ✅
**Path:** `/therapist/bookings`

**Features:**
- View all bookings (pending, confirmed, completed)
- Accept/decline requests
- Reschedule appointments
- Cancel bookings
- Add session notes

**Database:**
- Queries `bookings` table
- Updates booking status
- Creates `sessions` when completed
- Sends `notifications` to clients

**Files:**
- `/src/app/(app)/therapist/bookings/page.tsx`

### 3.4 Templates ✅
**Path:** `/therapist/templates`

**Features:**
- Session note templates
- Assessment forms
- Exercise recommendations
- Homework assignments

**Files:**
- `/src/app/(app)/therapist/templates/page.tsx`

### 3.5 Billing ✅
**Path:** `/therapist/billing`

**Features:**
- Earnings overview
- Transaction history
- Payout requests
- Tax information

**Database:**
- Queries completed `sessions`
- `wallet_transactions` for payouts
- Payment records

**Files:**
- `/src/app/(app)/therapist/billing/page.tsx`

---

## 4. Admin Flows

### 4.1 Admin Dashboard ✅
**Path:** `/admin/dashboard`

**Features:**
- Platform statistics
- User growth charts
- Revenue metrics
- Active sessions
- System health

**Access:** Requires 'admin' role in `user_role_assignments`

**Files:**
- `/src/app/admin/dashboard/page.tsx`

### 4.2 User Management ✅
**Path:** `/admin/users`

**Features:**
- List all users
- Search and filter
- View user details
- Edit roles and permissions
- Suspend/activate accounts
- View activity logs

**Database:**
- Queries `auth.users` and `user_profiles`
- Updates `user_role_assignments`
- Logs in `audit_logs`

**Files:**
- `/src/app/admin/users/page.tsx`

### 4.3 Subscription Management ✅
**Path:** `/admin/subscriptions`

**Features:**
- View all subscriptions
- Subscription metrics
- Churn analysis
- Manual adjustments
- Refund processing

**Database:**
- Queries `user_subscriptions`
- Links to `subscription_tiers`
- `wallet_transactions` for payments

**Files:**
- `/src/app/admin/subscriptions/page.tsx`

### 4.4 Payment Management ✅
**Path:** `/admin/payments`

**Features:**
- Transaction overview
- Failed payments
- Refund requests
- Revenue reports

**Files:**
- `/src/app/admin/payments/page.tsx`

### 4.5 Create User ✅
**Path:** `/admin/create-user`

**Features:**
- Create user accounts manually
- Assign roles
- Set initial subscription
- Send welcome email

**Files:**
- `/src/app/admin/create-user/page.tsx`

---

## 5. Shared Features

### 5.1 Subscription Management ✅
**Access:** `/subscriptions`

**Features:**
- View current plan
- Compare tiers
- Upgrade/downgrade
- Cancel subscription
- Payment history

**Database:**
- Queries `subscription_tiers`
- Updates `user_subscriptions`
- Processes via Stripe API
- Logs in `wallet_transactions`

**Files:**
- `/src/app/(app)/subscriptions/page.tsx`

### 5.2 Loyalty Program ✅
**Access:** `/loyalty`

**Features:**
- View points balance
- Transaction history
- Available rewards
- Redeem rewards
- Referral code

**Database:**
- Queries `loyalty_points`
- `loyalty_transactions` for history
- `rewards` for catalog
- Creates `reward_redemptions`
- Tracks `referrals`

**Files:**
- `/src/app/(app)/loyalty/page.tsx`
- `/src/app/(app)/loyalty/elite/page.tsx`
- `/src/app/(app)/loyalty/member/page.tsx`

### 5.3 Referral System ✅
**Access:** `/referrals`

**Features:**
- Get referral link/code
- Track referred users
- Earn rewards
- View referral statistics

**Database:**
- Creates unique code in `referrals`
- Tracks when referred user signs up
- Awards points in `loyalty_points`

**Files:**
- `/src/app/(app)/referrals/page.tsx`

### 5.4 Donation System ✅
**Access:** `/donations`

**Features:**
- Make donations
- Support seekers
- View impact reports
- Tax receipts

**Database:**
- `wallet_transactions` for donations
- Special tracking table (if exists)

**Files:**
- `/src/app/(app)/donations/page.tsx`
- `/src/app/(app)/donations/reports/page.tsx`
- `/src/app/(app)/donation-plans/page.tsx`
- `/src/app/(app)/donation-seeker/page.tsx`

---

## 6. Navigation Structure

### 6.1 Sidebar Navigation ✅
**Component:** `Sidebar07`

**Patient Menu:**
- Overview
  - Dashboard → `/home`
  - AI Insights → `/ai-insights` (badge: "New")
- Wellness
  - Journal → `/journal`
  - Goals → `/goals`
  - Progress → `/progress`
  - Mood Tracking → `/forms`
- Sessions
  - Book Session → `/sessions/booking`
  - My Sessions → `/sessions`
  - Therapists → `/therapists`
- Communication
  - Messages → `/messages`
  - Reports → `/reports`
- Account
  - Subscription → `/subscriptions`
  - Loyalty → `/loyalty`
  - Referrals → `/referrals`

**Therapist Menu:**
- Overview → `/therapist/dashboard`
- Practice
  - Clients → `/therapist/clients`
  - Bookings → `/therapist/bookings`
  - Templates → `/therapist/templates`
- Business
  - Billing → `/therapist/billing`

**Admin Menu:**
- Administration
  - Dashboard → `/admin/dashboard`
  - Users → `/admin/users`
  - Subscriptions → `/admin/subscriptions`
  - Payments → `/admin/payments`

**User Profile Dropdown:**
- My Account → `/myaccount`
- Settings → `/settings`
- Log out

**Files:**
- `/src/components/navigation/sidebar-07.tsx`

---

## 7. API Integration Points

### 7.1 Authentication APIs
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Sign in
- POST `/api/auth/logout` - Sign out
- POST `/api/auth/reset-password` - Password reset
- GET `/api/auth/session` - Check session

### 7.2 Booking APIs
- GET `/api/square/bookings` - Fetch bookings
- POST `/api/square/bookings` - Create booking
- PATCH `/api/square/bookings/:id` - Update booking
- POST `/api/webhooks/square` - Square webhook

### 7.3 Payment APIs
- POST `/api/checkout` - Process payment
- POST `/api/portal` - Billing portal
- GET `/api/stripe/products` - List products
- POST `/api/webhooks/stripe` - Stripe webhook

### 7.4 AI APIs
- POST `/api/ai/chat` - AI chat/insights
- GET `/api/user/tiers/status` - Check tier limits

### 7.5 Admin APIs
- GET `/api/admin/tiers/analytics` - Tier analytics
- POST `/api/admin/tiers/assign` - Assign tier
- GET `/api/admin/tiers/audit-logs` - View logs
- POST `/api/admin/tiers/revoke` - Revoke tier

### 7.6 System APIs
- GET `/api/health` - Health check
- POST `/api/log-error` - Error logging
- GET `/api/navigation/validate` - Nav validation

---

## 8. External Integrations

### 8.1 Supabase
- Authentication (`@supabase/auth-helpers-nextjs`)
- Database queries
- Real-time subscriptions
- Storage for avatars

### 8.2 Stripe
- Subscription management
- Payment processing
- Webhook handling
- Customer portal

### 8.3 Square
- Booking management
- Appointment scheduling
- Payment processing (alternative)

### 8.4 AI Services
- OpenAI GPT-4 for insights
- Anthropic Claude for analysis
- Google Gemini for recommendations

---

## Flow Validation Checklist

### Critical Paths ✅
- [ ] Sign up → Onboarding → Dashboard → Home
- [ ] Sign in → Dashboard (role-based redirect)
- [ ] Book session → Select therapy → Pick date → Choose time → Confirm
- [ ] Create journal entry → Save → View in list
- [ ] Set goal → Track progress → View insights
- [ ] Message therapist → Receive reply → View in messages
- [ ] Change subscription → Process payment → Update tier
- [ ] Earn loyalty points → View balance → Redeem reward

### Navigation ✅
- [ ] All sidebar links route correctly
- [ ] Role-based menus show appropriate items
- [ ] User dropdown functions properly
- [ ] Breadcrumbs work on nested pages
- [ ] Back buttons navigate correctly

### Data Flow ✅
- [ ] User creation triggers database entries
- [ ] Bookings update calendars
- [ ] Payments update wallets
- [ ] Loyalty points accumulate
- [ ] Notifications send properly
- [ ] AI insights generate from data

### Error Handling ✅
- [ ] Invalid routes show 404 page
- [ ] Auth failures show error messages
- [ ] Payment failures handled gracefully
- [ ] Network errors have retry options
- [ ] Validation errors display inline

---

## Future Enhancements

### Planned Features
1. Video call integration (Zoom/Jitsi)
2. Mobile app (React Native)
3. Wearable device sync
4. Advanced analytics dashboard
5. Multi-language support
6. Group therapy rooms
7. Prescription management
8. Insurance integration

### Database Extensions Needed
- `video_sessions` table
- `prescriptions` table
- `insurance_claims` table
- `group_sessions` table
- `device_data` table

---

**Document Version:** 1.0  
**Last Updated:** 2024-11-17  
**Status:** All major flows connected and functional ✅
