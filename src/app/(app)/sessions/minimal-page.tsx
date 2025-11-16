'use client';

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { CalendarOff, Clock, Calendar, Video, User, Plus, Filter } from "lucide-react";
import type { Session as AppSession, User } from '@/lib/types';
import { useAuth } from "@/lib/supabase-auth";
import { useAppStore } from "@/store/app-store";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';

// Helper to map appointment to session type
const mapBookingToSession = (booking: any): AppSession => {
  const dateValue = booking.date ? new Date(booking.date) : new Date();
  const status = (booking.status || '').toString().toLowerCase();
  let statusLabel: AppSession['status'] = 'Upcoming';
  if (status === 'cancelled' || status === 'canceled' || status === 'no_show') {
    statusLabel = 'Canceled';
  } else if (status === 'completed' || status === 'checked_out' || status === 'done') {
    statusLabel = 'Completed';
  }

  const therapistName = booking.practitioner
    || booking.therapistName
    || booking.therapist
    || booking.teamMemberName
    || booking.practitioner_id
    || 'Assigned therapist';

  const sessionType = booking.session_type || booking.serviceName || booking.type || 'Therapy Session';

  return {
    id: booking.id,
    therapist: therapistName,
    therapistAvatarUrl: booking.therapistAvatarUrl || 'https://i.pravatar.cc/150?u=square',
    date: dateValue.toISOString(),
    time: booking.time || dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: booking.duration || 60,
    status: statusLabel,
    type: sessionType,
    userId: booking.user_id,
  };
};

function MinimalSessionCard({ session }: { session: AppSession }) {
  const sessionDate = new Date(session.date);
  const formattedDate = format(sessionDate, "MMM d, yyyy");
  const isUpcoming = session.status === 'Upcoming';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'Completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'Canceled': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-squircle flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {session.therapist}
              </h3>
              <span className={`px-3 py-1 rounded-squircle text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{session.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                <span>{session.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{session.duration} min</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isUpcoming && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = `/sessions/${session.id}`}
            >
              View Details
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = `/sessions/${session.id}`}
          >
            View →
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SessionsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-squircle"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function NoSessionsFound({ error, onBookClick }: { error: Error | null, onBookClick: () => void }) {
  return (
    <Card className="p-12 text-center rounded-lg">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-squircle flex items-center justify-center mx-auto mb-4">
          <CalendarOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {error ? "Something went wrong" : "No sessions found"}
        </h3>
        <p className="text-gray-600 mb-6">
          {error ? error.message : "Ready to start your wellness journey? Book your first session."}
        </p>
        <Button 
          variant="default" 
          size="md"
          onClick={onBookClick}
          className="rounded-squircle"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book Your First Session
        </Button>
      </div>
    </Card>
  );
}

export default function MinimalSessionsPage() {
  const { user: currentUser, loading: isUserLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const [sessions, setSessions] = useState<AppSession[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const updateUserData = useCallback(async (updates: Partial<User>) => {
    if (!currentUser || !dataService) return;
    try {
      await dataService.updateUser(currentUser.id, updates);
    } catch (e) {
      console.error("Failed to update user data", e);
    }
  }, [currentUser, dataService]);

  useEffect(() => {
    if (isUserLoading) {
      setIsLoading(true);
      return;
    }
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fxService.getBookingsForUser(currentUser.id || 'user1', {
      email: currentUser.email,
      phone: currentUser.phoneNumber,
    })
      .then(bookings => {
        setSessions(
          bookings
            .map(mapBookingToSession)
            .sort((a: AppSession, b: AppSession) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
        setError(null);
      })
      .catch(e => setError(e))
      .finally(() => setIsLoading(false));
  }, [currentUser, isUserLoading]);

  const handleBookClick = () => {
    window.location.href = '/sessions/booking';
  };

  const filteredSessions = sessions?.filter(session => {
    if (filterStatus === 'all') return true;
    return session.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const stats = {
    total: sessions?.length || 0,
    upcoming: sessions?.filter(s => s.status === 'Upcoming').length || 0,
    completed: sessions?.filter(s => s.status === 'Completed').length || 0,
    canceled: sessions?.filter(s => s.status === 'Canceled').length || 0,
  };

  const filterOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Sessions</h1>
            <p className="text-gray-600">
              Manage your therapy sessions and track your progress
            </p>
          </div>
          <Button 
            variant="default" 
            size="md"
            onClick={handleBookClick}
            className="rounded-squircle"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Session
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-squircle flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-squircle flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-4 rounded-squircle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-squircle flex items-center justify-center">
                <Video className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-4 rounded-squircle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Canceled</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.canceled}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-squircle flex items-center justify-center">
                <CalendarOff className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filterStatus === option.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(option.value)}
              className="rounded-squircle"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Sessions List */}
        {(isLoading || isUserLoading) && <SessionsLoadingSkeleton />}
        
        {!isLoading && !isUserLoading && filteredSessions && filteredSessions.length > 0 && (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <MinimalSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {!isLoading && !isUserLoading && (!filteredSessions || filteredSessions.length === 0) && (
          <NoSessionsFound error={error} onBookClick={handleBookClick} />
        )}
      </div>
    </div>
  );
}