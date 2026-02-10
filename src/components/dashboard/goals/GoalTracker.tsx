'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DashboardCard } from '../shared/DashboardCard';

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  target_type: string;
}

export function GoalTracker({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '10', target_type: 'custom' });
  const supabase = createClient();

  const addGoal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Not authenticated'); return; }
    const { data, error } = await supabase
      .from('wellness_goals')
      .insert({
        user_id: user.id,
        title: newGoal.title,
        target_value: parseInt(newGoal.target),
        target_type: newGoal.target_type,
        current_value: 0,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      setGoals([...goals, data]);
      setOpen(false);
      toast.success('Goal set!');
    }
  };

  const updateProgress = async (goal: Goal, delta: number) => {
    const newValue = Math.min(goal.current_value + delta, goal.target_value);
    const { error } = await supabase
      .from('wellness_goals')
      .update({ current_value: newValue })
      .eq('id', goal.id);

    if (!error) {
      setGoals(goals.map((g) => (g.id === goal.id ? { ...g, current_value: newValue } : g)));
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
        <DialogContent className="rounded-[20px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Set a New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              className="bg-card border-border h-12 rounded-xl"
              placeholder="Goal Title (e.g. Meditate Daily)"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <div className="flex gap-4">
              <Input
                className="bg-card border-border h-12 rounded-xl"
                type="number"
                placeholder="Target"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
              <Input
                className="bg-card border-border h-12 rounded-xl"
                placeholder="Type (mood, sleep, activity, custom)"
                value={newGoal.target_type}
                onChange={(e) => setNewGoal({ ...newGoal, target_type: e.target.value })}
              />
            </div>
            <Button onClick={addGoal} className="h-12 w-full rounded-xl text-lg font-bold">
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-2 space-y-6">
        {goals.length === 0 && (
          <div className="text-muted-foreground bg-card border-border rounded-xl border border-dashed py-6 text-center text-sm italic">
            No goals set yet. Start today!
          </div>
        )}
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.current_value / goal.target_value) * 100);
          return (
            <div key={goal.id} className="group space-y-2">
              <div className="text-foreground flex justify-between text-[13px] font-bold">
                <span>{goal.title}</span>
                <span className="text-muted-foreground">
                  {goal.current_value} / {goal.target_value} {goal.target_type}
                </span>
              </div>
              <div className="bg-card border-border relative h-3 overflow-hidden rounded-full border">
                <div
                  className="bg-foreground absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => updateProgress(goal, 1)}
                  className="text-primary text-xs font-bold uppercase hover:underline"
                >
                  + Log Progress
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
