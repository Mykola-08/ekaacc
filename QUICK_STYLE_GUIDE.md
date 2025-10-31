# Quick Style Guide - EKA Account

> **TL;DR**: Use CSS variables, the `cn()` helper, and semantic color tokens. Never hardcode colors.

## 🎨 Colors - The #1 Rule

### ✅ DO: Use Semantic Tokens

```tsx
// Status indicators
<Badge className="bg-success/10 text-success border-success/20">Success</Badge>
<Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>
<Badge className="bg-info/10 text-info border-info/20">Info</Badge>
<Badge variant="destructive">Error</Badge>

// Base colors
<div className="bg-primary text-primary-foreground">
<p className="text-muted-foreground">Secondary text</p>
<Card className="border-border bg-card">
```

### ❌ DON'T: Hardcode Colors

```tsx
// Never do this:
<Badge className="bg-green-100 text-green-800">
<p className="text-pink-600">
<div className="border-blue-500">
```

## 🧩 Available Semantic Colors

| Token | Usage | Example |
|-------|-------|---------|
| `primary` | Main actions, headers | Buttons, active states |
| `secondary` | Secondary actions | Outlined buttons |
| `muted` | Disabled, less important | Placeholders, helpers |
| `accent` | Highlights | Badges, tags |
| `destructive` | Errors, warnings | Delete buttons, errors |
| `success` | Success states | ✅ Checkmarks, confirmations |
| `warning` | Warnings, caution | ⚠️ Alerts, validation |
| `info` | Information | ℹ️ Tips, notifications |
| `border` | Borders | Card borders |
| `background` / `foreground` | Base colors | Page background |
| `card` / `card-foreground` | Card backgrounds | Card components |

## 🛠️ Component Patterns

### Buttons

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>
```

### Cards

```tsx
<Card className="glass border-border/50">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Status Badges

```tsx
<Badge className="bg-success/10 text-success border-success/20">
  <CheckCircle className="h-3 w-3 mr-1" />
  Active
</Badge>
```

### Alerts

```tsx
<Alert className="border-success/20 bg-success/5">
  <CheckCircle className="h-4 w-4 text-success" />
  <AlertDescription>Success message</AlertDescription>
</Alert>
```

## 🎯 Icons

### Sizing

```tsx
<Icon className="h-4 w-4" /> // Small (16px) - In text
<Icon className="h-5 w-5" /> // Medium (20px) - Buttons, cards
<Icon className="h-6 w-6" /> // Large (24px) - Headers
<Icon className="h-10 w-10" /> // Hero (40px) - Large displays
```

### Coloring

```tsx
<Icon className="text-success" />      // Semantic color
<Icon className="text-current" />      // Inherit text color
<Icon className="text-muted-foreground" /> // Muted
```

## 📏 Spacing

```tsx
gap-2  // 8px  - Tight (icon + text)
gap-4  // 16px - Default (cards, buttons)
gap-6  // 24px - Sections
gap-8  // 32px - Large sections

p-6    // Standard card padding
p-6 pb-4  // Card header
p-6 pt-0  // Card content (continues from header)
```

## 📝 Typography

```tsx
<h1 className="text-3xl font-bold">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-semibold">Subsection</h3>
<h4 className="text-lg font-medium">Card Title</h4>
<p className="text-sm text-muted-foreground">Body text</p>
<p className="text-xs text-muted-foreground">Small text</p>
```

## 🔧 The `cn()` Helper

Always use for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base classes",
  condition && "conditional-class",
  isActive && "active-class",
  className // Allow prop override
)}>
```

## 🌓 Dark Mode

All semantic colors automatically adapt. Never do manual dark mode:

```tsx
// ✅ Good - Automatic
<div className="bg-card text-card-foreground">

// ❌ Bad - Manual
<div className="bg-white dark:bg-gray-900">
```

## 📦 Data Service Pattern

```tsx
// Always use the service abstraction
import { getDataService } from '@/services/data-service';

const service = await getDataService();
const data = await service.getData();

// Never import Firebase directly
// ❌ import { db } from '@/firebase/firebase';
```

## 🎨 Glass Effect

```tsx
<Card className="glass border-border/50">
  {/* Automatically gets backdrop blur + transparency */}
</Card>
```

## 🔄 Loading States

```tsx
import { Skeleton } from '@/components/ui/skeleton';

{isLoading ? (
  <Skeleton className="h-8 w-full" />
) : (
  <p>{data}</p>
)}
```

## 📱 Responsive

Mobile-first approach:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col mobile, 2 tablet, 3 desktop */}
</div>

<p className="text-sm md:text-base lg:text-lg">
  {/* Responsive text sizing */}
</p>
```

## ✅ Pre-Commit Checklist

Before committing new components:

- [ ] Using CSS variables (not hardcoded colors)
- [ ] Using `cn()` helper for className composition
- [ ] Icons properly sized (h-4, h-5, or h-6) and colored
- [ ] Consistent spacing (gap-4, p-6, etc.)
- [ ] Proper TypeScript types
- [ ] ARIA labels where needed
- [ ] Uses service abstraction for data
- [ ] Loading states with Skeleton
- [ ] Mobile-first responsive design
- [ ] No inline styles

## 🚀 Quick Start

See full examples:

- **Documentation**: `DESIGN_SYSTEM.md`
- **Live Examples**: `src/components/eka/design-system-showcase.tsx`
- **Implementation Guide**: `DESIGN_SYSTEM_IMPLEMENTATION.md`
