# Motion Primitives Integration Guide

## Overview

This document describes the Motion Primitives animation library integration into the EKA Account application. The integration enhances the existing minimalist design with smooth, modern animations while maintaining all current visual styles and functionality.

## Installation

### Dependencies Installed

```bash
npm install motion clsx tailwind-merge lucide-react
```

**Note:** `tailwind-merge` and `lucide-react` were already present in the project.

## Components Created

All Motion Primitives components are located in `src/components/motion-primitives/`.

### 1. TextEffect (`text-effect.tsx`)

Animates text with various preset effects.

**Presets:**

- `fade` - Simple fade in
- `slide` - Slide up with fade
- `scale` - Scale up with fade
- `blur` - Blur to clear
- `fade-in-blur` - Blur fade combined

**Props:**

- `children: string` - Text to animate
- `per?: 'word' | 'char' | 'line'` - Animation granularity (default: 'word')
- `preset?: string` - Animation preset
- `delay?: number` - Delay before animation starts
- `className?: string` - Additional CSS classes

**Example:**

```tsx
<TextEffect preset="fade-in-blur" per="word">
  Welcome to Your Dashboard
</TextEffect>
```

### 2. InView (`in-view.tsx`)

Triggers animations when element scrolls into viewport.

**Props:**

- `children: ReactNode` - Content to animate
- `variants?: object` - Custom animation variants
- `transition?: object` - Transition configuration
- `viewOptions?: object` - Intersection Observer options
- `className?: string` - Additional CSS classes

**Example:**

```tsx
<InView
  variants={{
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  <Card>...</Card>
</InView>
```

### 3. AnimatedNumber (`animated-number.tsx`)

Smoothly animates number changes with spring physics.

**Props:**

- `value: number` - Target number value
- `springOptions?: object` - Spring animation configuration
- `className?: string` - Additional CSS classes

**Example:**

```tsx
<AnimatedNumber value={75} />%
```

### 4. TextLoop (`text-loop.tsx`)

Rotating text carousel effect.

**Props:**

- `children: ReactNode[]` - Array of text elements to loop through
- `interval?: number` - Time between changes (default: 2000ms)
- `className?: string` - Additional CSS classes

**Example:**

```tsx
<TextLoop>
  <span>Feature 1</span>
  <span>Feature 2</span>
  <span>Feature 3</span>
</TextLoop>
```

### 5. AnimatedGroup (`animated-group.tsx`)

Staggered animations for groups of elements.

**Props:**

- `children: ReactNode` - Child elements to animate
- `preset?: 'fade' | 'slide' | 'scale' | 'blur'` - Animation type
- `stagger?: number` - Delay between child animations (default: 0.1)
- `className?: string` - Additional CSS classes

**Example:**

```tsx
<AnimatedGroup preset="fade" stagger={0.15}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AnimatedGroup>
```

### 6. Accordion (`accordion.tsx`)

Animated collapsible sections.

**Components:**

- `Accordion` - Container
- `AccordionItem` - Individual collapsible item
- `AccordionTrigger` - Click target
- `AccordionContent` - Expandable content

**Example:**

```tsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>
      Section content here...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Enhanced Components

### Dashboard Components

#### 1. **stat-card.tsx**

- Wrapped in `InView` for scroll-triggered fade-in
- Uses `AnimatedNumber` for numeric stat values
- Added hover shadow effect

```tsx
<InView
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }}
>
  <Card className="hover:shadow-lg transition-shadow duration-300">
    ...
    <AnimatedNumber value={numericValue} />
    ...
  </Card>
</InView>
```

#### 2. **next-session.tsx**

- Wrapped entire card in `InView` with slide-up animation
- Added `TextEffect` to "No upcoming sessions" text
- Applied hover shadow transition

**Animation Details:**

- Entry: Slide up from y: 30 over 0.6s with easeOut
- Empty state: Scale animation from 0.95 to 1.0
- Hover: Shadow elevation increase

#### 3. **goal-progress.tsx**

- Card wrapped in `InView` for scroll animation
- Title uses `TextEffect` with "fade" preset
- Progress percentages use `AnimatedNumber`
- Milestones wrapped in `AnimatedGroup` for staggered reveal

**Animation Details:**

- Entry: Slide up from y: 30 over 0.6s
- Milestones: Fade in with 0.1s stagger between items
- Progress numbers: Smooth spring animation

### Settings Components

#### 1. **settings-header.tsx**

- Title animates with `TextEffect` using "fade-in-blur" preset
- Description uses delayed "fade" preset

```tsx
<h2>
  <TextEffect preset="fade-in-blur" per="word">
    {title}
  </TextEffect>
</h2>
{description && (
  <p>
    <TextEffect preset="fade" delay={0.2}>
      {description}
    </TextEffect>
  </p>
)}
```

#### 2. **settings-card.tsx**

- Entire card wrapped in `InView` with blur effect
- Hover shadow transition added

```tsx
<InView
  variants={{
    hidden: { opacity: 0, filter: 'blur(4px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  }}
>
  <Card className="hover:shadow-md transition-shadow duration-300">
    ...
  </Card>
</InView>
```

## Design Principles

### 1. **Preserve Existing Design**

- All animations wrap existing components
- No changes to colors, spacing, or layouts
- Maintains minimalist light theme aesthetic

### 2. **Subtle and Professional**

- Animation durations: 0.5-0.6s (not too fast, not too slow)
- Easing: `easeOut` for natural deceleration
- Movement: Small distances (20-30px) for subtlety

### 3. **Performance Optimized**

- Uses native Motion (Framer Motion) for GPU-accelerated animations
- Intersection Observer for scroll-triggered animations (efficient)
- Spring physics for smooth, natural number animations

### 4. **Consistent Patterns**

- **Scroll animations**: Use `InView` with slide-up (y: 20-30)
- **Text animations**: Use `TextEffect` with "fade" or "fade-in-blur"
- **Numbers**: Use `AnimatedNumber` with default spring settings
- **Hover effects**: Combine with Tailwind's `transition-shadow`

## Usage Patterns

### Pattern 1: Card with Scroll Animation

```tsx
<InView
  variants={{
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  <Card className="hover:shadow-lg transition-shadow duration-300">
    {/* Card content */}
  </Card>
</InView>
```

### Pattern 2: Animated Heading

```tsx
<h1>
  <TextEffect preset="fade-in-blur" per="word">
    Your Dashboard Title
  </TextEffect>
</h1>
```

### Pattern 3: Animated Stat with Number

```tsx
<div className="text-3xl font-bold">
  <AnimatedNumber value={75} />%
</div>
```

### Pattern 4: Staggered List Items

```tsx
<AnimatedGroup preset="fade" stagger={0.1}>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</AnimatedGroup>
```

## Future Enhancements

### Additional Components to Create

Based on the Motion Primitives library, consider adding:

1. **Carousel** - Image/content sliders
2. **Dialog** - Animated modal dialogs
3. **Disclosure** - Expandable sections (similar to Accordion)
4. **Magnetic** - Elements that follow cursor
5. **Dock** - macOS-style dock menu
6. **Wavy Text** - Wave animation for text
7. **Blur Fade** - Advanced blur transitions

### Additional Components to Enhance

**High Priority:**

- Login/Signup page components
- Onboarding flow steps
- Journal entry cards
- Report visualizations
- Community posts

**Medium Priority:**

- Admin dashboard tables
- User profile cards
- Therapist booking calendar
- Payment forms

**Low Priority:**

- Error pages
- Loading states
- Toast notifications

## Best Practices

### 1. **Import Efficiently**

```tsx
// ✅ Good - Import only what you need
import { InView, TextEffect } from '@/components/motion-primitives';

// ❌ Avoid - Importing entire library
import * as MotionPrimitives from '@/components/motion-primitives';
```

### 2. **Accessibility**

- Animations respect `prefers-reduced-motion`
- All animated components maintain semantic HTML
- Keyboard navigation unaffected by animations

### 3. **Performance**

- Avoid animating too many elements simultaneously
- Use `InView` for off-screen content (lazy animation)
- Keep animation durations reasonable (0.3-0.8s)

### 4. **Consistency**

- Reuse the same variants across similar components
- Maintain consistent timing (duration, delay, stagger)
- Follow established patterns for predictability

## Testing

### Manual Testing Checklist

- [ ] Animations trigger on scroll
- [ ] Numbers count up smoothly
- [ ] Text reveals word-by-word correctly
- [ ] Hover effects work on cards
- [ ] No layout shifts during animations
- [ ] Smooth performance on low-end devices
- [ ] Works with `prefers-reduced-motion` enabled

### Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Issue: Animations not triggering

**Solution:** Ensure component is wrapped in `InView` and check viewport options.

### Issue: Numbers not animating

**Solution:** Verify `value` prop is a number, not a string. Parse if needed.

### Issue: Layout shifts during animation

**Solution:** Set fixed heights/widths or use `min-height` to reserve space.

### Issue: Performance issues

**Solution:** Reduce number of simultaneous animations, increase stagger delay.

## Migration Guide

### Converting Existing Components

**Before:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl">75%</div>
  </CardContent>
</Card>
```

**After:**

```tsx
<InView
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }}
  transition={{ duration: 0.6 }}
>
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle>
        <TextEffect preset="fade">Dashboard</TextEffect>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl">
        <AnimatedNumber value={75} />%
      </div>
    </CardContent>
  </Card>
</InView>
```

## Conclusion

The Motion Primitives integration enhances the EKA Account application with professional, subtle animations while maintaining the existing minimalist design aesthetic. All animations are performant, accessible, and consistent with modern UX best practices.

For questions or issues, refer to:

- Motion (Framer Motion) documentation: <https://motion.dev>
- Motion Primitives source: <https://github.com/ibelick/motion-primitives>
