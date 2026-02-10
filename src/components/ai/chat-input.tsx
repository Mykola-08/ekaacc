"use client";

/**
 * AI Chat Input
 *
 * Chat input bar with prompt-kit primitives, suggestion pills, and motion animations.
 */

import { useRef, useCallback } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/prompt-kit/prompt-input";
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion";
import { Send, Square, Paperclip } from "lucide-react";

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
  "How am I feeling this week?",
  "Log my mood",
  "Show my upcoming sessions",
  "Give me wellness recommendations",
  "Check my wallet balance",
  "What services are available?",
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
    <div className="space-y-3">
      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {SUGGESTIONS.map((s) => (
              <PromptSuggestion
                key={s}
                onClick={() => onSuggestion?.(s)}
              >
                {s}
              </PromptSuggestion>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <PromptInput
        value={value}
        onValueChange={onChange}
        onSubmit={handleSubmit}
        className="bg-muted/50 border-border/50 rounded-2xl border backdrop-blur-sm transition-colors focus-within:border-primary/30"
      >
        <PromptInputTextarea
          ref={textareaRef}
          placeholder="Ask EKA anything..."
          className="min-h-11 resize-none bg-transparent px-4 pt-3 pb-0 text-sm"
        />
        <PromptInputActions className="px-3 pb-2">
          <PromptInputAction tooltip="Attach file">
            <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded">
              <Paperclip className="h-4 w-4" />
            </button>
          </PromptInputAction>

          <div className="flex-1" />

          {isLoading ? (
            <PromptInputAction tooltip="Stop generating">
              <button
                type="button"
                onClick={onStop}
                className="bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer rounded-lg px-2 py-1"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            </PromptInputAction>
          ) : (
            <PromptInputAction tooltip="Send message">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 cursor-pointer rounded-lg px-2 py-1"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </PromptInputAction>
          )}
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}
