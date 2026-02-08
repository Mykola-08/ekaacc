import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: async (task) => {
        // Imitate API delay for morphing effect
        await new Promise((resolve) => setTimeout(resolve, 1500));

        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              ...task,
            },
          ],
        }));
      },
      updateTask: async (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },
      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
