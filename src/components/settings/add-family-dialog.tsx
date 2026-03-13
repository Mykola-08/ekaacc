'use client';

import { useState } from 'react';
import { addFamilyMember } from '@/server/family/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { PlusCircle, UserPlus, Calendar, User } from 'lucide-react';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { cn } from '@/lib/utils';

export function AddFamilyDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const feedback = useMorphingFeedback();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    feedback.setLoading('Adding member...');
    const formData = new FormData(e.currentTarget);

    try {
      const res = await addFamilyMember(null, formData);

      if (res.success) {
        feedback.setSuccess('Member added successfully');
        setTimeout(() => setOpen(false), 1200);
      } else {
        feedback.setError(res.message);
      }
    } catch (err) {
      feedback.setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 py-6 shadow-sm transition-all">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card overflow-hidden rounded-lg border-none p-0 shadow-sm sm:max-w-106.25">
        <div className="bg-muted/40 border-border/60 border-b p-6 pb-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-foreground font-serif text-xl">
              Add Family Member
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a child or dependent to manage their bookings.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="">
            <div className="">
              <Label htmlFor="full_name" className="text-foreground/90 font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="e.g. Maya V."
                  className="bg-muted/40 border-border focus:ring-border h-9 rounded-lg pl-10 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="">
              <Label htmlFor="dob" className="text-foreground/90 font-medium">
                Date of Birth
              </Label>
              <div className="relative">
                <Calendar className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  className="bg-muted/40 border-border focus:ring-border block h-9 w-full rounded-lg pl-10 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="">
              <Label htmlFor="relationship" className="text-foreground/90 font-medium">
                Relationship
              </Label>
              <Select name="relationship" required defaultValue="child">
                <SelectTrigger className="bg-muted/40 border-border focus:ring-border h-9 rounded-lg">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent className="border-border/60 rounded-lg shadow-sm">
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 pt-2">
            <InlineFeedback
              status={feedback.status}
              message={feedback.message}
              onDismiss={feedback.reset}
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-full rounded-lg text-base font-medium shadow-sm"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
