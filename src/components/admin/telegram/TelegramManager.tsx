'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Users, RefreshCcw, Trash2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TelegramChat = {
  chat_id: number;
  title: string;
  type: string;
  is_active: boolean;
};

interface TelegramManagerProps {
  chats: TelegramChat[];
}

export function TelegramManager({ chats }: TelegramManagerProps) {
  const [selectedChat, setSelectedChat] = useState<TelegramChat | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!selectedChat || !message.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/admin/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChat.chat_id,
          message: message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Message sent to ${selectedChat.title}`);
        setMessage('');
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <DashboardHeader
        title="Telegram Integration"
        subtitle="Manage bot connections and broadcast messages."
      >
        <Button className="gap-2 rounded-full">
          <RefreshCcw className="h-4 w-4" />
          Refresh Chats
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chat List */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-foreground px-1 text-lg font-bold">Active Channels & Groups</h3>
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  'hover:bg-secondary/40 cursor-pointer rounded-2xl border p-4 transition-all',
                  selectedChat?.chat_id === chat.chat_id
                    ? 'bg-primary/5 border-primary shadow-sm'
                    : 'bg-card border-border/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-foreground truncate font-semibold">{chat.title}</div>
                    <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      {chat.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {chats.length === 0 && (
              <div className="text-muted-foreground bg-card border-border rounded-2xl border border-dashed p-8 text-center">
                No chats found. Add bot to a group first.
              </div>
            )}
          </div>
        </div>

        {/* Main Action Area */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <DashboardCard title={`Message: ${selectedChat.title}`} icon={Send}>
              <div className="mt-4 space-y-6">
                <div className="bg-secondary/30 border-border/40 text-muted-foreground rounded-xl border p-4 text-sm">
                  Targeting Chat ID:{' '}
                  <code className="bg-secondary text-foreground rounded px-1.5 py-0.5 font-mono">
                    {selectedChat.chat_id}
                  </code>
                </div>
                <Textarea
                  placeholder="Type your broadcast message here... (supports HTML)"
                  className="bg-background border-border min-h-[150px] resize-none rounded-2xl p-4 text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedChat(null)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={isSending || !message.trim()}
                    className="bg-primary text-primary-foreground shadow-primary/20 rounded-full px-8 shadow-lg"
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </div>
            </DashboardCard>
          ) : (
            <div className="bg-card border-border/60 flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border p-8 text-center">
              <div className="bg-secondary text-muted-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-foreground text-xl font-bold">Select a Group</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Choose a channel or group from the list to send a broadcast message or manage
                settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
