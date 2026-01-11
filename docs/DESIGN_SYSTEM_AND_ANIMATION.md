# Design System & Animation Guidelines

## 1. Core Principles
Derived from "Great Animations" and Apple Design System principles.

### A. Motion Physics
- **Fast but Comfortable**: Animations must be snappy (<300ms) but use natural easing.
- **Spring Physics**: Use `iosSpring` (`stiffness: 400`, `damping: 30`) for layout changes and scale effects.
- **Interruptible**: Animations should support user interruption (Framer Motion allows this by default).

### B. Morphing & Continuity
- **Origin-Aware**: Interaction transitions (modals, dropdowns) must originate from the trigger element.
  - *Implementation*: Use `layoutId` in Framer Motion or `transform-origin` in CSS.
- **Shared Layout**: Elements should "morph" between states (e.g., a list item expanding into a card) using `layoutId`.

### C. Visual Hierarchy (The "Apple" Look)
- **Theme 1 (Mainstream)**:
  - **Backgrounds**: `bg-slate-50` (light grey) and `bg-white`.
  - **Glassmorphism**: `bg-white/70`, `backdrop-blur-xl`, `border-white/40`.
  - **Shadows**: `appleShadow` (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`).
  - **Accents**: "Apple Blue" (`#007AFF` / `blue-600`) for primary actions.
  - **Typography**: Clean sans-serif, high contrast (`slate-900` headings, `slate-500` body).

- **Theme 2 (Premium Services)**:
  - Used *only* for Premium Services selection.
  - **Aesthetic**: High contrast, "Sheet" style.
  - **Backgrounds**: Darker or heavily blurred glass over dark backgrounds (if in dark mode) or distinct "Passbook" style cards.
  - **Motion**: Slower, more deliberate springs (`stiffness: 300`, `damping: 35`).

## 2. Animation Utilities (`ui-utils.ts`)

```typescript
export const iosSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

export const glassEffect = "bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm";

export const appleShadow = "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300";

// For Premium Cards
export const premiumCardEffect = "bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-[0_20px_50px_rgb(0,0,0,0.2)]";
```

## 3. Implementation Guidelines

### Buttons & Triggers
- **Click Effect**: Scale down slightly (`scale: 0.98`) on tap/click.
- **Origin**: If opening a modal, the modal should expand *from* the button's center or position.

### Navigation
- **Sidebar**: Standard entry/exit (not origin-aware to avoid dizziness).
- **Page Transitions**: Subtle fade + slight Y-axis movement.

### Legal Pages
- Must look "comfortable" (good reading width, `prose-slate`, clear typography) but use the same clean animation entrance.

## 4. Updates Required
1. **Shared UI**: Centralize `ui-utils`.
2. **Booking App**: Apply `ClientDashboard` morphing.
3. **SEO Website**: Apply to Wallet and Landing pages.
4. **Legal**: Modernize layout.
