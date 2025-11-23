# shadcn UI Guide

## Philosophy
Components are: accessible, headless Radix primitives + Tailwind styling + variant-driven props. Keep logic lean; compose rather than extend deeply.

## Current Components
- `components/ui/button.tsx` – action triggers
- `components/ui/dialog.tsx` – modal container
- `components/ui/input.tsx` – form field
- `components/ui/form.tsx` – hook-form integration
- `components/ui/calendar.tsx` – date selection

## Patterns
1. Export a single component with optional `variant` and `size` props.
2. Use `cn()` to merge class names.
3. Keep styling tokens centralized in Tailwind config.
4. When adding new components, mirror structure (props interface + forwardRef + variants).

## Example Variant Addition
```tsx
// button.tsx snippet
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input bg-transparent hover:bg-accent',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);
```

## Accessibility
Always provide `aria-label` or descriptive text for icon-only buttons. Ensure dialogs have focus trap & keyboard closing (Radix handles this; verify labels).

## Theming
Use Tailwind config to define color palette `primary`, `accent`, etc. Avoid hard-coded hex in components.

## Testing Components
Prefer unit tests for logic (conditional classes) and integration tests for focus handling & keyboard navigation in complex components.

## Performance Tips
Lazy-load heavy components (calendar) if not immediately visible. Favor CSS transitions over JS animation for slot changes.
