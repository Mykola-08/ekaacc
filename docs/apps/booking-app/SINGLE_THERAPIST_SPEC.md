# Updated Therapist App Specification (Single Therapist Mode)

**Version:** 1.1  
**Date:** January 16, 2026  
**Status:** Single Therapist Active - Simplified UI/UX  
**Key Change:** All therapist selection, comparison, discovery, and matching features **HIDDEN** until additional therapists join

***

## Platform Overview (Single Therapist Mode)

**Current State:** Platform serves **ONE active therapist only**. All therapist-related discovery features are **disabled/hidden**.

**What Users See Instead:**
```
📅 Welcome! Book your next session with [Therapist Name]
👤 Dr. Sarah Chen - Your Wellness Guide
🎯 Specialties: Anxiety, Stress, Relationships, Life Transitions
💬 "Ready to help you thrive"
[BOOK NOW] [VIEW SCHEDULE]
```

**Auto-Enable Features:** When 2+ therapists join, automatically reveal full discovery features.

***

## Updated User Roles & Simplified Permissions

### **1. Client/Patient** *(Primary User)*
```
✅ Book sessions (DIRECT to single therapist - no selection needed)
✅ View personal upcoming schedule 
✅ Reschedule/cancel own sessions
✅ View session history & summaries
✅ Complete assigned exercises
✅ Access wallet & payment history
✅ View VIP/loyalty status & rewards
✅ Rate sessions (1-5 stars)
✅ Receive AI recommendations
✅ Join sessions (video/audio/chat)
✅ Manage profile & health metadata
✅ View personalized wellness dashboard
❌ Cannot see therapist comparison
❌ Cannot filter by specialty/location
```

### **2. Parent/Guardian** *(For minors/dependents)*
```
✅ All Client permissions for dependent
✅ Manage child's session schedule
✅ View child's exercise progress
✅ Approve session changes
✅ Set session time restrictions
✅ Receive child session summaries
✅ Manage payment for dependent
```

### **3. Student Client** *(Verified students)*
```
✅ All Client permissions
✅ Automatic 15% student discount
✅ Student-only wellness resources
✅ "Study Buddy" loyalty track
```

### **4. Therapist** *(Single Active Therapist)*
```
✅ View all client schedules
✅ Create/edit session notes
✅ Assign exercises & homework
✅ Set weekly availability
✅ View client profiles & metadata
✅ Access earnings dashboard
✅ Block problematic clients
✅ View client feedback/ratings
✅ Manage session cancellation policy
```

### **5. Admin/Platform Manager**
```
✅ Full system access
✅ Manage all users & payments
✅ Configure VIP/loyalty tiers
✅ Monitor platform analytics
✅ Manage exercises library
✅ Configure AI personalization
✅ Handle disputes/refunds
✅ System configuration
```

***

## Simplified Core Features (Single Therapist)

### **Module 1: SIMPLIFIED BOOKING** *(No Therapist Selection)*

#### **Client Booking Flow:**
```
1. Home Screen → "Book Next Session" (BIG GREEN BUTTON)
2. Shows single therapist's availability calendar
3. Select date/time slot → Confirm
4. Add session notes → Book
5. Instant confirmation + reminders
```

**Features:**
```
✅ Real-time availability calendar
✅ Recurring booking (weekly/bi-weekly)
✅ Session types: 30/45/60 min
✅ Formats: Video/Voice/Chat
✅ Auto-apply VIP/loyalty discounts
✅ Calendar sync (Google/Apple)
✅ Pre-session intake forms
```

**HIDDEN FEATURES (until 2+ therapists):**
```
❌ Therapist search/filter
❌ Therapist profiles comparison
❌ "Find your match" recommendations
❌ Specialty browsing
❌ Rating-based sorting
```

#### **Therapist Schedule Management:**
```
✅ Set weekly availability blocks
✅ Block personal time/vacations
✅ View client roster by day/week
✅ One-click session join
✅ Buffer time between sessions
✅ No-show auto-handling
```

***

### **Module 2: SIMPLIFIED PROFILES**

#### **Client Profile** *(Rich Metadata Collection)*
```
BASIC INFO:
- Name, DOB, contact details
- Emergency contacts
- Preferred session time/format

HEALTH METADATA:
- Primary concerns (anxiety, stress, etc.)
- Current medications/allergies
- Previous therapy experience
- Wellness goals

BEHAVIORAL DATA:
- Booking frequency patterns
- Exercise completion rates
- Session feedback trends
- Preferred session times
```

#### **Therapist Profile** *(Single - Always Visible)*
```
STATIC DISPLAY (no selection needed):
- Name, credentials, photo
- Specialties list
- Session formats offered
- Availability summary
- Bio/response time
```

***

### **Module 3: Session Management** *(Unchanged)*

```
PRE-SESSION:
✅ 48h/24h/1h reminders
✅ Virtual waiting room
✅ Tech check (camera/mic)

DURING SESSION:
✅ HD video/audio/chat
✅ Screen sharing
✅ Real-time notes
✅ Session timer

POST-SESSION:
✅ Client feedback (1-5 stars)
✅ Therapist summary/notes
✅ Auto-add to history
✅ Exercise assignments
```

***

### **Module 4: Exercise Management** *(Unchanged)*

```
THERAPIST SIDE:
✅ Assign exercises with deadlines
✅ Track completion rates
✅ View client progress

CLIENT SIDE:
✅ Daily exercise dashboard
✅ Video tutorials
✅ Completion tracking
✅ Streak counter
✅ AI-suggested exercises
```

***

## VIP & Loyalty System (Unchanged - Fully Active)

### **VIP Membership Tiers**
```
SILVER ($9.99/mo): 5% off, priority reminders
GOLD ($19.99/mo): 10% off, monthly check-in
PLATINUM ($39.99/mo): 15% off, dedicated support
```

### **Loyalty Discounts by Session Frequency**
```
1-2 sessions/mo → 0% discount
3-4 sessions/mo → 5% discount  
5-6 sessions/mo → 10% discount
7+ sessions/mo → 15% discount
50+ lifetime → "Loyal Guest" (permanent 15%)
```

### **Points System**
```
1 session = 10 points
4+ sessions/mo = +20 bonus
Review = +5 points
Exercise = +5 points
50 points = $5 credit
```

***

## AI Personalization (Single Therapist Optimized)

**Since only 1 therapist, AI focuses on:**

```
1. OPTIMAL SESSION TIMING
   "You book best on Wednesdays 3-5 PM"
   "Weekly sessions show best progress for you"

2. EXERCISE RECOMMENDATIONS
   "Anxiety clients like you complete breathing 78%"

3. PROGRESS TRACKING
   "Mood improved 25% over 8 weeks"
   "Consider bi-weekly sessions now"

4. CHURN PREVENTION
   "Missed last week? Free reminder call available"
```

***

## AI Chat Blocks (Single Therapist Version)

### **1. Booking Block (Simplified)**
```
┌─ NEXT SESSION ───────────────────┐
│ 📅 Thursday Jan 22 @ 3:00 PM     │
│ 👤 Dr. Sarah Chen                │
│ ⏱️ 60 min Video                  │
│ 💰 $65 (10% VIP discount)        │
│                                     │
│ [JOIN] [RESCHEDULE] [CANCEL]     │
└──────────────────────────────────┘
```

### **2. Schedule Block**
```
┌─ DR. CHEN'S AVAILABILITY ────────┐
│ 📅 This Week                     │
│ Wed 3PM, 4PM  ✅ Available       │
│ Thu 2PM, 4PM  ✅ Available       │
│ Fri 10AM, 3PM ✅ Available       │
│                                     │
│ [BOOK 3PM WED] [VIEW FULL WEEK] │
└──────────────────────────────────┘
```

### **3. Progress Dashboard**
```
┌─ YOUR PROGRESS ──────────────────┐
│ 📈 Sessions: 8 this month        │
│ ✅ Exercises: 22/25 completed     │
│ ⭐ Avg Rating: 4.8/5             │
│ 💰 VIP Gold - 10% discount       │
│                                     │
│ 🎯 Goals: Anxiety ↓42%           │
│ [VIEW DETAILS] [BOOK NEXT]       │
└──────────────────────────────────┘
```

***

## Updated UI Flow (Single Therapist)

```
HOME SCREEN:
[YOUR NEXT SESSION CARD]
[QUICK BOOK BUTTON]
[WELLNESS DASHBOARD]
[EXERCISES TODAY]

MAIN TABS:
📅 Schedule     💰 Wallet     🏆 Rewards
📝 Exercises    📊 Progress   💬 AI Assistant

NO "Find Therapist" tab
NO Comparison screens
NO Filter options
NO "Match Quiz"
```

***

## Feature Permission Matrix (Single Therapist)

| Feature | Client | Parent | Therapist | Admin |
|---------|--------|--------|-----------|-------|
| Book Sessions | ✅ | ✅ | ❌ | ✅ |
| View Schedule | ✅ | ✅ | ✅ | ✅ |
| Cancel/Reschedule | ✅ | ✅ | ✅ | ✅ |
| View Own History | ✅ | ✅ | ✅ | ✅ |
| Complete Exercises | ✅ | ✅ | ✅ | ✅ |
| Access VIP Rewards | ✅ | ✅ | ❌ | ✅ |
| View Wallet | ✅ | ✅ | ✅ | ✅ |
| AI Recommendations | ✅ | ✅ | ✅ | ✅ |
| Session Notes | ❌ | ❌ | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |

***

## Auto-Scaling Features (Future-Proof)

**When 2+ therapists join:**

```javascript
if (activeTherapists >= 2) {
  showTherapistDiscovery = true;
  enableFilters = true;
  enableMatching = true;
  showComparison = true;
} else {
  directBookingOnly = true;
  simplifiedHome = true;
}
```

**Gradual Rollout:**
```
2 therapists → Basic comparison
5 therapists → Filters + ratings
10+ therapists → AI matching
```

***

## Implementation Priority (Single Therapist MVP)

```
PHASE 1 (Week 1-2): 
✅ Client booking → single therapist
✅ Session management (video/chat)
✅ Basic profiles + metadata
✅ Wallet + payments

PHASE 2 (Week 3-4):
✅ VIP/loyalty system
✅ Exercise management
✅ AI chat blocks
✅ Parent/guardian features

PHASE 3 (Week 5-6):
✅ Student discounts
✅ Progress tracking
✅ AI personalization
✅ Admin dashboard
```

**Result:** Fully functional single-therapist platform in **6 weeks**, scales automatically to multi-therapist.

***

This updated spec **hides all therapist selection complexity** while keeping **all personalization, loyalty, AI, and metadata features active**. Perfect for launch with one therapist, scales seamlessly! 🚀
