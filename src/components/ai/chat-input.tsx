'use client';

/**
 * AI Chat Input
 *
 * Uses AI Elements PromptInput and Suggestion primitives.
 */

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import type { ChatStatus } from 'ai';
import { HugeiconsIcon } from '@hugeicons/react';
import { Attachment01Icon } from '@hugeicons/core-free-icons';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  status?: ChatStatus;
  isLoading?: boolean;
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
  status,
  isLoading,
  showSuggestions = false,
  onSuggestion,
}: ChatInputProps) {
  const chatStatus = status ?? (isLoading ? 'streaming' : 'ready');

  return (
    <div className="flex flex-col gap-2">
      {/* Suggestions */}

      {showSuggestions && (
        <div>
          <Suggestions>
            {SUGGESTIONS.map((s) => (
              <Suggestion key={s} suggestion={s} onClick={() => onSuggestion?.(s)} />
            ))}
          </Suggestions>
        </div>
      )}

      {/* Input bar */}
      <PromptInput
        onSubmit={({ text }) => {
          if (text.trim()) onSubmit();
        }}
      >
        <PromptInputTextarea
          placeholder="Ask EKA anything..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton tooltip="Attach file">
              <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit status={chatStatus} onStop={onStop} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
