# Keep React Migration - Remaining Fixes

## Type Errors to Fix

### 1. Progress Component
**Files affected:**
- `src/app/(app)/donation-seeker/page.tsx`
- `src/app/(app)/loyalty/page.tsx`

**Issue:** Keep React exports Progress differently

**Fix:**
```typescript
// Change from:
import { Progress } from '@/components/keep';

// To:
import { Progress, ProgressBar } from '@/components/keep';

// Then wrap usage:
<Progress>
  <ProgressBar value={75} />
</Progress>
```

### 2. Notification className
**File:** `src/app/(app)/donation-seeker/page.tsx:115`

**Issue:** Keep React Notification doesn't accept className directly

**Fix:**
```typescript
// Wrap in a div if you need custom className
<div className="your-classes">
  <Notification>
    <NotificationDescription>...</NotificationDescription>
  </Notification>
</div>
```

### 3. Badge Variants
**Files:**
- `src/app/(app)/donation-seeker/page.tsx`
- `src/app/(app)/loyalty/page.tsx`

**Issue:** Keep React Badge has different variants: `"base" | "border" | "background"`

**Fix:**
```typescript
// Old Radix variants: "default" | "secondary" | "destructive" | "outline"
// Keep React variants: "base" | "border" | "background"

// Change from:
<Badge variant="default">Text</Badge>
<Badge variant="secondary">Text</Badge>

// To:
<Badge variant="base">Text</Badge>  // or just <Badge>
<Badge variant="border">Text</Badge>
// Or use custom colors:
<Badge className="bg-green-500 text-white">Text</Badge>
```

### 4. Calendar Component
**File:** `src/app/(app)/journal/page.tsx`

**Issue:** Calendar not migrated (Keep React uses DatePicker)

**Options:**
A. Keep Radix Calendar (recommended for now)
```typescript
import { Calendar } from '@/components/ui/calendar';
```

B. Use Keep React DatePicker
```typescript
import { DatePicker } from '@/components/keep';
```

### 5. Button Variants
**File:** `src/app/(app)/journal/page.tsx`

**Issue:** Keep React Button has different variants

**Fix:**
```typescript
// Old: variant="ghost" size="icon"
// New: variant="outline" (or use className)

<Button variant="outline" className="h-9 w-9">
  <Icon />
</Button>

// Or no variant for ghost-like:
<Button className="ghost-button-styles">
  <Icon />
</Button>
```

### 6. Form Components
**File:** `src/app/(app)/myaccount/page.tsx`

**Issue:** React Hook Form wrapper components not in Keep React

**Fix:** Keep using Radix UI Form components
```typescript
import { Input, Label, Button } from '@/components/keep';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel,
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
```

## Quick Fix Script

Run these commands to fix the most common issues:

```bash
# Fix Progress imports
find src -name "*.tsx" -type f -exec sed -i 's/import { Progress } from/import { Progress, ProgressBar } from/g' {} +

# Add Calendar imports from ui where needed
# (Manual fix recommended - only 1-2 files)
```

## Files That Need Manual Attention

1. **src/app/(app)/donation-seeker/page.tsx** - Fix Progress, Notification, Badge
2. **src/app/(app)/loyalty/page.tsx** - Fix Progress, Badge
3. **src/app/(app)/journal/page.tsx** - Keep Calendar from Radix, fix Button variants
4. **src/app/(app)/myaccount/page.tsx** - Keep Form components from Radix

## Recommended Approach

### Option 1: Hybrid (Recommended)
Keep these Radix UI components:
- Calendar (date picking)
- Form wrappers (React Hook Form integration)
- Sidebar (already custom)
- Charts (Recharts wrappers)

Use Keep React for everything else.

### Option 2: Manual Component Wrappers
Create Keep React wrappers for specialized components:
```typescript
// src/components/keep/KeepProgress.tsx
import { Progress, ProgressBar } from 'keep-react';

export function KeepProgress({ value }: { value: number }) {
  return (
    <Progress>
      <ProgressBar value={value} />
    </Progress>
  );
}
```

## Summary

Out of 280 files:
- ✅ 108 files successfully migrated
- ⚠️ 4-5 files need minor fixes
- ℹ️ Rest had no UI components

Most common fixes needed:
1. Badge variant names
2. Button variant names  
3. Progress component structure
4. Keep specialized Radix components (Calendar, Form)

Total effort: **10-15 minutes of manual fixes**
