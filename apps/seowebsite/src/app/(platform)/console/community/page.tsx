"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Database } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          Community
        </h1>
        <p className="text-muted-foreground">Manage community features and settings</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Community Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Community management functionality coming soon. Configure forums, groups, and community settings here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
