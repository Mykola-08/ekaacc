# Universal UI / Motion Design Prompt

## (Apple-like · shadcn base · Hugeicons · Motion · pre-Liquid-Glass)

Design a modern, premium web interface inspired by Apple’s pre-Liquid-Glass
design language (macOS Big Sur → early Sonoma). The design must feel calm,
precise, and expensive, never playful or noisy.

### Core Style

- Base UI philosophy: **shadcn/ui minimalism**
- Clean layout, generous spacing, strong visual hierarchy
- Rounded corners (12–20px), soft borders, subtle elevation
- No sharp contrasts, no heavy gradients, no glass overload
- Visual weight is balanced and intentional

### Typography

- System-like modern sans-serif
- Clear hierarchy: large headings, relaxed body text
- Comfortable line height, readable at all sizes
- No decorative fonts

### Color System

- Neutral base: off-white, soft gray, deep charcoal
- One primary accent color (Apple-style blue)
- Optional secondary accent (muted yellow), used rarely
- No neon, no saturated gradients
- Dark mode is calm, low-contrast, elegant

### Icons

- Icon library: **Hugeicons**
- Icons are large, clean, and confident
- Standard size: 24–28px
- Feature / hero icons: 40–56px
- Icons are monochrome by default
- Accent color appears only on hover or active state

### Layout & Components

- Card-based structure with soft depth
- Buttons are solid, simple, and tactile
- Inputs and controls feel native and precise
- Navigation is clear, centered, and uncluttered
- UI feels “engineered”, not decorative

### Spring Motion Rules (Motion / Framer-style)

- **Default all transitions to spring**, not tween.
- Use springs for:
  - page enter/exit
  - card hover + press
  - drawers, dialogs, popovers
  - layout reflow, expanding sections, accordions
  - list items appearing (with stagger)

**Spring feel:**

- **Snappy, controlled, premium** (no wobble, no rubber band).
- Overshoot: minimal.
- Never bouncy like games.

**Suggested spring ranges (don’t expose numbers in UI unless needed):**

- **Stiffness:** medium-high
- **Damping:** medium-high
- **Mass:** low
- **Bounce:** near-zero
- **Duration target:** ~200–450ms depending on component size

**Interaction rules:**

- Hover: small lift + slight scale via spring
- Press: quick compression via spring
- Open/close: fade + scale 0.98→1 with spring
- Layout transitions: always smooth spring, no jumps

**Accessibility:**

- Respect `prefers-reduced-motion`: disable transforms, keep only opacity.

### Overall Feel

- Premium, modern, and timeless
- Inspired by Apple UI, not copying it
- Feels like a professional internal Apple tool
- Calm confidence, no visual noise
- Designed for focus, not distraction

### Explicitly Avoid

- Over-glassmorphism
- Heavy shadows
- Loud gradients
- Cartoonish icons
- Over-animated UI
- “Startup landing page” clichés
