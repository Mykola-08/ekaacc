"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { HardDrive } from 'lucide-react';

export default function DatabasePage() {
 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-3xl font-bold flex items-center gap-2">
     <HardDrive className="h-8 w-8" />
     Database
    </h1>
    <p className="text-muted-foreground">Database administration and management</p>
   </div>
   <Card>
    <CardHeader>
     <CardTitle>Database Management</CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-muted-foreground">Database management functionality coming soon. View tables, run queries, and manage data here.</p>
    </CardContent>
   </Card>
  </div>
 );
}
