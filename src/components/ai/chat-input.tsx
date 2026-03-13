'use client';

/**
 * AI Chat Input
 *
 * Chat input bar with prompt-kit primitives, suggestion pills, and motion animations.
 */

import { useRef, useCallback } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputBody,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Send, Square, Paperclip } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading: boolean;
  showSuggestions?: boolean;
  onSuggestion?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  'How am I feeling this week?',
  'Log my mood',
  'Show my upcoming sessions',
  'Give me wellness recommendations',
  'Check my wallet balance',
  'What services are available?',
];

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  showSuggestions = false,
  onSuggestion,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isLoading) return;
    onSubmit();
  }, [value, isLoading, onSubmit]);

  return (
    <div className="">
      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <Suggestions className="pb-1">
              {SUGGESTIONS.map((s) => (
                <Suggestion
                  key={s}
                  suggestion={s}
                  onClick={onSuggestion}
                  className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 rounded-full px-3! py-1! text-xs font-medium"
                />
              ))}
            </Suggestions>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <PromptInput
        onSubmit={(msg, e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-muted/50 border-border/50 focus-within:border-primary/30 rounded-lg border pb-2 backdrop-blur-sm transition-colors"
      >
        <PromptInputBody>
          <PromptInputTextarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ask EKA anything..."
            className="min-h-11 resize-none border-0 bg-transparent px-4 pt-3 pb-0 text-sm shadow-none focus-visible:ring-0"
          />
        </PromptInputBody>
        <PromptInputFooter className="px-3 pt-2">
          <PromptInputTools>
            <PromptInputButton
              tooltip={{ content: 'Attach file' }}
              type="button"
              className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer rounded p-0"
            >
              <Paperclip className="h-4 w-4" />
            </PromptInputButton>
          </PromptInputTools>

          <div className="flex-1" />

          <PromptInputSubmit
            status={isLoading ? 'streaming' : 'ready'}
            onStop={onStop}
            disabled={!value.trim() && !isLoading}
            className="h-auto rounded-lg px-2 py-1"
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
