'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Activity01Icon,
  ArrowRight01Icon,
  Message01Icon,
  PlayIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';

type SessionClient = {
  id: string;
  full_name: string | null;
};

type SessionBooking = {
  id: string;
  starts_at: string;
  status: string;
};

type SessionPlanSnapshot = {
  pendingAssignments: number;
  activeGoals: number;
  latestMood: number | null;
};

const SESSION_TYPES = [
  { id: 'intake', label: 'Intake Session' },
  { id: 'follow_up', label: 'Follow-up Session' },
  { id: 'crisis_support', label: 'Crisis Support Session' },
  { id: 'coaching', label: 'Coaching / Action Session' },
];

export function TherapistSessionModeLauncher({ isTherapist }: { isTherapist: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<SessionClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [sessionType, setSessionType] = useState('follow_up');
  const [locationType, setLocationType] = useState('online');
  const [upcomingBookings, setUpcomingBookings] = useState<SessionBooking[]>([]);
  const [snapshot, setSnapshot] = useState<SessionPlanSnapshot | null>(null);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId),
    [clients, selectedClientId]
  );

  const loadTherapistClients = useCallback(async () => {
    if (!open || !isTherapist) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: therapistProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!therapistProfile?.id) return;

      const { data: rows } = await supabase
        .from('bookings')
        .select('client:profiles!bookings_client_id_fkey(id, full_name)')
        .eq('therapist_id', therapistProfile.id)
        .limit(300);

      const unique = new Map<string, SessionClient>();
      for (const row of rows ?? []) {
        const client = Array.isArray(row.client) ? row.client[0] : row.client;
        if (client?.id && !unique.has(client.id)) {
          unique.set(client.id, { id: client.id, full_name: client.full_name });
        }
      }

      const resolved = Array.from(unique.values()).sort((a, b) =>
        (a.full_name || '').localeCompare(b.full_name || '')
      );
      setClients(resolved);

      if (!selectedClientId && resolved.length > 0) {
        setSelectedClientId(resolved[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, [open, isTherapist, selectedClientId]);

  useEffect(() => {
    loadTherapistClients();
  }, [loadTherapistClients]);

  useEffect(() => {
    const loadSessionPlan = async () => {
      if (!selectedClientId || !open) {
        setUpcomingBookings([]);
        setSnapshot(null);
        return;
      }

      const supabase = createClient();
      const now = new Date().toISOString();

      const [
        { data: bookings },
        { count: pendingAssignments },
        { count: activeGoals },
        { data: mood },
      ] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, starts_at, status')
          .eq('client_id', selectedClientId)
          .in('status', ['scheduled', 'pending'])
          .gte('starts_at', now)
          .order('starts_at', { ascending: true })
          .limit(3),
        supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', selectedClientId)
          .in('status', ['pending', 'in_progress']),
        supabase
          .from('wellness_goals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', selectedClientId)
          .eq('status', 'active'),
        supabase
          .from('journal_entries')
          .select('mood, created_at')
          .eq('user_id', selectedClientId)
          .not('mood', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1),
      ]);

      setUpcomingBookings((bookings ?? []) as SessionBooking[]);
      setSnapshot({
        pendingAssignments: pendingAssignments ?? 0,
        activeGoals: activeGoals ?? 0,
        latestMood: mood && mood.length > 0 ? Number(mood[0].mood) : null,
      });
    };

    loadSessionPlan();
  }, [open, selectedClientId]);

  const startSessionMode = () => {
    if (!selectedClientId) return;

    const targetBooking = upcomingBookings[0];
    if (targetBooking?.id) {
      const params = new URLSearchParams({
        sessionType,
        clientId: selectedClientId,
        locationType,
      });
      router.push(`/therapist/active-session/${targetBooking.id}?${params.toString()}`);
    } else {
      const params = new URLSearchParams({
        draft: 'true',
        sessionMode: 'true',
        clientId: selectedClientId,
        sessionType,
        locationType,
      });
      router.push(`/therapist/session-mode?${params.toString()}`);
    }

    setOpen(false);
  };

  const openTelegramComposer = () => {
    if (!selectedClient) return;
    const sessionLabel = SESSION_TYPES.find((type) => type.id === sessionType)?.label || 'Session';
    const text = `Hi ${selectedClient.full_name || 'there'}, this is your therapist from EKA. We are preparing your ${sessionLabel.toLowerCase()} now. Please share how you are feeling today so we can focus the session.`;
    const link = `https://t.me/share/url?url=${encodeURIComponent('https://ekaacc.com/wellness')}&text=${encodeURIComponent(text)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (!isTherapist) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="hidden gap-2 rounded-full md:flex">
          <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
          Session Mode
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Activity01Icon} className="text-primary size-4" />
            Start Therapist Session Mode
          </DialogTitle>
          <DialogDescription>
            Pick a client and session type. We will open the best workspace and preload a practical
            session plan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Client</p>
            <Select value={selectedClientId} onValueChange={setSelectedClientId} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? 'Loading clients...' : 'Choose a client'} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.full_name || 'Unnamed client'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Session type</p>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Session channel</p>
          <Select value={locationType} onValueChange={setLocationType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online / video</SelectItem>
              <SelectItem value="in_person">In person</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-muted/30 border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <HugeiconsIcon icon={UserGroupIcon} className="text-muted-foreground size-4" />
              Session plan snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Badge variant="outline">Upcoming: {upcomingBookings.length}</Badge>
            <Badge variant="outline">Pending tasks: {snapshot?.pendingAssignments ?? 0}</Badge>
            <Badge variant="outline">Active goals: {snapshot?.activeGoals ?? 0}</Badge>
            <Badge variant="outline">
              Latest mood: {snapshot?.latestMood == null ? 'N/A' : `${snapshot.latestMood}/10`}
            </Badge>
          </CardContent>
        </Card>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={openTelegramComposer}
            disabled={!selectedClientId}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={Message01Icon} className="size-4" />
            Telegram check-in
          </Button>

          <Button onClick={startSessionMode} disabled={!selectedClientId} className="gap-1.5">
            Start Session Workspace
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
