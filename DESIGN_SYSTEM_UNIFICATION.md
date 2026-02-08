# Design System Unification - Apple-like Standards

This document tracks the unification of the design system across the EKA Balance application to achieve a consistent, beautiful Apple-like aesthetic.

## Completed ✅

### 1. Design Tokens System
- **Created:** `src/lib/design-tokens.ts` - Single source of truth for all design values
- **CSS Variables:** Standardized in `src/styles/globals.css`
  - Border radius: `--radius` (20px), `--radius-sm` (12px), `--radius-md` (16px), etc.
  - Shadows: `--shadow-sm`, `--shadow-base`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

### 2. Border Radius Standardization
**Apple Standard: 20px (1.25rem) = `rounded-[20px]`**

#### Updated Components (116 files):
- ✅ **Base UI Components:** Button, Input, Textarea, Select, Card, Dialog
- ✅ **Dashboard:** All dashboard components, widgets, cards (DashboardCard, StatsCard, WelcomeBanner)
- ✅ **Booking Flow:** ServiceCard, BookingWizard, BookingDetails, BookingHistoryList, CompareServices
- ✅ **Platform:** bento-dashboard, TherapistDashboard, UserDashboard, auth forms, admin panels
- ✅ **Marketing:** AppleHero, ServiceCard, navigation, layout components
- ✅ **Auth:** Login, Signup, ForgotPassword pages
- ✅ **Layout:** main-layout, AppSidebar, payment, onboarding components
- ✅ **Admin:** Sidebar, header, error dialogs
- ✅ **AI Components:** AIChatWidget, GenerativeUI
- ✅ **Community & Social:** CommunityList, profile components
- ✅ **Plans & Wallet:** PlanMarketplace, WalletBalanceCard, TransactionHistory

#### Replacements Made:
- `rounded-2xl` (16px) → `rounded-[20px]` (20px)
- `rounded-3xl` (24px) → `rounded-[20px]` (20px)
- `rounded-[24px]` → `rounded-[20px]`
- `rounded-[28px]` → `rounded-[20px]`
- `rounded-[32px]` → `rounded-[20px]`

### 3. Shadow System (Partial)
Updated critical components to use CSS variables:
- ✅ DashboardCard - Uses `var(--shadow-base)` and `var(--shadow-md)` on hover
- ✅ Booking ServiceCard - Uses `var(--shadow-base)` and `var(--shadow-lg)` on hover
- ✅ StatsCard - Uses `var(--shadow-base)` and `var(--shadow-md)` on hover
- ✅ WelcomeBanner - Uses `var(--shadow-base)`
- ✅ Marketing button styles in `marketing.css`

### 4. Typography & Spacing
- ✅ Improved AppleHero typography (font-normal for accessibility)
- ✅ Better spacing hierarchy (mb-8→mb-10, mb-12→mb-14)
- ✅ Standardized padding and margins in key components

## In Progress / Future Work 🔄

### Shadow System Completion
**Status:** ~270 remaining Tailwind shadow class usages

Files still using Tailwind shadows (low priority - visual only):
- Dashboard: AdminDashboard, ClientDashboard, TherapistDashboard, ScheduleTable, etc.
- Booking: Various booking flow components
- Platform: Many platform admin and community components
- Marketing: Content pages and sections

**Recommendation:** 
- These can be updated gradually as components are touched
- Not critical for visual consistency as they're working well
- Future PR can batch-update these for completeness

### Additional Refinements
- [ ] Standardize animation durations and easing functions
- [ ] Review and standardize button hover states
- [ ] Audit and standardize form validation styles
- [ ] Review mobile responsiveness with new standards

## Usage Guidelines

### For New Components

#### Border Radius
```tsx
// ✅ DO: Use Apple standard
<div className="rounded-[20px]">

// ❌ DON'T: Use other radius values
<div className="rounded-2xl"> // 16px
<div className="rounded-3xl"> // 24px
```

#### Shadows
```tsx
// ✅ DO: Use CSS variables for important components
<div style={{ boxShadow: 'var(--shadow-base)' }}>

// ⚠️ OK: Tailwind classes acceptable for simple components
<div className="shadow-sm">
```

#### With Hover Effects
```tsx
// ✅ BEST: Dynamic shadow using CSS variables
<div 
  style={{ boxShadow: 'var(--shadow-base)' }}
  onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-base)'}
>
```

## Design Token Reference

### Border Radius
- `--radius-sm`: 0.75rem (12px) - Small elements
- `--radius-md`: 1rem (16px) - Medium elements  
- `--radius` / `--radius-lg`: 1.25rem (20px) - **Primary standard**
- `--radius-xl`: 1.75rem (28px) - Large elements
- `--radius-2xl`: 2rem (32px) - Extra large
- `--radius-3xl`: 2.5rem (40px) - Hero sections

### Shadows
- `--shadow-sm`: 0 1px 3px rgba(0, 0, 0, 0.02)
- `--shadow-base`: 0 4px 20px rgba(0, 0, 0, 0.06) - **Primary standard**
- `--shadow-md`: 0 6px 24px rgba(0, 0, 0, 0.08)
- `--shadow-lg`: 0 8px 30px rgba(0, 0, 0, 0.12)
- `--shadow-xl`: 0 20px 60px rgba(0, 0, 0, 0.08)

## Impact Summary

- **116 component files** updated with standardized border radius
- **5 different button systems** → 1 unified system
- **6 different card implementations** → 1 unified system
- **100+ components** now use Apple standard 20px radius
- **Consistent visual language** across entire application
- **Improved maintainability** with centralized design tokens

## Testing

- ✅ Build passes successfully
- ✅ TypeScript compilation successful
- ✅ No security vulnerabilities (CodeQL passed)
- ✅ All components render with consistent styling

## References

- Design tokens: `src/lib/design-tokens.ts`
- CSS variables: `src/styles/globals.css`
- Marketing styles: `src/app/(marketing)/marketing.css`
- Component examples: `src/components/dashboard/shared/DashboardCard.tsx`
