'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  PencilEdit01Icon,
  Delete01Icon,
  NoteIcon,
  Loading03Icon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { createAssignment, updateAssignment, deleteAssignment } from './actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  patient_id: string;
  therapist_id: string;
  created_at: string;
  patient?: { full_name: string | null } | null;
}

interface Patient {
  id: string;
  full_name: string | null;
  auth_id: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:     { label: 'Pending',     className: 'bg-warning/10 text-warning border-warning/20' },
  in_progress: { label: 'In Progress', className: 'bg-primary/10 text-primary border-primary/20' },
  submitted:   { label: 'Submitted',   className: 'bg-success/10 text-success border-success/20' },
  reviewed:    { label: 'Reviewed',    className: 'bg-muted text-muted-foreground' },
  cancelled:   { label: 'Cancelled',   className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const PRIORITY_CONFIG: Record<string, string> = {
  low:    'bg-muted text-muted-foreground',
  normal: 'bg-primary/10 text-primary',
  high:   'bg-destructive/10 text-destructive',
};

function formatDue(d: string | null) {
  if (!d) return null;
  const date = new Date(d);
  const diff = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Overdue', overdue: true };
  if (diff === 0) return { label: 'Due today', overdue: false };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false };
  return { label: `Due in ${diff} days`, overdue: false };
}

function AssignmentCard({
  a,
  onEdit,
  onDelete,
}: {
  a: Assignment;
  onEdit: (a: Assignment) => void;
  onDelete: (id: string) => void;
}) {
  const status = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.pending;
  const due = formatDue(a.due_date);
  const [deleting, startDelete] = useTransition();

  return (
    <Card className="rounded-2xl border-border/60 transition-all hover:-translate-y-px hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-xl bg-primary/10 p-2">
            <HugeiconsIcon icon={NoteIcon} className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{a.title}</p>
              <div className="flex items-center gap-1.5">
                {a.priority && a.priority !== 'normal' && (
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', PRIORITY_CONFIG[a.priority])}>
                    {a.priority}
                  </span>
                )}
                <span className={cn('rounded-full border px-2 py-0.5 text-xs font-medium capitalize', status.className)}>
                  {status.label}
                </span>
              </div>
            </div>
            {a.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {a.patient?.full_name && (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={UserIcon} className="size-3" />
                  {a.patient.full_name}
                </span>
              )}
              {due && (
                <span className={cn('flex items-center gap-1', due.overdue && 'text-destructive font-medium')}>
                  <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                  {due.label}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              onClick={() => onEdit(a)}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:text-destructive"
              disabled={deleting}
              onClick={() => startDelete(() => onDelete(a.id))}
            >
              {deleting ? (
                <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
              ) : (
                <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssignmentManager({
  assignments: initial,
  patients,
}: {
  assignments: Assignment[];
  patients: Patient[];
}) {
  const router = useRouter();
  const [assignments, setAssignments] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (a: Assignment) => { setEditing(a); setDialogOpen(true); };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      if (editing) {
        await updateAssignment(formData);
      } else {
        await createAssignment(formData);
      }
      setDialogOpen(false);
      setEditing(null);
      router.refresh();
    });
  };

  const handleDelete = async (id: string) => {
    await deleteAssignment(id);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const active = assignments.filter((a) => !['submitted', 'reviewed', 'cancelled'].includes(a.status));
  const completed = assignments.filter((a) => ['submitted', 'reviewed'].includes(a.status));

  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-4 lg:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <HugeiconsIcon icon={NoteIcon} className="size-5 text-muted-foreground" />
            Assignments & Homework
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Create and manage tasks assigned to your patients.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full" onClick={openCreate}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <div className="space-y-1.5">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  name="title"
                  placeholder="e.g. Daily breathing exercise"
                  defaultValue={editing?.title ?? ''}
                  required
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Instructions</Label>
                <Textarea
                  name="description"
                  rows={3}
                  placeholder="Detailed instructions for the patient…"
                  defaultValue={editing?.description ?? ''}
                  className="resize-none rounded-xl"
                />
              </div>
              {!editing && (
                <div className="space-y-1.5">
                  <Label>Patient <span className="text-destructive">*</span></Label>
                  <Select name="user_id" required>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Select a patient…" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length === 0 ? (
                        <SelectItem value="" disabled>No patients available</SelectItem>
                      ) : (
                        patients.map((p) => (
                          <SelectItem key={p.auth_id} value={p.auth_id}>
                            {p.full_name ?? 'Unnamed Patient'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select name="type" defaultValue={editing?.type ?? 'exercise'}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="worksheet">Worksheet</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Due Date <span className="text-destructive">*</span></Label>
                  <Input
                    name="due_date"
                    type="date"
                    required
                    defaultValue={
                      editing?.due_date
                        ? new Date(editing.due_date).toISOString().split('T')[0]
                        : ''
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              {editing && (
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select name="status" defaultValue={editing.status}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" className="rounded-full" onClick={() => { setDialogOpen(false); setEditing(null); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="gap-2 rounded-full">
                  {isPending && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
                  {isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-3 gap-3 px-4 lg:px-6">
          {[
            { label: 'Active', value: active.length, color: 'text-primary' },
            { label: 'Submitted', value: assignments.filter((a) => a.status === 'submitted').length, color: 'text-success' },
            { label: 'Total', value: assignments.length, color: 'text-foreground' },
          ].map(({ label, value, color }) => (
            <Card key={label} className="rounded-2xl border-border/60">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className={cn('mt-1 text-2xl font-bold tabular-nums', color)}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="px-4 lg:px-6">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <HugeiconsIcon icon={NoteIcon} className="size-7 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold">No assignments yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first assignment to give patients structured tasks to work on.
              </p>
            </div>
            <Button className="gap-2 rounded-full" onClick={openCreate}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Create Assignment
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="mb-4 rounded-xl">
              <TabsTrigger value="active" className="gap-1.5 rounded-lg text-xs">
                Active
                {active.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary tabular-nums">
                    {active.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-1.5 rounded-lg text-xs">
                Submitted
                {completed.length > 0 && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                    {completed.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {active.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-8 text-success/50" />
                  <p className="text-sm text-muted-foreground">All assignments have been submitted.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {active.map((a) => (
                    <AssignmentCard key={a.id} a={a} onEdit={openEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completed.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                  <p className="text-sm text-muted-foreground">No submitted assignments yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completed.map((a) => (
                    <AssignmentCard key={a.id} a={a} onEdit={openEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
