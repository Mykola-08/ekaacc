'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/supabase-auth';
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
    <div className="apple-page">
      <div className="apple-flex apple-h-[calc(100vh-80px)] apple-bg-background">
        {/* Conversation List */}
        <aside className="apple-w-1/4 apple-border-r apple-border-border">
          <header className="apple-p-6 apple-border-b apple-border-border">
            <h2 className="apple-title-section">Messages</h2>
          </header>
          <ScrollArea className="apple-h-full">
            {isLoading ? (
              <div className="apple-p-6 apple-space-y-4">
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
        <main className="apple-w-3/4 apple-flex apple-flex-col apple-bg-background">
          {activeConversation ? (
            <>
              <header className="apple-p-6 apple-border-b apple-border-border apple-flex apple-items-center apple-gap-4">
                <Avatar className="apple-avatar">
                  <AvatarImage src={activeConversation.avatarUrl} />
                  <AvatarFallback>{activeConversation.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="apple-title-card">{activeConversation.name}</h3>
                  <p className="apple-text-xs" style={{color: 'hsl(var(--muted-foreground))'}}>Online</p>
                </div>
              </header>

              <ScrollArea className="apple-flex-1 apple-p-6">
                <div className="apple-space-y-6">
                  {messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                  ))}
                </div>
              </ScrollArea>

              <footer className="apple-p-6 apple-border-t apple-border-border">
                <div className="apple-relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="apple-input apple-pr-24"
                  />
                  <div className="apple-absolute apple-right-3 apple-top-1/2 apple--translate-y-1/2 apple-flex apple-items-center apple-gap-2">
                    <Button variant="outline" size="icon" className="apple-button-outline">
                      <Paperclip className="apple-w-5 apple-h-5" />
                    </Button>
                    <Button onClick={handleSendMessage} className="apple-button-gradient-blue apple-p-2">
                      <Send className="apple-w-5 apple-h-5" />
                    </Button>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <div className="apple-flex-1 apple-flex apple-items-center apple-justify-center" style={{color: 'hsl(var(--muted-foreground))'}}>
              <p className="apple-text-body">Select a conversation to start messaging.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ConversationItem({ user, isActive, onClick }: { user: User, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "apple-flex apple-items-center apple-gap-4 apple-p-6 apple-w-full apple-text-left apple-hover:bg-muted/50 apple-transition-colors",
        isActive && "apple-bg-muted"
      )}
    >
      <Avatar className="apple-avatar">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="apple-flex-1">
        <h4 className="apple-title-card">{user.name}</h4>
        <p className="apple-text-sm" style={{color: 'hsl(var(--muted-foreground))'}}>
          That's great to hear. Is there anything...
        </p>
      </div>
      <span className="apple-text-xs" style={{color: 'hsl(var(--muted-foreground))'}}>2m ago</span>
    </button>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn("apple-flex", isUser ? "apple-justify-end" : "apple-justify-start")}>
      <div
        className={cn(
          "apple-max-w-xs lg:apple-max-w-md apple-p-4 apple-rounded-xl",
          isUser
            ? "apple-bg-primary apple-text-primary-foreground"
            : "apple-bg-muted"
        )}
      >
        <p className="apple-text-body">{message.content}</p>
      </div>
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <div className="apple-flex apple-items-center apple-gap-4 apple-p-6">
      <Skeleton className="apple-h-12 apple-w-12 apple-rounded-full" />
      <div className="apple-space-y-2 apple-flex-1">
        <Skeleton className="apple-h-4 apple-w-3/4" />
        <Skeleton className="apple-h-4 apple-w-1/2" />
      </div>
    </div>
  )
}
