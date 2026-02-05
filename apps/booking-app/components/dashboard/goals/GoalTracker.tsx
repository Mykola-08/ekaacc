'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, CheckCircle2 } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardCard } from "../shared/DashboardCard";

interface Goal {
    id: string;
    title: string;
    target_value: number;
    current_value: number;
    unit: string;
}

export function GoalTracker({ initialGoals }: { initialGoals: Goal[] }) {
    const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
    const [open, setOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target: '10', unit: 'sessions' });
    const supabase = createClient();

    const addGoal = async () => {
        const { data, error } = await supabase.from('wellness_goals').insert({
            title: newGoal.title,
            target_value: parseInt(newGoal.target),
            unit: newGoal.unit,
            current_value: 0,
            status: 'active'
        }).select().single();

        if (error) {
            toast.error(error.message);
        } else {
            setGoals([...goals, data]);
            setOpen(false);
            toast.success("Goal set!");
        }
    };

    const updateProgress = async (goal: Goal, delta: number) => {
        const newValue = Math.min(goal.current_value + delta, goal.target_value);
        const { error } = await supabase.from('wellness_goals').update({ current_value: newValue }).eq('id', goal.id);

        if (!error) {
            setGoals(goals.map(g => g.id === goal.id ? { ...g, current_value: newValue } : g));
            if (newValue === goal.target_value) {
                toast.success(`Goal "${goal.title}" completed! 🎉`);
            }
        }
    };

    return (
        <DashboardCard
            title="Wellness Goals"
            icon={Target}
            actionLabel="Add Goal"
            onAction={() => setOpen(true)}
            variant="default"
        >
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="rounded-[32px] sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Set a New Goal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input 
                                className="rounded-xl h-12 bg-card border-border" 
                                placeholder="Goal Title (e.g. Meditate Daily)" 
                                value={newGoal.title} 
                                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} 
                            />
                            <div className="flex gap-4">
                                <Input 
                                    className="rounded-xl h-12 bg-card border-border" 
                                    type="number" 
                                    placeholder="Target" 
                                    value={newGoal.target} 
                                    onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} 
                                />
                                <Input 
                                    className="rounded-xl h-12 bg-card border-border" 
                                    placeholder="Unit" 
                                    value={newGoal.unit} 
                                    onChange={e => setNewGoal({ ...newGoal, unit: e.target.value })} 
                                />
                            </div>
                            <Button onClick={addGoal} className="w-full h-12 rounded-xl text-lg font-bold">Create Goal</Button>
                        </div>
                    </DialogContent>
                </Dialog>

            <div className="space-y-6 mt-2">
                {goals.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm bg-card rounded-[24px] border border-dashed border-border italic">
                        No goals set yet. Start today!
                    </div>
                )}
                {goals.map(goal => {
                    const progress = Math.min(100, (goal.current_value / goal.target_value) * 100);
                    return (
                        <div key={goal.id} className="space-y-2 group">
                            <div className="flex justify-between text-[13px] font-bold text-foreground">
                                <span>{goal.title}</span>
                                <span className="text-muted-foreground">{goal.current_value} / {goal.target_value} {goal.unit}</span>
                            </div>
                            <div className="relative h-3 rounded-full bg-card overflow-hidden border border-border">
                                <div 
                                    className="absolute inset-y-0 left-0 bg-foreground transition-all duration-1000 ease-out rounded-full"
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>
                            <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                <button onClick={() => updateProgress(goal, 1)} className="text-[10px] uppercase font-bold text-primary hover:underline">+ Log Progress</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardCard>
    );
}
