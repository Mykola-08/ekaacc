'use client';

import { useAuth } from '@/context/auth-context';
import { TextEffect } from '@/components/motion-primitives';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

export function WelcomeHeader() {
  const { appUser, signOut } = useAuth();
  const userName = appUser?.name?.split(' ')[0] || 'there';

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          {`Hello, ${userName}`}
        </TextEffect>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's your wellness snapshot for today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button onClick={signOut} variant="outline">Logout</Button>
      </div>
    </header>
  );
}
