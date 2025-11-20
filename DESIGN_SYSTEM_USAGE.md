# EKA Design System - Quick Reference Guide

## Overview
This design system provides a comprehensive set of utility classes for consistent styling across the entire EKA Account platform. All classes are prefixed with `eka-` for easy identification.

## Quick Start

### Basic Page Layout
```tsx
<div className="eka-dashboard-container">
  <header className="eka-dashboard-header">
    {/* Header content */}
  </header>
  
  <main className="eka-dashboard-main">
    <div className="eka-page-header">
      <h1 className="eka-page-title">Page Title</h1>
      <p className="eka-page-description">Page description</p>
    </div>
    
    <div className="eka-grid-3">
      {/* Grid items */}
    </div>
  </main>
</div>
```

### Cards
```tsx
// Basic card
<div className="eka-card p-6">
  <h3 className="eka-section-title">Card Title</h3>
  <p className="eka-section-description">Card description</p>
</div>

// Hoverable card
<div className="eka-card-hover p-6">
  <h3>Hoverable Card</h3>
</div>

// Elevated card
<div className="eka-card-elevated p-6">
  <h3>Elevated Card</h3>
</div>

// Stat card
<div className="eka-stat-card">
  <p className="eka-stat-label">Total Users</p>
  <h2 className="eka-stat-value">1,234</h2>
  <p className="eka-stat-change">+12% from last month</p>
</div>
```

### Forms
```tsx
<form>
  <div className="eka-form-group">
    <label className="eka-form-label">Email</label>
    <input className="eka-input" type="email" placeholder="Enter email" />
  </div>
  
  <div className="eka-form-group">
    <label className="eka-form-label">Password</label>
    <input className="eka-input" type="password" />
    <p className="eka-form-error">Password is required</p>
  </div>
  
  <button className="eka-btn-primary eka-transition">
    Submit
  </button>
</form>
```

### Grids
```tsx
// 2-column responsive grid
<div className="eka-grid-2">
  <div className="eka-card p-4">Item 1</div>
  <div className="eka-card p-4">Item 2</div>
</div>

// 3-column responsive grid
<div className="eka-grid-3">
  <div className="eka-card p-4">Item 1</div>
  <div className="eka-card p-4">Item 2</div>
  <div className="eka-card p-4">Item 3</div>
</div>

// 4-column responsive grid
<div className="eka-grid-4">
  <div className="eka-card p-4">Item 1</div>
  <div className="eka-card p-4">Item 2</div>
  <div className="eka-card p-4">Item 3</div>
  <div className="eka-card p-4">Item 4</div>
</div>
```

### Navigation
```tsx
// Navigation links
<nav>
  <a href="/dashboard" className="eka-nav-link">
    Dashboard
  </a>
  <a href="/profile" className="eka-nav-link-active">
    Profile
  </a>
  <a href="/settings" className="eka-nav-link">
    Settings
  </a>
</nav>
```

### Badges
```tsx
<span className="eka-badge-primary">Primary</span>
<span className="eka-badge-secondary">Secondary</span>
<span className="eka-badge-outline">Outline</span>
```

### Alerts
```tsx
// Error alert
<div className="eka-alert-destructive">
  <p>There was an error processing your request</p>
</div>

// Success alert
<div className="eka-alert-success">
  <p>Your changes have been saved</p>
</div>

// Info alert
<div className="eka-alert">
  <p>Please verify your email address</p>
</div>
```

### Empty States
```tsx
<div className="eka-empty-state">
  <div className="eka-empty-state-icon">
    <Icon size={48} />
  </div>
  <h3 className="eka-empty-state-title">No data found</h3>
  <p className="eka-empty-state-description">
    Get started by creating your first item
  </p>
  <button className="eka-btn-primary">
    Create Item
  </button>
</div>
```

### Loading States
```tsx
// Skeleton loader
<div className="eka-skeleton h-4 w-full"></div>
<div className="eka-skeleton h-4 w-3/4 mt-2"></div>

// Spinner
<div className="eka-spinner h-8 w-8"></div>
```

### Buttons
```tsx
<button className="eka-btn-primary eka-transition">
  Primary Action
</button>

<button className="eka-btn-secondary eka-transition">
  Secondary Action
</button>

<button className="eka-btn-outline eka-transition">
  Outline Button
</button>
```

## Complete Class Reference

### Layout Classes
- `eka-container` - Standard container with responsive padding
- `eka-dashboard-container` - Full-height dashboard layout
- `eka-dashboard-header` - Sticky header with backdrop blur
- `eka-dashboard-main` - Main content area with spacing
- `eka-section-spacing` - Consistent vertical section spacing

### Card Classes
- `eka-card` - Base card styling
- `eka-card-hover` - Card with hover effects
- `eka-card-elevated` - Card with enhanced shadow
- `eka-stat-card` - Standardized statistics card

### Grid Classes
- `eka-grid-1` - Single column grid
- `eka-grid-2` - 2-column responsive grid (1 col on mobile, 2 on md+)
- `eka-grid-3` - 3-column responsive grid (1 col on mobile, 2 on md, 3 on lg+)
- `eka-grid-4` - 4-column responsive grid (1 col on mobile, 2 on md, 4 on lg+)

### Typography Classes
- `eka-page-title` - Main page heading (text-3xl font-bold)
- `eka-page-description` - Page description text
- `eka-section-title` - Section heading (text-2xl font-bold)
- `eka-section-description` - Section description
- `eka-section-header` - Section header container
- `eka-stat-label` - Stat card label
- `eka-stat-value` - Stat card value (text-3xl font-bold)
- `eka-stat-change` - Stat card change indicator

### Form Classes
- `eka-form-group` - Form field container
- `eka-form-label` - Form field label
- `eka-input` - Standardized input field
- `eka-form-error` - Error message styling

### Button Classes
- `eka-btn-primary` - Primary button
- `eka-btn-secondary` - Secondary button
- `eka-btn-outline` - Outline button

### Navigation Classes
- `eka-nav-link` - Navigation link
- `eka-nav-link-active` - Active navigation state

### Badge Classes
- `eka-badge` - Base badge
- `eka-badge-primary` - Primary badge
- `eka-badge-secondary` - Secondary badge
- `eka-badge-outline` - Outline badge

### Alert Classes
- `eka-alert` - Base alert
- `eka-alert-destructive` - Error alert
- `eka-alert-success` - Success alert

### State Classes
- `eka-transition` - Smooth 200ms transition
- `eka-focus` - Accessible focus state
- `eka-skeleton` - Loading skeleton
- `eka-spinner` - Loading spinner
- `eka-empty-state` - Empty state container
- `eka-empty-state-icon` - Empty state icon
- `eka-empty-state-title` - Empty state title
- `eka-empty-state-description` - Empty state description

## Color Usage

### Theme Colors
All components automatically adapt to light/dark mode using CSS variables:
- `background` - Page background
- `foreground` - Primary text color
- `primary` - Primary brand color (blue)
- `secondary` - Secondary UI color
- `muted` - Muted background/text
- `accent` - Accent highlights
- `destructive` - Error states
- `border` - Border color
- `input` - Input field border

### Usage in Custom Components
```tsx
// Use theme colors via Tailwind
<div className="bg-primary text-primary-foreground">
  Primary colored element
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary colored element
</div>

<p className="text-muted-foreground">
  Muted text
</p>
```

## Responsive Breakpoints
- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1920px

## Best Practices

### Do's ✅
- Use `eka-*` classes for consistency
- Combine with Tailwind utilities for spacing (p-4, mt-2, etc.)
- Use `eka-transition` on interactive elements
- Use semantic HTML with design system classes
- Test in both light and dark modes

### Don'ts ❌
- Don't create custom styles that duplicate eka-* functionality
- Don't use inline styles for things covered by the design system
- Don't skip the transition class on interactive elements
- Don't hardcode colors - use theme variables
- Don't break the grid system with custom layouts

## Migration Guide

### Old Pattern
```tsx
<div className="bg-white rounded-lg p-6 shadow-sm border">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### New Pattern
```tsx
<div className="eka-card p-6">
  <h2 className="eka-section-title">Title</h2>
  <p className="eka-section-description">Description</p>
</div>
```

## Support

For questions or suggestions about the design system:
1. Check this documentation
2. Review DESIGN_CONSISTENCY_UPDATES.md
3. Examine implemented examples in src/app/page.tsx
4. Consult globals.css for class definitions

## Version
Design System v1.0.0 - November 2025
