# Complete Application Flows Documentation

This document describes all user flows in the EKA Account application, including current implementation status and missing flows.

## 1. Authentication Flows

### 1.1 Sign Up Flow ✅ IMPLEMENTED
**Route:** `/signup`

**Steps:**
1. User navigates to signup page
2. User can choose between:
   - Email/password signup with optional full name and username
   - OAuth signup (Google, GitHub, Twitter, LinkedIn)
3. For email signup:
   - Enter email (required)
   - Enter password (min 6 characters, required)
   - Enter confirm password (must match)
   - Optionally enter full name
   - Optionally enter username (3+ chars, alphanumeric + underscore)
4. Form validation occurs
5. On submit, account is created in Supabase
6. User receives confirmation email
7. After confirmation, user is redirected to onboarding

**Issues Found:**
- ✅ Form works correctly
- ⚠️ Needs email confirmation setup in Supabase
- ⚠️ Redirect after signup not implemented (should go to onboarding)

### 1.2 Sign In Flow ✅ IMPLEMENTED
**Route:** `/login`

**Steps:**
1. User navigates to login page
2. User can choose between:
   - Email/password signin
   - OAuth signin (Google, GitHub, Twitter, LinkedIn)
3. For email signin:
   - Enter email
   - Enter password
4. On submit, user is authenticated
5. Redirect to dashboard or previous page

**Issues Found:**
- ✅ Form works correctly
- ✅ OAuth buttons present
- ⚠️ Error messages could be more user-friendly
- ⚠️ "Forgot password" link missing

### 1.3 OAuth Callback Flow ⚠️ NEEDS FIX
**Route:** `/auth/callback`

**Steps:**
1. User is redirected here from OAuth provider
2. Code is exchanged for session
3. User is redirected to dashboard

**Issues Found:**
- ⚠️ Fixed: Updated to use correct `exchangeCodeForSession` API
- ⚠️ Needs testing with actual OAuth providers

### 1.4 Sign Out Flow ⚠️ PARTIALLY IMPLEMENTED
**Implementation:** Available via auth context

**Steps:**
1. User clicks sign out button
2. Session is cleared
3. User is redirected to home page

**Issues Found:**
- ⚠️ No dedicated sign out button in main navigation
- ⚠️ Should confirm before signing out

### 1.5 Password Reset Flow ❌ MISSING
**Route:** NEEDS TO BE CREATED - `/forgot-password`, `/reset-password`

**Required Steps:**
1. User clicks "Forgot Password" on login page
2. User enters email address
3. Email with reset link is sent
4. User clicks link in email
5. User enters new password
6. User is redirected to login

**Implementation Needed:**
- Create `/forgot-password` page with email form
- Create `/reset-password` page with password form
- Add "Forgot Password" link to login page
- Implement password reset logic using Supabase

## 2. Onboarding Flow

### 2.1 User Onboarding ✅ IMPLEMENTED
**Route:** `/onboarding`

**Steps:**
1. After signup, user is directed to onboarding
2. User chooses onboarding type:
   - Quick Start (3 questions, 2 minutes)
   - Deep Personalization (7 steps, 5-7 minutes)
3. User completes onboarding steps
4. Progress is saved
5. After completion, user is directed to dashboard

**Issues Found:**
- ✅ Onboarding page loads correctly
- ⚠️ Need to verify all 8 steps are implemented
- ⚠️ Need to verify data is saved to database
- ⚠️ Need to implement redirect from signup to onboarding

## 3. Dashboard & Home Flows

### 3.1 Home Page ✅ IMPLEMENTED
**Route:** `/`

**Features:**
- Welcome message
- Feature highlights
- Sign in / Sign up buttons
- Quick access to main features

**Issues Found:**
- ✅ Page loads correctly
- ✅ Navigation works

### 3.2 Dashboard Flow ⚠️ PARTIALLY IMPLEMENTED
**Route:** `/dashboard`

**Features:**
- User overview
- Recent activity
- Quick actions
- AI insights preview
- Navigation to other sections

**Issues Found:**
- ✅ Auth guard works (shows "Please sign in" when not authenticated)
- ❌ Missing: Authenticated dashboard content
- ❌ Missing: Recent activity widget
- ❌ Missing: Quick action buttons
- ❌ Missing: Navigation sidebar/menu

### 3.3 My Account Flow ⚠️ NEEDS VERIFICATION
**Route:** `/myaccount`

**Expected Features:**
- View/edit profile information
- Manage account settings
- View subscription status
- Security settings

**Status:** NEEDS TESTING

## 4. Subscription & Payment Flows

### 4.1 View Subscriptions ⚠️ NEEDS VERIFICATION
**Route:** `/subscriptions`

**Features:**
- View available subscription tiers
- Compare features
- Current subscription status
- Upgrade/downgrade options

**Status:** NEEDS TESTING

### 4.2 Subscription Checkout Flow ⚠️ NEEDS VERIFICATION
**Route:** Via `/api/checkout`

**Steps:**
1. User selects subscription tier
2. User clicks subscribe
3. Stripe checkout session is created
4. User is redirected to Stripe
5. User completes payment
6. User is redirected back with success/failure
7. Webhook updates subscription status

**Issues Found:**
- ⚠️ Stripe integration requires environment variables
- ⚠️ Needs testing with test keys

### 4.3 Customer Portal Flow ⚠️ NEEDS VERIFICATION
**Route:** Via `/api/portal`

**Features:**
- Manage payment methods
- View billing history
- Cancel subscription
- Update subscription

**Status:** API endpoint exists, needs testing

### 4.4 Loyalty/VIP Tiers ⚠️ NEEDS VERIFICATION
**Routes:** `/loyalty`, `/loyalty/elite`, `/loyalty/member`, `/vip/silver`, `/vip/gold`, `/vip/platinum`

**Features:**
- View loyalty status
- Earn and redeem points
- VIP tier benefits
- Tier upgrade paths

**Status:** Routes exist, content needs verification

## 5. Therapist Flows

### 5.1 Therapist Dashboard ⚠️ NEEDS VERIFICATION
**Route:** `/therapist/dashboard`

**Features:**
- Overview of appointments
- Client management
- Earnings tracking
- Schedule management

**Status:** NEEDS TESTING

### 5.2 Client Management ⚠️ NEEDS VERIFICATION
**Route:** `/therapist/clients`

**Features:**
- View client list
- Search clients
- View client details
- Access client history

**Status:** NEEDS TESTING

### 5.3 Booking Management ⚠️ NEEDS VERIFICATION
**Route:** `/therapist/bookings`

**Features:**
- View upcoming bookings
- Confirm/cancel bookings
- Reschedule appointments
- Mark as completed

**Status:** NEEDS TESTING

### 5.4 Client Details ⚠️ NEEDS VERIFICATION
**Route:** `/therapist/person/[id]`

**Features:**
- View individual client profile
- Session history
- Notes and documents
- Communication history

**Status:** Dynamic route exists, needs testing

### 5.5 Billing for Therapists ⚠️ NEEDS VERIFICATION
**Route:** `/therapist/billing`

**Features:**
- View earnings
- Payment history
- Tax documents
- Payout settings

**Status:** NEEDS TESTING

### 5.6 Templates ⚠️ NEEDS VERIFICATION
**Route:** `/therapist/templates`

**Features:**
- Session note templates
- Exercise templates
- Communication templates
- Custom template creation

**Status:** NEEDS TESTING

## 6. Booking & Session Flows

### 6.1 View Sessions ⚠️ NEEDS VERIFICATION
**Route:** `/sessions`

**Features:**
- View upcoming sessions
- View past sessions
- Session details
- Reschedule/cancel

**Status:** NEEDS TESTING

### 6.2 Book Session Flow ⚠️ NEEDS VERIFICATION
**Route:** `/sessions/booking`

**Steps:**
1. Select therapist or service
2. Choose date and time
3. Confirm booking
4. Payment (if required)
5. Receive confirmation

**Status:** NEEDS TESTING

### 6.3 Find Therapists ⚠️ NEEDS VERIFICATION
**Route:** `/therapists`

**Features:**
- Browse therapists
- Filter by specialization
- View therapist profiles
- Book appointment

**Status:** NEEDS TESTING

## 7. Wellness Tracking Flows

### 7.1 Journal Entries ⚠️ NEEDS VERIFICATION
**Route:** `/journal`

**Features:**
- Create journal entries
- View past entries
- Mood tracking
- Tags and categorization
- Privacy settings

**Status:** NEEDS TESTING

### 7.2 Goals Management ⚠️ NEEDS VERIFICATION
**Route:** `/goals`

**Features:**
- Create goals
- Track progress
- View goal history
- Mark as complete
- Set reminders

**Status:** NEEDS TESTING

### 7.3 Progress Tracking ⚠️ NEEDS VERIFICATION
**Route:** `/progress`

**Features:**
- View progress charts
- Track metrics over time
- Export progress data
- Set milestones

**Status:** NEEDS TESTING

### 7.4 Progress Reports ⚠️ NEEDS VERIFICATION
**Route:** `/progress-reports`

**Features:**
- Generate reports
- Share with therapist
- Export as PDF
- Historical comparisons

**Status:** NEEDS TESTING

## 8. Communication Flows

### 8.1 Messages ⚠️ NEEDS VERIFICATION
**Route:** `/messages`

**Features:**
- Inbox/sent messages
- Compose new message
- Message threads
- Notifications

**Status:** NEEDS TESTING

## 9. Admin Flows

### 9.1 Admin Dashboard ⚠️ NEEDS VERIFICATION
**Route:** `/admin/dashboard`

**Features:**
- System overview
- User statistics
- Revenue metrics
- Recent activity

**Status:** NEEDS TESTING WITH ADMIN ROLE

### 9.2 User Management ⚠️ NEEDS VERIFICATION
**Route:** `/admin/users`

**Features:**
- View all users
- Search/filter users
- Edit user details
- Manage roles
- Ban/unban users

**Status:** NEEDS TESTING WITH ADMIN ROLE

### 9.3 Payment Management ⚠️ NEEDS VERIFICATION
**Route:** `/admin/payments`

**Features:**
- View all transactions
- Refund management
- Payment disputes
- Revenue reports

**Status:** NEEDS TESTING WITH ADMIN ROLE

### 9.4 Subscription Management ⚠️ NEEDS VERIFICATION
**Route:** `/admin/subscriptions`

**Features:**
- View all subscriptions
- Manually adjust subscriptions
- Handle subscription issues
- View churn metrics

**Status:** NEEDS TESTING WITH ADMIN ROLE

### 9.5 Admin Settings ⚠️ NEEDS VERIFICATION
**Route:** `/admin/settings`

**Features:**
- System configuration
- Email templates
- Feature flags
- Integration settings

**Status:** NEEDS TESTING WITH ADMIN ROLE

### 9.6 Create User ⚠️ NEEDS VERIFICATION
**Route:** `/admin/create-user`

**Features:**
- Create new user account
- Set initial role
- Send invitation email

**Status:** NEEDS TESTING WITH ADMIN ROLE

### 9.7 Community Setup ⚠️ NEEDS VERIFICATION
**Route:** `/admin/community-setup`

**Features:**
- Configure community features
- Set community rules
- Manage community roles

**Status:** NEEDS TESTING WITH ADMIN ROLE

## 10. Settings & Preferences

### 10.1 User Settings ⚠️ NEEDS VERIFICATION
**Route:** `/settings`

**Features:**
- Profile settings
- Password change
- Notification preferences
- Privacy settings
- Connected accounts

**Status:** NEEDS TESTING

### 10.2 Privacy Controls ⚠️ NEEDS VERIFICATION
**Route:** `/privacy-controls`

**Features:**
- Data privacy settings
- Who can see what
- Data export
- Account deletion

**Status:** NEEDS TESTING

### 10.3 Personalization ⚠️ NEEDS VERIFICATION
**Route:** `/personalization`

**Features:**
- UI preferences
- Recommended content settings
- Interest selection

**Status:** NEEDS TESTING

## 11. AI & Insights

### 11.1 AI Insights ⚠️ NEEDS VERIFICATION
**Route:** `/ai-insights`

**Features:**
- AI-generated insights
- Pattern analysis
- Recommendations
- Wellness tips

**Status:** NEEDS TESTING

### 11.2 AI Chat (API) ⚠️ NEEDS VERIFICATION
**Route:** `/api/ai/chat`

**Features:**
- Chat with AI assistant
- Context-aware responses
- Wellness guidance

**Status:** API endpoint exists, needs testing

## 12. Referral & Rewards

### 12.1 Referrals ⚠️ NEEDS VERIFICATION
**Route:** `/referrals`

**Features:**
- Referral code generation
- Track referrals
- Referral rewards
- Share options

**Status:** NEEDS TESTING

## 13. Promotional & Marketing Pages

### 13.1 Promotional Pages ⚠️ NEEDS VERIFICATION
**Routes:** 
- `/promotional/athlete`
- `/promotional/business`
- `/promotional/neck-pain`
- `/promotional/office-worker`
- `/promotional/student`

**Features:**
- Targeted landing pages
- Specific use cases
- Sign up CTAs

**Status:** Routes exist, content needs verification

## 14. Educational & Donation Flows

### 14.1 Educational Integration ⚠️ NEEDS VERIFICATION
**Route:** `/educational-integration`

**Features:**
- Educational content
- Learning resources
- Integration with education systems

**Status:** NEEDS TESTING

### 14.2 EI Plans ⚠️ NEEDS VERIFICATION
**Route:** `/ei-plans`

**Features:**
- Educational improvement plans
- Tracking and goals

**Status:** NEEDS TESTING

### 14.3 Donations ⚠️ NEEDS VERIFICATION
**Routes:** `/donations`, `/donations/reports`, `/donation-plans`, `/donation-seeker`

**Features:**
- Make donations
- View donation history
- Donation plans
- Request donations

**Status:** NEEDS TESTING

## 15. Tools & Utilities

### 15.1 Tools ⚠️ NEEDS VERIFICATION
**Route:** `/tools`

**Features:**
- Wellness tools
- Calculators
- Assessments
- Resources

**Status:** NEEDS TESTING

### 15.2 Verificator ⚠️ NEEDS VERIFICATION
**Route:** `/verificator`

**Features:**
- Verification system
- Document verification

**Status:** NEEDS TESTING

### 15.3 Forms ⚠️ NEEDS VERIFICATION
**Route:** `/forms`

**Features:**
- Custom forms
- Form builder
- Form submissions

**Status:** NEEDS TESTING

### 15.4 Reports ⚠️ NEEDS VERIFICATION
**Route:** `/reports`

**Features:**
- Generate various reports
- Export capabilities
- Scheduled reports

**Status:** NEEDS TESTING

## 16. Miscellaneous

### 16.1 Navigation Demo ⚠️ NEEDS VERIFICATION
**Route:** `/navigation-demo`

**Purpose:** Demonstration of navigation components

**Status:** NEEDS TESTING

### 16.2 Customized Blocks ⚠️ NEEDS VERIFICATION
**Route:** `/customized-blocks`

**Purpose:** UI component showcase

**Status:** NEEDS TESTING

## Missing Critical Flows

### 1. Password Reset Flow ❌ MISSING
**Priority:** HIGH

**Required Pages:**
- `/forgot-password` - Request password reset
- `/reset-password` - Set new password

**Required API:**
- Password reset request endpoint
- Password reset confirmation endpoint

### 2. Email Verification Flow ❌ MISSING
**Priority:** HIGH

**Required Pages:**
- `/verify-email` - Email verification confirmation
- Resend verification email option

### 3. Post-Signup Redirect ❌ MISSING
**Priority:** HIGH

After successful signup, user should be:
1. Shown email verification message
2. Redirected to onboarding (if email confirmed)
3. Given option to resend verification email

### 4. Post-Login Redirect ❌ MISSING
**Priority:** MEDIUM

After successful login:
1. If onboarding not complete → redirect to `/onboarding`
2. If onboarding complete → redirect to `/dashboard`
3. Respect "return URL" if coming from protected page

### 5. Session Timeout Handling ❌ MISSING
**Priority:** MEDIUM

**Required:**
- Detect session expiration
- Show re-authentication modal
- Preserve user's current location
- Redirect to login if needed

### 6. Account Settings Page ❌ INCOMPLETE
**Priority:** MEDIUM

**Missing Features:**
- Change email
- Change password
- Delete account
- Export data
- Connected accounts management

### 7. Notification System ❌ MISSING
**Priority:** MEDIUM

**Required:**
- In-app notifications
- Notification preferences
- Mark as read/unread
- Notification history

### 8. Search Functionality ❌ MISSING
**Priority:** LOW

**Required:**
- Global search
- Search therapists
- Search content
- Search history

## Summary

**Total Routes Identified:** 77 routes
**Fully Implemented:** ~10 routes (13%)
**Partially Implemented:** ~15 routes (19%)
**Needs Verification:** ~45 routes (58%)
**Missing:** ~7 critical flows (9%)

## Next Steps

1. ✅ Fix OAuth callback implementation
2. ✅ Fix E2E test assertions
3. ⚠️ Implement password reset flow
4. ⚠️ Implement email verification flow
5. ⚠️ Add post-signup/login redirects
6. ⚠️ Test all admin flows with proper permissions
7. ⚠️ Test all therapist flows
8. ⚠️ Test all user wellness tracking flows
9. ⚠️ Implement missing account settings features
10. ⚠️ Add comprehensive error handling throughout

## Testing Priority

**High Priority (Should test immediately):**
1. Authentication flows (login, signup, OAuth)
2. Dashboard for authenticated users
3. Onboarding completion
4. Subscription checkout
5. Basic profile management

**Medium Priority:**
6. Therapist dashboard and client management
7. Booking system
8. Journal and goal tracking
9. Admin user management
10. Payment portal

**Low Priority:**
11. Promotional pages
12. Educational features
13. Donation system
14. Advanced reporting
15. Navigation demos
