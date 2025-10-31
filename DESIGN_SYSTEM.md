# EKA Account Design System

## Core Principles

This document outlines the design patterns and principles to maintain consistency across the EKA Account application.

## 1. Color System

### ✅ DO: Use CSS Variables (Semantic Tokens)

```tsx
// Good - Uses semantic color tokens
<div className="bg-primary text-primary-foreground">
<Badge variant="destructive">Error</Badge>
<p className="text-muted-foreground">Secondary text</p>
```

### ❌ DON'T: Use Hardcoded Colors

```tsx
// Bad - Hardcoded colors
<div className="bg-green-500 text-green-900">
<p className="text-pink-600">Important</p>
<Badge className="bg-yellow-100">Warning</Badge>
```

### Available Semantic Colors

- `background` / `foreground` - Base page colors
- `card` / `card-foreground` - Card backgrounds
- `primary` / `primary-foreground` - Primary actions (buttons, links)
- `secondary` / `secondary-foreground` - Secondary elements
- `muted` / `muted-foreground` - Muted/disabled states
- `accent` / `accent-foreground` - Accent highlights
- `destructive` / `destructive-foreground` - Errors/warnings
- `border` - Border colors
- `input` - Input borders
- `ring` - Focus rings

### Status Colors (When semantic tokens aren't enough)

For truly semantic status indicators, create CSS variables in `globals.css`:

```css
:root {
  --success: 142 76% 36%; /* Green */
  --warning: 38 92% 50%; /* Orange */
  --info: 221 83% 53%; /* Blue */
}

.dark {
  --success: 142 71% 45%;
  --warning: 38 92% 60%;
  --info: 221 83% 63%;
}
```

Then use them:

```tsx
<Badge className="bg-success/10 text-success border-success/20">Success</Badge>
```

## 2. Component Patterns

### Always Use `cn()` for Conditional Classes

```tsx
import { cn } from '@/lib/utils';

// Good
<div className={cn(
  "base-classes",
  condition && "conditional-class",
  className
)}>

// Bad
<div className={`base-classes ${condition ? 'conditional-class' : ''} ${className}`}>
```

### Consistent Card Pattern

```tsx
<Card className={cn("glass border-border/50", className)}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Button Variants

Always use the predefined button variants:

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>
```

## 3. Typography

### Heading Hierarchy

```tsx
<h1 className="text-3xl font-bold">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-semibold">Subsection</h3>
<h4 className="text-lg font-medium">Card Title</h4>
<p className="text-sm text-muted-foreground">Body text</p>
```

### Never Inline Font Family

```tsx
// Bad
<p style={{ fontFamily: 'Inter' }}>Text</p>

// Good - Uses global font-body class from layout
<p className="font-body">Text</p>
```

## 4. Spacing & Layout

### Standard Spacing Scale

- `gap-2` (8px) - Tight spacing (icons + text)
- `gap-4` (16px) - Default spacing
- `gap-6` (24px) - Section spacing
- `gap-8` (32px) - Large section spacing

### Padding Pattern

```tsx
<Card>
  <CardHeader className="p-6 pb-4"> {/* Standard header padding */}
  <CardContent className="p-6 pt-0"> {/* Content continues from header */}
  <CardFooter className="p-6 pt-0"> {/* Footer continues spacing */}
</Card>
```

## 5. Accessibility

### Always Provide ARIA Labels

```tsx
// Icons without visible text
<Button variant="ghost" aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Interactive elements
<div role="button" aria-label="Select option" tabIndex={0}>
```

### Focus States

All interactive elements must have visible focus states (handled by Tailwind's `focus-visible:` variant):

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
```

## 6. Icon Usage

### Consistent Icon Sizing

```tsx
import { Heart } from 'lucide-react';

// In text (16px)
<Heart className="h-4 w-4" />

// In buttons/cards (20px)
<Heart className="h-5 w-5" />

// Large icons (24px)
<Heart className="h-6 w-6" />

// Hero icons (40px+)
<Heart className="h-10 w-10" />
```

### Icon Colors

```tsx
// Good - Inherits text color
<Heart className="h-4 w-4 text-current" />
<Heart className="h-4 w-4 text-muted-foreground" />

// Bad - Hardcoded color
<Heart className="h-4 w-4 text-pink-600" />
```

## 7. Animation & Transitions

### Standard Transitions

```tsx
// Hover effects
<Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">

// Active states
<Button className="active:scale-[0.98]">

// Glass effect (from globals.css)
<Card className="glass">
```

### Loading States

Use the loading skeleton components:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-8 w-full" />
```

## 8. Forms

### Standard Form Pattern

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Label</FormLabel>
          <FormControl>
            <Input placeholder="Placeholder" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## 9. Data Service Pattern

### Always Use Service Abstraction

```tsx
// Good
import { getDataService } from '@/services/data-service';

const service = await getDataService();
const data = await service.getData();

// Bad - Never import Firebase directly
import { db } from '@/firebase/firebase';
import { mockData } from '@/services/mock-data-service';
```

## 10. Performance Patterns

### Use `useOptimizedData` for Client Components

```tsx
import { useOptimizedData } from '@/hooks/use-optimized-data';

const { data, isLoading, error } = useOptimizedData({
  cacheKey: 'unique-key',
  fetcher: async () => {
    const service = await getDataService();
    return service.getData();
  },
  staleTime: 300000, // 5 minutes
});
```

### Image Optimization

```tsx
import { OptimizedImage } from '@/components/eka/optimized-image';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
/>
```

## 11. Responsive Design

### Mobile-First Breakpoints

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

<p className="text-sm md:text-base lg:text-lg">
  {/* Responsive text sizing */}
</p>
```

## 12. Dark Mode

### Automatic Dark Mode Support

All color tokens automatically adapt to dark mode. Never hardcode light/dark specific colors:

```tsx
// Good - Automatic dark mode
<div className="bg-card text-card-foreground border-border">

// Bad - Manual dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

## 13. Component File Organization

```
src/components/
├── ui/              # Radix primitives (button, card, etc.)
├── eka/             # Custom app components
│   ├── forms/       # Form components
│   ├── insights/    # AI insights components
│   └── dashboard/   # Dashboard specific
```

## Quick Reference Checklist

Before committing new components:

- [ ] Uses CSS variables instead of hardcoded colors
- [ ] Applies `cn()` for className composition
- [ ] Includes proper TypeScript types
- [ ] Has appropriate ARIA labels
- [ ] Uses service abstraction for data access
- [ ] Follows mobile-first responsive pattern
- [ ] Includes proper error states
- [ ] Has loading states with skeletons
- [ ] Uses semantic HTML elements
- [ ] Consistent spacing (gap-4, p-6, etc.)
- [ ] Icons properly sized and colored
- [ ] No inline styles
- [ ] No global CSS modules

## Migration Guide

To fix existing components with hardcoded colors:

1. **Find hardcoded colors:**

   ```bash
   # Search for hardcoded Tailwind colors
   grep -r "text-green-" src/
   grep -r "bg-pink-" src/
   grep -r "border-blue-" src/
   ```

2. **Replace with semantic tokens:**
   - Success states: `text-green-600` → Create `--success` CSS variable
   - Warnings: `text-yellow-600` → Create `--warning` CSS variable
   - Info: `text-blue-600` → Create `--info` CSS variable
   - Errors: Use `text-destructive`

3. **Update component:**

   ```tsx
   // Before
   <Badge className="bg-green-100 text-green-800">Active</Badge>
   
   // After
   <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
   ```

## Resources

- **Tailwind Docs:** <https://tailwindcss.com/docs>
- **Radix UI:** <https://www.radix-ui.com/>
- **Lucide Icons:** <https://lucide.dev/>
- **CVA (Class Variance Authority):** <https://cva.style/docs>
