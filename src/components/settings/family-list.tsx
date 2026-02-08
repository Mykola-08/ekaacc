'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteFamilyMember } from '@/server/family/actions';
import { toast } from 'sonner';
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

  if (!members || members.length === 0) {
    return (
      <div className="text-muted-foreground animate-in fade-in zoom-in rounded-lg border border-dashed p-8 text-center duration-500">
        <User className="text-muted-foreground/30 mx-auto mb-3 h-12 w-12" />
        <p>No family members added yet.</p>
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Add a dependent to book services for them.
        </p>
      </div>
    );
  }

  async function handleDelete() {
    if (!deletingId) return;

    const res = await deleteFamilyMember(deletingId);
    if (res.success) {
      toast.success('Family member removed');
    } else {
      toast.error(res.message || 'Failed to remove member');
    }
    setDeletingId(null);
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="group bg-card border-border/60 hover:border-border relative flex items-start gap-4 rounded-[20px] border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <Avatar className="border-border/60 bg-muted/40 h-12 w-12 border">
              <AvatarFallback className="bg-muted/50 text-muted-foreground font-serif text-lg">
                {member.full_name?.charAt(0) || <User className="h-5 w-5" />}
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
              className="text-muted-foreground/50 absolute top-3 right-3 h-9 w-9 rounded-xl opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
              onClick={() => setDeletingId(member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-card overflow-hidden rounded-[24px] border-none p-0 shadow-2xl sm:max-w-100">
          <div className="flex flex-col items-center p-8 pb-6 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-500" />
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
              className="border-border hover:bg-card hover:text-foreground h-11 flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="h-11 flex-1 rounded-xl bg-red-500 shadow-md shadow-red-200 hover:bg-red-600"
            >
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
