# EKA Onboarding Flow - Testing Guide

## 🎯 Purpose
This guide helps you test the comprehensive onboarding flow and personalized dashboard implementation.

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev -- -p 9003
```
Server will be available at: **http://localhost:9003**

### 2. Access the Application
Open your browser and navigate to the local development server.

## 📋 Test Scenarios

### Scenario 1: New User Onboarding (Primary Test)

**Objective:** Verify mandatory onboarding for users without personalization data.

**Steps:**
1. Clear localStorage or use incognito mode
2. Navigate to `/home` or root page
3. Verify onboarding modal appears immediately
4. Attempt to dismiss modal (should fail - it's mandatory)
5. Complete each step of the onboarding process

**Expected Behavior:**
- Modal appears on page load
- Cannot be dismissed by clicking outside or pressing ESC
- Progress indicator shows current step (1/5, 2/5, etc.)
- Cannot advance to next step without completing required fields
- Visual feedback for incomplete fields
- Smooth transitions between steps

### Scenario 2: Step-by-Step Validation

**Step 1: Basic Information**

**Required Fields:**
- Full Name (text)
- Age (number, 13-120)
- Location (text)
- Occupation (text)

**Test Cases:**
- ✅ Try to proceed without filling name → Should show validation error
- ✅ Enter age < 13 or > 120 → Should show validation error
- ✅ Fill all fields correctly → "Next" button should become active
- ✅ Verify smooth transition to Step 2

**Step 2: Goals & Challenges**

**Required Selections:**
- At least 1 Therapeutic Goal
- At least 1 Current Challenge
- At least 1 Pain Area

**Test Cases:**
- ✅ Try to proceed with no selections → Should be blocked
- ✅ Select multiple goals → Should show checkmarks
- ✅ Verify all options are clickable and visually responsive
- ✅ Check "Back" button works correctly

**Step 3: Lifestyle Factors**

**Required Ratings (1-5 scale):**
- Work Stress Level
- Sleep Quality
- Exercise Frequency (dropdown)
- Diet Quality
- Social Support

**Test Cases:**
- ✅ Verify all sliders/dropdowns are interactive
- ✅ Check that all factors have default values
- ✅ Try moving sliders to different positions
- ✅ Verify exercise frequency dropdown has correct options

**Step 4: Preferences & Experience**

**Required Selections:**
- At least 1 Preferred Approach
- Previous Therapy Experience (dropdown)

**Test Cases:**
- ✅ Select different therapy approaches
- ✅ Choose from experience dropdown
- ✅ Verify selections are visually highlighted

**Step 5: Deeper Insights**

**Required Selections:**
- At least 1 Motivation
- At least 1 Expectation
- At least 1 Personality Trait
- At least 1 Value

**Test Cases:**
- ✅ Make all required selections
- ✅ "Complete" button should only activate when all fields filled
- ✅ Click "Complete" and verify AI insights generation starts

### Scenario 3: AI Insights Generation

**Objective:** Verify AI persona profile is generated correctly.

**Steps:**
1. Complete all 5 onboarding steps
2. Click "Complete" button
3. Observe loading state with spinner
4. Wait for AI processing (simulated 2-3 seconds)
5. Verify toast notification appears
6. Check dashboard loads with personalized data

**Expected Behavior:**
- Loading spinner appears with message "Generating your personalized profile..."
- Toast notification: "🎉 Welcome to EKA! Your personalized dashboard is ready."
- Onboarding modal closes automatically
- Dashboard displays with all personalized content

### Scenario 4: Personalized Dashboard Display

**Objective:** Verify all dashboard cards show real user data (no placeholders).

**Cards to Verify:**

**1. AI Persona Profile Card**
- ✅ Shows AI-generated persona description
- ✅ Displays recommended therapy approaches as badges
- ✅ Card has gradient background styling
- ✅ Text is readable and well-formatted

**2. Personalized Stats (4 cards)**
- ✅ **Wellness Score:** Shows AI personalization score (e.g., "85%")
- ✅ **Sessions Complete:** Shows "0/10" for new users
- ✅ **Active Goals:** Shows number of selected therapeutic goals
- ✅ **Mood Trend:** Shows "Improving" with percentage

**3. Therapeutic Goals Tracker**
- ✅ Lists all selected goals from onboarding
- ✅ Each goal has a progress bar
- ✅ Progress percentages are displayed
- ✅ "Get AI Recommendations" button is present

**4. Lifestyle Insights**
- ✅ Displays work stress level from onboarding
- ✅ Shows sleep quality rating
- ✅ Shows exercise frequency selection

**5. Next Session Widget**
- ✅ Shows empty state for new users
- ✅ Displays upcoming sessions if any exist

**6. Recent Activity Feed**
- ✅ Shows empty state with "No recent activity yet" message
- ✅ Sparkle icon displayed

### Scenario 5: Returning User Experience

**Objective:** Verify users with completed onboarding don't see modal again.

**Steps:**
1. Complete onboarding once
2. Refresh the page
3. Navigate away and back to `/home`
4. Close and reopen browser

**Expected Behavior:**
- Onboarding modal does NOT appear
- Dashboard loads directly with saved personalization data
- All previously entered data is displayed correctly

### Scenario 6: Data Persistence

**Objective:** Verify personalization data is saved correctly.

**Test Cases:**
1. Check browser localStorage or check data context
2. Verify `personalizationCompleted: true` flag is set
3. Verify all personalization fields are populated:
   - therapeuticGoals array
   - currentChallenges array
   - painAreas array
   - lifestyleFactors object
   - preferredApproaches array
   - motivations, expectations, personalityTraits arrays
   - AI-generated fields (aiPersonaProfile, aiRecommendedApproaches, etc.)

### Scenario 7: Minimalist Header & Sidebar

**Objective:** Verify clean, minimalist navigation.

**Header Tests:**
- ✅ Only shows: Sidebar toggle, Search bar, Book Session (for clients), Notifications, User menu
- ✅ No wallet widget
- ✅ No quick actions dropdown
- ✅ No complex form dialogs
- ✅ Clean, centered search bar

**Sidebar Tests:**
- ✅ No PersonaSwitcher component
- ✅ Shows appropriate sections based on user role
- ✅ Smooth animations on expand/collapse
- ✅ Icons display correctly in collapsed state
- ✅ Tooltips appear on hover when collapsed

### Scenario 8: Responsive Design

**Objective:** Test on different screen sizes.

**Test Breakpoints:**
- Mobile (< 640px): Single column layout
- Tablet (640px - 1024px): 2-column stats, stacked content
- Desktop (> 1024px): 4-column stats, 3-column layout

**Test Cases:**
- ✅ Onboarding modal is responsive
- ✅ Dashboard cards stack correctly on mobile
- ✅ Sidebar collapses automatically on small screens
- ✅ All touch targets are large enough on mobile
- ✅ Text remains readable at all sizes

### Scenario 9: Accessibility Testing

**Objective:** Verify keyboard navigation and screen reader support.

**Test Cases:**
- ✅ Tab through onboarding form fields
- ✅ Use Enter/Space to select checkboxes
- ✅ Navigate sidebar with keyboard
- ✅ Check ARIA labels are present
- ✅ Verify focus indicators are visible
- ✅ Test with screen reader (if available)

### Scenario 10: Error Handling

**Objective:** Test error scenarios and edge cases.

**Test Cases:**
1. **Network Errors:**
   - Simulate offline mode during onboarding
   - Verify error toast appears
   - Check retry functionality

2. **Invalid Data:**
   - Enter extremely long text in fields
   - Try special characters in name field
   - Enter boundary values for age (13, 120)

3. **Incomplete Forms:**
   - Try to submit with missing required fields
   - Verify validation messages are clear
   - Check that form state is preserved on validation failure

## 🐛 Common Issues & Debugging

### Issue: Onboarding not appearing
**Debug Steps:**
1. Check browser console for errors
2. Verify `currentUser.personalizationCompleted` is `false` or `undefined`
3. Check if `isLoading` is stuck on `true`
4. Clear localStorage and refresh

### Issue: Cannot proceed to next step
**Debug Steps:**
1. Check console for validation errors
2. Verify all required fields are filled
3. Check `canProceed()` function logic
4. Inspect field values in React DevTools

### Issue: AI insights not generating
**Debug Steps:**
1. Check browser console for errors
2. Verify `generateAIInsights()` function is being called
3. Check if promise is resolving correctly
4. Verify toast notifications are working

### Issue: Dashboard showing placeholders
**Debug Steps:**
1. Check if personalization data was saved
2. Inspect `currentUser.personalization` object
3. Verify conditional rendering logic
4. Check data mapping in dashboard components

## 📊 Success Criteria

The onboarding and personalization implementation is successful if:

- ✅ New users MUST complete onboarding before accessing dashboard
- ✅ All 5 steps have proper validation
- ✅ AI insights generate without errors
- ✅ Dashboard displays 100% personalized content (zero placeholders)
- ✅ Data persists across page refreshes
- ✅ Header and sidebar follow minimalist design
- ✅ Smooth animations throughout
- ✅ Responsive on all screen sizes
- ✅ No TypeScript/React errors in console
- ✅ Accessible via keyboard navigation

## 🎨 Visual Checklist

### Onboarding Modal
- [ ] Modal cannot be dismissed
- [ ] Progress indicator shows correct step
- [ ] Icons animate on step change
- [ ] Form fields have proper spacing
- [ ] Buttons are clearly styled
- [ ] Loading state shows spinner

### Dashboard
- [ ] Hero section displays user name
- [ ] AI persona card has gradient background
- [ ] Stat cards have smooth entrance animations
- [ ] Progress bars are correctly styled
- [ ] Empty states are visually appealing
- [ ] All cards have consistent spacing

### Navigation
- [ ] Header is clean and centered
- [ ] Sidebar transitions smoothly
- [ ] Active links are highlighted
- [ ] Icons are properly aligned

## 🔄 Testing Workflow

**Recommended Testing Order:**
1. Start with clean state (clear localStorage)
2. Test complete happy path (Scenario 1-4)
3. Test data persistence (Scenario 5-6)
4. Test UI/UX (Scenario 7-8)
5. Test accessibility (Scenario 9)
6. Test error cases (Scenario 10)

## 📝 Test Report Template

```markdown
## Test Session Report

**Date:** [Date]
**Tester:** [Name]
**Browser:** [Chrome/Firefox/Safari/Edge]
**Device:** [Desktop/Mobile/Tablet]

### Scenarios Tested
- [ ] New User Onboarding
- [ ] Step-by-Step Validation
- [ ] AI Insights Generation
- [ ] Dashboard Display
- [ ] Data Persistence
- [ ] Minimalist Design
- [ ] Responsive Layout
- [ ] Accessibility
- [ ] Error Handling

### Issues Found
1. [Issue description]
   - Severity: [Critical/High/Medium/Low]
   - Steps to reproduce:
   - Expected vs Actual:

### Screenshots
[Attach screenshots if applicable]

### Overall Status
- [ ] All tests passed
- [ ] Minor issues found
- [ ] Major issues found
- [ ] Blocking issues found
```

## 🚀 Next Steps After Testing

Once testing is complete and successful:

1. **Document any bugs** found during testing
2. **Fix critical issues** before proceeding
3. **Gather user feedback** on onboarding experience
4. **Move to AI integration** (connecting real AI services)
5. **Implement analytics** to track completion rates
6. **Optimize performance** if needed

## 💡 Tips for Effective Testing

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Use browser DevTools to simulate different devices
- Test with different user personas (admin, therapist, client)
- Clear cache between tests for clean slate
- Document everything - even small observations
- Take screenshots of visual bugs
- Test at different times of day (network conditions vary)
- Use React DevTools to inspect component state
- Check Network tab for API calls (future AI integration)

---

**Happy Testing! 🎉**

If you find any issues, document them and we'll address them before moving to production.
