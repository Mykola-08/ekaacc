'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  TaskDone02Icon,
  BookOpen02Icon,
  Loading03Icon,
  NoteIcon,
} from '@hugeicons/core-free-icons';
import { updateAssignmentStatus, submitAssignment } from '@/app/actions/assignments-actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
};

function formatDue(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: { label: 'To Do', className: 'bg-warning/10 text-warning-foreground' },
  in_progress: { label: 'In Progress', className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success' },
};

function AssignmentCard({
  assignment,
  onSubmit,
}: {
  assignment: Assignment;
  onSubmit: (assignment: Assignment) => void;
}) {
  const badge = STATUS_BADGE[assignment.status] ?? STATUS_BADGE['pending'];
  const isCompleted = assignment.status === 'completed';

  return (
    <Card className={cn('rounded-2xl transition-all', isCompleted && 'opacity-70')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn('mt-0.5 shrink-0 rounded-xl p-2', isCompleted ? 'bg-success/10' : 'bg-primary/10')}>
              <HugeiconsIcon
                icon={isCompleted ? TaskDone02Icon : NoteIcon}
                className={cn('size-4', isCompleted ? 'text-success' : 'text-primary')}
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-foreground">{assignment.title}</h4>
              {assignment.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{assignment.description}</p>
              )}
            </div>
          </div>
          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', badge.className)}>
            {badge.label}
          </span>
        </div>
      </CardHeader>
      {assignment.due_date && (
        <CardContent className="pb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            <span className={cn(
              new Date(assignment.due_date) < new Date() && !isCompleted && 'text-destructive font-medium'
            )}>
              {formatDue(assignment.due_date)}
            </span>
          </div>
        </CardContent>
      )}
      <CardFooter className={cn('pt-0', !assignment.due_date && 'pt-0')}>
        {isCompleted ? (
          <p className="w-full text-center text-xs font-medium text-success">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="mr-1 inline size-3.5" />
            Submitted
          </p>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 rounded-xl"
            size="sm"
            onClick={() => onSubmit(assignment)}
          >
            <HugeiconsIcon icon={BookOpen02Icon} className="size-4" />
            Start Exercise
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function AssignmentsPageClient({ assignments: initial }: { assignments: Assignment[] }) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>(initial);
  const [submitTarget, setSubmitTarget] = useState<Assignment | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pending = assignments.filter((a) => a.status !== 'completed');
  const completed = assignments.filter((a) => a.status === 'completed');

  const handleSubmit = async () => {
    if (!submitTarget) return;
    if (!responseText.trim()) { setSubmitError('Please write a response before submitting.'); return; }
    setSubmitting(true);
    setSubmitError(null);
    const res = await submitAssignment(submitTarget.id, responseText.trim());
    setSubmitting(false);
    if (!res.success) { setSubmitError(res.error ?? 'Failed to submit'); return; }
    setAssignments((prev) =>
      prev.map((a) => a.id === submitTarget.id ? { ...a, status: 'completed' } : a)
    );
    setSubmitTarget(null);
    setResponseText('');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <HugeiconsIcon icon={NoteIcon} className="size-5 text-muted-foreground" />
          Assignments
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Tasks and exercises assigned by your therapist.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center lg:mx-6">
          <div className="rounded-2xl bg-muted p-4">
            <HugeiconsIcon icon={NoteIcon} className="size-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold">No assignments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Your therapist hasn't assigned any tasks yet.</p>
          </div>
        </div>
      ) : (
        <div className="px-4 lg:px-6">
          <Tabs defaultValue="pending">
            <TabsList className="mb-4 rounded-xl">
              <TabsTrigger value="pending" className="rounded-lg gap-1.5">
                Pending
                {pending.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary tabular-nums">
                    {pending.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg gap-1.5">
                Completed
                {completed.length > 0 && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                    {completed.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-8 text-success/50" />
                  <p className="text-sm text-muted-foreground">All caught up! No pending assignments.</p>
                </div>
              ) : (
                <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                  {pending.map((a) => (
                    <AssignmentCard key={a.id} assignment={a} onSubmit={setSubmitTarget} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completed.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                  <p className="text-sm text-muted-foreground">No completed assignments yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                  {completed.map((a) => (
                    <AssignmentCard key={a.id} assignment={a} onSubmit={setSubmitTarget} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Submit Dialog */}
      <Dialog open={!!submitTarget} onOpenChange={(open) => { if (!open) { setSubmitTarget(null); setResponseText(''); setSubmitError(null); } }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{submitTarget?.title}</DialogTitle>
            {submitTarget?.description && (
              <DialogDescription>{submitTarget.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-3">
            <Label>Your Response</Label>
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response, reflections, or notes here…"
              className="min-h-36 resize-none rounded-xl"
            />
            {submitError && (
              <Alert variant="destructive"><AlertDescription>{submitError}</AlertDescription></Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setSubmitTarget(null)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 rounded-full">
              {submitting && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
