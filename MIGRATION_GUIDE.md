# Component Migration Guide: keep-react → shadcn

This guide outlines the migration from keep-react components to shadcn/ui components.

## Why Migrate?

1. **Consistency**: Shadcn/ui provides a more consistent design system
2. **Customization**: Better customization options through Tailwind CSS
3. **Type Safety**: Better TypeScript support
4. **Modern**: More actively maintained and modern approach
5. **Bundle Size**: Smaller bundle size through tree-shaking

## Component Mapping

### Core Components

| keep-react | shadcn/ui | Notes |
|------------|-----------|-------|
| `Button` | `Button` from `@/components/ui/button` | Direct replacement |
| `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` | Same from `@/components/ui/card` | Direct replacement |
| `Badge` | `Badge` from `@/components/ui/badge` | Direct replacement |
| `Avatar`, `AvatarFallback`, `AvatarImage` | Same from `@/components/ui/avatar` | Direct replacement |
| `Input` | `Input` from `@/components/ui/input` | Direct replacement |
| `Label` | `Label` from `@/components/ui/label` | Direct replacement |
| `Textarea` | `Textarea` from `@/components/ui/textarea` | Direct replacement |
| `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` | Same from `@/components/ui/select` | Direct replacement |
| `Switch` | `Switch` from `@/components/ui/switch` | Direct replacement |
| `Checkbox` | `Checkbox` from `@/components/ui/checkbox` | Direct replacement |
| `Alert`, `AlertDescription`, `AlertTitle` | Same from `@/components/ui/alert` | Direct replacement |
| `Tabs`, `TabsContent`, `TabsList`, `TabsItem` | `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` from `@/components/ui/tabs` | Note: `TabsItem` → `TabsTrigger` |
| `Modal`, `ModalContent`, `ModalDescription`, `ModalHeader`, `ModalTitle`, `ModalFooter` | `Dialog`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogTitle`, `DialogFooter` from `@/components/ui/dialog` | Note: Modal → Dialog |
| `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` | Same from `@/components/ui/tooltip` | Direct replacement |
| `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow` | Same from `@/components/ui/table` | Direct replacement |
| `Skeleton` | `Skeleton` from `@/components/ui/skeleton` | Direct replacement |
| `Notification`, `NotificationTitle`, `NotificationDescription` | Use `Toaster` and `useToast` from `@/components/ui/toast` or `sonner` | Different API |
| `Divider` | `Separator` from `@/components/ui/separator` | Name change |
| `LineProgress` | `Progress` from `@/components/ui/progress` | Name change |

### Migration Examples

#### Before (keep-react)
```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/keep';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

#### After (shadcn)
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Modal → Dialog Migration

#### Before
```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/keep';

<Modal>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
      <ModalDescription>Description</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button>Action</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

#### After
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tabs Migration

#### Before
```tsx
import { Tabs, TabsContent, TabsList, TabsItem } from '@/components/keep';

<Tabs>
  <TabsList>
    <TabsItem value="tab1">Tab 1</TabsItem>
    <TabsItem value="tab2">Tab 2</TabsItem>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### After
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Notification → Toast Migration

#### Before
```tsx
import { Notification, NotificationTitle, NotificationDescription } from '@/components/keep';

<Notification>
  <NotificationTitle>Success</NotificationTitle>
  <NotificationDescription>Operation completed</NotificationDescription>
</Notification>
```

#### After (using sonner - already installed)
```tsx
import { toast } from 'sonner';

// In your component
toast.success('Success', {
  description: 'Operation completed'
});
```

## Migration Strategy

### Phase 1: High-Traffic Components (Priority)
1. Authentication pages (`src/app/auth/**`, `src/app/login/**`)
2. Main dashboard (`src/app/dashboard/**`)
3. Shared navigation components

### Phase 2: Admin and Management
1. Admin dashboard
2. Product management panels
3. Role management panels

### Phase 3: Feature Components
1. AI components
2. EKA therapy components
3. Subscription components

### Phase 4: Remaining Components
1. Promotional components
2. Accessibility features
3. Testing components

## Automated Migration Script

```bash
# Replace imports in a file (example)
sed -i "s|from '@/components/keep'|from '@/components/ui/button'|g" file.tsx
```

## Testing After Migration

1. **Visual Testing**: Check that components render correctly
2. **Functional Testing**: Verify all interactions work
3. **Accessibility Testing**: Ensure WCAG compliance maintained
4. **Responsive Testing**: Test on different screen sizes

## Common Issues and Solutions

### Issue: TabsItem not found
**Solution**: Replace `TabsItem` with `TabsTrigger`

### Issue: Modal not found
**Solution**: Replace `Modal` with `Dialog`

### Issue: Notification not working
**Solution**: Use `toast` from sonner or `useToast` hook

### Issue: LineProgress not found
**Solution**: Replace with `Progress` component

### Issue: Divider not found
**Solution**: Replace with `Separator` component

## Benefits After Migration

1. ✅ Fully consistent design system
2. ✅ Better accessibility out of the box
3. ✅ Easier customization with Tailwind
4. ✅ Smaller bundle size
5. ✅ Better TypeScript support
6. ✅ Active community support
