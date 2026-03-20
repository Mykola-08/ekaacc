# UI/UX Unification Design Document

## Overview

This design document specifies a comprehensive UI/UX unification system for the application, establishing a pixel-perfect, premium, clean design language with modern Maya-style aesthetics. The design system unifies all components across dashboard, booking, marketing, and other application sections while maintaining flexibility for context-specific variations.

### Design Philosophy

The unified design system follows these core principles:

1. **Maya-Style Aesthetics**: Refined border radius, generous spacing, clean lines, and premium feel
2. **Consistency First**: Identical behavior and appearance across all application sections
3. **Accessibility by Default**: WCAG 2.1 AA compliance built into every component
4. **Performance Optimized**: Smooth animations with reduced-motion support
5. **Developer Experience**: Clear APIs, comprehensive documentation, and predictable patterns
6. **Theme Flexibility**: Seamless light/dark mode with perceptually uniform colors

### Technology Stack

- **Framework**: Next.js 16.2.0 with React 19
- **Styling**: Tailwind CSS 4.2.2 with custom design tokens
- **Components**: Radix UI primitives with custom styling
- **Typography**: Geist Sans and Geist Mono font families
- **Color Space**: OKLCH for perceptually uniform colors
- **Animation**: CSS transitions with spring easing functions

### Current State Analysis

The application currently has:
- Multiple button variants with inconsistent styling (rounded-4xl vs rounded-lg)
- Card components with varying border radius and shadow implementations
- Duplicate design tokens across marketing and dashboard sections
- Inconsistent spacing patterns (some using arbitrary values)
- Mixed animation timing and easing functions
- Separate styling contexts that sometimes conflict

### Design Goals

1. Standardize all design tokens into a single source of truth
2. Unify component styling while preserving section-specific overrides
3. Establish consistent spacing using an 8px base grid
4. Create a comprehensive Maya-style radius system
5. Implement consistent interactive states across all components
6. Ensure accessibility compliance throughout
7. Provide clear migration paths for existing components

---

## Architecture

### Design Token Hierarchy

The design system uses a three-tier token hierarchy:

```
Primitive Tokens (CSS Variables)
    ↓
Semantic Tokens (Theme-aware)
    ↓
Component Tokens (Context-specific)
```

**Primitive Tokens**: Raw values defined in `:root` and `.dark`
- Colors in OKLCH format
- Spacing in rem/px
- Shadows with rgba values
- Radius in rem

**Semantic Tokens**: Theme-aware tokens that reference primitives
- `--color-primary`, `--color-secondary`
- `--spacing-4`, `--spacing-8`
- `--shadow-sm`, `--shadow-md`
- `--radius-lg`, `--radius-xl`

**Component Tokens**: Specific to component contexts
- `--button-height-default`, `--button-padding-x`
- `--card-padding`, `--card-gap`
- `--input-height`, `--input-border-width`

### Section Context System

The design system supports three primary contexts:

1. **Base Context**: Default styling for dashboard and application pages
2. **Marketing Context**: Scoped within `.marketing` wrapper for landing pages
3. **Booking Context**: Specialized styling for booking flows

Each context can override design tokens while maintaining component API consistency.

### Component Architecture

All components follow a consistent structure:

```typescript
// 1. Variant definition using CVA
const componentVariants = cva(baseStyles, {
  variants: { ... },
  defaultVariants: { ... }
})

// 2. Component with typed props
function Component({
  variant,
  size,
  className,
  ...props
}: ComponentProps) {
  return (
    <Element
      data-slot="component-name"
      data-variant={variant}
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

**Key Architectural Decisions**:

- **CVA for Variants**: Class Variance Authority provides type-safe variant management
- **Data Attributes**: Used for styling hooks and debugging (`data-slot`, `data-variant`)
- **Composition**: Components compose smaller primitives rather than monolithic implementations
- **Radix Primitives**: Accessibility and behavior from Radix UI, styling from design system
- **Tailwind Utilities**: Prefer utility classes over custom CSS for maintainability

### File Organization

```
src/
├── styles/
│   ├── globals.css          # Design tokens and base styles
│   ├── dashboard.css         # Dashboard-specific overrides
│   └── components.css        # Shared component styles
├── components/
│   ├── ui/                   # Base UI components
│   ├── dashboard/            # Dashboard-specific components
│   ├── booking/              # Booking-specific components
│   └── shared/               # Cross-section shared components
└── lib/
    └── design-tokens.ts      # TypeScript token exports
```

---

## Components and Interfaces

### Button Component

**Purpose**: Primary interactive element for user actions

**Variants**:
- `default`: Primary action button with brand color
- `secondary`: Secondary actions with muted styling
- `outline`: Bordered button for less prominent actions
- `ghost`: Transparent button for tertiary actions
- `destructive`: Warning/delete actions with red accent
- `link`: Text-only link-style button

**Sizes**:
- `xs`: 24px height (h-6) - Compact UI elements
- `sm`: 32px height (h-8) - Dense layouts
- `default`: 36px height (h-9) - Standard size
- `lg`: 40px height (h-10) - Prominent actions
- `icon-xs`, `icon-sm`, `icon`, `icon-lg`: Square icon-only variants

**API**:
```typescript
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  size?: "xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"
  asChild?: boolean
}
```

**Maya-Style Specifications**:
- Border Radius: `rounded-lg` (var(--radius) = 0.5rem = 8px)
- Padding: Consistent with size (default: px-3 = 12px horizontal)
- Height: Fixed per size variant for consistency
- Gap: 1.5 spacing units between icon and text (6px)
- Transition: 200ms for all state changes
- Focus Ring: 3px ring with 50% opacity

**Interactive States**:
- **Hover**: Brightness filter or background opacity change
- **Focus**: Visible 3px ring with `focus-visible:ring-ring/50`
- **Active**: Subtle translate-y-px for pressed effect
- **Disabled**: 50% opacity, pointer-events-none

**Accessibility**:
- Minimum 44x44px touch target (enforced by size variants)
- Visible focus indicator for keyboard navigation
- Proper ARIA attributes when used as toggle
- Disabled state prevents interaction

**Implementation Notes**:
- Uses Radix Slot for `asChild` composition
- Data attributes for variant/size tracking
- Icon sizing handled via `[&_svg]` selectors
- Inline icon positioning with `data-icon` attributes

