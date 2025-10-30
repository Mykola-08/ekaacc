# Personalization System Implementation

## Overview
This document describes the comprehensive personalization system implemented to provide users with a tailored experience based on their behavior, activities, hobbies, occupation, goals, and preferences.

---

## 🎯 Core Components

### 1. **Enhanced Type System** (`src/lib/types.ts`)

#### New Personalization Fields
```typescript
// Occupation & Lifestyle
occupationType: 'student' | 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'other'
sportsActivities: string[]        // e.g., ['Running', 'Yoga', 'Swimming']
activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
hobbies: string[]                 // e.g., ['Reading', 'Music', 'Gaming']
interests: string[]
favoriteActivities: string[]
leisureTime: 'none' | 'little' | 'moderate' | 'plenty'
emotionalState?: string
```

#### Activity Tracking Interface
```typescript
activityData?: {
  // Session patterns
  preferredSessionTimes?: string[]
  sessionFrequency?: 'weekly' | 'bi-weekly' | 'monthly'
  averageSessionDuration?: number
  completedSessions?: number
  
  // App usage
  mostVisitedPages?: string[]
  featureUsage?: {
    journal: number
    progress: number
    exercises: number
    community: number
    aiInsights: number
  }
  
  // Engagement metrics
  loginStreak?: number
  totalLogins?: number
  lastActiveDate?: string
  averageTimeSpent?: number
  
  // Milestones
  milestones?: Array<{
    name: string
    achievedDate: string
    description: string
  }>
  
  // Learned preferences
  preferredExerciseTypes?: string[]
  preferredTherapistGender?: 'male' | 'female' | 'any'
  preferredCommunicationMethod?: 'video' | 'audio' | 'text'
  
  // Progress indicators
  progressTrend?: 'improving' | 'stable' | 'declining'
  wellnessScoreHistory?: number[]
  moodHistory?: Array<{ date: string; mood: string; score: number }>
}
```

#### Recommendations Interface
```typescript
recommendations?: {
  sessions?: Array<{
    title: string
    description: string
    type: string
    reason: string
    priority: 'high' | 'medium' | 'low'
  }>
  exercises?: Array<{
    name: string
    type: string
    duration: number
    reason: string
  }>
  articles?: Array<{
    title: string
    url: string
    relevance: string
  }>
  therapists?: Array<{
    name: string
    specialty: string
    matchScore: number
  }>
  nextSteps?: string[]
}
```

#### Personalized Content Interface
```typescript
personalizedContent?: {
  welcomeMessage?: string
  motivationalMessages?: string[]
  celebrationMessages?: string[]
  checkInMessages?: string[]
  feedbackMessages?: Array<{
    message: string
    type: 'tip' | 'encouragement' | 'reminder' | 'celebration'
    date: string
    read: boolean
  }>
}
```

---

### 2. **Personalization Engine** (`src/lib/personalization-engine.ts`)

#### Core Methods

**`generateWelcomeMessage(user: User): string`**
- Time-aware greetings (Good morning/afternoon/evening)
- Occupation-specific messages (student, employed, etc.)
- Streak celebrations
- Goal-focused greetings

**Examples:**
```typescript
"Good morning, John! Ready to work on reducing stress?"
"🔥 5 day streak, Sarah! You're on fire!"
"Welcome back, Mike! Your wellness journey continues."
```

**`generateMotivationalMessages(user: User): string[]`**
- Based on therapeutic goals
- Sports and activity acknowledgment
- Occupation-tailored encouragement
- Progress-based motivation

**Examples:**
```typescript
[
  "Your commitment to mindfulness is inspiring",
  "Yoga practice shows your dedication to wellness",
  "As a student, you're building lifelong stress management skills"
]
```

**`generateSessionRecommendations(user: User): Recommendation[]`**
- Stress level → Stress Management Sessions
- Sleep quality → Sleep Hygiene Workshops
- Sports activities → Athletic Mindset Coaching
- Occupation → Student/Professional Success Sessions
- Progress → Advanced Wellness Strategies
- Challenges → Anxiety/Depression Relief

**`generateExerciseRecommendations(user: User): Exercise[]`**
- High stress → Breathing exercises
- Sedentary lifestyle → Gentle stretching
- Yoga practitioners → Mindful yoga flows
- Focus goals → Concentration meditation

**`generateFeedbackMessages(user: User): FeedbackMessage[]`**
- First session celebration
- Login streak milestones (7 days, 30 days, etc.)
- Feature discovery tips
- Progress encouragement
- Re-engagement reminders

**`generateNextSteps(user: User): string[]`**
- New users: "Book your first therapy session"
- Active users: "Continue your session journey"
- Goal-focused: "Work on your goal: [specific goal]"

**`trackActivity(user: User, activity: ActivityEvent): User`**
Tracks and updates:
- Page visits
- Feature usage
- Session completions
- Exercise completions
- Login patterns
- Engagement metrics

**`generatePersonalizedData(user: User): PersonalizedData`**
- Combines all above methods into single comprehensive object
- Returns: welcome message, motivational messages, recommendations, feedback, next steps

---

### 3. **Enhanced Onboarding Form** (`src/components/eka/comprehensive-onboarding.tsx`)

#### New Step 3 Fields (Lifestyle & Activities)

**Occupation Type**
- Student
- Employed (Full-time/Part-time)
- Self-employed
- Unemployed (Seeking work)
- Retired
- Stay-at-home parent
- Unable to work
- Other

**Sports & Physical Activities** (Multi-select)
- Running/Jogging
- Yoga
- Gym/Weight Training
- Swimming
- Cycling
- Team Sports (Football, Basketball, etc.)
- Martial Arts
- Dancing
- Hiking/Outdoor Activities
- Pilates
- Rock Climbing
- Other Sports

**Activity Level**
- Sedentary (Little to no exercise)
- Lightly Active (1-2 days/week)
- Moderately Active (3-4 days/week)
- Very Active (5-6 days/week)
- Extremely Active (Daily intense exercise)

**Hobbies & Interests** (Multi-select)
- Reading
- Music (Listening/Playing)
- Art & Crafts
- Gaming
- Cooking/Baking
- Gardening
- Photography
- Writing/Journaling
- Traveling
- Tech/Programming
- Volunteering
- Pets/Animal Care
- DIY Projects
- Other Hobbies

**Leisure Time Available**
- Almost no free time
- A little (1-2 hours/day)
- Moderate (2-4 hours/day)
- Plenty (4+ hours/day)

#### Validation
Step 3 now requires:
- Work stress level
- Sleep quality
- **At least one sport OR one hobby**

---

## 🔧 Integration Guide

### Step 1: Use PersonalizationEngine in Dashboard

```typescript
// src/app/(app)/home/page.tsx
import { PersonalizationEngine } from '@/lib/personalization-engine';
import { useData } from '@/context/unified-data-context';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { currentUser } = useData();
  const [personalizedData, setPersonalizedData] = useState(null);
  
  useEffect(() => {
    if (currentUser) {
      const data = PersonalizationEngine.generatePersonalizedData(currentUser);
      setPersonalizedData(data);
    }
  }, [currentUser]);
  
  if (!personalizedData) return <Loading />;
  
  return (
    <div>
      {/* Welcome Section */}
      <h1>{personalizedData.welcomeMessage}</h1>
      
      {/* Motivational Messages */}
      <div>
        {personalizedData.motivationalMessages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      
      {/* Recommended Sessions */}
      <div>
        <h2>Recommended for You</h2>
        {personalizedData.recommendations.sessions.map((session) => (
          <SessionCard key={session.title} {...session} />
        ))}
      </div>
      
      {/* Recommended Exercises */}
      <div>
        <h2>Try These Exercises</h2>
        {personalizedData.recommendations.exercises.map((exercise) => (
          <ExerciseCard key={exercise.name} {...exercise} />
        ))}
      </div>
      
      {/* Feedback Messages */}
      <div>
        {personalizedData.feedbackMessages.map((msg, i) => (
          <FeedbackCard key={i} {...msg} />
        ))}
      </div>
      
      {/* Next Steps */}
      <div>
        <h2>What's Next?</h2>
        {personalizedData.nextSteps.map((step, i) => (
          <NextStepCard key={i} step={step} />
        ))}
      </div>
    </div>
  );
}
```

### Step 2: Track User Activity

```typescript
// In any page/component where you want to track activity
import { PersonalizationEngine } from '@/lib/personalization-engine';
import { useData } from '@/context/unified-data-context';

function JournalPage() {
  const { currentUser, updateUser } = useData();
  
  useEffect(() => {
    // Track page visit
    if (currentUser) {
      const updatedUser = PersonalizationEngine.trackActivity(
        currentUser,
        {
          type: 'page-visit',
          page: '/journal',
          timestamp: new Date().toISOString()
        }
      );
      updateUser(updatedUser);
    }
  }, [currentUser]);
  
  const handleJournalEntry = (entry) => {
    // Track feature usage
    const updatedUser = PersonalizationEngine.trackActivity(
      currentUser,
      {
        type: 'feature-use',
        feature: 'journal',
        timestamp: new Date().toISOString()
      }
    );
    updateUser(updatedUser);
    // ... save journal entry
  };
  
  return <JournalForm onSubmit={handleJournalEntry} />;
}
```

### Step 3: Display Personalized Recommendations

```typescript
// Example: RecommendationsCard component
interface RecommendationsCardProps {
  recommendations: User['recommendations'];
}

function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  const sessions = recommendations?.sessions || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Sessions</CardTitle>
        <CardDescription>Based on your goals and activities</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.map((session) => (
          <div key={session.title} className="border-b last:border-0 py-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{session.title}</h4>
                <p className="text-sm text-muted-foreground">{session.description}</p>
                <p className="text-xs mt-1 text-primary">{session.reason}</p>
              </div>
              <Badge variant={
                session.priority === 'high' ? 'destructive' :
                session.priority === 'medium' ? 'default' : 'secondary'
              }>
                {session.priority}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

---

## 📊 Data Flow

```
User completes onboarding
    ↓
Onboarding data saved to User.personalization
    ↓
PersonalizationEngine.generatePersonalizedData(user)
    ↓
Returns personalized content bundle
    ↓
Display in dashboard, widgets, and cards
    ↓
User interacts with app (page visits, feature usage, sessions)
    ↓
PersonalizationEngine.trackActivity(user, activity)
    ↓
Updates User.activityData
    ↓
Regenerate personalized content
    ↓
Cycle continues...
```

---

## 🎨 UI Components to Create

### 1. WelcomeHero Component
```typescript
<WelcomeHero message={personalizedData.welcomeMessage} />
```

### 2. MotivationalCard Component
```typescript
<MotivationalCard messages={personalizedData.motivationalMessages} />
```

### 3. RecommendedSessionsCard Component
```typescript
<RecommendedSessionsCard sessions={personalizedData.recommendations.sessions} />
```

### 4. RecommendedExercisesCard Component
```typescript
<RecommendedExercisesCard exercises={personalizedData.recommendations.exercises} />
```

### 5. FeedbackMessagesCard Component
```typescript
<FeedbackMessagesCard messages={personalizedData.feedbackMessages} />
```

### 6. NextStepsCard Component
```typescript
<NextStepsCard steps={personalizedData.nextSteps} />
```

---

## 🗄️ Database Persistence

### API Routes to Create

**`/api/user/activity` (POST)**
```typescript
// Track and save user activity
export async function POST(request: Request) {
  const { userId, activity } = await request.json();
  const user = await getUser(userId);
  const updatedUser = PersonalizationEngine.trackActivity(user, activity);
  await saveUser(updatedUser);
  return Response.json({ success: true });
}
```

**`/api/user/personalization` (GET)**
```typescript
// Get personalized content
export async function GET(request: Request) {
  const userId = request.headers.get('user-id');
  const user = await getUser(userId);
  const personalizedData = PersonalizationEngine.generatePersonalizedData(user);
  return Response.json(personalizedData);
}
```

---

## ✅ Implementation Checklist

### Completed ✅
- [x] Extended User type with behavioral tracking fields
- [x] Created PersonalizationEngine class with all methods
- [x] Added occupation type, sports, hobbies, activity level to onboarding
- [x] Updated onboarding form UI for Step 3
- [x] Fixed TypeScript compilation errors
- [x] Validated no duplicate components exist

### Pending ⏳
- [ ] Fix sidebar visibility issue (investigate CSS/rendering)
- [ ] Integrate PersonalizationEngine into home/dashboard page
- [ ] Create RecommendationsCard component
- [ ] Create MotivationalCard component
- [ ] Create FeedbackCard component
- [ ] Create NextStepsCard component
- [ ] Implement activity tracking hooks
- [ ] Create API routes for data persistence
- [ ] Test complete personalization flow
- [ ] Add loading states for personalization generation
- [ ] Implement real-time activity tracking

---

## 🐛 Known Issues

### Sidebar Not Showing
**Issue:** User reports sidebar not visible despite correct code structure.

**Investigation:**
- Layout file verified correct (`<AppSidebar />` properly included)
- Sidebar component has `z-30` and is fixed
- CSS variables defined (`--sidebar-w: 240px`, `--sidebar-w-collapsed: 60px`)
- No TypeScript errors

**Possible Causes:**
1. CSS z-index conflict
2. Overlay issue with other elements
3. `currentUser` not loaded (sidebar returns null if no user)
4. `motion.div` animation issue (`initial={{ opacity: 0, x: -32 }}`)
5. Responsive breakpoint hiding sidebar

**Next Steps:**
- Check browser console for runtime errors
- Verify `currentUser` is loaded in layout
- Test with `motion.div` animation disabled
- Inspect element to check computed styles

---

## 🚀 Future Enhancements

1. **AI-Powered Insights**
   - Connect to real AI service for persona generation
   - Generate therapy recommendations using LLM
   - Predict user needs based on activity patterns

2. **Advanced Analytics**
   - Track onboarding completion rate
   - Measure personalization effectiveness
   - A/B test recommendation algorithms

3. **Real-time Personalization**
   - Update recommendations based on session outcomes
   - Adjust exercise difficulty based on completion rates
   - Adapt communication style based on user engagement

4. **Social Features**
   - Recommend users with similar goals
   - Community groups based on hobbies/activities
   - Peer motivation and support matching

---

## 📝 Usage Examples

### Example 1: Student with High Stress
```typescript
const student = {
  occupationType: 'student',
  therapeuticGoals: ['Reduce stress'],
  lifestyleFactors: { workStressLevel: 5 },
  sportsActivities: ['Yoga'],
  hobbies: ['Reading', 'Music']
};

// PersonalizationEngine generates:
welcomeMessage: "Good morning, John! As a student managing high stress, you're taking the right steps."
motivationalMessages: [
  "Your yoga practice shows your commitment to wellness",
  "As a student, you're building lifelong stress management skills"
]
recommendations.sessions: [
  { title: "Student Success Session", reason: "Tailored for student challenges" },
  { title: "Stress Management Session", reason: "Your stress level is high" }
]
```

### Example 2: Employed Professional with Sleep Issues
```typescript
const professional = {
  occupationType: 'employed',
  therapeuticGoals: ['Improve sleep'],
  lifestyleFactors: { sleepQuality: 2 },
  sportsActivities: ['Running', 'Gym'],
  hobbies: ['Cooking', 'Tech']
};

// PersonalizationEngine generates:
welcomeMessage: "Good evening, Sarah! Ready to improve your sleep quality?"
recommendations.sessions: [
  { title: "Sleep Hygiene Workshop", reason: "Your sleep quality needs attention" },
  { title: "Athletic Mindset Coaching", reason: "You're active with running and gym" }
]
recommendations.exercises: [
  { name: "Evening Relaxation Routine", reason: "Helps with sleep quality" }
]
```

---

## 🎯 Success Metrics

Track these metrics to measure personalization effectiveness:

1. **Onboarding Completion Rate**
   - % of users who complete all 5 steps
   - Average time to complete
   - Drop-off points

2. **Recommendation Engagement**
   - % of users who book recommended sessions
   - % of users who try recommended exercises
   - Click-through rate on recommendations

3. **Activity Tracking**
   - Average login streak
   - Most visited pages
   - Most used features
   - Session completion rate

4. **User Satisfaction**
   - Survey: "How relevant are the recommendations?"
   - Survey: "Does the app understand your needs?"
   - Net Promoter Score (NPS)

---

## 📚 Additional Resources

- **Type Definitions:** `src/lib/types.ts` (lines 187-290)
- **PersonalizationEngine:** `src/lib/personalization-engine.ts`
- **Onboarding Form:** `src/components/eka/comprehensive-onboarding.tsx`
- **Usage Example:** See Step 1 in Integration Guide above

---

**Last Updated:** Current session
**Status:** Ready for integration and testing
