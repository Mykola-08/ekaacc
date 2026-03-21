'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { markAssignmentComplete } from './actions';

export function MarkCompleteButton({ assignmentId }: { assignmentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await markAssignmentComplete(assignmentId);
        })
      }
    >
      {isPending ? 'Saving...' : 'Mark Complete'}
    </Button>
  );
}
