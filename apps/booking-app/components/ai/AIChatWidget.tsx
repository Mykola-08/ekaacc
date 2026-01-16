'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, X, MessageSquare, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { BookingResult, ServiceResult, WalletResult, AvailabilityResult, BookingConfirmation } from './GenerativeUI';
import { format } from 'date-fns';

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}

interface Message {
  id: string;
  role: 'function' | 'system' | 'user' | 'assistant' | 'data' | 'tool';
  content: string;
  toolInvocations?: ToolInvocation[];
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    // @ts-expect-error - api type definition mismatch in ai sdk v3 vs v4
    api: '/api/chat',
  }) as unknown as {
    messages: Message[];
    input: string;
    handleInputChange: (e: any) => void;
    handleSubmit: (e: any) => void;
    isLoading: boolean;
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle slot selection from GenerativeUI
  useEffect(() => {
    const handleSlotSelect = (e: any) => {
       const timeStr = e.detail;
       const date = new Date(timeStr);
       const prompt = `Book appointment for ${format(date, 'MMM d')} at ${format(date, 'h:mm a')}`;
       
       // Simulate typing
       handleInputChange({ target: { value: prompt } } as any);
       // Focus input
       const inputEl = document.querySelector('input[placeholder="Type a message..."]') as HTMLInputElement;
       if (inputEl) inputEl.focus();
    };

    const handleServiceSelect = (e: any) => {
        const { name } = e.detail;
        const prompt = `Check availability for ${name}`;
        handleInputChange({ target: { value: prompt } } as any);
        const inputEl = document.querySelector('input[placeholder="Type a message..."]') as HTMLInputElement;
        if (inputEl) inputEl.focus();
    };

    document.addEventListener('ai_slot_selected', handleSlotSelect);
    document.addEventListener('ai_service_selected', handleServiceSelect);
    
    return () => {
        document.removeEventListener('ai_slot_selected', handleSlotSelect);
        document.removeEventListener('ai_service_selected', handleServiceSelect);
    };
  }, [handleInputChange]);

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all hover:scale-105"
            >
              <Sparkles className="h-6 w-6" />
              <span className="sr-only">Open Chat</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]"
          >
            <Card className="h-full flex flex-col shadow-2xl border-purple-100 dark:border-purple-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shrink-0">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold">EKA Concierge</CardTitle>
                        <p className="text-[10px] text-indigo-100 opacity-90">Always here to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 rounded-full"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden relative bg-slate-50 dark:bg-slate-950">
                <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground opacity-60">
                      <Sparkles className="h-12 w-12 mb-4 text-purple-400" />
                      <p className="text-sm">How can I help you regarding your wellness journey today?</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-6">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white/50 text-xs h-auto py-1"
                            onClick={() => {
                                const event = { target: { value: "When is my next appointment?" } } as any;
                                handleInputChange(event);
                                // Need to trigger submit manually or let user press enter, 
                                // but for simplicity just populating input
                            }}
                        >
                            "When is my next appointment?"
                        </Button>
                         <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white/50 text-xs h-auto py-1"
                        >
                            "Check my wallet balance"
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex w-full mb-4",
                        m.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all",
                          m.role === 'user'
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none"
                            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-bl-none text-slate-800 dark:text-slate-200"
                        )}
                      >
                        {/* Check if there are tool invocations */}
                        {m.toolInvocations?.map((toolInvocation) => {
                             const toolCallId = toolInvocation.toolCallId;

                             // Render tool based on toolName
                             if ('result' in toolInvocation) {
                                switch(toolInvocation.toolName) {
                                    case 'getMyBookings':
                                        return <BookingResult key={toolCallId} bookings={toolInvocation.result.bookings} />;
                                    case 'searchServices':
                                        return <ServiceResult key={toolCallId} services={toolInvocation.result.services} />;
                                    case 'getWalletBalance':
                                        return <WalletResult key={toolCallId} {...toolInvocation.result} />;
                                    case 'checkAvailability':
                                        return <AvailabilityResult key={toolCallId} slots={toolInvocation.result.slots} />;
                                    case 'bookAppointment':
                                        return <BookingConfirmation key={toolCallId} {...toolInvocation.result} />;
                                    default:
                                        // For cancelBooking, etc, the text response is usually enough
                                        // or we can add specific UIs later
                                        return <div key={toolCallId} className="text-xs text-muted-foreground italic mt-2 border-l-2 border-primary/20 pl-2">
                                            Completed action: {toolInvocation.toolName}
                                        </div>;
                                }
                             } else {
                                 return <div key={toolCallId} className="flex items-center gap-2 text-xs opacity-70 italic mb-2">
                                     <Sparkles className="w-3 h-3 animate-spin"/>
                                     Processing {toolInvocation.toolName}...
                                 </div>
                             }
                        })}
                        
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                     <div className="flex justify-start w-full mb-4">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                           <div className="flex gap-1">
                             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                           </div>
                        </div>
                     </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()}
                    className="rounded-full bg-purple-600 hover:bg-purple-700 h-10 w-10 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
