'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Button, Input, Avatar, AvatarFallback, AvatarImage, Card, CardContent, Skeleton } from '@/components/keep';
import { Paperclip, Send } from 'lucide-react';
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
    <div>
      <div className="flex h-[calc(100vh-80px)] bg-background">
        {/* Conversation List */}
        <aside className="w-1/4 border-r border-border">
          <header className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold">Messages</h2>
          </header>
          <Card className="h-full overflow-y-auto border-0 shadow-none">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
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
            </CardContent>
          </Card>
        </aside>

        {/* Message View */}
        <main className="w-3/4 flex flex-col bg-background">
          {activeConversation ? (
            <>
              <header className="p-6 border-b border-border flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={activeConversation.avatarUrl} />
                  <AvatarFallback>{activeConversation.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{activeConversation.name}</h3>
                  <p className="text-xs" style={{color: 'hsl(var(--muted-foreground))'}}>Online</p>
                </div>
              </header>

              <Card className="flex-1 overflow-y-auto border-0 shadow-none">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <MessageItem key={msg.id} message={msg} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <footer className="p-6 border-t border-border">
                <div className="relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-24"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleSendMessage} className="p-2">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{color: 'hsl(var(--muted-foreground))'}}>
              <p>Select a conversation to start messaging.</p>
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
        "flex items-center gap-4 p-6 w-full text-left hover:bg-muted/50 transition-colors",
        isActive && "bg-muted"
      )}
    >
      <Avatar>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold text-lg">{user.name}</h4>
        <p className="text-sm" style={{color: 'hsl(var(--muted-foreground))'}}>
          That's great to hear. Is there anything...
        </p>
      </div>
      <span className="text-xs" style={{color: 'hsl(var(--muted-foreground))'}}>2m ago</span>
    </button>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}> 
      <div
        className={cn(
          "max-w-xs lg:max-w-md p-4 rounded-xl",
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
    <div className="flex items-center gap-4 p-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
