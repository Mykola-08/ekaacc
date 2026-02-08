'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this or use standard textarea
import { Slider } from '@/components/ui/slider'; // Assuming you have this
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SessionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export function SessionLogModal({ isOpen, onClose, booking, onSuccess }: SessionLogModalProps) {
  const [initialMood, setInitialMood] = useState([5]);
  const [finalMood, setFinalMood] = useState([8]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('booking')
        .update({
          initial_mood: initialMood[0],
          final_mood: finalMood[0],
          therapist_notes: notes,
          status: 'completed',
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast.success('Session logged successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Failed to log session: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startMood = initialMood[0] ?? 0;
  const endMood = finalMood[0] ?? 0;
  const improvement = startMood > 0 ? Math.round(((endMood - startMood) / startMood) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border rounded-2xl p-8 shadow-2xl sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-foreground text-2xl font-bold">Complete Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Initial Client Mood
              </Label>
              <span className="text-primary bg-primary/10 rounded-full px-3 py-1 text-sm font-bold">
                {initialMood[0]}/10
              </span>
            </div>
            <Slider
              value={initialMood}
              onValueChange={setInitialMood}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Final Client Mood
              </Label>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
                {finalMood[0]}/10
              </span>
            </div>
            <Slider
              value={finalMood}
              onValueChange={setFinalMood}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          {initialMood[0] !== undefined && initialMood[0] > 0 && (
            <div className="bg-card border-border rounded-xl border p-4 text-center">
              <span className="text-muted-foreground text-[13px] font-semibold">
                Predicted Improvement:{' '}
              </span>
              <span
                className={`ml-2 text-lg font-bold ${improvement > 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}
              >
                {improvement > 0 ? '+' : ''}
                {improvement}%
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label>Session Notes (Private)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key observations, treatment details..."
              className="bg-secondary border-border focus:bg-background min-h-25 transition-colors"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="rounded-full px-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Complete Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
