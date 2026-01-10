import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Check, Info, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { api } from '@/lib/platform/mobile/api';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/platform/ui/tooltip';

interface GoalsProps {
  userId: string;
}

export function Goals({ userId }: GoalsProps) {
  const [goals, setGoals] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: '',
    title: '',
    description: '',
    totalDays: 20,
    daysCompleted: 0,
    progress: 0,
    status: 'in-progress'
  });

  const goalCategories = ['Health', 'Fitness', 'Mental Health', 'Nutrition', 'Hobbies'];

  useEffect(() => {
    async function loadGoals() {
      try {
        const data = await api.getGoals(userId);
        setGoals(data.goals || []);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, [userId]);

  const filteredGoals = goals.filter(goal => 
    filter === 'all' ? true : goal.status === filter
  );

  const completedCount = goals.filter(g => g.status === 'completed').length;
  const totalCount = goals.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddGoal = async () => {
    if (!newGoal.category) return;
    try {
      const response = await api.createGoal({ userId, ...newGoal });
      setGoals([...goals, response.goal]);
      setIsAdding(false);
      setNewGoal({
        category: '',
        title: '',
        description: '',
        totalDays: 20,
        daysCompleted: 0,
        progress: 0,
        status: 'in-progress'
      });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleUpdateProgress = async (goal: any) => {
    if (goal.status === 'completed') return;
    try {
      const newDaysCompleted = goal.daysCompleted + 1;
      const newProgress = Math.round((newDaysCompleted / goal.totalDays) * 100);
      const newStatus = newProgress >= 100 ? 'completed' : 'in-progress';
      
      const updates = {
        daysCompleted: newDaysCompleted,
        progress: newProgress,
        status: newStatus
      };
      
      const response = await api.updateGoal(userId, goal.id, updates);
      setGoals(goals.map(g => g.id === response.goal.id ? response.goal : g));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <ResponsiveContainer maxWidth="xl" className="p-6 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-900">My Goals</h1>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden lg:inline">Add Goal</span>
              </span>
            </Button>
          </div>
          <p className="text-gray-500">Track your wellness journey</p>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overall Progress Stats Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 lg:mb-12"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="w-6 h-6 rounded-md bg-white/20" />
                  <Skeleton className="w-32 h-6 rounded-md bg-white/20" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="w-16 h-10 mx-auto mb-2 rounded-md bg-white/20" />
                      <Skeleton className="w-20 h-4 mx-auto rounded-md bg-white/20" />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="w-32 h-4 rounded-md bg-white/20" />
                    <Skeleton className="w-12 h-4 rounded-md bg-white/20" />
                  </div>
                  <Skeleton className="w-full h-3 rounded-full bg-white/20" />
                </div>
              </div>
            </motion.div>

            {/* Goals Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white rounded-3xl p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Skeleton className="w-3/4 h-6 mb-2 rounded-md" />
                      <Skeleton className="w-full h-4 rounded-md" />
                    </div>
                  </div>

                  {/* Progress Bar Skeleton */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <Skeleton className="w-10 h-4 rounded-md" />
                    </div>
                    <Skeleton className="w-full h-3 rounded-full" />
                  </div>

                  <Skeleton className="w-full h-11 rounded-xl" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center py-12 lg:py-20"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-500 mb-8">
              Start tracking your wellness goals
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-2xl h-14 px-8"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Goal
              </span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Overall Progress Stats */}
            <div className="mb-8 lg:mb-12">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white">Your Progress</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <Info className="w-3 h-3 text-white/80" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Track your wellness goals and celebrate milestones</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="grid grid-cols-3 gap-4 lg:gap-6">
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl text-white mb-1">{totalCount}</p>
                    <p className="text-sm text-white/70">Total Goals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl text-white mb-1">{completedCount}</p>
                    <p className="text-sm text-white/70">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl text-white mb-1">{totalCount - completedCount}</p>
                    <p className="text-sm text-white/70">In Progress</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Overall Completion</span>
                    <span className="text-sm text-white">{overallProgress}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white rounded-3xl p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-2">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-gray-500 text-sm mb-4">{goal.description}</p>
                      )}
                    </div>
                    {goal.status === 'completed' && (
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {goal.daysCompleted} / {goal.totalDays} days
                      </span>
                      <span className="text-sm text-gray-900">{goal.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${goal.progress}%` }}
                        className="h-full bg-gray-900 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {goal.status !== 'completed' && (
                    <Button
                      onClick={() => handleUpdateProgress(goal)}
                      variant="outline"
                      className="w-full border-0 bg-gray-50 hover:bg-gray-100 rounded-xl"
                    >
                      Mark Day Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Goal Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsAdding(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 lg:p-8 w-full max-w-md"
            >
              {/* Modal content remains the same */}
              <h2 className="text-gray-900 mb-6">Create New Goal</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 mb-2 block text-sm">Goal Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => {
                      const category = e.target.value;
                      setNewGoal({
                        ...newGoal,
                        category,
                        title: category
                      });
                    }}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900"
                  >
                    <option value="">Select a category</option>
                    {goalCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 mb-2 block text-sm">Duration (days)</label>
                  <input
                    type="number"
                    value={newGoal.totalDays}
                    onChange={(e) => setNewGoal({ ...newGoal, totalDays: parseInt(e.target.value) || 20 })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900"
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setIsAdding(false)}
                    variant="outline"
                    className="flex-1 border-gray-200 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddGoal}
                    disabled={!newGoal.category}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-xl"
                  >
                    Create Goal
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}


