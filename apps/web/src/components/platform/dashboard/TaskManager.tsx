'use client';

import { useState } from 'react';
import { useTaskStore, Task } from '@/stores/taskStore';
import { MorphingActionButton } from '@ekaacc/shared-ui';
import { Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export function TaskManager() {
  const { tasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
    const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
    updateTask(task.id, { status: nextStatus });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-primary/10 text-primary p-2 rounded-xl"><CheckCircle2 size={20} /></span>
        Tasks
      </h3>

      {/* Add Task Form */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-secondary/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <div className="shrink-0">
             <MorphingActionButton 
                status={buttonStatus}
                onClick={handleAddTask}
                idleLabel="Add"
             />
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false} mode='popLayout'>
            {tasks.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-10 text-muted-foreground text-sm"
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
                    "group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                    task.status === 'done' 
                        ? "bg-zinc-50 dark:bg-zinc-800/50 border-transparent opacity-60" 
                        : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                )}
            >
                <div className="flex items-center gap-3 flex-1" onClick={() => cycleStatus(task)}>
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                        task.status === 'done' ? "text-green-500 bg-green-500/10" :
                        task.status === 'in-progress' ? "text-blue-500 bg-blue-500/10" : "text-zinc-300"
                    )}>
                        {task.status === 'done' ? <CheckCircle2 size={16} /> : 
                         task.status === 'in-progress' ? <Clock size={16} /> : <Circle size={16} />}
                    </div>
                    <span className={cn(
                        "text-sm font-medium transition-all",
                        task.status === 'done' && "line-through text-muted-foreground"
                    )}>
                        {task.title}
                    </span>
                </div>
                
                <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all transform hover:scale-110"
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
