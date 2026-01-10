"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Admin Settings
        </h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Platform settings functionality coming soon. Configure global settings, integrations, and preferences here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
