'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send, X, MessageSquare, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookingResult,
  ServiceResult,
  WalletResult,
  AvailabilityResult,
  BookingConfirmation,
  PersonalizedGreetingResult,
  DailyActionsResult,
  AffirmationResult,
  ProgressReportResult,
  PatternInsightResult,
  BreathingExerciseResult,
  AchievementCelebrationResult,
  MeditationResult,
  SleepInsightResult,
  GoalTrackerResult,
  MoodCalendarResult,
  BookingPreviewBlock,
  ServiceComparisonBlock,
  WalletHistoryBlock
} from './GenerativeUI';
import { format } from 'date-fns';

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolInvocations?: ToolInvocation[];
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch chat response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const assistantId = (Date.now() + 1).toString();
      let assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        toolInvocations: [],
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('t:')) {
            const content = line.slice(2);
            assistantMessage = {
              ...assistantMessage,
              content: assistantMessage.content + content
            };
            setMessages(prev => prev.map(m => m.id === assistantId ? assistantMessage : m));
          } else if (line.startsWith('0:')) {
            try {
              const data = JSON.parse(line.slice(2));
              if (data.type === 'tool-result') {
                const invocation: ToolInvocation = {
                  toolCallId: Math.random().toString(36).substring(7),
                  toolName: data.toolName,
                  args: data.args,
                  result: data.result,
                };
                assistantMessage = {
                  ...assistantMessage,
                  toolInvocations: [...(assistantMessage.toolInvocations || []), invocation]
                };
                setMessages(prev => prev.map(m => m.id === assistantId ? assistantMessage : m));
              }
            } catch (e) {
              console.error('Failed to parse tool result', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slot selection from GenerativeUI
  useEffect(() => {
    const handleSlotSelect = (e: any) => {
      const timeStr = e.detail;
      const date = new Date(timeStr);
      const prompt = `Book appointment for ${format(date, 'MMM d')} at ${format(date, 'h:mm a')}`;
      setInput(prompt);
      const inputEl = document.querySelector('input[placeholder="Type a message..."]') as HTMLInputElement;
      if (inputEl) inputEl.focus();
    };

    const handleServiceSelect = (e: any) => {
      const { name } = e.detail;
      const prompt = `Check availability for ${name}`;
      setInput(prompt);
      const inputEl = document.querySelector('input[placeholder="Type a message..."]') as HTMLInputElement;
      if (inputEl) inputEl.focus();
    };

    const handleConfirmBooking = (e: any) => {
      const { serviceName, dateTime } = e.detail;
      const prompt = `Confirm my booking for ${serviceName} on ${format(new Date(dateTime), 'MMM d @ h:mm a')}`;
      setInput(prompt);
      // Automatically submit for "Confirm"
      setTimeout(() => {
        const form = document.querySelector('form');
        form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    };

    const handleCancelBooking = (e: any) => {
      const bookingId = e.detail;
      const prompt = `Cancel my booking ${bookingId}`;
      setInput(prompt);
    };

    const handleReschedule = (e: any) => {
      const booking = e.detail;
      const prompt = `I want to reschedule my ${booking.service?.name} appointment`;
      setInput(prompt);
    };

    document.addEventListener('ai_slot_selected', handleSlotSelect);
    document.addEventListener('ai_service_selected', handleServiceSelect);
    document.addEventListener('ai_confirm_booking', handleConfirmBooking);
    document.addEventListener('ai_cancel_booking', handleCancelBooking);
    document.addEventListener('ai_reschedule_request', handleReschedule);

    return () => {
      document.removeEventListener('ai_slot_selected', handleSlotSelect);
      document.removeEventListener('ai_service_selected', handleServiceSelect);
      document.removeEventListener('ai_confirm_booking', handleConfirmBooking);
      document.removeEventListener('ai_cancel_booking', handleCancelBooking);
      document.removeEventListener('ai_reschedule_request', handleReschedule);
    };
  }, []);

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
                          onClick={() => setInput("When is my next appointment?")}
                        >
                          "When is my next appointment?"
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 text-xs h-auto py-1"
                          onClick={() => setInput("Check my wallet balance")}
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
                        {m.toolInvocations?.map((toolInvocation, idx) => {
                          const toolCallId = toolInvocation.toolCallId || idx.toString();

                          // Render tool based on toolName
                          if (toolInvocation.result) {
                            switch (toolInvocation.toolName) {
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
                              case 'getPersonalizedGreeting':
                                return <PersonalizedGreetingResult key={toolCallId} {...toolInvocation.result} />;
                              case 'suggestDailyActions':
                                return <DailyActionsResult key={toolCallId} actions={toolInvocation.result.actions} />;
                              case 'generateAffirmation':
                                return <AffirmationResult key={toolCallId} affirmation={toolInvocation.result.affirmation} />;
                              case 'getProgressReport':
                                return <ProgressReportResult key={toolCallId} report={toolInvocation.result.report} />;
                              case 'identifyPatterns':
                                return <PatternInsightResult key={toolCallId} patterns={toolInvocation.result.patterns} />;
                              case 'suggestBreathingExercise':
                                return <BreathingExerciseResult key={toolCallId} exercise={toolInvocation.result.exercise} />;
                              case 'celebrateAchievement':
                                return <AchievementCelebrationResult key={toolCallId} achievements={toolInvocation.result.achievements} />;
                              case 'startGuidedMeditation':
                                return <MeditationResult key={toolCallId} session={toolInvocation.result.session} />;
                              case 'getSleepInsights':
                                return <SleepInsightResult key={toolCallId} insight={toolInvocation.result.insight} />;
                              case 'getInteractiveGoalTracker':
                                return <GoalTrackerResult key={toolCallId} tracker={toolInvocation.result.tracker} />;
                              case 'getMoodCalendar':
                                return <MoodCalendarResult key={toolCallId} days={toolInvocation.result.days} />;
                              case 'getBookingPreview':
                                return <BookingPreviewBlock key={toolCallId} preview={toolInvocation.result.preview} />;
                              case 'compareServices':
                                return <ServiceComparisonBlock key={toolCallId} services={toolInvocation.result.services} />;
                              case 'getWalletHistory':
                                return <WalletHistoryBlock key={toolCallId} transactions={toolInvocation.result.transactions} />;
                              default:
                                return <div key={toolCallId} className="text-xs text-muted-foreground italic mt-2 border-l-2 border-primary/20 pl-2">
                                  Completed action: {toolInvocation.toolName}
                                </div>;
                            }
                          } else {
                            return <div key={toolCallId} className="flex items-center gap-2 text-xs opacity-70 italic mb-2">
                              <Sparkles className="w-3 h-3 animate-spin" />
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
