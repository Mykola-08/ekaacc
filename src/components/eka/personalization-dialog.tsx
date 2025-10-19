'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalizationDialogProps {
  onClose: () => void;
  onSubmit: (data: { goals: string; interests: string }) => void;
}

export function PersonalizationDialog({ onClose, onSubmit }: PersonalizationDialogProps) {
  const [goals, setGoals] = useState('');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals || !interests) {
      toast({
        variant: 'destructive',
        title: 'Please fill out both fields.',
        description: 'Your answers will help us personalize your experience.',
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: 'Personalizing your experience...',
      description: 'Your dashboard is being tailored to your needs.',
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({ goals, interests });
    setIsLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Personalize Your Experience
            </DialogTitle>
            <DialogDescription>
              Answer two quick questions to help us tailor the EKA platform to you. This will help train your personal AI and customize your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goals">What are your primary goals for using EKA?</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., Reduce back pain, improve my sleep, manage work-related stress..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interests">What areas of wellness are you most interested in?</Label>
              <Textarea
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., Mindfulness, physical therapy, nutrition, new therapy techniques..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" onClick={onClose}>
                Skip for Now
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Personalize
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    