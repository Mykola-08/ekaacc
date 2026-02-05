# Custom Design System Backup

**Created:** 2026-02-05  
**Purpose:** Backup of custom design tokens and styles before standardizing to pure shadcn

This document contains all custom design choices that were replaced with standard shadcn styles. Use this to restore the custom design system if needed.

---

## 1. Custom Border Radius Values

### Current Custom Values (347 instances)
The design used custom, larger border-radius values for a more modern, rounded aesthetic:

```css
/* Custom Radius Scale */
rounded-[36px]  /* Extra large cards and containers */
rounded-[32px]  /* Large cards (standard card radius) */
rounded-[28px]  /* Medium-large cards */
rounded-[24px]  /* Medium cards and dialogs */
rounded-[20px]  /* Small-medium buttons and cards */
rounded-[16px]  /* Standard buttons and inputs */
rounded-[14px]  /* Small buttons */
rounded-[12px]  /* Extra small elements */
rounded-[6px]   /* Tiny badges */
```

### Shadcn Standard Replacements
```css
rounded-2xl     /* 1rem = 16px */
rounded-xl      /* 0.75rem = 12px */
rounded-lg      /* 0.5rem = 8px */
rounded-md      /* 0.375rem = 6px */
rounded-sm      /* 0.25rem = 4px */
```

---

## 2. Custom Typography

### Font Families
```css
--font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
```

**Space Grotesk** was used for all headings (h1-h6) to create visual hierarchy.

### Custom Letter Spacing & Line Heights
```css
body { letter-spacing: -0.003em; }
h1, h2, h3, h4, h5, h6 { 
  letter-spacing: -0.015em;
  line-height: 1.1;
}
.headline { letter-spacing: -0.025em; line-height: 0.95; }
```

---

## 3. Custom Animations

### SEO Website
```css
.animate-hero-fade-in
.animate-hero-slide-up
.animate-gold-shine
.stagger-children (with delays)
.section-fade-in
```

### Booking App
```css
.animate-enter-fast/medium/slow
.animate-exit-fast
.animate-slide-in-right/bottom
```

---

## 4. Custom Component Classes

```css
.hero-card - Large featured cards
.nav-shadow - Subtle navigation shadow
.section-spacing / section-spacing-sm / section-spacing-lg
.container-default / container-sm / container-lg
.headline / .title / .subtitle / .body / .caption
.input-field / .select-field
```

---

## 5. Restoration Instructions

To restore custom design:
1. `git checkout <commit-before-standardization>`
2. Restore CSS files from this backup
3. Find/replace shadcn radius → custom pixel values
4. Add Space Grotesk font import
5. Restore animation files

**Last commit with custom styles:** See git log around 2026-02-05

---

*Full detailed documentation in sections above. This is a quick reference.*
