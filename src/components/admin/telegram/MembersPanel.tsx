'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  listMembersAction,
  banMemberAction,
  unbanMemberAction,
  promoteMemberAction,
  demoteMemberAction,
  restrictMemberAction,
} from '@/server/telegram/actions';
import type { TelegramChannel, TelegramGroupMember } from '@/server/telegram/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface MembersPanelProps {
  channels: TelegramChannel[];
}

export function MembersPanel({ channels }: MembersPanelProps) {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id ?? '');
  const [members, setMembers] = useState<TelegramGroupMember[]>([]);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedChannel) return;
    startTransition(async () => {
      const res = await listMembersAction(selectedChannel);
      if (res.success) setMembers(res.data);
    });
  }, [selectedChannel]);

  function handleBan(userId: number) {
    startTransition(async () => {
      const res = await banMemberAction(selectedChannel, userId);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.telegram_user_id === userId ? { ...m, status: 'kicked' as const } : m
          )
        );
        toast.success('Member banned');
      } else {
        toast.error(res.error ?? 'Failed to ban');
      }
    });
  }

  function handleUnban(userId: number) {
    startTransition(async () => {
      const res = await unbanMemberAction(selectedChannel, userId);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.telegram_user_id === userId ? { ...m, status: 'member' as const } : m
          )
        );
        toast.success('Member unbanned');
      } else {
        toast.error(res.error ?? 'Failed to unban');
      }
    });
  }

  function handlePromote(userId: number) {
    startTransition(async () => {
      const res = await promoteMemberAction(selectedChannel, userId);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.telegram_user_id === userId ? { ...m, status: 'admin' as const } : m
          )
        );
        toast.success('Member promoted to admin');
      } else {
        toast.error(res.error ?? 'Failed to promote');
      }
    });
  }

  function handleDemote(userId: number) {
    startTransition(async () => {
      const res = await demoteMemberAction(selectedChannel, userId);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.telegram_user_id === userId ? { ...m, status: 'member' as const } : m
          )
        );
        toast.success('Admin demoted');
      } else {
        toast.error(res.error ?? 'Failed to demote');
      }
    });
  }

  function handleMute(userId: number) {
    startTransition(async () => {
      const res = await restrictMemberAction(selectedChannel, userId, {
        can_send_messages: false,
        can_send_photos: false,
        can_send_videos: false,
        can_send_documents: false,
        can_send_audios: false,
        can_send_voice_notes: false,
        can_send_video_notes: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
      });
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.telegram_user_id === userId ? { ...m, status: 'restricted' as const } : m
          )
        );
        toast.success('Member muted');
      } else {
        toast.error(res.error ?? 'Failed to mute');
      }
    });
  }

  const filtered = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.username?.toLowerCase().includes(q) ||
      m.first_name?.toLowerCase().includes(q) ||
      m.last_name?.toLowerCase().includes(q) ||
      m.telegram_user_id.toString().includes(q)
    );
  });

  if (channels.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No channels connected.
        </CardContent>
      </Card>
    );
  }

  const statusVariant = (s: string) => {
    if (s === 'creator' || s === 'admin') return 'default' as const;
    if (s === 'kicked' || s === 'left') return 'destructive' as const;
    return 'outline' as const;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search members…"
          className="w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-muted-foreground">
          {filtered.length} member{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {isPending ? 'Loading…' : 'No members found'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {[m.first_name, m.last_name].filter(Boolean).join(' ') || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.username ? `@${m.username}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(m.status)} className="capitalize">
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(m.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {m.status === 'kicked' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnban(m.telegram_user_id)}
                            disabled={isPending}
                          >
                            Unban
                          </Button>
                        ) : m.status === 'member' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePromote(m.telegram_user_id)}
                              disabled={isPending}
                            >
                              Promote
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMute(m.telegram_user_id)}
                              disabled={isPending}
                            >
                              Mute
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleBan(m.telegram_user_id)}
                              disabled={isPending}
                            >
                              Ban
                            </Button>
                          </>
                        ) : m.status === 'admin' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDemote(m.telegram_user_id)}
                            disabled={isPending}
                          >
                            Demote
                          </Button>
                        ) : m.status === 'restricted' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnban(m.telegram_user_id)}
                              disabled={isPending}
                            >
                              Unrestrict
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleBan(m.telegram_user_id)}
                              disabled={isPending}
                            >
                              Ban
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
