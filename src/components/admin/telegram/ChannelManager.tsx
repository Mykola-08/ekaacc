'use client';

import { useState, useTransition } from 'react';
import {
  addChannelAction,
  listChannelsAction,
  refreshChannelAction,
  deactivateChannelAction,
  getInviteLinkAction,
} from '@/server/telegram/actions';
import type { TelegramChannel } from '@/server/telegram/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface ChannelManagerProps {
  initialChannels: TelegramChannel[];
}

export function ChannelManager({ initialChannels }: ChannelManagerProps) {
  const [channels, setChannels] = useState<TelegramChannel[]>(initialChannels);
  const [chatIdInput, setChatIdInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAddChannel() {
    const chatId = parseInt(chatIdInput.trim(), 10);
    if (isNaN(chatId)) {
      toast.error('Enter a valid numeric Chat ID');
      return;
    }

    startTransition(async () => {
      const res = await addChannelAction(chatId);
      if (res.success && res.data) {
        setChannels((prev) => [res.data!, ...prev]);
        setChatIdInput('');
        setDialogOpen(false);
        toast.success('Channel added successfully');
      } else {
        toast.error(res.error ?? 'Failed to add channel');
      }
    });
  }

  function handleRefresh(channelId: string) {
    startTransition(async () => {
      const res = await refreshChannelAction(channelId);
      if (res.success && res.data) {
        setChannels((prev) =>
          prev.map((c) => (c.id === channelId ? res.data! : c))
        );
        toast.success('Channel refreshed');
      } else {
        toast.error(res.error ?? 'Failed to refresh');
      }
    });
  }

  function handleDeactivate(channelId: string) {
    startTransition(async () => {
      const res = await deactivateChannelAction(channelId);
      if (res.success) {
        setChannels((prev) => prev.filter((c) => c.id !== channelId));
        toast.success('Channel deactivated');
      } else {
        toast.error(res.error ?? 'Failed to deactivate');
      }
    });
  }

  async function handleCopyInviteLink(channelId: string) {
    const res = await getInviteLinkAction(channelId);
    if (res.success && res.data) {
      await navigator.clipboard.writeText(res.data);
      toast.success('Invite link copied');
    } else {
      toast.error(res.error ?? 'Failed to get invite link');
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Channels & Groups</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Channel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Telegram Channel / Group</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Enter the Chat ID of the channel or group. Make sure the bot is
              already added as an admin.
            </p>
            <Input
              placeholder="e.g. -1001234567890"
              value={chatIdInput}
              onChange={(e) => setChatIdInput(e.target.value)}
            />
            <Button onClick={handleAddChannel} disabled={isPending}>
              {isPending ? 'Adding…' : 'Add Channel'}
            </Button>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {channels.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No channels connected yet. Add one to get started.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead>Bot Admin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((ch) => (
                <TableRow key={ch.id}>
                  <TableCell className="font-medium">
                    {ch.title}
                    {ch.username && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        @{ch.username}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {ch.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {ch.member_count.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ch.bot_is_admin ? 'default' : 'destructive'}>
                      {ch.bot_is_admin ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefresh(ch.id)}
                        disabled={isPending}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyInviteLink(ch.id)}
                      >
                        Invite
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeactivate(ch.id)}
                        disabled={isPending}
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
