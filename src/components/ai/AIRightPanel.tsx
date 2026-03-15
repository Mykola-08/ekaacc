'use client';

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
import { useRightPanel } from '@/context/platform/right-panel-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWebLLMAvailable } from '@/hooks/use-webllm';
import { WebLLMChatTransport } from '@/lib/platform/integrations/webllm';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { X, PanelLeft, Plus, Globe, Monitor } from 'lucide-react';
import { toast } from '@/components/ui/morphing-toaster';
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

export function AIRightPanel() {
  const { isOpen, close } = useRightPanel();
  const isMobile = useIsMobile();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [input, setInput] = useState('');
  const [useWebLLMMode, setUseWebLLMMode] = useState(false);
  const webllmAvailable = useWebLLMAvailable();

  const transport = useMemo(
    () =>
      useWebLLMMode && webllmAvailable
        ? new WebLLMChatTransport()
        : new DefaultChatTransport({
            api: '/api/ai/chat',
            body: { conversationId },
          }),
    [conversationId, useWebLLMMode, webllmAvailable]
  );

  const { messages, sendMessage, status, stop, setMessages, regenerate } = useChat({
    transport,
    onError: (err) => {
      toast.error(err.message || 'Failed to get AI response');
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const isStreaming = status === 'streaming';

  useEffect(() => {
    if (isOpen) fetchConversations();
  }, [isOpen]);

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
    setHistoryOpen(false);
  }, [setMessages]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/ai/conversations?id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          setConversationId(id);
          const chatMessages = (data.messages || [])
            .filter((m: { role: string }) => m.role !== 'system')
            .map((m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: 'text' as const, text: m.content }],
            }));
          setMessages(chatMessages);
        }
      } catch {
        toast.error('Failed to load conversation');
      }
      setHistoryOpen(false);
    },
    [setMessages]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/ai/conversations?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (conversationId === id) handleNewConversation();
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

  // Mobile: render as a full-screen Sheet from the right
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetTitle className="sr-only">EKA Assistant</SheetTitle>
          <PanelContent
            hasMessages={hasMessages}
            messages={messages}
            isLoading={isLoading}
            isStreaming={isStreaming}
            status={status}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleSuggestion={handleSuggestion}
            handleCopy={handleCopy}
            stop={stop}
            regenerate={regenerate}
            historyOpen={historyOpen}
            setHistoryOpen={setHistoryOpen}
            conversations={conversations}
            conversationId={conversationId}
            handleSelectConversation={handleSelectConversation}
            handleNewConversation={handleNewConversation}
            handleDeleteConversation={handleDeleteConversation}
            onClose={close}
            webllmAvailable={webllmAvailable}
            useWebLLM={useWebLLMMode}
            onToggleWebLLM={() => setUseWebLLMMode(!useWebLLMMode)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: docked right panel
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="bg-background relative flex h-svh shrink-0 flex-col overflow-hidden border-l"
        >
          <div className="flex w-95 flex-1 flex-col">
            <PanelContent
              hasMessages={hasMessages}
              messages={messages}
              isLoading={isLoading}
              isStreaming={isStreaming}
              status={status}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleSuggestion={handleSuggestion}
              handleCopy={handleCopy}
              stop={stop}
              regenerate={regenerate}
              historyOpen={historyOpen}
              setHistoryOpen={setHistoryOpen}
              conversations={conversations}
              conversationId={conversationId}
              handleSelectConversation={handleSelectConversation}
              handleNewConversation={handleNewConversation}
              handleDeleteConversation={handleDeleteConversation}
              onClose={close}
              webllmAvailable={webllmAvailable}
              useWebLLM={useWebLLMMode}
              onToggleWebLLM={() => setUseWebLLMMode(!useWebLLMMode)}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ─── Inner content shared between mobile Sheet and desktop panel ─── */

interface PanelContentProps {
  hasMessages: boolean;
  messages: ReturnType<typeof useChat>['messages'];
  isLoading: boolean;
  isStreaming: boolean;
  status: ReturnType<typeof useChat>['status'];
  input: string;
  setInput: (v: string) => void;
  handleSend: () => void;
  handleSuggestion: (text: string) => void;
  handleCopy: (content: string) => void;
  stop: () => void;
  regenerate: () => void;
  historyOpen: boolean;
  setHistoryOpen: (v: boolean) => void;
  conversations: ConversationItem[];
  conversationId: string | null;
  handleSelectConversation: (id: string) => Promise<void>;
  handleNewConversation: () => void;
  handleDeleteConversation: (id: string) => Promise<void>;
  onClose: () => void;
  webllmAvailable: boolean;
  useWebLLM: boolean;
  onToggleWebLLM: () => void;
}

function PanelContent({
  hasMessages,
  messages,
  isLoading,
  isStreaming,
  status,
  input,
  setInput,
  handleSend,
  handleSuggestion,
  handleCopy,
  stop,
  regenerate,
  historyOpen,
  setHistoryOpen,
  conversations,
  conversationId,
  handleSelectConversation,
  handleNewConversation,
  handleDeleteConversation,
  onClose,
  webllmAvailable,
  useWebLLM,
  onToggleWebLLM,
}: PanelContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <PanelLeft className="size-4" />
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
          <h2 className="text-sm font-semibold">EKA Assistant</h2>
          <p className="text-muted-foreground text-xs">
            {useWebLLM ? 'WebLLM (local)' : 'Your AI wellness companion'}
          </p>
        </div>

        {webllmAvailable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={useWebLLM ? 'default' : 'ghost'}
                  size="icon"
                  className="size-8"
                  onClick={onToggleWebLLM}
                >
                  {useWebLLM ? <Monitor className="size-4" /> : <Globe className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {useWebLLM ? 'Using WebLLM (local)' : 'Switch to WebLLM'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button variant="ghost" size="icon" className="size-8" onClick={handleNewConversation}>
          <Plus className="size-4" />
          <span className="sr-only">New conversation</span>
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
          <X className="size-4" />
          <span className="sr-only">Close panel</span>
        </Button>
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
      <div className={cn('border-t p-3', !hasMessages && 'border-t-0')}>
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          onStop={stop}
          status={status}
          showSuggestions={false}
          onSuggestion={handleSuggestion}
        />
      </div>
    </>
  );
}
