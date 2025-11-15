# Keep React Quick Reference

## Quick Import Guide

```tsx
// Import components
import { Button, Card, Input, Badge } from '@/components/keep';

// Import icons
import { Heart, User, Calendar } from 'phosphor-react';
```

## Most Used Components

### Button
```tsx
<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="softBg">Soft</Button>
<Button disabled>Disabled</Button>

// With icon
<Button>
  <Heart size={20} className="mr-2" />
  Like
</Button>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Input
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="your@email.com" 
  />
</div>
```

### Badge
```tsx
<Badge>Default</Badge>
<Badge className="bg-green-500 text-white">Success</Badge>
<Badge className="bg-red-500 text-white">Error</Badge>
```

### Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
      <TableCell><Badge>Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Tabs
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsItem value="tab1">Tab 1</TabsItem>
    <TabsItem value="tab2">Tab 2</TabsItem>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Checkbox & Switch
```tsx
// Checkbox
<div className="flex items-center gap-2">
  <Checkbox id="agree" />
  <Label htmlFor="agree">I agree</Label>
</div>

// Switch
<div className="flex items-center gap-2">
  <Switch id="enable" />
  <Label htmlFor="enable">Enable feature</Label>
</div>
```

### Loading States
```tsx
// Spinner
<Spinner />

// Skeleton
<Skeleton>
  <SkeletonLine className="h-4 w-3/4" />
</Skeleton>
```

## Common Patterns for EKA Account

### Session Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Therapy Session</CardTitle>
    <CardDescription>With Dr. Smith</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p className="text-sm">Tomorrow at 2:00 PM</p>
      <Badge className="bg-green-500 text-white">Confirmed</Badge>
    </div>
  </CardContent>
</Card>
```

### Wallet Display
```tsx
<Card>
  <CardContent className="text-center py-8">
    <p className="text-sm text-muted-foreground mb-2">Balance</p>
    <p className="text-4xl font-bold">€125.00</p>
    <Button className="mt-4">Add Funds</Button>
  </CardContent>
</Card>
```

### Settings Form
```tsx
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
    </div>
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
    <Button>Save</Button>
  </CardContent>
</Card>
```

## Color Customization

Use Tailwind classes for custom colors:

```tsx
// Custom badge colors
<Badge className="bg-green-500 text-white">Success</Badge>
<Badge className="bg-yellow-500 text-white">Warning</Badge>
<Badge className="bg-red-500 text-white">Error</Badge>
<Badge className="bg-blue-500 text-white">Info</Badge>

// Custom button styles
<Button className="bg-purple-500 hover:bg-purple-600">Custom</Button>
```

## Icons (Phosphor React)

```tsx
import { 
  Heart, 
  User, 
  Calendar, 
  CreditCard,
  Bell,
  Settings,
  LogOut 
} from 'phosphor-react';

<Button>
  <Heart size={20} weight="fill" />
  Favorite
</Button>
```

## Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

## Documentation

- **Keep React Docs**: https://react.keepdesign.io/
- **Phosphor Icons**: https://phosphoricons.com/
- **Examples**: `src/components/keep/KeepReactExamples.tsx`
- **Full Guide**: `docs/KEEP_REACT_INTEGRATION.md`
