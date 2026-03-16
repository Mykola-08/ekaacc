'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SentIcon,
  PlusSignIcon,
  MessageMultiple01Icon,
  Loading03Icon,
  UserGroupIcon,
  Comment01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import {
  sendChannelMessage,
  createChannel,
  getChannelMessages,
  joinChannel,
} from '@/app/actions/channels-actions';
import { cn } from '@/lib/utils';

type Channel = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  created_at: string;
};

type Message = {
  id: string;
  content: string;
  type: string;
  created_at: string;
  sender_id: string;
  sender: { full_name: string | null; avatar_url: string | null } | null;
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getInitials(name: string | null) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function shouldShowDateSeparator(messages: Message[], index: number) {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].created_at).toDateString();
  const curr = new Date(messages[index].created_at).toDateString();
  return prev !== curr;
}

function isSameSender(messages: Message[], index: number) {
  if (index === 0) return false;
  const prev = messages[index - 1];
  const curr = messages[index];
  if (prev.sender_id !== curr.sender_id) return false;
  const diff = new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime();
  return diff < 5 * 60 * 1000; // 5 min
}

export function ChatPageClient({
  myChannels: initialChannels,
  userId,
  userFullName,
}: {
  myChannels: Channel[];
  userId: string;
  userFullName: string | null;
}) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(initialChannels[0] ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [, startTransition] = useTransition();

  // Create channel dialog
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Load messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    setLoadingMessages(true);
    getChannelMessages(selectedChannel.id).then(({ data }) => {
      setMessages((data as Message[]) ?? []);
      setLoadingMessages(false);
    });
  }, [selectedChannel?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 8s when channel is active
  useEffect(() => {
    if (!selectedChannel) return;
    const interval = setInterval(() => {
      getChannelMessages(selectedChannel.id).then(({ data }) => {
        setMessages((data as Message[]) ?? []);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedChannel?.id]);

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || !selectedChannel) return;
    setSending(true);
    setMessageText('');

    // Optimistic message
    const optimistic: Message = {
      id: `optimistic-${Date.now()}`,
      content: text,
      type: 'text',
      created_at: new Date().toISOString(),
      sender_id: userId,
      sender: { full_name: userFullName, avatar_url: null },
    };
    setMessages((prev) => [...prev, optimistic]);

    const res = await sendChannelMessage(selectedChannel.id, text);
    setSending(false);
    if (res.success) {
      // Replace optimistic with real message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimistic.id
            ? { ...optimistic, id: (res.data as any).id }
            : m
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) { setCreateError('Channel name is required.'); return; }
    setCreating(true);
    setCreateError(null);
    const res = await createChannel({ name: newName.trim(), description: newDesc.trim() || undefined });
    setCreating(false);
    if (!res.success) { setCreateError(res.error ?? 'Failed to create'); return; }
    const newChannel = res.data as Channel;
    setChannels((prev) => [newChannel, ...prev]);
    setSelectedChannel(newChannel);
    setNewName(''); setNewDesc('');
    setShowCreate(false);
  };

  const handleJoin = (channelId: string) => {
    startTransition(async () => {
      await joinChannel(channelId);
    });
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height,4rem))] overflow-hidden">
      {/* Sidebar */}
      <div className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
        {/* Sidebar header */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Channels</h2>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full"
            onClick={() => setShowCreate(true)}
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search channels…"
              className="h-8 pl-8 text-xs rounded-lg"
            />
          </div>
        </div>

        {/* Channel list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {filteredChannels.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <HugeiconsIcon icon={MessageMultiple01Icon} className="size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                {search ? 'No channels found' : 'No channels yet'}
              </p>
              {!search && (
                <Button variant="ghost" size="sm" className="text-xs rounded-full" onClick={() => setShowCreate(true)}>
                  Create one
                </Button>
              )}
            </div>
          ) : (
            filteredChannels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors',
                  selectedChannel?.id === ch.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className="font-medium text-xs text-current opacity-60">#</span>
                <span className="truncate text-xs font-medium">{ch.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      {selectedChannel ? (
        <div className="flex flex-1 flex-col min-w-0">
          {/* Channel header */}
          <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground font-semibold">#</span>
              <h3 className="text-sm font-semibold truncate">{selectedChannel.name}</h3>
              {selectedChannel.type === 'announcement' && (
                <Badge variant="secondary" className="text-xs shrink-0">Announcements</Badge>
              )}
            </div>
            {selectedChannel.description && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <p className="truncate text-xs text-muted-foreground">{selectedChannel.description}</p>
              </>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <HugeiconsIcon icon={Loading03Icon} className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="rounded-2xl bg-muted p-4">
                  <HugeiconsIcon icon={Comment01Icon} className="size-8 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="font-semibold text-sm">No messages yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Be the first to say something in #{selectedChannel.name}!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender_id === userId;
                const groupWithPrev = isSameSender(messages, i);
                const showDate = shouldShowDateSeparator(messages, i);

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-3 py-3">
                        <div className="flex-1 border-t border-border/50" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDate(msg.created_at)}
                        </span>
                        <div className="flex-1 border-t border-border/50" />
                      </div>
                    )}
                    <div className={cn('flex gap-3', isMe && 'flex-row-reverse', groupWithPrev && 'mt-0.5')}>
                      {/* Avatar */}
                      {groupWithPrev ? (
                        <div className="w-8 shrink-0" />
                      ) : (
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className="text-xs bg-muted">
                            {getInitials(msg.sender?.full_name ?? null)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn('flex flex-col gap-0.5 max-w-[70%]', isMe && 'items-end')}>
                        {!groupWithPrev && (
                          <div className={cn('flex items-baseline gap-2', isMe && 'flex-row-reverse')}>
                            <span className="text-xs font-semibold">
                              {isMe ? 'You' : (msg.sender?.full_name ?? 'Unknown')}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        )}
                        <div
                          className={cn(
                            'rounded-2xl px-3 py-2 text-sm leading-relaxed',
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-tr-sm'
                              : 'bg-muted text-foreground rounded-tl-sm'
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 focus-within:border-primary/50 transition-colors">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${selectedChannel.name}…`}
                className="flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 h-8"
                disabled={sending}
              />
              <Button
                size="icon"
                className="size-7 shrink-0 rounded-full"
                onClick={handleSend}
                disabled={sending || !messageText.trim()}
              >
                {sending ? (
                  <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={SentIcon} className="size-3.5" />
                )}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border px-1 py-0.5 text-xs font-mono">Enter</kbd> to send
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-2xl bg-muted p-6">
            <HugeiconsIcon icon={UserGroupIcon} className="size-12 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Welcome to Channels</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Join or create a channel to start collaborating with your care team.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-full">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Create a Channel
          </Button>
        </div>
      )}

      {/* Create Channel Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>New Channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Channel Name <span className="text-destructive">*</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">#</span>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="general"
                  className="h-10 pl-7 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What is this channel about?"
                className="min-h-16 resize-none rounded-xl"
              />
            </div>
            {createError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{createError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} className="gap-2 rounded-full">
              {creating && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {creating ? 'Creating…' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
