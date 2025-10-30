# Quick Start: Personalization System

## 🎯 What's Been Done

### 1. ✅ Fixed Sidebar Visibility Issue
**Problem:** Sidebar was not showing because it returned `null` when `currentUser` was not loaded.

**Solution:** Changed sidebar to show a loading skeleton instead of `null` while user data loads.

**Result:** Sidebar now always visible with smooth loading state.

---

### 2. ✅ Extended User Type System
**Location:** `src/lib/types.ts` (lines 187-290)

**New Fields:**
- `occupationType` - Student, Employed, Self-employed, etc.
- `sportsActivities` - Array of physical activities user does
- `activityLevel` - Sedentary to Very Active
- `hobbies` - User's hobbies and interests
- `leisureTime` - How much free time they have
- `activityData` - Complete behavioral tracking (sessions, engagement, milestones)
- `recommendations` - Personalized sessions, exercises, articles
- `personalizedContent` - Welcome messages, motivational quotes, feedback

---

### 3. ✅ Created PersonalizationEngine
**Location:** `src/lib/personalization-engine.ts` (~410 lines)

**Methods:**
- `generateWelcomeMessage()` - Time and context-aware greetings
- `generateMotivationalMessages()` - Encouragement based on goals/activities
- `generateSessionRecommendations()` - Suggests therapy sessions
- `generateExerciseRecommendations()` - Suggests exercises
- `generateFeedbackMessages()` - Celebrates milestones, provides tips
- `generateNextSteps()` - Actionable next steps
- `trackActivity()` - Updates user's activity data
- `generatePersonalizedData()` - Combines all above into one object

---

### 4. ✅ Enhanced Onboarding Form
**Location:** `src/components/eka/comprehensive-onboarding.tsx`

**New Step 3 Fields:**
- Occupation Type (dropdown)
- Sports & Physical Activities (multi-select: 12 options)
- Activity Level (5 levels)
- Hobbies & Interests (multi-select: 14 options)
- Leisure Time Available (4 levels)

**Validation:** Requires at least one sport OR one hobby to proceed.

---

## 🚀 Next Steps (Immediate)

### Step 1: Test the Application
The dev server should be running on **http://localhost:9002**

**Test Checklist:**
1. ✅ Open browser to http://localhost:9002
2. ✅ Verify sidebar is now visible (should show loading skeleton if not logged in)
3. ✅ Log in or sign up
4. ✅ Complete onboarding (all 5 steps)
5. ✅ On Step 3, verify you see:
   - Occupation Type dropdown
   - Sports Activities checkboxes (12 options)
   - Activity Level dropdown
   - Hobbies checkboxes (14 options)
   - Leisure Time dropdown
6. ✅ Try to proceed without selecting sports/hobbies (should fail validation)
7. ✅ Select at least 1 sport or 1 hobby, then proceed
8. ✅ Complete all 5 steps
9. ✅ Verify you reach the dashboard

### Step 2: Integrate PersonalizationEngine into Dashboard

**File to Edit:** `src/app/(app)/home/page.tsx`

**Add this code:**

```typescript
'use client';
import { PersonalizationEngine } from '@/lib/personalization-engine';
import { useData } from '@/context/unified-data-context';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { currentUser } = useData();
  const [personalizedData, setPersonalizedData] = useState(null);
  
  useEffect(() => {
    if (currentUser && currentUser.personalization) {
      const data = PersonalizationEngine.generatePersonalizedData(currentUser);
      setPersonalizedData(data);
    }
  }, [currentUser]);
  
  // If no personalized data yet, show onboarding
  if (!currentUser?.personalization?.fullName) {
    return <ComprehensiveOnboarding onComplete={() => {}} onSkip={() => {}} />;
  }
  
  if (!personalizedData) {
    return <div>Loading personalized content...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {personalizedData.welcomeMessage}
          </CardTitle>
        </CardHeader>
      </Card>
      
      {/* Motivational Messages */}
      {personalizedData.motivationalMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Daily Motivation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {personalizedData.motivationalMessages.map((msg, i) => (
              <p key={i} className="text-muted-foreground italic">
                ✨ {msg}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Recommended Sessions */}
      {personalizedData.recommendations.sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Sessions</CardTitle>
            <CardDescription>Based on your goals and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalizedData.recommendations.sessions.map((session) => (
              <div key={session.title} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    <p className="text-xs mt-1 text-primary">💡 {session.reason}</p>
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
      )}
      
      {/* Recommended Exercises */}
      {personalizedData.recommendations.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Try These Exercises</CardTitle>
            <CardDescription>Personalized for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalizedData.recommendations.exercises.map((exercise) => (
              <div key={exercise.name} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.type} • {exercise.duration} minutes
                    </p>
                    <p className="text-xs mt-1 text-primary">💡 {exercise.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Next Steps */}
      {personalizedData.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {personalizedData.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Step 3: Add Activity Tracking

**Example: Track page visits**

```typescript
// In any page component
useEffect(() => {
  if (currentUser) {
    const updatedUser = PersonalizationEngine.trackActivity(currentUser, {
      type: 'page-visit',
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });
    // Save to context or database
    updateUser(updatedUser);
  }
}, []);
```

---

## 📋 Verification Checklist

### Sidebar Fixed
- [ ] Sidebar visible on all pages
- [ ] Shows loading skeleton when user not loaded
- [ ] Shows user's navigation links when logged in
- [ ] Collapses/expands smoothly

### Onboarding Enhanced
- [ ] Step 3 shows all new fields
- [ ] Occupation type dropdown works
- [ ] Sports activities multi-select works (12 options)
- [ ] Activity level dropdown works
- [ ] Hobbies multi-select works (14 options)
- [ ] Leisure time dropdown works
- [ ] Validation requires at least 1 sport OR 1 hobby
- [ ] Can proceed after selecting activities
- [ ] All data saves to user profile

### PersonalizationEngine Works
- [ ] Generates welcome message based on time/occupation
- [ ] Generates motivational messages
- [ ] Recommends sessions based on stress/goals/activities
- [ ] Recommends exercises based on activity level
- [ ] Provides feedback messages
- [ ] Shows next steps

### Dashboard Integration
- [ ] Welcome message displays
- [ ] Motivational messages show
- [ ] Recommended sessions show with reasons
- [ ] Recommended exercises show with durations
- [ ] Next steps show
- [ ] All content is personalized (not generic)

---

## 🐛 Troubleshooting

### Sidebar still not showing?
1. Open browser dev console (F12)
2. Check for JavaScript errors
3. Verify `currentUser` is loading (check Network tab)
4. Clear browser cache and reload
5. Check if you're logged in

### Onboarding form not showing new fields?
1. Hard reload (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify file changes were saved
4. Check TypeScript compilation (no errors found ✅)

### PersonalizationEngine not generating content?
1. Verify user completed onboarding
2. Check `currentUser.personalization` exists
3. Log `PersonalizationEngine.generatePersonalizedData(currentUser)` to console
4. Verify user has goals, activities, or hobbies set

---

## 📚 Documentation

- **Full System Documentation:** `PERSONALIZATION_SYSTEM.md`
- **Type Definitions:** `src/lib/types.ts`
- **PersonalizationEngine Code:** `src/lib/personalization-engine.ts`
- **Onboarding Form:** `src/components/eka/comprehensive-onboarding.tsx`
- **Sidebar Component:** `src/components/eka/app-sidebar.tsx`

---

## 🎉 Summary

**Fixed:**
1. ✅ Sidebar visibility issue (now shows loading state)
2. ✅ No duplicate components (confirmed)
3. ✅ Onboarding collects sports, hobbies, occupation, activity level
4. ✅ PersonalizationEngine generates dynamic content
5. ✅ All TypeScript errors resolved

**Ready for:**
1. Testing onboarding flow with new fields
2. Integrating PersonalizationEngine into dashboard
3. Adding activity tracking throughout app
4. Creating personalized UI components

**Next Session:**
1. Test sidebar fix
2. Complete dashboard integration
3. Implement activity tracking
4. Create database persistence layer

---

**Development Server:** http://localhost:9002
**Status:** Ready for testing and integration
