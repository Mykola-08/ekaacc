'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon,
  DocumentValidationIcon,
  Pulse01Icon,
  BookOpen02Icon,
  Target01Icon,
  Edit02Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { cn } from '@/lib/utils';

type ActionKey = 'summarize' | 'mood' | 'resources' | 'goals' | 'journal';

interface DialogState {
  open: boolean;
  title: string;
  content: string;
}

const ACTIONS: {
  key: ActionKey;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  color: string;
}[] = [
  {
    key: 'summarize',
    label: 'Summarize Week',
    description: 'Get a weekly overview',
    icon: DocumentValidationIcon,
    color: 'text-primary bg-primary/8',
  },
  {
    key: 'mood',
    label: 'Mood Analysis',
    description: 'Explore mood patterns',
    icon: Pulse01Icon,
    color: 'text-success bg-success/8',
  },
  {
    key: 'resources',
    label: 'Resources',
    description: 'Get recommendations',
    icon: BookOpen02Icon,
    color: 'text-warning bg-warning/8',
  },
  {
    key: 'goals',
    label: 'Goal Tips',
    description: 'Smart goal guidance',
    icon: Target01Icon,
    color: 'text-destructive bg-destructive/8',
  },
  {
    key: 'journal',
    label: 'Journal Prompt',
    description: 'AI writing prompt',
    icon: Edit02Icon,
    color: 'text-primary bg-primary/8',
  },
];

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function AIQuickActions() {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingKey, setLoadingKey] = useState<ActionKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ open: false, title: '', content: '' });

  const showDialog = (title: string, content: string) =>
    setDialog({ open: true, title, content });
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const handleCopy = async () => {
    if (!dialog.content) return;
    await navigator.clipboard.writeText(dialog.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = async (key: ActionKey) => {
    if (loadingKey) return;
    setLoadingKey(key);

    try {
      switch (key) {
        case 'summarize': {
          const res = await fetch('/api/ai/summary?range=week', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to generate weekly summary');
          const data = await res.json();
          showDialog('Weekly Summary', data.summary ?? data.content ?? JSON.stringify(data, null, 2));
          break;
        }
        case 'mood': {
          router.push('/ai-insights');
          break;
        }
        case 'resources': {
          const res = await fetch('/api/ai/insights', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to trigger resource recommendations');
          toast({ title: 'Resource recommendations generated!' });
          router.push('/resources');
          break;
        }
        case 'goals': {
          const res = await fetch('/api/ai/insights?type=goal_recommendation', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to generate goal tips');
          const data = await res.json();
          const content =
            Array.isArray(data.insights) && data.insights.length > 0
              ? data.insights.map((i: { content: string }) => i.content).join('\n\n')
              : data.content ?? data.summary ?? JSON.stringify(data, null, 2);
          showDialog('Smart Goal Tips', content);
          break;
        }
        case 'journal': {
          const res = await fetch('/api/ai/summary?type=journal_prompt', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to generate journal prompt');
          const data = await res.json();
          const prompt = data.prompt ?? data.summary ?? data.content ?? '';
          showDialog('Journal Prompt', prompt);
          break;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({ title: message, variant: 'destructive' });
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
            AI Actions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {ACTIONS.map(({ key, label, description, icon, color }) => {
              const isLoading = loadingKey === key;
              const isDisabled = loadingKey !== null;

              return (
                <Button
                  key={key}
                  variant="outline"
                  className={cn(
                    'group/action h-auto flex-col gap-2 py-3.5 text-center transition-all duration-150',
                    'hover:border-primary/20 hover:bg-muted/40',
                    isLoading && 'border-primary/20 bg-primary/5'
                  )}
                  disabled={isDisabled}
                  onClick={() => handleAction(key)}
                  aria-label={label}
                >
                  <div className={cn('flex size-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-150', color)}>
                    {isLoading ? <Spinner /> : <HugeiconsIcon icon={icon} className="size-4" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium leading-tight">{label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{description}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialog.open} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
              {dialog.title}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto rounded-[var(--radius)] bg-muted/30 p-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {dialog.content}
            </p>
          </div>
          <DialogFooter className="flex-row items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3.5 text-success" />
                  Copied
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                  Copy
                </>
              )}
            </Button>
            <DialogFooter showCloseButton />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
