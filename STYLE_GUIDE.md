# EKA Account Design Style Guide

## Design Principles

Based on the homepage and login page design, this guide ensures consistent styling across all pages.

### Core Design Patterns

#### 1. Layout Structure
```tsx
<div className="min-h-screen bg-background">
  <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</div>
```

#### 2. Page Headers
```tsx
<div className="text-center space-y-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Badge variant="secondary" className="mb-4">
      <Icon className="w-3 h-3 mr-1" />
      Badge Text
    </Badge>
  </motion.div>
  
  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
    Main Title
    <span className="block text-primary">Highlighted Text</span>
  </h1>
  
  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
    Description text
  </p>
</div>
```

#### 3. Feature Cards (Grid Layout)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {features.map((feature, index) => (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="border-muted hover:border-border transition-all duration-300">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
            <feature.icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{feature.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

#### 4. Buttons
```tsx
// Primary button
<Button asChild size="lg">
  <Link href="/path">Button Text</Link>
</Button>

// Secondary/Outline button
<Button asChild variant="outline" size="lg">
  <Link href="/path">Button Text</Link>
</Button>
```

#### 5. Forms
```tsx
<Card className="overflow-hidden">
  <CardContent className="grid p-0 md:grid-cols-2">
    <form className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="field">Label</Label>
          <Input id="field" type="text" placeholder="Placeholder" />
        </div>
        <Button type="submit" className="w-full">Submit</Button>
      </div>
    </form>
    <div className="relative hidden bg-muted md:block">
      <Image src="/image.jpg" alt="Alt" fill className="object-cover" />
    </div>
  </CardContent>
</Card>
```

### Color Palette
- **Background**: `bg-background` - Clean white/dark background
- **Foreground**: `text-foreground` - Main text color
- **Primary**: `text-primary` or `bg-primary` - Blue accent color
- **Secondary**: `bg-secondary` - Light gray backgrounds
- **Muted**: `text-muted-foreground` - Subdued text
- **Border**: `border-muted` - Subtle borders

### Typography
- **Page Title**: `text-4xl sm:text-6xl font-bold tracking-tight`
- **Section Title**: `text-3xl sm:text-4xl font-bold`
- **Card Title**: `text-2xl font-bold` or `text-xl font-semibold`
- **Body Text**: `text-xl` for descriptions, `text-base` for content
- **Muted Text**: `text-muted-foreground`

### Spacing
- **Container Padding**: `py-16 px-4 sm:px-6 lg:px-8`
- **Section Spacing**: `space-y-8` or `space-y-12`
- **Card Padding**: `p-6 md:p-8`
- **Gap Between Elements**: `gap-4`, `gap-6`, or `gap-8`

### Animations
Use Framer Motion for smooth animations:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1 }}
>
  {/* Content */}
</motion.div>
```

### Responsive Design
- Mobile: Single column layouts
- Tablet (md): 2 columns
- Desktop (lg): 3-4 columns
- Use `sm:`, `md:`, `lg:` breakpoints consistently

## Application Guidelines

1. **Always use** `bg-background` for page backgrounds
2. **Always wrap** content in `max-w-7xl mx-auto` container
3. **Add animations** to important sections using Framer Motion
4. **Use Cards** for grouped content with `Card`, `CardHeader`, `CardTitle`, `CardContent`
5. **Keep it clean** - lots of whitespace, minimal borders
6. **Icons** should be from `lucide-react` at 16px or 24px sizes
7. **Transitions** use `transition-all duration-300` for hover effects
8. **Consistent spacing** with Tailwind's spacing scale

## Component Usage

### Cards
- Use `Card` component from `@/components/ui/card`
- Add hover effects: `hover:border-border transition-all duration-300`
- Keep borders subtle: `border-muted`

### Buttons  
- Primary actions: `<Button>` (default variant)
- Secondary actions: `<Button variant="outline">`
- Size: `size="lg"` for prominent actions

### Forms
- Use `Label` from `@/components/ui/label`
- Use `Input` from `@/components/ui/input`
- Group with `grid gap-2` or `space-y-2`

### Badges
- Use `Badge variant="secondary"` for tags
- Include icons when appropriate

This style guide should be applied to ALL pages in the application to maintain visual consistency.
