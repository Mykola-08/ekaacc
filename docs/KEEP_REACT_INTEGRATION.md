# Keep React UI Integration Guide

## Overview

Keep React has been successfully integrated into the EKA Account application. Keep React is a modern, open-source component library built with React and Tailwind CSS, providing beautiful, accessible components out of the box.

## Installation

Keep React and its dependencies have been installed:
```bash
npm install keep-react phosphor-react
```

## Configuration

### 1. Tailwind Configuration
The `tailwind.config.ts` has been updated to include Keep React:

```typescript
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/keep-react/**/*.{js,jsx,ts,tsx}', // Added for Keep React
  ],
  presets: [require('keep-react/preset')], // Added for Keep React
  // ... rest of config
}
```

### 2. Component Structure
Keep React components are available at:
- **Direct import**: `import { Button } from 'keep-react'`
- **Alias import**: `import { Button } from '@/components/keep'`

## Available Components

Keep React provides 40+ production-ready components:

### Form Components
- `Button` & `ButtonGroup` - Action buttons with variants
- `Input` & `InputIcon` - Text inputs
- `Checkbox` - Checkbox inputs
- `Radio` & `RadioGroup` - Radio buttons
- `Switch` - Toggle switches
- `Select` - Dropdown selections
- `Textarea` - Multi-line text input
- `Label` - Form labels
- `DatePicker` - Date selection
- `InputOTP` - OTP input fields
- `NumberInput` - Number inputs with steppers
- `Upload` - File upload components

### Layout Components
- `Card` - Content containers
- `Accordion` - Collapsible content
- `Tabs` - Tabbed interfaces
- `Divider` - Visual separators
- `Sidebar` - Navigation sidebars
- `Navbar` - Navigation bars
- `Breadcrumb` - Breadcrumb navigation
- `Steps` - Step indicators

### Data Display
- `Table` - Data tables
- `Badge` - Status badges
- `Avatar` - User avatars
- `Timeline` - Event timelines
- `Empty` - Empty states
- `Rating` - Star ratings
- `Charts` - Data visualization

### Feedback Components
- `Modal` & `Drawer` - Dialogs
- `Notification` - Alerts and notifications
- `Toast` - Toast notifications
- `Progress` - Progress bars
- `Spinner` - Loading spinners
- `Skeleton` - Loading skeletons
- `Alert` - Alert messages

### Utility Components
- `Dropdown` - Dropdown menus
- `Popover` - Popovers
- `Tooltip` - Tooltips
- `Pagination` - Page navigation
- `Slider` - Range sliders
- `Carousel` - Image carousels

## Usage Examples

### Basic Button
```tsx
import { Button } from '@/components/keep';

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="softBg">Soft Background</Button>
```

### Card Component
```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/keep';

<Card>
  <CardHeader>
    <CardTitle>Session Details</CardTitle>
    <CardDescription>Your upcoming therapy session</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Session with Dr. Smith at 2:00 PM</p>
  </CardContent>
</Card>
```

### Form with Input
```tsx
import { Input, Label, Button } from '@/components/keep';

<div className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input 
      id="email" 
      type="email" 
      placeholder="your@email.com" 
    />
  </div>
  <Button>Submit</Button>
</div>
```

### Modal Dialog
```tsx
import { 
  Modal, 
  ModalAction, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalFooter 
} from '@/components/keep';
import { Button } from '@/components/keep';

<Modal>
  <ModalAction asChild>
    <Button>Open Modal</Button>
  </ModalAction>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
      <ModalDescription>
        Are you sure you want to proceed?
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Data Table
```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/keep';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Session 1</TableCell>
      <TableCell>Completed</TableCell>
      <TableCell>€50.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Tabs
```tsx
import { Tabs, TabsList, TabsItem, TabsContent } from '@/components/keep';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsItem value="overview">Overview</TabsItem>
    <TabsItem value="sessions">Sessions</TabsItem>
    <TabsItem value="settings">Settings</TabsItem>
  </TabsList>
  <TabsContent value="overview">
    Overview content here
  </TabsContent>
  <TabsContent value="sessions">
    Sessions content here
  </TabsContent>
  <TabsContent value="settings">
    Settings content here
  </TabsContent>
</Tabs>
```

## Keep React vs Existing Radix UI Components

Your project already uses Radix UI with custom styling. Keep React is built on top of Radix UI primitives but provides:

1. **Pre-styled components** - No need to write custom styles
2. **Consistent design system** - Built-in design tokens
3. **Additional components** - More components than raw Radix UI
4. **Better accessibility** - Enhanced ARIA patterns
5. **Phosphor Icons** - Beautiful icon library included

### Migration Strategy

You can use Keep React alongside your existing Radix UI components:

1. **Keep existing components** - No need to replace working code
2. **Use Keep React for new features** - Faster development
3. **Gradual migration** - Replace components as needed
4. **Import with aliases** - Avoid naming conflicts

Example of using both:
```tsx
// Existing Radix UI component
import { Button as RadixButton } from '@/components/ui/button';

// New Keep React component
import { Card } from '@/components/keep';

<Card>
  <RadixButton>Click me</RadixButton>
</Card>
```

## Styling and Theming

Keep React works seamlessly with your existing Tailwind setup:

### Using Tailwind Classes
```tsx
<Button className="w-full mt-4">Full Width Button</Button>
```

### Custom Colors
```tsx
<Badge className="bg-green-500 text-white">Success</Badge>
```

### Dark Mode
Keep React respects the `dark` class on the root element (already configured in your project):

```tsx
// Automatically adapts to dark mode
<Card>Content</Card>
```

## Icons (Phosphor React)

Keep React uses Phosphor Icons. Import them directly:

```tsx
import { Heart, Star, User, Calendar } from 'phosphor-react';

<Button>
  <Heart size={20} />
  Favorite
</Button>
```

## Best Practices

1. **Import from alias** - Use `@/components/keep` for consistency
2. **Use semantic HTML** - Keep React components are accessible by default
3. **Combine with Tailwind** - Use utility classes for custom styling
4. **Check documentation** - Visit https://react.keepdesign.io/ for full API
5. **TypeScript support** - All components are fully typed

## Common Patterns in EKA Account

### Session Card
```tsx
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/keep';

<Card>
  <CardHeader>
    <CardTitle>Therapy Session</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p>Dr. Smith - Individual Therapy</p>
      <Badge>Confirmed</Badge>
    </div>
  </CardContent>
</Card>
```

### Wallet Balance Display
```tsx
import { Card, CardContent, Button } from '@/components/keep';

<Card>
  <CardContent className="text-center py-8">
    <p className="text-4xl font-bold">€{balance.toFixed(2)}</p>
    <Button className="mt-4">Add Funds</Button>
  </CardContent>
</Card>
```

### Settings Form
```tsx
import { Label, Input, Switch, Button } from '@/components/keep';

<form className="space-y-4">
  <div>
    <Label htmlFor="name">Name</Label>
    <Input id="name" defaultValue={user.name} />
  </div>
  <div className="flex items-center gap-2">
    <Switch id="notifications" />
    <Label htmlFor="notifications">Enable notifications</Label>
  </div>
  <Button type="submit">Save Changes</Button>
</form>
```

## Resources

- **Official Documentation**: https://react.keepdesign.io/
- **GitHub**: https://github.com/StaticMania/keep-react
- **Phosphor Icons**: https://phosphoricons.com/
- **Component Playground**: Check `src/components/keep/KeepReactDemo.tsx`

## Troubleshooting

### Component not found
Ensure the import is correct:
```tsx
// ✅ Correct
import { Button } from 'keep-react';
import { Button } from '@/components/keep';

// ❌ Wrong
import { Button } from 'keep-react/Button';
```

### Styling conflicts
Use Tailwind's `cn()` utility to merge classes:
```tsx
import { cn } from '@/lib/utils';

<Button className={cn("custom-class", className)}>
  Click me
</Button>
```

### TypeScript errors
Ensure `keep-react` types are installed (included in the package).

## Next Steps

1. Explore the demo page: Create a route for `KeepReactDemo.tsx`
2. Start using Keep React in new features
3. Gradually migrate existing components as needed
4. Customize the design system in `tailwind.config.ts`
5. Check official docs for advanced usage patterns
