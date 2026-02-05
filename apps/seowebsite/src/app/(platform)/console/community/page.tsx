'use client';

import { Users, MessageSquare, Heart, Shield } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            Community
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage community features and interactions.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden min-h-[400px] flex items-center justify-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-50/50 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
           <div className="flex items-center justify-center -space-x-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-card ring-4 ring-white shadow-lg flex items-center justify-center z-10">
                    <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-100 ring-4 ring-white shadow-lg flex items-center justify-center z-0">
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
           </div>
           
           <h2 className="text-2xl font-bold text-foreground mb-3">Community Hub</h2>
           <p className="text-muted-foreground mb-8">
               Engage with your user base, moderate discussions, and foster a healthy community environment.
           </p>
           
           <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-muted/30 p-4 rounded-2xl flex flex-col items-center">
                    <Shield className="w-5 h-5 text-muted-foreground/80 mb-2" />
                    <span className="text-sm font-semibold text-foreground">Moderation</span>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl flex flex-col items-center">
                    <Heart className="w-5 h-5 text-muted-foreground/80 mb-2" />
                    <span className="text-sm font-semibold text-foreground">Engagement</span>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
