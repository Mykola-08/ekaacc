import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarPlus, Gift, MessageSquarePlus, PlusCircle } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            icon: CalendarPlus,
            label: "Book Session",
            href: "/sessions"
        },
        {
            icon: Gift,
            label: "Donate",
            href: "/donations"
        },
        {
            icon: MessageSquarePlus,
            label: "New Report",
            href: "/reports"
        },
        {
            icon: PlusCircle,
            label: "Upgrade Plan",
            href: "/account"
        },
    ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Your most common tasks, one click away.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
            <Button key={action.label} variant="outline" className="h-20 flex flex-col gap-2">
                <action.icon className="h-6 w-6 text-primary" />
                <span>{action.label}</span>
            </Button>
        ))}
      </CardContent>
    </Card>
  );
}
