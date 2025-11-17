'use client';

import { useAuth } from '@/lib/supabase-auth';
import { TextEffect } from '@/components/motion-primitives';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

export function WelcomeHeader() {
  const { user: appUser } = useAuth();
  const userName = (appUser as any)?.name?.split(' ')[0] || 'there';
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="flex justify-between items-center mb-12">
      <div>
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          className="text-5xl font-light text-foreground mb-3"
        >
          {`${greeting}, ${userName}`}
        </TextEffect>
        <p className="text-muted-foreground text-xl font-light">
          Your wellness journey continues
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-xl"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Link href="/settings">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-xl"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
