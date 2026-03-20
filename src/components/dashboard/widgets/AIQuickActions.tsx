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
} from '@hugeicons/core-free-icons';
import { useToast } from '@/hooks/platform/ui/use-toast';

type ActionKey = 'summarize' | 'mood' | 'resources' | 'goals';

interface DialogState {
  open: boolean;
  title: string;
  content: string;
}

const ACTIONS: {
  key: ActionKey;
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
}[] = [
  { key: 'summarize', label: 'Summarize My Week', icon: DocumentValidationIcon },
  { key: 'mood', label: 'Mood Analysis', icon: Pulse01Icon },
  { key: 'resources', label: 'Recommend Resources', icon: BookOpen02Icon },
  { key: 'goals', label: 'Smart Goal Tips', icon: Target01Icon },
];

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function AIQuickActions() {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingKey, setLoadingKey] = useState<ActionKey | null>(null);
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: '',
    content: '',
  });

  const showDialog = (title: string, content: string) => {
    setDialog({ open: true, title, content });
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
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
          showDialog(
            'Weekly Summary',
            data.summary ?? data.content ?? JSON.stringify(data, null, 2)
          );
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
          const res = await fetch('/api/ai/insights?type=goal_recommendation', {
            method: 'POST',
          });
          if (!res.ok) throw new Error('Failed to generate goal tips');
          const data = await res.json();
          const content =
            Array.isArray(data.insights) && data.insights.length > 0
              ? data.insights.map((i: { content: string }) => i.content).join('\n\n')
              : data.content ?? data.summary ?? JSON.stringify(data, null, 2);
          showDialog('Smart Goal Tips', content);
          break;
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({ title: message, variant: 'destructive' });
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
            AI Actions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {ACTIONS.map(({ key, label, icon }) => {
              const isLoading = loadingKey === key;
              const isDisabled = loadingKey !== null;

              return (
                <Button
                  key={key}
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1.5 text-xs text-center"
                  disabled={isDisabled}
                  onClick={() => handleAction(key)}
                  aria-label={label}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <HugeiconsIcon icon={icon} className="size-5" />
                  )}
                  <span>{label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialog.open} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {dialog.content}
            </p>
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  );
}
