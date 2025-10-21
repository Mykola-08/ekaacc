# EKA Forms System

A comprehensive form system for the EKA mental health platform with integrated AI assistance.

## 📋 Forms Overview

### 1. Welcome Personalization Form

**Location:** `src/components/eka/forms/welcome-personalization-form.tsx`

A 3-step onboarding form for new patients with AI-powered personalization.

**Features:**

- ✅ Multi-step wizard (3 steps)
- ✅ Personal goals & interests collection
- ✅ Mental health concerns assessment
- ✅ Emergency contact information
- ✅ Session time preferences
- ✅ €10 discount incentive for completion
- ✅ Skippable with persistent header banner
- ✅ Auto-appears for users who haven't completed it

**Data Collected:**

```typescript
{
  goals: string;
  interests: string;
  values: string;
  preferences: string;
  mentalHealthConcerns: string[];
  previousTherapyExperience: string;
  preferredSessionTime: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}
```

**Integration:**

- Appears in header banner when `!currentUser.personalizationCompleted`
- Can be dismissed temporarily
- Updates user profile on completion
- Awards €10 discount coupon

---

### 2. Donation Seeker Application Form

**Location:** `src/components/eka/forms/donation-seeker-application-form.tsx`

A 4-step application for patients seeking financial support with AI-enhanced history revision.

**Features:**

- ✅ Personal & contact information
- ✅ Financial situation assessment
- ✅ Mental health history with AI assistance
- ✅ AI revision & suggestions for history
- ✅ Support level selection
- ✅ Confidential application process
- ✅ 48-hour review promise

**AI Features:**

- **AI History Revision:** Analyzes and enhances mental health history
- **AI Suggestions:** Provides 4+ personalized suggestions to improve application
- **Compare Versions:** Side-by-side view of original vs AI-revised version
- **One-click Apply:** Use AI version or keep original

**Data Collected:**

```typescript
{
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  financialInfo: {
    currentFinancialSituation: string;
    monthlyIncome: string;
    employmentStatus: string;
  };
  mentalHealthHistory: string;
  reasonForSupport: string;
  supportNeeded: string;
  previousTherapyAccess: string;
  aiRevisedHistory?: string;
  aiSuggestions?: string[];
}
```

---

### 3. Daily Mood Log Form

**Location:** `src/components/eka/forms/daily-mood-log-form.tsx`

A comprehensive daily check-in form for tracking mental health and wellbeing.

**Features:**

- ✅ 5 mood scales (0-10 sliders)
  - Overall Mood
  - Energy Level
  - Stress Level
  - Sleep Quality
  - Physical Health
- ✅ Emotion selection (10 emotions with emojis)
- ✅ Activity tracking (8 activities)
- ✅ Trigger identification
- ✅ Gratitude journaling
- ✅ Additional notes
- ✅ Visual feedback with emojis
- ✅ Date stamped automatically

**Data Collected:**

```typescript
{
  date: Date;
  overallMood: number;
  energy: number;
  stress: number;
  sleep: number;
  physicalHealth: number;
  emotions: string[];
  triggers?: string;
  gratitude?: string;
  notes?: string;
  activities?: string[];
}
```

**Use Cases:**

- Daily mental health tracking
- Pattern identification over time
- Session preparation
- Progress monitoring

---

### 4. Session Assessment Form (Therapist)

**Location:** `src/components/eka/forms/session-assessment-form.tsx`

A dual-purpose form for therapists to complete before and after each session.

**Two Modes:**

#### Pre-Session Assessment

Complete **before** the session begins to establish baseline.

**Features:**

- ✅ Client current mood assessment
- ✅ Anxiety level tracking
- ✅ Crisis risk evaluation (4 levels)
- ✅ Session goals planning
- ✅ Presenting concerns documentation
- ✅ Medication changes tracking

#### Post-Session Assessment

Complete **after** the session to document outcomes.

**Features:**

- ✅ Session summary documentation
- ✅ 10+ intervention types tracking (CBT, DBT, ACT, etc.)
- ✅ Homework assignment
- ✅ 5 progress metrics:
  - Post-session mood
  - Session productivity
  - Client engagement
  - Therapeutic alliance
  - Progress towards goals
- ✅ New concerns identification
- ✅ Follow-up actions (6 options)
- ✅ Next session planning
- ✅ Private therapist notes

**Data Collected:**

```typescript
{
  sessionType: 'pre' | 'post';
  timestamp: Date;
  
  // Pre-session
  preSessionMood?: number;
  preSessionAnxiety?: number;
  preSessionGoals?: string;
  preSessionConcerns?: string;
  preSessionMedications?: string;
  crisisRisk?: string;
  
  // Post-session
  postSessionMood?: number;
  postSessionProgress?: number;
  sessionSummary?: string;
  interventionsUsed?: string[];
  homeworkAssigned?: string;
  clientEngagement?: number;
  therapeuticAlliance?: number;
  progressTowardsGoals?: number;
  concernsIdentified?: string;
  followUpNeeded?: string[];
  nextSessionGoals?: string;
  therapistNotes?: string;
}
```

---

## 🎨 UI/UX Features

### Design Elements

- **Multi-step wizards** with progress indicators
- **Smooth animations** (fade-in transitions)
- **Responsive design** (mobile-first)
- **Accessible** (ARIA labels, keyboard navigation)
- **Visual feedback** (emojis, color coding)
- **Loading states** with animations
- **Toast notifications** for confirmations
- **Badge indicators** for special features

### Form Components Used

- Dialog/Modal containers
- Sliders for numeric scales
- Textareas for long-form text
- Select dropdowns for options
- Checkbox groups for multi-select
- Button groups for toggles
- Cards for section grouping
- Tabs for complex forms
- Alerts for important notices

---

## 🚀 Usage

### Access Forms Page

Navigate to `/forms` to see all available forms with descriptions.

### Individual Form Usage

#### Welcome Form

```tsx
import { WelcomePersonalizationForm } from '@/components/eka/forms';

<WelcomePersonalizationForm
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(data) => console.log(data)}
  onSkip={() => console.log('Skipped')}
/>
```

#### Donation Application

```tsx
import { DonationSeekerApplicationForm } from '@/components/eka/forms';

<DonationSeekerApplicationForm
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(data) => console.log(data)}
/>
```

#### Daily Mood Log

```tsx
import { DailyMoodLogForm } from '@/components/eka/forms';

<DailyMoodLogForm
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(data) => console.log(data)}
/>
```

#### Session Assessment

```tsx
import { SessionAssessmentForm } from '@/components/eka/forms';

// Pre-session
<SessionAssessmentForm
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(data) => console.log(data)}
  patientName="John Doe"
  sessionType="pre"
/>

// Post-session
<SessionAssessmentForm
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(data) => console.log(data)}
  patientName="John Doe"
  sessionType="post"
/>
```

---

## 🤖 AI Integration

### Current AI Features

1. **Donation Application AI Revision**
   - Analyzes mental health history (min 50 characters)
   - Provides contextual enhancements
   - Offers 4 personalized suggestions
   - Shows before/after comparison

### Simulated AI Behavior

Currently uses simulated AI with realistic delays:

- 3 seconds for analysis
- Contextual enhancements added
- Structured suggestions provided

### Future AI Enhancements (To Implement)

- Connect to real AI service (OpenAI, Anthropic, etc.)
- Sentiment analysis for mood logs
- Pattern detection across multiple logs
- Session note summarization
- Treatment plan suggestions
- Crisis risk prediction
- Therapeutic intervention recommendations

---

## 📊 Data Flow

### Welcome Form

1. User completes 3-step form
2. Data saved to `user.personalization`
3. `personalizationCompleted` flag set to `true`
4. €10 discount coupon activated
5. Banner dismissed from header

### Donation Application

1. User completes 4-step form
2. Optional AI enhancement of history
3. Application submitted for review
4. Email notification sent
5. 48-hour review timer started

### Daily Mood Log

1. User logs daily metrics
2. Data timestamped automatically
3. Saved to user's mood history
4. Available for trend analysis
5. Therapist can view patterns

### Session Assessment

1. Therapist completes pre-session form
2. Session conducted
3. Therapist completes post-session form
4. Both assessments linked to session record
5. Progress metrics calculated
6. Follow-up actions scheduled

---

## 🔒 Security & Privacy

- All forms use secure data transmission
- Sensitive data (financial, mental health) handled confidentially
- Therapist notes are private
- Emergency contacts stored securely
- AI processing respects privacy
- No data shared without consent

---

## 🎯 Business Logic

### €10 Discount System

- Awarded only once on welcome form completion
- Applied automatically to first session
- Tracked via `personalizationCompleted` flag
- Banner persists until completed or dismissed

### Donation Application Review

- 48-hour review commitment
- Manual review by EKA team
- Verification may be required
- Approval/denial notification sent

### Mood Tracking

- Daily logs encouraged but not required
- Historical data used for insights
- Trends shared with therapist (if consented)
- Can export data for external use

### Session Documentation

- Pre-session required before session start
- Post-session required within 24 hours
- Both linked to billing record
- Used for treatment plan updates
- Accessible by supervising clinicians

---

## 🛠️ Technical Details

### Dependencies

- React 18+
- Next.js 14+
- shadcn/ui components
- Lucide icons
- date-fns
- TypeScript

### File Structure

```
src/components/eka/forms/
├── index.ts                              # Exports
├── welcome-personalization-form.tsx      # Welcome form
├── donation-seeker-application-form.tsx  # Donation app
├── daily-mood-log-form.tsx              # Mood log
└── session-assessment-form.tsx          # Therapist form
```

### Supporting Components

- `PersonalizationBanner` - Header banner for incomplete personalization
- Forms demo page at `/forms`
- Integration in `AppHeader` component

---

## 📝 Testing

Visit `/forms` to test all forms with sample data.

**Test Scenarios:**

1. Complete welcome form and verify discount
2. Skip welcome form and check banner persistence
3. Submit donation application with AI enhancement
4. Log daily mood with different emotion combinations
5. Complete pre/post session assessments as therapist

---

## 🚧 Future Enhancements

- [ ] Connect real AI service for history enhancement
- [ ] Add file upload for donation verification
- [ ] Implement mood trend visualization
- [ ] Add session video call integration
- [ ] Create therapist dashboard for all assessments
- [ ] Add email notifications for form submissions
- [ ] Implement form auto-save (drafts)
- [ ] Add form validation with detailed error messages
- [ ] Create PDF export for completed forms
- [ ] Add multi-language support

---

## 📞 Support

For questions or issues with forms:

- Check `/forms` demo page
- Review this documentation
- Contact development team
- Submit issue on GitHub

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0
