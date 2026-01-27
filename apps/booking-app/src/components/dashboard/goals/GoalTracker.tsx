'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, CheckCircle2 } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
        <Card className="p-6 rounded-[28px] border-border bg-card/50 backdrop-blur-sm animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Wellness Goals</h3>
                        <p className="text-xs text-muted-foreground">Track your progress</p>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0"><Plus className="w-4 h-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Set a New Goal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Goal Title (e.g. Meditate Daily)" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} />
                            <div className="flex gap-4">
                                <Input type="number" placeholder="Target" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} />
                                <Input placeholder="Unit (e.g. mins)" value={newGoal.unit} onChange={e => setNewGoal({ ...newGoal, unit: e.target.value })} />
                            </div>
                            <Button onClick={addGoal} className="w-full">Create Goal</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                {goals.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">No goals set yet. Start today!</div>
                )}
                {goals.map(goal => {
                    const progress = Math.min(100, (goal.current_value / goal.target_value) * 100);
                    return (
                        <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{goal.title}</span>
                                <span className="text-muted-foreground">{goal.current_value} / {goal.target_value} {goal.unit}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Progress value={progress} className="h-2.5 bg-rose-100" indicatorClassName="bg-rose-500" />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 rounded-full hover:bg-rose-100 hover:text-rose-600"
                                    onClick={() => updateProgress(goal, 1)}
                                    disabled={progress >= 100}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
