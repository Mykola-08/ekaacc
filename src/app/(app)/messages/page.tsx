'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Send, MessageSquare } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Messages</h1>
          </div>
          <p className="text-xl text-muted-foreground">Communicate securely with your care team</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-muted hover:border-border transition-all duration-300">
            <CardContent className="p-0">
              <div className="flex h-[calc(100vh-300px)]">
                {/* Conversation List */}
                <aside className="w-1/3 border-r border-muted">
                  <div className="p-4 border-b border-muted">
                    <h2 className="text-lg font-semibold">Conversations</h2>
                  </div>
                  <div className="overflow-y-auto">
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
                  </div>
                </aside>

                {/* Message View */}
                <main className="w-2/3 flex flex-col bg-background">
                  {activeConversation ? (
                    <>
                      <header className="p-4 border-b border-muted flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={activeConversation.avatarUrl} />
                          <AvatarFallback>{activeConversation.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{activeConversation.name}</h3>
                          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Online</p>
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
                    <div className="flex-1 flex items-center justify-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <p>Select a conversation to start messaging.</p>
                    </div>
                  )}
                </main>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ConversationItem({ user, isActive, onClick }: { user: User, isActive: boolean, onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "flex items-center gap-4 p-6 w-full justify-start text-left hover:bg-muted/50 transition-colors",
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
    </Button>
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
  );
}
