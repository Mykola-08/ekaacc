"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Briefcase } from 'lucide-react';

export default function ServicesPage() {
 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-3xl font-bold flex items-center gap-2">
     <Briefcase className="h-8 w-8" />
     Services Management
    </h1>
    <p className="text-muted-foreground">Manage therapy services and offerings</p>
   </div>
   <Card>
    <CardHeader>
     <CardTitle>Services</CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-muted-foreground">Services management functionality coming soon. Configure therapy types, pricing, and availability here.</p>
    </CardContent>
   </Card>
  </div>
 );
}
