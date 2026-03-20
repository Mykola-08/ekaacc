'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SentIcon,
  PlusSignIcon,
  MessageMultiple01Icon,
  Loading03Icon,
  UserGroupIcon,
  Comment01Icon,
  Search01Icon,
  MoreVerticalIcon,
  PencilEdit01Icon,
  Delete01Icon,
  File01Icon,
  Attachment01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import {
  sendChannelMessage,
  createChannel,
  getChannelMessages,
  joinChannel,
  editChannelMessage,
  deleteChannelMessage,
} from '@/app/actions/channels-actions';
import { getSessionTemplates } from '@/app/actions/templates-actions';
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
  updated_at?: string;
  sender_id: string;
  sender: { full_name: string | null; avatar_url: string | null } | null;
};

type Template = {
  id: string;
  name: string;
  content: Record<string, any>;
  type: string | null;
};

function normalizeMessages(data: unknown): Message[] {
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    ...item,
    sender: Array.isArray(item.sender) ? (item.sender[0] ?? null) : (item.sender ?? null),
  }));
}

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
  return new Date(messages[index - 1].created_at).toDateString() !== new Date(messages[index].created_at).toDateString();
}

function isSameSender(messages: Message[], index: number) {
  if (index === 0) return false;
  if (messages[index - 1].sender_id !== messages[index].sender_id) return false;
  return new Date(messages[index].created_at).getTime() - new Date(messages[index - 1].created_at).getTime() < 5 * 60 * 1000;
}

// Safely extract text from a template content object (Plate.js JSON or plain string)
function templateToText(content: Record<string, any>): string {
  if (!content) return '';
  try {
    if (typeof content === 'string') return content;
    const nodes = Array.isArray(content) ? content : content.content ?? content.children ?? [];
    const extractText = (node: any): string => {
      if (typeof node === 'string') return node;
      if (node?.text != null) return String(node.text);
      if (Array.isArray(node?.children)) return node.children.map(extractText).join('');
      if (Array.isArray(node)) return node.map(extractText).join('\n');
      return '';
    };
    return nodes.map(extractText).join('\n').trim();
  } catch {
    return JSON.stringify(content);
  }
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

  // Edit message
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Delete message
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Template picker
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(templateSearch.toLowerCase())
  );

  // Load messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    setLoadingMessages(true);
    getChannelMessages(selectedChannel.id).then(({ data }) => {
      setMessages(normalizeMessages(data));
      setLoadingMessages(false);
    });
  }, [selectedChannel?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!selectedChannel) return;
    const interval = setInterval(() => {
      getChannelMessages(selectedChannel.id).then(({ data }) => {
        setMessages(normalizeMessages(data));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedChannel?.id]);

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || !selectedChannel) return;
    setSending(true);
    setMessageText('');

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
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...optimistic, id: (res.data as any).id } : m))
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleCreate = async () => {
    if (!newName.trim()) { setCreateError('Channel name is required.'); return; }
    setCreating(true); setCreateError(null);
    const res = await createChannel({ name: newName.trim(), description: newDesc.trim() || undefined });
    setCreating(false);
    if (!res.success) { setCreateError(res.error ?? 'Failed to create'); return; }
    const newChannel = res.data as Channel;
    setChannels((prev) => [newChannel, ...prev]);
    setSelectedChannel(newChannel);
    setNewName(''); setNewDesc(''); setShowCreate(false);
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.content);
  };

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;
    setEditSaving(true);
    const res = await editChannelMessage(editingId, editText.trim());
    setEditSaving(false);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => m.id === editingId ? { ...m, content: editText.trim() } : m)
      );
      setEditingId(null);
    }
  };

  const confirmDelete = async (messageId: string) => {
    setDeletingId(messageId);
    const res = await deleteChannelMessage(messageId);
    setDeletingId(null);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
  };

  const openTemplates = () => {
    setShowTemplates(true);
    if (templates.length === 0) {
      setLoadingTemplates(true);
      getSessionTemplates().then((res) => {
        setTemplates((res.data as Template[]) ?? []);
        setLoadingTemplates(false);
      });
    }
  };

  const insertTemplate = (template: Template) => {
    const text = templateToText(template.content);
    setMessageText((prev) => (prev ? prev + '\n\n' + text : text));
    setShowTemplates(false);
    setTemplateSearch('');
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height,4rem))] overflow-hidden">
      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <div className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Channels</h2>
          <Button variant="ghost" size="icon" className="size-7 rounded-[calc(var(--radius)*0.8)]" onClick={() => setShowCreate(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          </Button>
        </div>

        <div className="px-3 py-2">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search channels…"
              className="h-8 pl-8 text-xs rounded-[calc(var(--radius)*0.8)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {filteredChannels.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <HugeiconsIcon icon={MessageMultiple01Icon} className="size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">{search ? 'No channels found' : 'No channels yet'}</p>
              {!search && (
                <Button variant="ghost" size="sm" className="text-xs rounded-[calc(var(--radius)*0.8)]" onClick={() => setShowCreate(true)}>
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
                  'w-full flex items-center gap-2.5 rounded-[var(--radius)] px-3 py-2 text-left text-sm transition-colors',
                  selectedChannel?.id === ch.id
                    ? 'bg-muted text-foreground font-medium'
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

      {/* ── Main Chat ──────────────────────────────────────────────── */}
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
                <div className="rounded-[var(--radius)] bg-muted p-4">
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
                const isEditing = editingId === msg.id;
                const isDeleting = deletingId === msg.id;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-3 py-3">
                        <div className="flex-1 border-t border-border/50" />
                        <span className="text-xs text-muted-foreground font-medium">{formatDate(msg.created_at)}</span>
                        <div className="flex-1 border-t border-border/50" />
                      </div>
                    )}
                    <div className={cn('group flex gap-3', isMe && 'flex-row-reverse', groupWithPrev && 'mt-0.5')}>
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

                        {isEditing ? (
                          /* ─── Inline edit ─── */
                          <div className="flex flex-col gap-2 w-full min-w-[240px]">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="min-h-16 resize-none rounded-[var(--radius)] text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                                if (e.key === 'Escape') { setEditingId(null); }
                              }}
                            />
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs rounded-[calc(var(--radius)*0.8)]"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 px-2 text-xs rounded-[calc(var(--radius)*0.8)] gap-1"
                                onClick={saveEdit}
                                disabled={editSaving}
                              >
                                {editSaving
                                  ? <HugeiconsIcon icon={Loading03Icon} className="size-3 animate-spin" />
                                  : <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />}
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* ─── Normal message ─── */
                          <div className="relative flex items-end gap-1">
                            <div
                              className={cn(
                                'rounded-[var(--radius)] px-3 py-2 text-sm leading-relaxed',
                                isDeleting && 'opacity-40',
                                isMe
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                  : 'bg-muted text-foreground rounded-tl-sm'
                              )}
                            >
                              {msg.content}
                            </div>

                            {/* Actions (only for own messages, visible on hover) */}
                            {isMe && (
                              <div className={cn(
                                'opacity-0 group-hover:opacity-100 transition-opacity',
                                isMe ? 'order-first' : 'order-last'
                              )}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-6 rounded-[calc(var(--radius)*0.8)] text-muted-foreground hover:bg-muted"
                                    >
                                      <HugeiconsIcon icon={MoreVerticalIcon} className="size-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align={isMe ? 'end' : 'start'} className="rounded-[var(--radius)]">
                                    <DropdownMenuItem
                                      className="gap-2 text-xs rounded-[calc(var(--radius)*0.8)]"
                                      onClick={() => startEdit(msg)}
                                    >
                                      <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="gap-2 text-xs text-destructive focus:text-destructive rounded-[calc(var(--radius)*0.8)]"
                                      onClick={() => confirmDelete(msg.id)}
                                    >
                                      <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-background px-3 py-1.5 focus-within:border-primary/50 transition-colors">
              {/* Attach template Button */}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 rounded-[calc(var(--radius)*0.8)] text-muted-foreground hover:text-foreground"
                onClick={openTemplates}
                title="Attach template"
              >
                <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
              </Button>

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
                className="size-7 shrink-0 rounded-[calc(var(--radius)*0.8)]"
                onClick={handleSend}
                disabled={sending || !messageText.trim()}
              >
                {sending
                  ? <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                  : <HugeiconsIcon icon={SentIcon} className="size-3.5" />}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              <kbd className="rounded border border-border px-1 py-0.5 text-xs font-mono">Enter</kbd> to send
              {' · '}
              <kbd className="rounded border border-border px-1 py-0.5 text-xs font-mono">
                <HugeiconsIcon icon={Attachment01Icon} className="inline size-2.5" />
              </kbd> to insert template
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-[var(--radius)] bg-muted p-6">
            <HugeiconsIcon icon={UserGroupIcon} className="size-12 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Welcome to Channels</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Join or create a channel to start collaborating with your care team.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-[calc(var(--radius)*0.8)]">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Create a Channel
          </Button>
        </div>
      )}

      {/* ── Create Channel Dialog ───────────────────────────────── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-[var(--radius)] max-w-sm">
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
                  className="h-10 pl-7 rounded-[var(--radius)]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What is this channel about?"
                className="min-h-16 resize-none rounded-[var(--radius)]"
              />
            </div>
            {createError && (
              <Alert variant="destructive"><AlertDescription>{createError}</AlertDescription></Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} className="gap-2 rounded-[calc(var(--radius)*0.8)]">
              {creating && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {creating ? 'Creating…' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Template Picker Dialog ──────────────────────────────── */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="rounded-[var(--radius)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="size-5 text-muted-foreground" />
              Insert Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search templates…"
                className="h-9 pl-9 rounded-[var(--radius)]"
                autoFocus
              />
            </div>

            <ScrollArea className="h-72 rounded-[var(--radius)] border border-border">
              {loadingTemplates ? (
                <div className="flex items-center justify-center py-12">
                  <HugeiconsIcon icon={Loading03Icon} className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    {templateSearch ? 'No templates match your search.' : 'No templates yet.'}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => insertTemplate(t)}
                      className="w-full flex items-start gap-3 rounded-[var(--radius)] px-3 py-2.5 text-left hover:bg-muted transition-colors"
                    >
                      <div className="mt-0.5 rounded-[calc(var(--radius)*0.8)] bg-primary/10 p-1.5 shrink-0">
                        <HugeiconsIcon icon={File01Icon} className="size-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.name}</p>
                        {t.type && (
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{t.type.replace(/_/g, ' ')}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="ghost" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => setShowTemplates(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
