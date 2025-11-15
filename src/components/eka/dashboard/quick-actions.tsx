'use client';
;
;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
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
            <Button key={action.label} variant="outline" className="h-24 flex-col gap-2 text-center" asChild>
                <Link href={action.href}>
                    <action.icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                </Link>
            </Button>
        ))}
      </CardContent>
    </Card>
  );
}
