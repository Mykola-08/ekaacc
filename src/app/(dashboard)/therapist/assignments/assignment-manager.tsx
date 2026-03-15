'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createAssignment, updateAssignment } from './actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string;
  user_id: string;
  profiles?: { full_name: string } | null;
}

interface Patient {
  id: string;
  full_name: string;
}

export function AssignmentManager({
  assignments,
  patients,
}: {
  assignments: Assignment[];
  patients: Patient[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      await createAssignment(formData);
      setDialogOpen(false);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    startTransition(async () => {
      await updateAssignment(formData);
      setDialogOpen(false);
      setEditingAssignment(null);
    });
  };

  const openEdit = (a: Assignment) => {
    setEditingAssignment(a);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingAssignment(null);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments & Homework</h1>
          <p className="text-muted-foreground">Track patient progress on assigned tasks.</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingAssignment(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
              </DialogTitle>
            </DialogHeader>
            <form action={editingAssignment ? handleUpdate : handleCreate} className="grid gap-4">
              {editingAssignment && <input type="hidden" name="id" value={editingAssignment.id} />}
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Breathing exercise"
                  defaultValue={editingAssignment?.title || ''}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Instructions for the assignment"
                  defaultValue={editingAssignment?.description || ''}
                />
              </div>
              {!editingAssignment && (
                <div className="grid gap-2">
                  <Label htmlFor="user_id">Patient</Label>
                  <Select name="user_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={
                    editingAssignment?.due_date
                      ? new Date(editingAssignment.due_date).toISOString().split('T')[0]
                      : ''
                  }
                  required
                />
              </div>
              {editingAssignment && (
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingAssignment.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : editingAssignment ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {assignments?.map((a) => (
          <Card key={a.id} className="group hover:border-primary/50 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div className="">
                <div className="font-semibold">{a.title}</div>
                <div className="text-muted-foreground text-sm">
                  Assigned to{' '}
                  <span className="text-foreground font-medium">
                    {a.profiles?.full_name || 'Unknown'}
                  </span>{' '}
                  • Due {new Date(a.due_date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={a.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {a.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => openEdit(a)}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!assignments || assignments.length === 0) && (
          <div className="text-muted-foreground rounded-xl border-2 border-dashed py-12 text-center">
            No active assignments. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
