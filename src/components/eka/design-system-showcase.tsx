/**
 * Design System Showcase Component
 * 
 * This component demonstrates proper usage of the EKA design system.
 * Use this as a reference when creating new components.
 */

'use client';

;
;
;
;
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Notification, NotificationDescription } from '@/components/keep';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle,
  Heart,
  Zap,
  Trophy
} from 'lucide-react';

export function DesignSystemShowcase() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Design System Showcase</h1>
        <p className="text-muted-foreground">
          Reference implementation of EKA design patterns
        </p>
      </div>

      {/* Color System */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Colors</CardTitle>
          <CardDescription>
            Always use CSS variables instead of hardcoded colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Good Examples */}
          <div>
            <h4 className="text-sm font-medium mb-3">✅ Good: Using Semantic Tokens</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Badge variant="default" className="justify-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Primary
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20 justify-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Success
              </Badge>
              <Badge className="bg-warning/10 text-warning border-warning/20 justify-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Warning
              </Badge>
              <Badge className="bg-info/10 text-info border-info/20 justify-center">
                <Info className="h-3 w-3 mr-1" />
                Info
              </Badge>
            </div>
          </div>

          {/* Bad Examples - Commented */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-destructive">
              ❌ Bad: Hardcoded Colors (Don't Use)
            </h4>
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <code className="text-xs text-muted-foreground">
                {`// Never do this:\n`}
                {`<Badge className="bg-green-100 text-green-800">Success</Badge>\n`}
                {`<p className="text-pink-600">Important</p>`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>
            Use predefined button variants for consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Status Indicators</CardTitle>
          <CardDescription>
            Consistent status communication using semantic colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Notification className="border-success/20 bg-success/5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <NotificationDescription className="text-success-foreground ml-2">
              Operation completed successfully
            </NotificationDescription>
          </Notification>

          <Notification className="border-warning/20 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <NotificationDescription className="text-warning-foreground ml-2">
              Please review your settings before continuing
            </NotificationDescription>
          </Notification>

          <Notification className="border-info/20 bg-info/5">
            <Info className="h-4 w-4 text-info" />
            <NotificationDescription className="text-info-foreground ml-2">
              New features are now available
            </NotificationDescription>
          </Notification>

          <Notification className="border-destructive/20 bg-destructive/5">
            <XCircle className="h-4 w-4 text-destructive" />
            <NotificationDescription className="text-destructive-foreground ml-2">
              An error occurred. Please try again.
            </NotificationDescription>
          </Notification>
        </CardContent>
      </Card>

      {/* Icon Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Sizing & Colors</CardTitle>
          <CardDescription>
            Consistent icon patterns using semantic colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                <span className="text-sm">Small (h-4 w-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" />
                <span className="text-sm">Medium (h-5 w-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-success" />
                <span className="text-sm">Large (h-6 w-6)</span>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Icon Color Pattern:</p>
              <code className="text-xs">
                {`<Icon className="h-5 w-5 text-success" /> // Use semantic colors\n`}
                {`<Icon className="h-5 w-5 text-current" /> // Inherit text color`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Patterns */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Glass Effect Cards</CardTitle>
          <CardDescription>
            Using the .glass utility class for modern aesthetics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Standard Glass Card</p>
                    <p className="text-sm text-muted-foreground">
                      With backdrop blur
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-success/20 bg-success/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Success Variant</p>
                    <p className="text-sm text-muted-foreground">
                      With semantic coloring
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Hierarchy</CardTitle>
          <CardDescription>
            Consistent text sizing and weights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold">Heading 1 (text-3xl font-bold)</h1>
            <p className="text-xs text-muted-foreground">Used for page titles</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Heading 2 (text-2xl font-semibold)</h2>
            <p className="text-xs text-muted-foreground">Used for section titles</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Heading 3 (text-xl font-semibold)</h3>
            <p className="text-xs text-muted-foreground">Used for subsections</p>
          </div>
          <div>
            <h4 className="text-lg font-medium">Heading 4 (text-lg font-medium)</h4>
            <p className="text-xs text-muted-foreground">Used for card titles</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Body text (text-sm text-muted-foreground)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Spacing Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>
            Standard spacing patterns for consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <div className="h-4 w-4 rounded bg-primary" />
              <span className="text-sm">gap-2 (8px) - Tight spacing</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="h-4 w-4 rounded bg-primary" />
              <span className="text-sm">gap-4 (16px) - Default spacing</span>
            </div>
            <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg">
              <div className="h-4 w-4 rounded bg-primary" />
              <span className="text-sm">gap-6 (24px) - Section spacing</span>
            </div>
            <div className="flex items-center gap-8 p-3 bg-muted/30 rounded-lg">
              <div className="h-4 w-4 rounded bg-primary" />
              <span className="text-sm">gap-8 (32px) - Large sections</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-info/20 bg-info/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-info" />
            Key Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Always use CSS variables (--primary, --success, etc.) instead of hardcoded colors</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Use <code className="bg-muted px-1 py-0.5 rounded">cn()</code> helper for conditional className composition</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Prefer predefined component variants over custom styling</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Maintain consistent spacing using gap-2, gap-4, gap-6, gap-8</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Icons should use semantic colors and consistent sizing (h-4 w-4, h-5 w-5, h-6 w-6)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
