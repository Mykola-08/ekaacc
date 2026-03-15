'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/platform/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { SentIcon, MoreVerticalIcon, TelephoneIcon, Video01Icon, Search01Icon, Message01Icon } from '@hugeicons/core-free-icons';

type Channel = {
  id: string;
  type: string;
  last_message?: string;
  updated_at: string;
  participants: Profile[];
};

type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: Profile;
};

export function ChatInterface() {
  const { user } = useAuth();
  const supabase = createClient();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch channels on mount
  useEffect(() => {
    if (!user) return;

    const fetchChannels = async () => {
      // detailed query would be complex with RLS, assuming a simplified view or function exists
      // or manually joining. For MVP, we fetch participants where user_id = me
      const { data: participation } = await supabase
        .from('chat_participants')
        .select('channel_id')
        .eq('profile_id', user.id);

      if (!participation?.length) {
        setIsLoading(false);
        return;
      }

      const channelIds = participation.map((p) => p.channel_id);

      const { data: channelData } = await supabase
        .from('chat_channels')
        .select(
          `
          id,
          type,
          updated_at,
          chat_participants(
            profile:profiles(id, full_name, avatar_url)
          )
        `
        )
        .in('id', channelIds)
        .order('updated_at', { ascending: false });

      if (channelData) {
        const formattedChannels = channelData.map((c: any) => ({
          id: c.id,
          type: c.type,
          updated_at: c.updated_at,
          participants: c.chat_participants.map((p: any) => p.profile),
        }));
        setChannels(formattedChannels);
        if (formattedChannels.length > 0) {
          setActiveChannelId(formattedChannels[0].id);
        }
      }
      setIsLoading(false);
    };

    fetchChannels();
  }, [user, supabase]);

  // Fetch messages and subscribe when active channel changes
  useEffect(() => {
    if (!activeChannelId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select(
          `
          id,
          content,
          sender_id,
          created_at,
          sender:profiles(id, full_name, avatar_url)
        `
        )
        .eq('channel_id', activeChannelId)
        .order('created_at', { ascending: true });

      if (data) {
        // @ts-ignore
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${activeChannelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${activeChannelId}`,
        },
        async (payload) => {
          // Fetch sender info for the new message
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: senderData,
          } as Message;

          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannelId, supabase]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChannelId || !user) return;

    const content = inputText.trim();
    setInputText('');

    const { error } = await supabase.from('chat_messages').insert({
      channel_id: activeChannelId,
      sender_id: user.id,
      content: content,
    });

    if (error) {
      console.error('Error sending message:', error);
      // Ideally show toast
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading conversations...</div>;
  }

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const otherParticipants = activeChannel?.participants.filter((p) => p.id !== user?.id) || [];
  const channelTitle = otherParticipants.map((p) => p.full_name).join(', ') || 'Chat';

  return (
    <div className="bg-background text-foreground flex h-full flex-col md:flex-row">
      {/* Sidebar List */}
      <div className="border-border w-full border-b md:w-80 md:border-r md:border-b-0">
        <div className="p-4">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground absolute top-2.5 left-2.5 size-4"  />
            <Input placeholder="Search messages..." className="bg-secondary/50 border-0 pl-9" />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="p-2">
            {channels.map((channel) => {
              const others = channel.participants.filter((p) => p.id !== user?.id);
              const title = others.map((p) => p.full_name).join(', ') || 'Unknown';
              const isActive = channel.id === activeChannelId;

              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={others[0]?.avatar_url} />
                    <AvatarFallback>{title.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="truncate font-medium">{title}</span>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(channel.updated_at), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {/* Last message placeholder - would need a real join or field */}
                      View conversation
                    </p>
                  </div>
                </button>
              );
            })}
            {channels.length === 0 && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                No conversations yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex h-150 flex-1 flex-col md:h-auto">
        {activeChannelId ? (
          <>
            {/* Header */}
            <header className="border-border flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={otherParticipants[0]?.avatar_url} />
                  <AvatarFallback>{channelTitle.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold">{channelTitle}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="bg-success/75 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                      <span className="bg-success relative inline-flex h-2 w-2 rounded-full"></span>
                    </span>
                    <span className="text-muted-foreground text-xs">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-8 w-8"
                >
                  <HugeiconsIcon icon={TelephoneIcon} className="size-4"  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-8 w-8"
                >
                  <HugeiconsIcon icon={Video01Icon} className="size-4"  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-8 w-8"
                >
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4"  />
                </Button>
              </div>
            </header>

            {/* Messages */}
            <ScrollArea className="bg-secondary/10 flex-1 p-4">
              <div className="mx-auto max-w-3xl">
                {messages.map((msg, i) => {
                  const isMe = msg.sender_id === user?.id;
                  const showAvatar =
                    !isMe && (i === 0 || messages[i - 1].sender_id !== msg.sender_id);

                  return (
                    <div
                      key={msg.id}
                      className={cn('flex w-full gap-2', isMe ? 'justify-end' : 'justify-start')}
                    >
                      {!isMe && (
                        <div className="w-8 shrink-0">
                          {showAvatar && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.sender?.avatar_url} />
                              <AvatarFallback>
                                {msg.sender?.full_name?.substring(0, 2) || '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[75%] rounded-xl px-4 py-2.5 text-sm',
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-card text-card-foreground border-border rounded-tl-none border'
                        )}
                      >
                        <p>{msg.content}</p>
                        <span
                          className={cn(
                            'mt-1 block text-[10px] opacity-70',
                            isMe ? 'text-primary-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="bg-card border-border border-t p-4">
              <form onSubmit={handleSendMessage} className="mx-auto flex max-w-3xl gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground shrink-0"
                >
                  <PlusSignIcon className="h-5 w-5" />
                </Button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-secondary/50 flex-1 border-0 focus-visible:ring-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputText.trim()}
                  className="shrink-0 rounded-full"
                >
                  <HugeiconsIcon icon={SentIcon} className="size-4"  />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <HugeiconsIcon icon={Message01Icon} className="size-8"  />
            </div>
            <h3 className="text-foreground mb-1 text-lg font-semibold">No Chat Selected</h3>
            <p className="max-w-xs text-sm">
              Select a conversation from the sidebar to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlusSignIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
