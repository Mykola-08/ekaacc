'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Button, Card, CardContent, CardHeader, CardTitle, CardFooter, Skeleton, Input, Textarea, Label } from '@/components/keep';
import { Plus, Trash } from 'lucide-react';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/lib/types';

export default function GoalsPage() {
  const { user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (dataService && user?.id) {
      setIsLoading(true);
      const userGoals = await dataService.getGoals(user.id);
      setGoals(userGoals || []);
      setIsLoading(false);
    }
  }, [dataService, user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSaveGoal = (newGoal: Goal) => {
    setGoals([newGoal, ...goals]);
    setIsCreating(false);
    toast({
      title: 'Goal saved',
      description: 'Your new goal has been saved.',
    });
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (dataService) {
      await dataService.deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      toast({
        title: 'Goal deleted',
        description: 'Your goal has been deleted.',
      });
    }
  };

  return (
    <div className="apple-page">
      <div className="apple-container">
        <div className="apple-flex-between apple-mb-12">
          <div>
            <h1 className="apple-title-section">My Goals</h1>
            <p className="apple-text-body">Set and track your therapy goals.</p>
          </div>
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)}
              className="apple-button-gradient-blue"
            >
              <Plus className="apple-w-4 apple-h-4 apple-mr-2" />
              New Goal
            </Button>
          )}
        </div>

        <div className="apple-space-y-8">
          {isCreating && (
            <NewGoalCard
              onSave={handleSaveGoal}
              onCancel={() => setIsCreating(false)}
            />
          )}

          {isLoading ? (
            <GoalSkeleton />
          ) : goals.length > 0 ? (
            goals.map((goal) => <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />)
          ) : (
            !isCreating && (
              <Card className="apple-card apple-card-dashed apple-flex apple-flex-col apple-items-center apple-justify-center apple-text-center apple-p-12">
                <h3 className="apple-title-card apple-mb-2">No goals yet</h3>
                <p className="apple-text-body">
                  Create a new goal to start tracking your progress.
                </p>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function NewGoalCard({
  onSave,
  onCancel,
}: {
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSave = async () => {
    if (dataService && user) {
      const newGoal = await dataService.createGoal({
        userId: user.id,
        description,
        targetDate,
        isCompleted: false,
      });
      onSave(newGoal);
    }
  };

  return (
    <Card className="apple-card apple-card-subtle">
      <CardHeader>
        <CardTitle className="apple-title-card">New Goal</CardTitle>
      </CardHeader>
      <CardContent className="apple-space-y-6">
        <div className="apple-space-y-3">
          <Label htmlFor="description" className="apple-text-sm apple-font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to achieve?"
            className="apple-input"
          />
        </div>
        <div className="apple-space-y-3">
          <Label htmlFor="targetDate" className="apple-text-sm apple-font-medium">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="apple-input"
          />
        </div>
      </CardContent>
      <CardFooter className="apple-flex apple-justify-end apple-gap-3">
        <Button variant="outline" onClick={onCancel} className="apple-button-outline">Cancel</Button>
        <Button onClick={handleSave} className="apple-button-gradient-blue">Save</Button>
      </CardFooter>
    </Card>
  );
}

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p>{goal.description}</p>
        <p className="text-sm text-muted-foreground">
          Target Date: {new Date(goal.targetDate).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onDelete(goal.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function GoalSkeleton() {
  return (
    <div className="apple-space-y-8">
      <Card className="apple-card">
        <CardHeader>
          <Skeleton className="apple-h-6 apple-w-1/2" />
        </CardHeader>
        <CardContent className="apple-space-y-4">
          <Skeleton className="apple-h-4 apple-w-full" />
          <Skeleton className="apple-h-4 apple-w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}
