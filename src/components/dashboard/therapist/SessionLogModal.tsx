'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";  // Assuming you have this or use standard textarea
import { Slider } from "@/components/ui/slider";      // Assuming you have this
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
                    status: 'completed'
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
            <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl rounded-2xl p-8">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-foreground">Complete Session</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground font-bold uppercase text-xs tracking-wider">Initial Client Mood</Label>
                            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">{initialMood[0]}/10</span>
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
                        <div className="flex justify-between items-center">
                            <Label className="text-muted-foreground font-bold uppercase text-xs tracking-wider">Final Client Mood</Label>
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">{finalMood[0]}/10</span>
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
                        <div className="bg-card p-4 rounded-xl text-center border border-border">
                            <span className="text-[13px] text-muted-foreground font-semibold">Predicted Improvement: </span>
                            <span className={`text-lg font-bold ml-2 ${improvement > 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                {improvement > 0 ? '+' : ''}{improvement}%
                            </span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Session Notes (Private)</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Key observations, treatment details..."
                            className="min-h-25 bg-secondary border-border focus:bg-background transition-colors"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="rounded-full px-6">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Session'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

