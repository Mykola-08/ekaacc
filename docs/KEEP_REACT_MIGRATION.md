# Migrating from Radix UI to Keep React

## Overview

This guide helps you migrate existing Radix UI components to Keep React components in the EKA Account application. Keep React is built on Radix UI primitives, so the migration is straightforward.

## Why Migrate?

- ✅ **Pre-styled components** - Less custom CSS to maintain
- ✅ **Consistent design** - Built-in design system
- ✅ **Faster development** - Ready-to-use components
- ✅ **Better documentation** - Comprehensive examples
- ✅ **Same accessibility** - Built on Radix UI primitives

## Button Component

### Before (Radix UI)
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

### After (Keep React)
```tsx
import { Button } from '@/components/keep';

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="softBg">Soft Background</Button>
// Note: Keep React doesn't have "ghost" or "destructive" variants
// Use custom className instead
<Button className="text-red-500">Destructive</Button>
```

## Card Component

### Before (Radix UI)
```tsx
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    Footer
  </CardFooter>
</Card>
```

### After (Keep React)
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/keep';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
    {/* Note: Keep React doesn't have CardFooter */}
    {/* Add footer content directly in CardContent */}
    <div className="mt-4 flex justify-end gap-2">
      <Button>Action</Button>
    </div>
  </CardContent>
</Card>
```

## Input Component

### Before (Radix UI)
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Email" />
</div>
```

### After (Keep React)
```tsx
import { Input, Label } from '@/components/keep';

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Email" />
</div>
// Same API - no changes needed!
```

## Dialog/Modal Component

### Before (Radix UI)
```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div>Content</div>
  </DialogContent>
</Dialog>
```

### After (Keep React)
```tsx
import {
  Modal,
  ModalAction,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/keep';

<Modal>
  <ModalAction asChild>
    <Button>Open</Button>
  </ModalAction>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
      <ModalDescription>Description</ModalDescription>
    </ModalHeader>
    <div>Content</div>
  </ModalContent>
</Modal>
```

## Checkbox Component

### Before (Radix UI)
```tsx
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

### After (Keep React)
```tsx
import { Checkbox, Label } from '@/components/keep';

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
// Same API - no changes needed!
```

## Switch Component

### Before (Radix UI)
```tsx
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

### After (Keep React)
```tsx
import { Switch, Label } from '@/components/keep';

<div className="flex items-center gap-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
// Same API - no changes needed!
```

## Tabs Component

### Before (Radix UI)
```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

### After (Keep React)
```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsItem,
} from '@/components/keep';

<Tabs defaultValue="account">
  <TabsList>
    <TabsItem value="account">Account</TabsItem>
    <TabsItem value="password">Password</TabsItem>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
// Note: TabsTrigger is now TabsItem
```

## Table Component

### Before (Radix UI)
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### After (Keep React)
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/keep';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
    </TableRow>
  </TableBody>
</Table>
// Same API - no changes needed!
```

## Select Component

### Before (Radix UI)
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>
```

### After (Keep React)
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/keep';

<Select>
  <SelectValue placeholder="Select" />
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>
// Note: No SelectTrigger wrapper needed
```

## Migration Strategy

### Phase 1: New Components (Recommended)
Use Keep React for all new features and components you build.

```tsx
// ✅ For new features
import { Button, Card, Input } from '@/components/keep';
```

### Phase 2: High-Impact Pages
Migrate pages that users interact with most:
1. Dashboard
2. Session booking
3. Settings pages
4. Wallet/payment pages

### Phase 3: Gradual Migration
Migrate remaining components over time as you make updates.

### Phase 4: Cleanup
Once migration is complete, remove unused Radix UI components from `src/components/ui/`.

## Coexistence Pattern

You can use both libraries simultaneously:

```tsx
// Import with different names to avoid conflicts
import { Button as RadixButton } from '@/components/ui/button';
import { Button as KeepButton } from '@/components/keep';

export default function MyComponent() {
  return (
    <div>
      <RadixButton>Old Button</RadixButton>
      <KeepButton>New Button</KeepButton>
    </div>
  );
}
```

## Common Pitfalls

### 1. Different Variant Names
Keep React uses different variant names than your custom Radix components:
- `ghost` → Use `variant="softBg"` or custom className
- `destructive` → Use custom className with red colors

### 2. Missing CardFooter
Keep React Cards don't have a separate footer component. Add footer content in CardContent.

### 3. TabsTrigger vs TabsItem
Keep React uses `TabsItem` instead of `TabsTrigger`.

### 4. No SelectTrigger
Keep React Select doesn't need a separate trigger wrapper.

## Testing After Migration

After migrating a component:

1. **Visual Check**: Verify styling looks correct
2. **Functionality**: Test all interactions (clicks, inputs, etc.)
3. **Accessibility**: Verify keyboard navigation and screen readers
4. **Dark Mode**: Check dark mode compatibility
5. **Responsive**: Test on mobile and desktop

## Rollback Plan

If issues arise, you can easily rollback:

```tsx
// Temporarily switch back to Radix
import { Button } from '@/components/ui/button'; // Old
// import { Button } from '@/components/keep'; // New
```

## Getting Help

- **Keep React Docs**: https://react.keepdesign.io/
- **Examples**: `src/components/keep/KeepReactExamples.tsx`
- **Quick Reference**: `docs/KEEP_REACT_QUICK_REF.md`
- **Full Guide**: `docs/KEEP_REACT_INTEGRATION.md`
