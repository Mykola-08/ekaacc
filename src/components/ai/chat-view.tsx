"use client";

/**
 * AI Chat View
 *
 * Main chat interface combining prompt-kit, motion primitives,
 * and visual blocks into a complete AI chat experience.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container";
import { ScrollButton } from "@/components/prompt-kit/scroll-button";
import { Loader } from "@/components/prompt-kit/loader";
import { ChatMessage } from "@/components/ai/chat-message";
import { ChatInput } from "@/components/ai/chat-input";
import { ChatWelcome } from "@/components/ai/chat-welcome";
import { ConversationList } from "@/components/ai/conversation-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { toast } from "sonner";

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
}

export function AIChatView() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");

  // Memoize transport so it updates when conversationId changes
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: { conversationId },
      }),
    [conversationId]
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    regenerate,
    error,
  } = useChat({
    transport,
    onError: (err) => {
      toast.error(err.message || "Failed to get AI response");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/conversations");
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
    setInput("");
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
            .filter((m: any) => m.role !== "system")
            .map((m: any) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: "text" as const, text: m.content }],
            }));
          setMessages(chatMessages);
        }
      } catch {
        toast.error("Failed to load conversation");
      }
      setSidebarOpen(false);
    },
    [setMessages]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/ai/conversations?id=${id}`, { method: "DELETE" });
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (conversationId === id) {
          handleNewConversation();
        }
      } catch {
        toast.error("Failed to delete conversation");
      }
    },
    [conversationId, handleNewConversation]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage({ text });
  }, [input, sendMessage]);

  const handleSuggestion = useCallback(
    (text: string) => {
      setInput("");
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100dvh-6rem)] max-h-225 overflow-hidden rounded-2xl border">
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
                <PanelLeft className="h-4 w-4" />
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
            <p className="text-muted-foreground text-xs">Your AI wellness companion</p>
          </div>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-hidden">
          {hasMessages ? (
            <ChatContainerRoot className="h-full">
              <ChatContainerContent className="space-y-4 px-4 py-4">
                {messages.map((message, i) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLast={i === messages.length - 1 && message.role === "assistant"}
                    onCopy={handleCopy}
                    onRegenerate={() => regenerate()}
                  />
                ))}

                {isLoading &&
                  messages[messages.length - 1]?.role === "user" && (
                    <div className="flex items-center gap-3 pl-12">
                      <Loader variant="typing" className="text-muted-foreground" />
                    </div>
                  )}

                <ChatContainerScrollAnchor />
              </ChatContainerContent>

              <ScrollButton className="absolute bottom-20 right-4" />
            </ChatContainerRoot>
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
            isLoading={isLoading}
            showSuggestions={false}
            onSuggestion={handleSuggestion}
          />
          <p className="text-muted-foreground mt-2 text-center text-[10px]">
            EKA can make mistakes. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
