import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  BookOpen01Icon,
  Wallet01Icon,
  Shield01Icon,
  UserCircleIcon,
  Settings01Icon,
  GridIcon,
  AlertCircleIcon,
  Clock01Icon,
  Layout01Icon,
} from '@hugeicons/core-free-icons';

export const dynamic = 'force-dynamic';

const features = [
  {
    title: 'Book a Session',
    description: 'Find availability and schedule your next wellness session.',
    href: '/book',
    icon: Calendar03Icon,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'My Bookings',
    description: 'View upcoming and past appointments.',
    href: '/bookings',
    icon: Clock01Icon,
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    title: 'Wellness Journal',
    description: 'Track your mood, progress, and personal reflections.',
    href: '/journal',
    icon: BookOpen01Icon,
    color: 'text-violet-600 bg-violet-50',
  },
  {
    title: 'Wallet',
    description: 'Manage your funds, view transactions and add credit.',
    href: '/wallet',
    icon: Wallet01Icon,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    title: 'Subscriptions',
    description: 'Browse and manage membership plans and benefits.',
    href: '/subscriptions',
    icon: Shield01Icon,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Materials & Resources',
    description: 'Access educational content, exercises, and wellness guides.',
    href: '/resources',
    icon: GridIcon,
    color: 'text-teal-600 bg-teal-50',
  },
  {
    title: 'My Profile',
    description: 'Update your personal information and preferences.',
    href: '/profile',
    icon: UserCircleIcon,
    color: 'text-sky-600 bg-sky-50',
  },
  {
    title: 'Preferences',
    description: 'Customize notifications, language, and app settings.',
    href: '/settings',
    icon: Settings01Icon,
    color: 'text-slate-600 bg-slate-50',
  },
  {
    title: 'Notifications',
    description: 'Stay updated with your latest alerts and reminders.',
    href: '/notifications',
    icon: Layout01Icon,
    color: 'text-orange-600 bg-orange-50',
  },
  {
    title: 'Crisis Support',
    description: 'Get immediate help and emergency resources.',
    href: '/crisis',
    icon: AlertCircleIcon,
    color: 'text-red-600 bg-red-50',
  },
];

export default async function FeaturesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 px-4 py-8 duration-700 md:px-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">All Features</h2>
        <p className="text-sm font-medium text-muted-foreground">
          Explore every tool and page available to you in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="group h-full cursor-pointer rounded-[20px] border border-border bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-6">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.color} transition-colors`}
                >
                  <HugeiconsIcon icon={feature.icon} className="size-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
