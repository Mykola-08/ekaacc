# EKA Design System

A comprehensive design system for the EKA mental wellness platform, focusing on accessibility, modern aesthetics, and exceptional user experience.

## 🎨 Design Principles

### Core Principles
- **Accessibility First**: WCAG 2.1 AA compliant with proper ARIA labels, keyboard navigation, and screen reader support
- **Mobile-First**: Responsive design starting from mobile devices up to desktop
- **Modern Aesthetics**: Clean, professional design with subtle animations and micro-interactions
- **Performance**: Optimized for fast loading and smooth interactions
- **Consistency**: Unified design language across all components and pages

### Visual Hierarchy
- Clear typography scale with consistent spacing
- Color system with proper contrast ratios
- Intuitive navigation and information architecture
- Focus indicators for keyboard navigation

## 🎯 Color System

### Primary Colors
```css
--primary: 221 83% 53% /* Modern blue with excellent contrast */
--primary-foreground: 0 0% 100% /* White text on primary */
```

### Semantic Colors
```css
--destructive: 0 84.2% 60.2% /* Error states */
--success: 142 76% 36% /* Success states */
--warning: 45 93% 47% /* Warning states */
```

### Neutral Colors
```css
--background: 0 0% 100% /* Light mode background */
--foreground: 240 10% 3.9% /* Light mode text */
--muted: 240 4.8% 95.9% /* Subtle backgrounds */
--muted-foreground: 240 3.8% 46.1% /* Secondary text */
```

## 📱 Responsive Breakpoints

- **xs**: 475px (Extra small devices)
- **sm**: 640px (Small tablets)
- **md**: 768px (Tablets)
- **lg**: 1024px (Small laptops)
- **xl**: 1280px (Desktop)
- **2xl**: 1536px (Large screens)
- **3xl**: 1920px (Extra large screens)

## 🔄 Animation System

### Timing
- `--animation-duration: 200ms`
- `--animation-easing: cubic-bezier(0.4, 0, 0.2, 1)`

### Animations
- `fade-in`: Smooth opacity and translate transitions
- `slide-up`: Modal and drawer animations
- `scale-in`: Button and interactive element feedback
- `hover-lift`: Card and button hover effects

## 🧩 Component Library

### Buttons
- **Touch-friendly**: Minimum 44px height for accessibility
- **Multiple variants**: Primary, secondary, outline, ghost, destructive
- **Loading states**: Built-in loading indicators
- **Focus management**: Proper focus indicators and ARIA support

```tsx
<Button variant="default" size="lg" aria-label="Sign in to your account">
  Sign In
</Button>
```

### Cards
- **Modern design**: Subtle shadows and hover effects
- **Responsive padding**: Adapts to screen size
- **Interactive**: Hover states with lift effects
- **Accessible**: Proper heading hierarchy

### Forms
- **Input fields**: Touch-friendly with clear focus states
- **Validation**: Real-time feedback with accessible error messages
- **Labels**: Proper association with form controls
- **Keyboard navigation**: Full keyboard support

### Navigation
- **Mobile-first**: Collapsible navigation for small screens
- **Active states**: Clear indication of current location
- **Keyboard support**: Full keyboard navigation
- **Screen reader**: Proper ARIA labels and roles

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Color contrast**: Minimum 4.5:1 ratio for normal text
- **Focus indicators**: Visible focus outlines on all interactive elements
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Proper ARIA labels and roles
- **Touch targets**: Minimum 44px for mobile devices

### ARIA Implementation
- `aria-label` for interactive elements
- `aria-expanded` for collapsible content
- `aria-controls` for element relationships
- `role` attributes for semantic meaning
- `aria-live` for dynamic content updates

## 🌟 Enhanced Features

### Glass Morphism
```css
.glass-effect {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
```

### Gradient Text
```css
.gradient-text {
  @apply bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent;
}
```

### Interactive Elements
```css
.hover-lift {
  @apply transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10;
}
```

### Status Indicators
- Online: Green badge with proper contrast
- Offline: Gray badge for inactive states
- Busy: Yellow badge for warning states

## 📋 Implementation Guidelines

### Component Usage
1. Always use semantic HTML elements
2. Include proper ARIA labels for accessibility
3. Implement responsive design from mobile up
4. Add loading states for async operations
5. Include focus management for keyboard users

### Color Usage
- Use CSS variables for consistency
- Maintain proper contrast ratios
- Test in both light and dark modes
- Consider color blindness accessibility

### Typography
- Use the established type scale
- Maintain consistent line heights
- Ensure readable font sizes on all devices
- Use proper heading hierarchy

### Spacing
- Use the spacing system consistently
- Apply responsive spacing for different screen sizes
- Maintain visual rhythm and balance
- Consider touch-friendly spacing

## 🧪 Testing Checklist

### Accessibility Testing
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content properly
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible
- [ ] Touch targets are adequate size

### Responsive Testing
- [ ] Layout works on mobile devices
- [ ] Typography scales appropriately
- [ ] Touch interactions work properly
- [ ] Navigation adapts to screen size
- [ ] Images and media are responsive

### Performance Testing
- [ ] Animations are smooth
- [ ] Loading states work correctly
- [ ] No layout shifts during loading
- [ ] Images are optimized
- [ ] Code is properly optimized

## 🚀 Future Enhancements

### Planned Improvements
1. **Advanced Animations**: More sophisticated micro-interactions
2. **Theme System**: Enhanced theming with user preferences
3. **Component Library**: Expand component library with more elements
4. **Design Tokens**: Implement comprehensive design token system
5. **User Testing**: Conduct usability testing for continuous improvement

### Technical Roadmap
- Implement CSS custom properties for better theming
- Add support for reduced motion preferences
- Enhance dark mode implementation
- Add support for high contrast modes
- Implement CSS container queries for better responsive design

---

This design system ensures a consistent, accessible, and modern user experience across the entire EKA platform. Regular updates and user feedback will continue to refine and improve the system.