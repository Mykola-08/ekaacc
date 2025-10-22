'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeSelector } from '@/components/eka/theme-selector';
import { ArrowLeft, Palette, Info } from 'lucide-react';
import Link from 'next/link';

export default function AppearanceSettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
          <p className="text-muted-foreground">
            Customize how Ekaacc looks and feels for you
          </p>
        </div>
      </div>

      <Separator />

      {/* Theme Selector Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>Theme</CardTitle>
          </div>
          <CardDescription>
            Choose a theme to personalize your experience. Premium themes are available with Loyal and VIP memberships.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-gray-900 font-medium">
                Unlock More Themes
              </p>
              <p className="text-sm text-gray-600">
                Get access to exclusive premium themes with a Loyal or VIP membership. Choose from ocean waves, sunset vibes, midnight elegance, and more!
              </p>
              <div className="flex gap-2 pt-2">
                <Link href="/account/subscriptions">
                  <Button size="sm" variant="outline" className="border-blue-300">
                    View Subscriptions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings (Future) */}
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="text-gray-600">More Customization Options</CardTitle>
          <CardDescription>
            Coming soon: Font size, animations, contrast settings, and more
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
