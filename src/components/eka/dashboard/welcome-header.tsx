'use client';

import { useAuth } from '@/lib/supabase-auth';
import { TextEffect } from '@/components/motion-primitives';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

export function WelcomeHeader() {
  const { user: appUser, signOut } = useAuth();
  const userName = (appUser as any)?.name?.split(' ')[0] || 'there';

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          className="text-4xl font-bold gradient-text mb-2"
        >
          {`Hello, ${userName}`}
        </TextEffect>
        <p className="text-muted-foreground text-lg">
          Here's your wellness snapshot for today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="hover-lift rounded-lg"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Link href="/settings">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover-lift rounded-lg"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button 
          onClick={signOut} 
          variant="outline"
          className="hover-lift rounded-lg"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
