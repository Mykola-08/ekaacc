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

    const improvement = initialMood[0] && finalMood[0] ? Math.round(((finalMood[0] - initialMood[0]) / initialMood[0]) * 100) : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-[20px]">
                <DialogHeader>
                    <DialogTitle>Complete Session</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Initial Client Mood</Label>
                            <span className="font-bold text-blue-600">{initialMood[0]}/10</span>
                        </div>
                        <Slider
                            value={initialMood}
                            onValueChange={setInitialMood}
                            min={1}
                            max={10}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Final Client Mood</Label>
                            <span className="font-bold text-green-600">{finalMood[0]}/10</span>
                        </div>
                        <Slider
                            value={finalMood}
                            onValueChange={setFinalMood}
                            min={1}
                            max={10}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    {initialMood[0] !== undefined && initialMood[0] > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <span className="text-sm text-blue-600 font-medium">Predicted Improvement: </span>
                            <span className={`text-lg font-bold ${improvement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
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
                            className="min-h-[100px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="outline" onClick={onClose} className="border-gray-200">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-[#007AFF] hover:bg-[#0062CC] rounded-full px-6">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Session'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
