'use client';

/**
 * AI Chat Welcome Screen
 *
 * Shown when no conversation is active. Features the EKA branding,
 * greeting, and suggestion prompts with motion animations.
 */

import * as motion from 'motion/react-client';
import { Brain, Heart, Calendar, TrendingUp, Sparkles, MessageCircle } from 'lucide-react';

interface ChatWelcomeProps {
  userName?: string | null;
  onSuggestion: (text: string) => void;
}

const QUICK_ACTIONS = [
  {
    icon: Heart,
    label: 'Log my mood',
    description: "Track how you're feeling",
    prompt: "I'd like to log my mood today.",
  },
  {
    icon: TrendingUp,
    label: 'Mood trends',
    description: 'See your patterns',
    prompt: 'Show me my mood trend for the past two weeks.',
  },
  {
    icon: Calendar,
    label: 'My sessions',
    description: 'View upcoming bookings',
    prompt: 'What sessions do I have coming up?',
  },
  {
    icon: Brain,
    label: 'Get insights',
    description: 'AI wellness analysis',
    prompt: 'Generate personalized wellness insights for me.',
  },
];

export function ChatWelcome({ userName, onSuggestion }: ChatWelcomeProps) {
  const greeting = getGreeting();

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      {/* Logo + greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg"
        >
          <Sparkles className="text-primary h-8 w-8" />
        </motion.div>
        <h1 className="text-foreground mb-1 text-2xl font-semibold tracking-tight">
          {greeting}
          {userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-muted-foreground text-sm">
          I&apos;m EKA, your wellness companion. How can I help you today?
        </p>
      </motion.div>

      {/* Quick action cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 grid w-full max-w-lg grid-cols-2 gap-3"
      >
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              onClick={() => onSuggestion(action.prompt)}
              className="bg-muted/50 hover:bg-muted group hover:border-primary/20 flex items-start gap-3 rounded-xl border p-3 text-left transition-all"
            >
              <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors">
                <Icon className="text-primary h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-muted-foreground text-xs">{action.description}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Subtle hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="text-muted-foreground flex items-center gap-1.5 text-xs"
      >
        <MessageCircle className="h-3 w-3" />
        <span>Ask me anything about your wellness journey</span>
      </motion.div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
