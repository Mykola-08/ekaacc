'use client';

import { useState } from 'react';
import { useTaskStore, Task } from '@/store/taskStore';
import { MorphingActionButton } from '@/components/ui';
import { Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export function TaskManager() {
  const { tasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setButtonStatus('error');
      setTimeout(() => setButtonStatus('idle'), 2000);
      return;
    }

    setButtonStatus('loading');
    try {
      await addTask({ title: newTaskTitle, status: 'todo' });
      setButtonStatus('success');
      setNewTaskTitle('');
      setTimeout(() => setButtonStatus('idle'), 2000);
    } catch (e) {
      setButtonStatus('error');
      setTimeout(() => setButtonStatus('idle'), 2000);
    }
  };

  const cycleStatus = (task: Task) => {
    const nextStatus =
      task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
    updateTask(task.id, { status: nextStatus });
  };

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <span className="bg-primary/10 text-primary rounded-xl p-2">
          <CheckCircle2 size={20} />
        </span>
        Tasks
      </h3>

      {/* Add Task Form */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="bg-secondary/50 focus:ring-primary/20 flex-1 rounded-[20px] px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
        />
        <div className="shrink-0">
          <MorphingActionButton status={buttonStatus} onClick={handleAddTask} idleLabel="Add" />
        </div>
      </div>

      {/* Task List */}
      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground py-10 text-center text-sm"
            >
              No tasks yet. Add one above!
            </motion.div>
          )}

          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                'group flex cursor-pointer items-center justify-between rounded-[20px] border p-4 transition-all',
                task.status === 'done'
                  ? 'border-transparent bg-zinc-50 opacity-60 dark:bg-zinc-800/50'
                  : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
              )}
            >
              <div className="flex flex-1 items-center gap-3" onClick={() => cycleStatus(task)}>
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
                    task.status === 'done'
                      ? 'bg-green-500/10 text-green-500'
                      : task.status === 'in-progress'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'text-zinc-300'
                  )}
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 size={16} />
                  ) : task.status === 'in-progress' ? (
                    <Clock size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-all',
                    task.status === 'done' && 'text-muted-foreground line-through'
                  )}
                >
                  {task.title}
                </span>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="transform p-2 text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:scale-110 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
