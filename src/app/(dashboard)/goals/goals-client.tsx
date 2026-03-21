'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Target01Icon,
  PlusSignIcon,
  MoreVerticalIcon,
  Delete01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
  TaskDone02Icon,
  Moon01Icon,
} from '@hugeicons/core-free-icons';
import {
  createGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalProgressHistory,
} from '@/app/actions/goals-actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Goal = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  progress_percentage: number;
  status: string;
  is_achieved: boolean | null;
  target_date: string | null;
  created_at: string;
};

type GoalProgressHistory = {
  id: string;
  progress_percentage: number;
  recorded_at: string;
};

const CATEGORY_OPTIONS = [
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'physical', label: 'Physical Health' },
  { value: 'mental', label: 'Mental Health' },
  { value: 'social', label: 'Social' },
  { value: 'work', label: 'Work & Career' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_BADGE: Record<string, string> = {
  mindfulness: 'bg-primary/10 text-primary',
  physical: 'bg-success/10 text-success',
  mental: 'bg-warning/10 text-warning-foreground',
  social: 'bg-secondary text-secondary-foreground',
  work: 'bg-muted text-muted-foreground',
  other: 'bg-muted text-muted-foreground',
};

function GoalCard({
  goal,
  onCheckIn,
  onDelete,
}: {
  goal: Goal;
  onCheckIn: (goal: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className={cn('rounded-[var(--radius)] transition-shadow hover:shadow-sm', goal.is_achieved && 'opacity-80')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 shrink-0 rounded-[var(--radius)] bg-primary/10 p-2">
              {goal.is_achieved ? (
                <HugeiconsIcon icon={TaskDone02Icon} className="size-4 text-success" />
              ) : (
                <HugeiconsIcon icon={Target01Icon} className="size-4 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-foreground">{goal.title}</h4>
              {goal.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{goal.description}</p>
              )}
            </div>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-[calc(var(--radius)*0.8)]">
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={isPending}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete goal?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{goal.title}&rdquo; will be permanently deleted. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => startTransition(() => onDelete(goal.id))}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {goal.category && (
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', CATEGORY_BADGE[goal.category] ?? 'bg-muted text-muted-foreground')}>
              {goal.category}
            </span>
          )}
          {goal.is_achieved && (
            <Badge variant="secondary" className="bg-success/10 text-success text-xs">Achieved</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn('font-semibold tabular-nums', goal.progress_percentage >= 100 ? 'text-success' : 'text-foreground')}>
              {goal.progress_percentage}%
            </span>
          </div>
          <Progress value={goal.progress_percentage} className="h-1.5 rounded-[calc(var(--radius)*0.8)]" />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {goal.is_achieved ? (
          <p className="w-full text-center text-xs text-success font-medium">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="mr-1 inline size-3.5" />
            Goal achieved!
          </p>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 rounded-[var(--radius)]"
            size="sm"
            onClick={() => onCheckIn(goal)}
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
            Update Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function GoalsPageClient({ goals: initial }: { goals: Goal[] }) {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>(initial);
  const [isPending, startTransition] = useTransition();

  // New goal dialog
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Check-in dialog
  const [checkInGoal, setCheckInGoal] = useState<Goal | null>(null);
  const [checkInValue, setCheckInValue] = useState<number>(0);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<GoalProgressHistory[]>([]);

  const handleCreate = async () => {
    if (!title.trim()) { setCreateError('Please enter a goal title.'); return; }
    setCreating(true);
    setCreateError(null);
    const res = await createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      target_date: targetDate || undefined,
    });
    setCreating(false);
    if (!res.success) { setCreateError(res.error ?? 'Failed to create goal'); return; }
    setGoals((prev) => [res.data as Goal, ...prev]);
    setTitle(''); setDescription(''); setCategory(''); setTargetDate('');
    setShowNewDialog(false);
    router.refresh();
  };

  const handleCheckIn = async () => {
    if (!checkInGoal) return;
    const val = Math.min(100, Math.max(0, checkInValue));
    setCheckingIn(true);
    const res = await updateGoalProgress(checkInGoal.id, val);
    setCheckingIn(false);
    if (!res.success) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === checkInGoal.id
          ? { ...g, progress_percentage: val, is_achieved: val >= 100, status: val >= 100 ? 'completed' : 'active' }
          : g
      )
    );
    setCheckInGoal(null);
    setCheckInValue(0);
    setCheckInHistory([]);
    router.refresh();
  };

  const openCheckIn = (goal: Goal) => {
    setCheckInGoal(goal);
    setCheckInValue(goal.progress_percentage);
    getGoalProgressHistory(goal.id).then((res) => {
      if (!res.error) {
        setCheckInHistory(res.data as GoalProgressHistory[]);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    });
  };

  const active = goals.filter((g) => !g.is_achieved);
  const achieved = goals.filter((g) => g.is_achieved);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <HugeiconsIcon icon={Target01Icon} className="size-5 text-muted-foreground" />
            Goals & Milestones
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Track progress, build habits, and reach your milestones.
          </p>
        </div>
        <Button onClick={() => setShowNewDialog(true)} className="shrink-0 gap-2 rounded-[calc(var(--radius)*0.8)]">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          New Goal
        </Button>
      </div>

      {/* Active goals */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed py-16 text-center">
          <div className="rounded-[var(--radius)] bg-muted p-4">
            <HugeiconsIcon icon={Moon01Icon} className="size-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold">No goals yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Set your first goal to start tracking progress.</p>
          </div>
          <Button onClick={() => setShowNewDialog(true)} className="rounded-[calc(var(--radius)*0.8)] gap-2 mt-2">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active ({active.length})
              </h2>
              <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {active.map((g) => (
                  <GoalCard key={g.id} goal={g} onCheckIn={openCheckIn} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
          {achieved.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Achieved ({achieved.length})
              </h2>
              <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {achieved.map((g) => (
                  <GoalCard key={g.id} goal={g} onCheckIn={openCheckIn} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Goal Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="rounded-[var(--radius)]">
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daily meditation practice"
                className="h-10 rounded-[var(--radius)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal and what success looks like…"
                className="min-h-20 resize-none rounded-[var(--radius)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 rounded-[var(--radius)]">
                    <SelectValue placeholder="Category…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="h-10 rounded-[var(--radius)]"
                />
              </div>
            </div>
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} className="gap-2 rounded-[calc(var(--radius)*0.8)]">
              {creating && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {creating ? 'Creating…' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-in Dialog */}
      <Dialog
        open={!!checkInGoal}
        onOpenChange={(open) => {
          if (!open) {
            setCheckInGoal(null);
            setCheckInHistory([]);
          }
        }}
      >
        <DialogContent className="rounded-[var(--radius)] max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{checkInGoal?.title}</p>
            <div className="space-y-1.5">
              <Label>Progress (%)</Label>
              <Slider
                value={[checkInValue]}
                min={0}
                max={100}
                step={5}
                onValueChange={(next) => setCheckInValue(next[0] ?? 0)}
              />
              <p className="text-center text-2xl font-semibold tabular-nums">{checkInValue}%</p>
              <p className="text-xs text-muted-foreground text-center">Drag to update from 0 to 100</p>
            </div>
            <Progress value={checkInValue} className="h-2.5 rounded-[calc(var(--radius)*0.8)]" />
            {checkInHistory.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Recent updates</p>
                <div className="space-y-1.5">
                  {checkInHistory.slice(0, 4).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(entry.recorded_at).toLocaleDateString()}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {entry.progress_percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => setCheckInGoal(null)}>Cancel</Button>
            <Button onClick={handleCheckIn} disabled={checkingIn} className="gap-2 rounded-[calc(var(--radius)*0.8)]">
              {checkingIn && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {checkingIn ? 'Saving…' : 'Save Progress'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
