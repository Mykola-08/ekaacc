'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
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
  WalletHistoryBlock,
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
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
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

      setMessages((prev) => [...prev, assistantMessage]);

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
              content: assistantMessage.content + content,
            };
            setMessages((prev) => prev.map((m) => (m.id === assistantId ? assistantMessage : m)));
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
                  toolInvocations: [...(assistantMessage.toolInvocations || []), invocation],
                };
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? assistantMessage : m))
                );
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
      const inputEl = document.querySelector(
        'input[placeholder="Type a message..."]'
      ) as HTMLInputElement;
      if (inputEl) inputEl.focus();
    };

    const handleServiceSelect = (e: any) => {
      const { name } = e.detail;
      const prompt = `Check availability for ${name}`;
      setInput(prompt);
      const inputEl = document.querySelector(
        'input[placeholder="Type a message..."]'
      ) as HTMLInputElement;
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
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed right-6 bottom-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-zinc-900 text-white shadow-xl transition-transform hover:scale-105 hover:bg-zinc-800"
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-6 bottom-6 z-50 h-[600px] max-h-[calc(100vh-100px)] w-[380px] max-w-[calc(100vw-48px)]"
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-[20px] border-zinc-200 bg-zinc-50/95 shadow-2xl dark:border-zinc-800">
              <CardHeader className="shrink-0 border-b border-zinc-100 bg-white/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-zinc-100 p-2">
                      <Sparkles className="h-4 w-4 text-zinc-900" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-zinc-900">
                        Concierge
                      </CardTitle>
                      <p className="text-xs font-medium text-zinc-500">Wellness Assistant</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="bg-secondary relative flex-1 overflow-hidden p-0">
                <div ref={scrollRef} className="h-full space-y-4 overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center text-zinc-400">
                      <Sparkles className="mb-4 h-10 w-10 text-zinc-300" />
                      <p className="text-sm font-medium text-zinc-500">
                        How can I support your wellness today?
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm"
                          onClick={() => setInput('When is my next appointment?')}
                        >
                          My schedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm"
                          onClick={() => setInput('Check my wallet balance')}
                        >
                          Balance
                        </Button>
                      </div>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        'mb-4 flex w-full',
                        m.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-[20px] px-4 py-3 text-sm shadow-sm transition-all',
                          m.role === 'user'
                            ? 'rounded-br-none bg-linear-to-br from-indigo-500 to-purple-600 text-white'
                            : 'rounded-bl-none border border-slate-100 bg-white text-slate-800 dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-200'
                        )}
                      >
                        {/* Check if there are tool invocations */}
                        {m.toolInvocations?.map((toolInvocation, idx) => {
                          const toolCallId = toolInvocation.toolCallId || idx.toString();

                          // Render tool based on toolName
                          if (toolInvocation.result) {
                            switch (toolInvocation.toolName) {
                              case 'getMyBookings':
                                return (
                                  <BookingResult
                                    key={toolCallId}
                                    bookings={toolInvocation.result.bookings}
                                  />
                                );
                              case 'searchServices':
                                return (
                                  <ServiceResult
                                    key={toolCallId}
                                    services={toolInvocation.result.services}
                                  />
                                );
                              case 'getWalletBalance':
                                return <WalletResult key={toolCallId} {...toolInvocation.result} />;
                              case 'checkAvailability':
                                return (
                                  <AvailabilityResult
                                    key={toolCallId}
                                    slots={toolInvocation.result.slots}
                                  />
                                );
                              case 'bookAppointment':
                                return (
                                  <BookingConfirmation
                                    key={toolCallId}
                                    {...toolInvocation.result}
                                  />
                                );
                              case 'getPersonalizedGreeting':
                                return (
                                  <PersonalizedGreetingResult
                                    key={toolCallId}
                                    {...toolInvocation.result}
                                  />
                                );
                              case 'suggestDailyActions':
                                return (
                                  <DailyActionsResult
                                    key={toolCallId}
                                    actions={toolInvocation.result.actions}
                                  />
                                );
                              case 'generateAffirmation':
                                return (
                                  <AffirmationResult
                                    key={toolCallId}
                                    affirmation={toolInvocation.result.affirmation}
                                  />
                                );
                              case 'getProgressReport':
                                return (
                                  <ProgressReportResult
                                    key={toolCallId}
                                    report={toolInvocation.result.report}
                                  />
                                );
                              case 'identifyPatterns':
                                return (
                                  <PatternInsightResult
                                    key={toolCallId}
                                    patterns={toolInvocation.result.patterns}
                                  />
                                );
                              case 'suggestBreathingExercise':
                                return (
                                  <BreathingExerciseResult
                                    key={toolCallId}
                                    exercise={toolInvocation.result.exercise}
                                  />
                                );
                              case 'celebrateAchievement':
                                return (
                                  <AchievementCelebrationResult
                                    key={toolCallId}
                                    achievements={toolInvocation.result.achievements}
                                  />
                                );
                              case 'startGuidedMeditation':
                                return (
                                  <MeditationResult
                                    key={toolCallId}
                                    session={toolInvocation.result.session}
                                  />
                                );
                              case 'getSleepInsights':
                                return (
                                  <SleepInsightResult
                                    key={toolCallId}
                                    insight={toolInvocation.result.insight}
                                  />
                                );
                              case 'getInteractiveGoalTracker':
                                return (
                                  <GoalTrackerResult
                                    key={toolCallId}
                                    tracker={toolInvocation.result.tracker}
                                  />
                                );
                              case 'getMoodCalendar':
                                return (
                                  <MoodCalendarResult
                                    key={toolCallId}
                                    days={toolInvocation.result.days}
                                  />
                                );
                              case 'getBookingPreview':
                                return (
                                  <BookingPreviewBlock
                                    key={toolCallId}
                                    preview={toolInvocation.result.preview}
                                  />
                                );
                              case 'compareServices':
                                return (
                                  <ServiceComparisonBlock
                                    key={toolCallId}
                                    services={toolInvocation.result.services}
                                  />
                                );
                              case 'getWalletHistory':
                                return (
                                  <WalletHistoryBlock
                                    key={toolCallId}
                                    transactions={toolInvocation.result.transactions}
                                  />
                                );
                              default:
                                return (
                                  <div
                                    key={toolCallId}
                                    className="text-muted-foreground border-primary/20 mt-2 border-l-2 pl-2 text-xs italic"
                                  >
                                    Completed action: {toolInvocation.toolName}
                                  </div>
                                );
                            }
                          } else {
                            return (
                              <div
                                key={toolCallId}
                                className="mb-2 flex items-center gap-2 text-xs italic opacity-70"
                              >
                                <Sparkles className="h-3 w-3 animate-spin" />
                                Processing {toolInvocation.toolName}...
                              </div>
                            );
                          }
                        })}

                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  ))}

                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="mb-4 flex w-full justify-start">
                      <div className="rounded-[20px] rounded-bl-none border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex gap-1">
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                            style={{ animationDelay: '0ms' }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                            style={{ animationDelay: '150ms' }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                            style={{ animationDelay: '300ms' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border-0 bg-slate-100 focus-visible:ring-1 focus-visible:ring-purple-500 dark:bg-slate-800"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="h-10 w-10 shrink-0 rounded-full bg-purple-600 hover:bg-purple-700"
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
