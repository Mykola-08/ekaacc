'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const [conversations, setConversations] = useState<User[]>([]);
  const [activeConversation, setActiveConversation] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conversations (e.g., user's therapist)
  useEffect(() => {
    async function fetchConversations() {
      if (dataService && user) {
        setIsLoading(true);
        const allUsers = await dataService.getAllUsers();
        const therapist = allUsers.find(u => u.role === 'Therapist');
        if (therapist) {
          setConversations([therapist]);
          setActiveConversation(therapist);
        }
        setIsLoading(false);
      }
    }
    fetchConversations();
  }, [dataService, user]);

  // Fetch messages for the active conversation
  useEffect(() => {
    async function fetchMessages() {
      if (dataService && activeConversation) {
        const conversationId = [user?.uid, activeConversation.id].sort().join('_');
        const userMessages = await dataService.getMessages(conversationId);
        setMessages(userMessages);
      }
    }
    fetchMessages();
  }, [dataService, activeConversation, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dataService || !user || !activeConversation) return;
    const conversationId = [user.uid, activeConversation.id].sort().join('_');
    const message: Omit<Message, 'id'> = {
      role: 'user',
      content: newMessage,
    };
    const sentMessage = await dataService.sendMessage(conversationId, message);
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Conversation List */}
      <aside className="w-1/4 border-r">
        <header className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </header>
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => <ConversationSkeleton key={i} />)}
            </div>
          ) : (
            conversations.map(convoUser => (
              <ConversationItem
                key={convoUser.id}
                user={convoUser}
                isActive={activeConversation?.id === convoUser.id}
                onClick={() => setActiveConversation(convoUser)}
              />
            ))
          )}
        </ScrollArea>
      </aside>

      {/* Message View */}
      <main className="w-3/4 flex flex-col">
        {activeConversation ? (
          <>
            <header className="p-4 border-b flex items-center gap-4">
              <Avatar>
                <AvatarImage src={activeConversation.avatarUrl} />
                <AvatarFallback>{activeConversation.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{activeConversation.name}</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <MessageItem key={msg.id} message={msg} />
                ))}
              </div>
            </ScrollArea>

            <footer className="p-4 border-t">
              <div className="relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-24"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function ConversationItem({ user, isActive, onClick }: { user: User, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 w-full text-left hover:bg-muted/50 transition-colors",
        isActive && "bg-muted"
      )}
    >
      <Avatar>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold">{user.name}</h4>
        <p className="text-sm text-muted-foreground truncate">
          That's great to hear. Is there anything...
        </p>
      </div>
      <span className="text-xs text-muted-foreground">2m ago</span>
    </button>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md p-3 rounded-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
