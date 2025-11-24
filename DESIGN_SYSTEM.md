# Design System - EKA Account Platform

## Overview

This document outlines the design system used across all EKA Account applications to ensure consistency, accessibility, and maintainability.

## Design Principles

1. **Consistency**: Same patterns across all 8 apps
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Responsiveness**: Mobile-first approach
4. **Performance**: Optimized for fast loading
5. **Maintainability**: Single source of truth

## Applications Using This System

1. **Web** - User-facing application
2. **Admin** - Administrative dashboard
3. **Therapist** - Therapist portal
4. **Academy** - Learning management system (NEW)
5. **API** - Backend services
6. **Marketing** - Marketing website
7. **Booking** - Appointment scheduling
8. **Legal** - Terms and privacy pages

## Technology Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 3.4+
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Fonts**: Inter (sans-serif)

## Color Palette

### Primary Colors
```css
--primary: 222.2 47.4% 11.2%;       /* #1a1f2e - Dark blue-grey */
--primary-foreground: 210 40% 98%;  /* #f9fafb - Light text */
```

### Secondary Colors
```css
--secondary: 210 40% 96.1%;         /* #f1f5f9 - Light grey */
--secondary-foreground: 222.2 47.4% 11.2%; /* #1a1f2e - Dark text */
```

### Accent Colors
```css
--accent: 210 40% 96.1%;            /* #f1f5f9 */
--accent-foreground: 222.2 47.4% 11.2%; /* #1a1f2e */
```

### Semantic Colors
```css
--destructive: 0 84.2% 60.2%;       /* #ef4444 - Red */
--destructive-foreground: 210 40% 98%; /* #f9fafb */

--success: 142 76% 36%;             /* #16a34a - Green */
--warning: 38 92% 50%;              /* #f59e0b - Amber */
--info: 217 91% 60%;                /* #3b82f6 - Blue */
```

### Neutral Colors
```css
--background: 0 0% 100%;            /* #ffffff - White */
--foreground: 222.2 84% 4.9%;       /* #020817 - Almost black */

--muted: 210 40% 96.1%;             /* #f1f5f9 */
--muted-foreground: 215.4 16.3% 46.9%; /* #64748b - Grey */

--card: 0 0% 100%;                  /* #ffffff */
--card-foreground: 222.2 84% 4.9%;  /* #020817 */

--popover: 0 0% 100%;               /* #ffffff */
--popover-foreground: 222.2 84% 4.9%; /* #020817 */

--border: 214.3 31.8% 91.4%;        /* #e2e8f0 */
--input: 214.3 31.8% 91.4%;         /* #e2e8f0 */
--ring: 222.2 84% 4.9%;             /* #020817 */
```

## Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

## Spacing

Uses 4px base unit (0.25rem):

```css
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

## Border Radius

```css
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.5rem;       /* 8px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.75rem;   /* 12px */
--radius-full: 9999px;  /* Fully rounded */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## Component Library

### Button

```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Controls

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Input
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Email" />
</div>

// Textarea
<div>
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Type your message..." />
</div>

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>

// Checkbox
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

### Dialog/Modal

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Toast/Alert

```tsx
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Toast
const { toast } = useToast();
toast({
  title: "Success",
  description: "Your changes have been saved.",
});

// Alert
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Progress

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={60} className="w-full" />
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

## Layout Patterns

### Page Layout

```tsx
export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        {/* Header content */}
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

### Dashboard Layout

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40">
        {/* Sidebar navigation */}
      </aside>
      <div className="flex-1">
        <header className="border-b bg-background px-6 py-4">
          {/* Header */}
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>{/* Card 1 */}</Card>
  <Card>{/* Card 2 */}</Card>
  <Card>{/* Card 3 */}</Card>
</div>
```

## Accessibility

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Focus states must be visible (ring utilities)
- Tab order should be logical

### ARIA Labels

```tsx
// Button with accessible label
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Form with proper labels
<div>
  <Label htmlFor="username">Username</Label>
  <Input
    id="username"
    aria-describedby="username-help"
    aria-required="true"
  />
  <p id="username-help" className="text-sm text-muted-foreground">
    Choose a unique username
  </p>
</div>
```

### Focus Management

```tsx
// Always show focus rings
<Button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Click me
</Button>

// Skip to content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Color Contrast

- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- UI components: minimum 3:1 ratio

## Responsive Design

### Breakpoints

```css
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

### Mobile-First Approach

```tsx
// Start with mobile styles, add larger breakpoints
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Responsive column */}
</div>

<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Responsive heading */}
</h1>

<Button className="w-full md:w-auto">
  {/* Full width on mobile, auto on desktop */}
</Button>
```

## Animation

### Transitions

```tsx
// Hover effects
<Button className="transition-colors hover:bg-primary/90">
  Hover me
</Button>

// Smooth animations
<div className="transition-all duration-300 ease-in-out">
  Animated content
</div>
```

### Loading States

```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-[250px]" />
```

## Dark Mode Support

All components support dark mode via `dark:` prefix:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Dark mode support
</div>
```

## Best Practices

### Component Composition

```tsx
// Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid: Monolithic components
<ComplexCard title="Title" content="Content" />
```

### Consistent Spacing

```tsx
// Use consistent spacing scale
<div className="space-y-4">  {/* 16px between items */}
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Semantic HTML

```tsx
// Good: Semantic elements
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Avoid: Div soup
<div>
  <div>
    <div><a href="/">Home</a></div>
  </div>
</div>
```

## Testing

### Visual Regression Testing

```bash
# Run visual tests
npm run test:visual

# Update snapshots
npm run test:visual -- -u
```

### Accessibility Testing

```bash
# Run axe accessibility tests
npm run test:a11y
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Maintenance

### Adding New Components

1. Create component in `components/ui/`
2. Follow existing patterns
3. Add TypeScript types
4. Include accessibility features
5. Test across breakpoints
6. Document usage

### Updating Colors

1. Update `tailwind.config.ts`
2. Update CSS variables in `app/globals.css`
3. Test dark mode
4. Verify contrast ratios
5. Update documentation

### Reporting Issues

- Design inconsistencies: design@ekaacc.com
- Accessibility issues: a11y@ekaacc.com
- Component bugs: bugs@ekaacc.com

## Version History

- v1.0.0 (2024-01-15): Initial design system
- v1.1.0 (2024-02-01): Added dark mode support
- v1.2.0 (2024-03-01): Academy LMS components

---

**Maintained by**: Design Team @ EKA Account  
**Last Updated**: 2024-11-24
