---
name: eka-design
description: Design system, animation, and UX conventions for the EKA platform. Applies when building UI components, layouts, animations, forms, or marketing pages.
user-invocable: false
---

# EKA Platform Design System

## Quick Reference

### Semantic Color Tokens (use these, never raw colors)
- `bg-background`, `bg-card`, `bg-muted`, `bg-popover`
- `text-foreground`, `text-muted-foreground`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-accent`
- `border-border`, `border-input`, `ring-ring`
- `bg-destructive`, `text-destructive`

### Never Do
- Never use `dark:` prefix — theming is handled via CSS variables.
- Never hardcode hex/rgb/hsl values — use semantic tokens.
- Never use `space-x-*`/`space-y-*` — use `flex gap-*`.

### Animation Rules
- **Enter/Exit**: `ease-out` (Quint/Expo curves)
- **Movement**: `ease-in-out` for in-screen movement
- **Hovers**: `200ms` duration
- **Max duration**: <1s for all animations
- **Springs**: Prefer `motion` (Framer Motion) springs for natural feel
- **Performance**: Only animate `transform` / `opacity`
- **`will-change`**: Use sparingly, only when needed

### Component Patterns
- Use `cva` for component variants with `variant` and `size` props.
- Use `cn()` from `@/lib/utils` to merge classes.
- Use `asChild` from Radix for composable triggers.
- Every Dialog/Sheet/Drawer must have a Title (use `sr-only` if visually hidden).

### Form Patterns
- React Hook Form + Zod for validation.
- Use shadcn `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`.
- Validate at boundaries with Zod schemas.

### Detailed specs
- Design system: `docs/design/design-system.md`
- Animations: `docs/design/animations.md` and `docs/design/animation-theory.md`
- Components: `docs/design/component-design.md`
- Forms: `docs/design/forms-controls.md`
- UX principles: `docs/design/ux-principles.md`
- Performance: `docs/design/performance.md`
- Accessibility: `docs/design/touch-accessibility.md`
