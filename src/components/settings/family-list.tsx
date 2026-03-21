'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { deleteFamilyMember } from '@/server/family/actions';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Delete01Icon, Alert01Icon } from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function FamilyList({ members }: { members: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteFeedback = useMorphingFeedback();

  if (!members || members.length === 0) {
    return (
      <div className="text-muted-foreground animate-in fade-in zoom-in rounded-[calc(var(--radius)*0.8)] border border-dashed p-8 text-center duration-500">
        <HugeiconsIcon icon={UserIcon} className="text-muted-foreground/30 mx-auto mb-3 size-12" />
        <p>No family members added yet.</p>
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Add a dependent to book services for them.
        </p>
      </div>
    );
  }

  async function handleDelete() {
    if (!deletingId) return;

    deleteFeedback.setLoading('Removing...');
    const res = await deleteFamilyMember(deletingId);
    if (res.success) {
      deleteFeedback.setSuccess('Family member removed');
    } else {
      deleteFeedback.setError(res.message || 'Failed to remove member');
    }
    setDeletingId(null);
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="group bg-card border-border/60 hover:border-border hover: relative flex items-start gap-4 rounded-[calc(var(--radius)*0.8)] border p-5 transition-all hover:-translate-y-1"
          >
            <Avatar className="border-border/60 bg-muted/40 h-12 w-12 border">
              <AvatarFallback className="bg-muted/50 text-muted-foreground font-serif text-lg">
                {member.full_name?.charAt(0) || (
                  <HugeiconsIcon icon={UserIcon} className="size-5" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-foreground mb-1 truncate font-semibold">{member.full_name}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-medium capitalize">
                  {member.metadata?.relationship || 'Dependent'}
                </span>
                {member.dob && (
                  <span className="text-muted-foreground/80">
                    • Born {new Date(member.dob).getFullYear()}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive absolute top-3 right-3 h-9 w-9 rounded-[var(--radius)] opacity-0 transition-all group-hover:opacity-100"
              onClick={() => setDeletingId(member.id)}
            >
              <HugeiconsIcon icon={Delete01Icon} className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-card overflow-hidden rounded-[calc(var(--radius)*0.8)] border-none p-0 sm:max-w-100">
          <div className="flex flex-col items-center p-8 pb-6 text-center">
            <div className="bg-destructive/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Alert01Icon} className="text-destructive size-8" />
            </div>
            <DialogTitle className="text-foreground mb-2 font-serif text-xl">
              Remove Family Member?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to remove this family member? This action cannot be undone.
            </DialogDescription>
          </div>

          <div className="bg-muted/40 flex gap-3 p-6">
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
              className="border-border hover:bg-card hover:text-foreground h-11 flex-1 rounded-[var(--radius)]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-destructive shadow-destructive/20 hover:bg-destructive/90 h-11 flex-1 rounded-[var(--radius)]"
            >
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
