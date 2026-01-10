'use client';

import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { CalendarPlus, Gift, FilePlus, Star } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
    const actions = [
        {
            icon: CalendarPlus,
            label: "Book Session",
            href: "/therapies"
        },
        {
            icon: FilePlus,
            label: "Start Report",
            href: "/reports"
        },
        {
            icon: Gift,
            label: "Donate",
            href: "/donations"
        },
        {
            icon: Star,
            label: "Upgrade Plan",
            href: "/account/vip"
        },
    ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Your most common tasks, one click away.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) => (
            <Link href={action.href} key={action.label} className="h-24 flex-col gap-2 text-center">
                <Button variant="outline" className="h-24 flex-col gap-2 text-center w-full">
                    <action.icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                </Button>
            </Link>
        ))}
      </CardContent>
    </Card>
  );
}
