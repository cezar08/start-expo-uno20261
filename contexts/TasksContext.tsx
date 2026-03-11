import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { Task } from '@/types/task';

const STORAGE_KEY = '@exemplo/tasks';

type TasksContextType = {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  isLoading: boolean;
};

const TasksContext = createContext<TasksContextType | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega tarefas do AsyncStorage ao montar o componente
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Task[];
          setTasks(Array.isArray(parsed) ? parsed : []);
        }
      } catch {
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persiste tarefas no AsyncStorage sempre que a lista mudar
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: generateId(), title: trimmed, completed: false, createdAt: Date.now() },
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, isLoading }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks devem ser usados dentro de TasksProvider');
  }
  return ctx;
}
