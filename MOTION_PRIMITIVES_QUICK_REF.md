# Motion Primitives Quick Reference

## Quick Component Import

```tsx
import { InView, TextEffect, AnimatedNumber, AnimatedGroup } from '@/components/motion-primitives';
```

## Common Patterns

### 1. Animate Card on Scroll

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

### 2. Animate Title/Heading

```tsx
<h1>
  <TextEffect preset="fade-in-blur" per="word">
    Your Page Title
  </TextEffect>
</h1>
```

### 3. Animate Description Text

```tsx
<p>
  <TextEffect preset="fade" delay={0.2}>
    Your description text here
  </TextEffect>
</p>
```

### 4. Animate Numbers/Stats

```tsx
<div className="text-3xl font-bold">
  <AnimatedNumber value={75} />%
</div>
```

### 5. Staggered List Animation

```tsx
<AnimatedGroup preset="fade" stagger={0.1}>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</AnimatedGroup>
```

## TextEffect Presets

- `fade` - Simple fade in
- `slide` - Slide up with fade
- `scale` - Scale up with fade
- `blur` - Blur to clear
- `fade-in-blur` - Combined blur and fade

## Common Variants

### Slide Up

```tsx
variants={{
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}}
```

### Fade Only

```tsx
variants={{
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}}
```

### Scale In

```tsx
variants={{
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}}
```

### Blur Fade

```tsx
variants={{
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: { opacity: 1, filter: 'blur(0px)' },
}}
```

## Enhanced Components Summary

✅ **stat-card.tsx** - InView + AnimatedNumber + hover shadow
✅ **settings-header.tsx** - TextEffect for title and description
✅ **settings-card.tsx** - InView with blur effect + hover shadow
✅ **next-session.tsx** - InView slide-up + TextEffect for empty state
✅ **goal-progress.tsx** - InView + TextEffect + AnimatedNumber + AnimatedGroup

## Standard Timings

- Duration: `0.6s` (scroll animations)
- Delay: `0.2s` (secondary elements)
- Stagger: `0.1s` (group items)
- Ease: `easeOut` (natural deceleration)

## Hover Effects

```tsx
className="hover:shadow-lg transition-shadow duration-300"
```
