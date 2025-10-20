"use client";

import { Suspense, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/unified-data-context";
import { useOptimizedData } from "@/hooks/use-optimized-data";
import { getDataService } from "@/services/data-service";
import OptimizedSessionCard from "@/components/eka/optimized-session-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Session } from "@/lib/types";

// Skeleton loading component
function SessionsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-[200px] w-full" />
        </div>
      ))}
    </div>
  );
}

// Memoized sessions list component
function SessionsList({ 
  sessions, 
  emptyMessage 
}: { 
  sessions: any[]; 
  emptyMessage: string;
}) {
  // Memoize the session cards to prevent unnecessary re-renders
  const sessionCards = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <OptimizedSessionCard
            key={session.id}
            session={session}
            onJoin={(id) => console.log('Join session:', id)}
            onReschedule={(id) => console.log('Reschedule session:', id)}
            onCancel={(id) => console.log('Cancel session:', id)}
          />
        ))}
      </div>
    );
  }, [sessions, emptyMessage]);

  return sessionCards;
}

export default function OptimizedSessionsPage() {
  const { currentUser } = useData();

  // Use optimized data fetching with caching
  const { data: sessions, isLoading, error } = useOptimizedData({
    cacheKey: `user-sessions-${currentUser?.id}`,
    fetcher: async () => {
      const dataService = await getDataService();
      const allSessions = await dataService.getSessions();
      return allSessions.filter((s: Session) => s.userId === currentUser?.id);
    },
    staleTime: 300000, // 5 minutes
  });

  // Memoize filtered sessions to avoid recalculation
  const { upcoming, past, cancelled } = useMemo(() => {
    if (!sessions) {
      return { upcoming: [], past: [], cancelled: [] };
    }

    const now = new Date();
    
    return {
      upcoming: sessions
        .filter((s: Session) => new Date(s.date) > now && s.status === 'Upcoming')
        .sort((a: Session, b: Session) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      past: sessions
        .filter((s: Session) => new Date(s.date) <= now || s.status === 'Completed')
        .sort((a: Session, b: Session) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      cancelled: sessions
        .filter((s: Session) => s.status === 'Canceled')
        .sort((a: Session, b: Session) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  }, [sessions]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading sessions. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
          <p className="text-muted-foreground">
            Manage your therapy sessions and appointments
          </p>
        </div>
        <Link href="/sessions/booking">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Book Session
          </Button>
        </Link>
      </div>

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({past.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Suspense fallback={<SessionsSkeleton />}>
            {isLoading ? (
              <SessionsSkeleton />
            ) : (
              <SessionsList 
                sessions={upcoming} 
                emptyMessage="No upcoming sessions. Book your first session!" 
              />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Suspense fallback={<SessionsSkeleton />}>
            {isLoading ? (
              <SessionsSkeleton />
            ) : (
              <SessionsList 
                sessions={past} 
                emptyMessage="No past sessions yet." 
              />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <Suspense fallback={<SessionsSkeleton />}>
            {isLoading ? (
              <SessionsSkeleton />
            ) : (
              <SessionsList 
                sessions={cancelled} 
                emptyMessage="No cancelled sessions." 
              />
            )}
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
