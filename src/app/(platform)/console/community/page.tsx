'use client';

import { Users, MessageSquare, Heart, Shield } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold tracking-tight">
            Community
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage community features and interactions.
          </p>
        </div>
      </div>

      <div className="bg-card relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 -translate-x-1/3 -translate-y-1/2 rounded-full bg-blue-50/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 translate-x-1/4 translate-y-1/3 rounded-full bg-cyan-50/50 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center justify-center text-center">
          <div className="mb-8 flex items-center justify-center -space-x-4">
            <div className="bg-card z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-lg ring-4 ring-white">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="z-0 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-lg ring-4 ring-white">
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <h2 className="text-foreground mb-3 text-2xl font-bold">Community Hub</h2>
          <p className="text-muted-foreground mb-8">
            Engage with your user base, moderate discussions, and foster a healthy community
            environment.
          </p>

          <div className="grid w-full grid-cols-2 gap-4">
            <div className="bg-muted/30 flex flex-col items-center rounded-2xl p-4">
              <Shield className="text-muted-foreground/80 mb-2 h-5 w-5" />
              <span className="text-foreground text-sm font-semibold">Moderation</span>
            </div>
            <div className="bg-muted/30 flex flex-col items-center rounded-2xl p-4">
              <Heart className="text-muted-foreground/80 mb-2 h-5 w-5" />
              <span className="text-foreground text-sm font-semibold">Engagement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
