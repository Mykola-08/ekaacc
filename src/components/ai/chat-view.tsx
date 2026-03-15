'use client';

/**
 * AI Chat View
 *
 * Main chat interface using AI Elements conversation primitives,
 * visual blocks, and the full-page chat experience.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ui/loader';
import { ChatMessage } from '@/components/ai/chat-message';
import { ChatInput } from '@/components/ai/chat-input';
import { ChatWelcome } from '@/components/ai/chat-welcome';
import { ConversationList } from '@/components/ai/conversation-list';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/components/ui/morphing-toaster';
import { useWebLLMAvailable } from '@/hooks/use-webllm';
import { WebLLMChatTransport } from '@/lib/platform/integrations/webllm';
import { HugeiconsIcon } from '@hugeicons/react';
import { PanelLeftIcon, GlobeIcon } from '@hugeicons/core-free-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConversationItem {
  id: string;
  title: string | null;
  updatedAt: string;
}

export function AIChatView() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [useWebLLM, setUseWebLLM] = useState(false);
  const webllmAvailable = useWebLLMAvailable();

  // Memoize transport — switches between server API and WebLLM
  const transport = useMemo(
    () =>
      useWebLLM && webllmAvailable
        ? new WebLLMChatTransport()
        : new DefaultChatTransport({
            api: '/api/ai/chat',
            body: { conversationId },
          }),
    [conversationId, useWebLLM, webllmAvailable]
  );

  const { messages, sendMessage, status, stop, setMessages, regenerate, error } = useChat({
    transport,
    onError: (err) => {
      toast.error(err.message || 'Failed to get AI response');
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const isStreaming = status === 'streaming';

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      // Silently fail
    }
  }, []);

  const handleNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setInput('');
    setSidebarOpen(false);
  }, [setMessages]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/ai/conversations?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setConversationId(id);
          // Convert DB messages to UIMessage format with parts
          const chatMessages = (data.messages || [])
            .filter((m: any) => m.role !== 'system')
            .map((m: any) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: 'text' as const, text: m.content }],
            }));
          setMessages(chatMessages);
        }
      } catch {
        toast.error('Failed to load conversation');
      }
      setSidebarOpen(false);
    },
    [setMessages]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/ai/conversations?id=${id}`, { method: 'DELETE' });
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (conversationId === id) {
          handleNewConversation();
        }
      } catch {
        toast.error('Failed to delete conversation');
      }
    },
    [conversationId, handleNewConversation]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage({ text });
  }, [input, sendMessage]);

  const handleSuggestion = useCallback(
    (text: string) => {
      setInput('');
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100dvh-6rem)] max-h-225 overflow-hidden rounded-lg border">
      {/* Desktop sidebar */}
      <div className="bg-muted/30 hidden w-64 shrink-0 border-r lg:block">
        <ConversationList
          conversations={conversations}
          activeId={conversationId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
        />
      </div>

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          {/* Mobile sidebar trigger */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
                <HugeiconsIcon icon={PanelLeftIcon} className="size-4"  />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Conversations</SheetTitle>
              <ConversationList
                conversations={conversations}
                activeId={conversationId}
                onSelect={handleSelectConversation}
                onNew={handleNewConversation}
                onDelete={handleDeleteConversation}
              />
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-sm font-semibold">EKA Assistant</h1>
            <p className="text-muted-foreground text-xs">
              {useWebLLM && webllmAvailable ? 'WebLLM (local)' : 'Your AI wellness companion'}
            </p>
          </div>

          {/* WebLLM toggle */}
          {webllmAvailable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={useWebLLM ? 'default' : 'ghost'}
                    size="icon"
                    className="size-8"
                    onClick={() => setUseWebLLM(!useWebLLM)}
                  >
                    {useWebLLM ? (
                      <HugeiconsIcon icon={GlobeIcon} className="size-4"  />
                    ) : (
                      <HugeiconsIcon icon={GlobeIcon} className="size-4"  />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {useWebLLM ? 'Using WebLLM (local)' : 'Switch to WebLLM'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-hidden">
          {hasMessages ? (
            <Conversation className="h-full">
              <ConversationContent className="gap-8 px-4 py-4">
                {messages.map((message, i) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLast={i === messages.length - 1 && message.role === 'assistant'}
                    isStreaming={isStreaming}
                    onCopy={handleCopy}
                    onRegenerate={() => regenerate()}
                  />
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex items-center gap-3 pl-12">
                    <Loader variant="typing" className="text-muted-foreground" />
                  </div>
                )}
              </ConversationContent>

              <ConversationScrollButton />
            </Conversation>
          ) : (
            <ChatWelcome onSuggestion={handleSuggestion} />
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSend}
            onStop={stop}
            status={status}
            showSuggestions={false}
            onSuggestion={handleSuggestion}
          />
          <p className="text-muted-foreground text-2xs mt-2 text-center">
            EKA can make mistakes. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
