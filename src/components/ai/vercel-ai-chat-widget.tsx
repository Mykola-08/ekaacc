'use client';

import React, { useState, useCallback } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { vercelAIService, type VercelAIRequest } from '@/ai/vercel-ai-service';
import { useAuth } from '@/lib/supabase-auth';
import { Sparkles, Send, Loader2, Brain, Heart, MessageSquare } from 'lucide-react';

interface AIChatWidgetProps {
  className?: string;
  onResponse?: (response: string) => void;
  placeholder?: string;
  context?: string;
  model?: 'openai' | 'anthropic' | 'google';
}

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 }
};

const messageVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { opacity: 0, y: -10, scale: 0.9 }
};

const typingVariants: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function AIChatWidget({ 
  className = '', 
  onResponse, 
  placeholder = "Ask me anything about your wellness journey...",
  context,
  model = 'openai'
}: AIChatWidgetProps) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const request: VercelAIRequest = {
        prompt: input.trim(),
        context: context || 'You are a supportive AI assistant for mental health and wellness. Provide empathetic, professional, and helpful responses.',
        userId: user.id,
        model,
        maxTokens: 800,
        temperature: 0.7
      };

      const response = await vercelAIService.generateText(request);
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: response.content,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
      onResponse?.(response.content);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [input, user, context, model, onResponse]);

  const quickPrompts = [
    "I'm feeling anxious today, what can I do?",
    "Can you help me track my mood?",
    "What are some relaxation techniques?",
    "How can I improve my sleep?"
  ];

  return (
    <motion.div
      variants={glowVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-2xl ${className}`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
        >
          <Brain className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Wellness Assistant</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Here to support your mental health journey</p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              variants={messageVariants}
              initial="initial"
              animate="animate"
              className="flex justify-start"
            >
              <div className="bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm px-4 py-2 rounded-2xl">
                <div className="flex items-center gap-2">
                  <motion.span
                    variants={typingVariants}
                    animate="animate"
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.span
                    variants={typingVariants}
                    animate="animate"
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <motion.span
                    variants={typingVariants}
                    animate="animate"
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome message */}
        {messages.length === 0 && (
          <motion.div
            variants={messageVariants}
            initial="initial"
            animate="animate"
            className="text-center py-8"
          >
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Hi there! I'm your AI wellness assistant. How can I support you today?
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick prompts:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInput(prompt)}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors disabled:opacity-50"
            >
              {prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-10 pr-12 py-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading || !user}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Powered by AI • For support, contact a mental health professional
        </p>
      </div>
    </motion.div>
  );
}