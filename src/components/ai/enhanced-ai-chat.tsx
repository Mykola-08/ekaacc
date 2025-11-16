'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sparkles, 
  MessageSquare, 
  Brain, 
  Calendar,
  Target,
  Clock,
  BarChart3,
  Settings,
  Send,
  Mic,
  Paperclip,
  X,
  ChevronDown,
  Zap,
  Star,
  Crown
} from 'lucide-react';
import { TextShimmer } from '@/components/magicui/text-shimmer';
import { BlurIn } from '@/components/magicui/blur-in';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { AnimatedList, AnimatedListItem } from '@/components/magicui/animated-list';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface EnhancedAIChatProps {
  userId: string;
  subscriptionTier: 'basic' | 'premium' | 'vip';
  onClose?: () => void;
  className?: string;
}

interface AIInsight {
  id: string;
  type: 'goal' | 'reminder' | 'booking' | 'wellness';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AIUsage {
  daily: number;
  limit: number;
  resetTime: string;
}

const subscriptionConfig = {
  basic: { limit: 50, color: 'bg-blue-500', icon: Star, name: 'Basic' },
  premium: { limit: 200, color: 'bg-purple-500', icon: Zap, name: 'Premium' },
  vip: { limit: 1000, color: 'bg-yellow-500', icon: Crown, name: 'VIP' }
};

export function EnhancedAIChat({ userId, subscriptionTier, onClose, className }: EnhancedAIChatProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [showProactivePanel, setShowProactivePanel] = useState(subscriptionTier !== 'basic');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [usage, setUsage] = useState<AIUsage>({ daily: 0, limit: subscriptionConfig[subscriptionTier].limit, resetTime: '24h' });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref: insightsRef, inView: insightsInView } = useInView({ threshold: 0.1 });

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: {
      userId,
      subscriptionTier,
      context: {
        proactive: showProactivePanel,
        insights: aiInsights
      }
    },
    onResponse: (response) => {
      // Update usage from response headers
      const dailyUsage = response.headers.get('X-AI-Daily-Usage');
      const limit = response.headers.get('X-AI-Limit');
      if (dailyUsage && limit) {
        setUsage({
          daily: parseInt(dailyUsage),
          limit: parseInt(limit),
          resetTime: '24h'
        });
      }
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Simulate proactive insights for premium+ users
    if (subscriptionTier !== 'basic' && insightsInView) {
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'goal',
          title: 'Weekly Goal Progress',
          description: 'You\'re 75% complete with your mindfulness goal this week',
          action: 'Review goals',
          priority: 'medium'
        },
        {
          id: '2',
          type: 'booking',
          title: 'Recommended Session',
          description: 'Based on your stress levels, consider booking a relaxation session',
          action: 'Book now',
          priority: 'high'
        },
        {
          id: '3',
          type: 'reminder',
          title: 'Daily Check-in',
          description: 'Don\'t forget your daily wellness check-in',
          action: 'Start check-in',
          priority: 'low'
        }
      ];
      setAiInsights(mockInsights);
    }
  }, [subscriptionTier, insightsInView]);

  const quickPrompts = [
    "Help me book a therapy session",
    "Analyze my wellness data",
    "Set a new goal for me",
    "What exercises help with anxiety?",
    "Track my mood patterns"
  ];

  const handleQuickPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>);
    handleSubmit(new Event('submit') as any);
  };

  const usagePercentage = (usage.daily / usage.limit) * 100;

  return (
    <div className={cn("flex h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl overflow-hidden", className)}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AnimatedGradientText className="text-lg font-semibold">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Wellness Assistant
              </AnimatedGradientText>
              <Badge variant="outline" className={cn("gap-1", subscriptionConfig[subscriptionTier].color)}>
                {React.createElement(subscriptionConfig[subscriptionTier].icon, { className: "w-3 h-3" })}
                {subscriptionConfig[subscriptionTier].name}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-600">
                <NumberTicker value={usage.daily} /> / {usage.limit} uses
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Usage Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Daily Usage</span>
              <span>Resets in {usage.resetTime}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div 
                className={cn("h-2 rounded-full", {
                  'bg-green-500': usagePercentage < 50,
                  'bg-yellow-500': usagePercentage >= 50 && usagePercentage < 80,
                  'bg-red-500': usagePercentage >= 80
                })}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Brain className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-2">
              <Zap className="w-4 h-4" />
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 mt-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <BlurIn>
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to Your AI Assistant</h3>
                      <p className="text-slate-600 mb-6">I'm here to help with your wellness journey. How can I assist you today?</p>
                    </BlurIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {quickPrompts.map((prompt, index) => (
                        <motion.div
                          key={prompt}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ShimmerButton
                            onClick={() => handleQuickPrompt(prompt)}
                            className="w-full text-xs"
                          >
                            {prompt}
                          </ShimmerButton>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3 mb-4", {
                      'justify-end': message.role === 'user',
                      'justify-start': message.role === 'assistant'
                    })}
                  >
                    <div className={cn("flex gap-3 max-w-[80%]", {
                      'flex-row-reverse': message.role === 'user'
                    })}>
                      <Avatar className="w-8 h-8">
                        {message.role === 'user' ? (
                          <AvatarFallback>U</AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                            <Sparkles className="w-4 h-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Card className={cn("p-3", {
                        'bg-blue-500 text-white': message.role === 'user',
                        'bg-white': message.role === 'assistant'
                      })}>
                        <TextShimmer 
                          duration={1.5}
                          className={cn("text-sm", {
                            'text-white': message.role === 'user'
                          })}
                        >
                          {message.content}
                        </TextShimmer>
                      </Card>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 mb-4"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                        <Sparkles className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="bg-white p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="text-sm text-slate-600 ml-2">Thinking...</span>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4 bg-white/80 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Button type="button" variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about your wellness..."
                  className="flex-1"
                  disabled={usage.daily >= usage.limit}
                />
                <Button type="button" variant="ghost" size="sm">
                  <Mic className="w-4 h-4" />
                </Button>
                <RainbowButton type="submit" size="sm" disabled={usage.daily >= usage.limit}>
                  <Send className="w-4 h-4" />
                </RainbowButton>
              </form>
              {usage.daily >= usage.limit && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Daily limit reached. Upgrade your subscription for more AI interactions.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 mt-0">
            <div className="p-4" ref={insightsRef}>
              <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
              <AnimatedList className="space-y-3">
                {aiInsights.map((insight) => (
                  <AnimatedListItem key={insight.id}>
                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {insight.type === 'goal' && <Target className="w-4 h-4 text-green-500" />}
                            {insight.type === 'booking' && <Calendar className="w-4 h-4 text-blue-500" />}
                            {insight.type === 'reminder' && <Clock className="w-4 h-4 text-yellow-500" />}
                            {insight.type === 'wellness' && <Brain className="w-4 h-4 text-purple-500" />}
                            <span className="font-medium">{insight.title}</span>
                            <Badge 
                              variant="outline" 
                              className={cn({
                                'border-green-500 text-green-500': insight.priority === 'low',
                                'border-yellow-500 text-yellow-500': insight.priority === 'medium',
                                'border-red-500 text-red-500': insight.priority === 'high'
                              })}
                            >
                              {insight.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                          {insight.action && (
                            <ShimmerButton size="sm" className="text-xs">
                              {insight.action}
                            </ShimmerButton>
                          )}
                        </div>
                      </div>
                    </Card>
                  </AnimatedListItem>
                ))}
              </AnimatedList>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="flex-1 mt-0">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Calendar className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-medium mb-1">Book Session</h4>
                    <p className="text-xs text-slate-600">Schedule a therapy session</p>
                  </Card>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Target className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-medium mb-1">Set Goal</h4>
                    <p className="text-xs text-slate-600">Create a wellness goal</p>
                  </Card>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <BarChart3 className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="font-medium mb-1">View Reports</h4>
                    <p className="text-xs text-slate-600">Check your progress</p>
                  </Card>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Settings className="w-8 h-8 text-slate-500 mb-2" />
                    <h4 className="font-medium mb-1">AI Settings</h4>
                    <p className="text-xs text-slate-600">Customize preferences</p>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Proactive Panel (Premium+ only) */}
      {showProactivePanel && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="bg-gradient-to-b from-blue-50 to-purple-50 border-l border-slate-200"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Proactive Assistant
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProactivePanel(false)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Card className="p-3 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Active</span>
                </div>
                <p className="text-xs text-slate-600">Monitoring your wellness data...</p>
              </Card>

              <AnimatedList className="space-y-2">
                <AnimatedListItem>
                  <Card className="p-3 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Mood Analysis</span>
                    </div>
                    <p className="text-xs text-slate-600">Your mood has been stable this week</p>
                  </Card>
                </AnimatedListItem>
                <AnimatedListItem>
                  <Card className="p-3 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Upcoming</span>
                    </div>
                    <p className="text-xs text-slate-600">Therapy session tomorrow at 2 PM</p>
                  </Card>
                </AnimatedListItem>
                <AnimatedListItem>
                  <Card className="p-3 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Goal Progress</span>
                    </div>
                    <p className="text-xs text-slate-600">Exercise goal: 3/5 completed</p>
                  </Card>
                </AnimatedListItem>
              </AnimatedList>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function FloatingAIAssistant({ userId, subscriptionTier }: { userId: string; subscriptionTier: 'basic' | 'premium' | 'vip' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification for premium+ users
    if (subscriptionTier !== 'basic') {
      const timer = setTimeout(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionTier]);

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">I have insights for you!</span>
              </div>
              <p className="text-xs mt-1 opacity-90">Click to see personalized recommendations</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RainbowButton
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 90 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -90 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </RainbowButton>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-30 w-[400px] h-[600px]"
          >
            <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-slate-900">AI Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center text-slate-500 text-sm">
                AI Chat functionality will be available here.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}