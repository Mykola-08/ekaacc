import React from 'react'
import { Button } from './button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Input } from './input'
import { Badge } from './badge'
import { Alert, AlertTitle, AlertDescription } from './alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

export function TestDefaultBlocks() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Default Button Components</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm" variant="default">Small Button</Button>
          <Button size="default" variant="default">Default Button</Button>
          <Button size="lg" variant="default">Large Button</Button>
          <Button size="icon" variant="outline">⚡</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Default Card Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card Title</CardTitle>
              <CardDescription>This card uses the beautiful default shadcn styling with proper rounded corners</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Default card content with the original beautiful shadcn design and rounded corners.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Default Input Components</h2>
        <div className="max-w-md space-y-4">
          <Input placeholder="Default input with beautiful styling..." />
          <Input type="email" placeholder="Email address" />
          <Input type="password" placeholder="Password" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Default Badge Components</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Destructive Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Default Alert Components</h2>
        <div className="space-y-4 max-w-2xl">
          <Alert>
            <AlertTitle>Default Alert Title</AlertTitle>
            <AlertDescription>
              This alert uses the beautiful default shadcn styling with proper rounded corners.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>
              This destructive alert features the beautiful default shadcn design.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Default Dialog Components</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Default Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default Dialog Title</DialogTitle>
              <DialogDescription>
                This dialog uses the beautiful default shadcn styling with proper rounded corners.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>Dialog content with the original beautiful shadcn design.</p>
              <Input placeholder="Input inside dialog..." />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="default">Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Beautiful Default shadcn Design</h2>
        <div className="p-6 bg-card rounded-lg border">
          <p className="text-card-foreground">
            All components now use the beautiful default shadcn design:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>✓ Beautiful rounded corners (rounded-md, rounded-lg)</li>
            <li>✓ Clean and minimal design</li>
            <li>✓ Proper spacing and typography</li>
            <li>✓ Accessible focus states</li>
            <li>✓ Consistent with shadcn/ui design system</li>
            <li>✓ Professional and modern appearance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}