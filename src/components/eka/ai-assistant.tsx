'use client';

import { Avatar, AvatarFallback, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/keep';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
;
;
;
;
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
;
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your EKA wellness assistant. How can I help you today?',
      },
    ]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const reply = await fxService.getAIChatResponse(currentInput, messages);
      const aiMessage: Message = {
        id: Date.now().toString() + 'ai',
        role: 'assistant',
        content: reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
       toast({
            variant: 'destructive',
            title: 'AI Assistant Error',
            description: 'Could not get a response. Please try again.'
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button with animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="w-96 h-[500px] shadow-2xl flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className={cn(
                            'flex items-start gap-3',
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          )}
                        >
                           {message.role === 'assistant' && (
                            <Avatar className='h-8 w-8'>
                                <AvatarFallback className='bg-primary text-primary-foreground'><Bot className='h-5 w-5'/></AvatarFallback>
                            </Avatar>
                        )}
                          <div
                            className={cn(
                              'max-w-[80%] rounded-lg px-4 py-2',
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                           {message.role === 'user' && (
                            <Avatar className='h-8 w-8'>
                                <AvatarFallback><User className='h-5 w-5'/></AvatarFallback>
                            </Avatar>
                        )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-start items-start gap-3"
                      >
                        <Avatar className='h-8 w-8'>
                            <AvatarFallback className='bg-primary text-primary-foreground'><Bot className='h-5 w-5'/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <motion.div
                            className="flex space-x-1"
                          >
                            <motion.div
                              className="w-1.5 h-1.5 bg-primary rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-primary rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-primary rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      disabled={isLoading}
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
