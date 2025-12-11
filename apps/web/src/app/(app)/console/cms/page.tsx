"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function CMSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Content Management
        </h1>
        <p className="text-muted-foreground">Manage website content and pages</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">CMS functionality coming soon. Manage blog posts, pages, and other content here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
