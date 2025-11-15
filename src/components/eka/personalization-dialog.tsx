'use client';

import { Button, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Textarea } from '@/components/keep';
import { useState } from 'react';
;
;
;
;
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

interface PersonalizationDialogProps {
  onClose: () => void;
  onSubmit: (data: { goals: string; interests: string; squareCustomerId: string }) => void;
}

export function PersonalizationDialog({ onClose, onSubmit }: PersonalizationDialogProps) {
  const [goals, setGoals] = useState('');
  const [interests, setInterests] = useState('');
  const [squareCustomerId, setSquareCustomerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals || !interests) {
      toast({
        variant: 'destructive',
        title: 'Please fill out goals and interests.',
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
    
    onSubmit({ goals, interests, squareCustomerId });
    setIsLoading(false);
  };

  return (
    <Modal open={true} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Personalize Your Experience
            </ModalTitle>
            <ModalDescription>
              Answer these questions to help us tailor the EKA platform to you and sync with your Square profile.
            </ModalDescription>
          </ModalHeader>
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
             <div className="grid gap-2">
              <Label htmlFor="square-id">Square Customer ID (Optional)</Label>
               <Input
                id="square-id"
                value={squareCustomerId}
                onChange={(e) => setSquareCustomerId(e.target.value)}
                placeholder="Enter your Square ID to sync bookings"
              />
            </div>
          </div>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Skip for Now
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Personalize
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
    