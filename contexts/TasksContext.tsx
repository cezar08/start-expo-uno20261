import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { useAuth } from '@/contexts/AuthContext';
import {
  createTaskRequest,
  deleteTaskRequest,
  listTasksRequest,
  toggleTaskRequest,
} from '@/services/tasksApi';
import { getRequestErrorMessage } from '@/services/requestError';
import type { Task } from '@/types/task';

type TasksContextType = {
  tasks: Task[];
  addTask: (title: string) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  isOffline: boolean;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
    setIsOffline(!connected);
    return connected;
  }, []);

  const refreshTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const connected = await checkConnection();
      if (!connected) {
        setErrorMessage('Dispositivo offline. Conecte-se para sincronizar tarefas.');
        return;
      }

      const remoteTasks = await listTasksRequest(token);
      setTasks(remoteTasks);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, 'Não foi possível carregar as tarefas.'));
    } finally {
      setIsLoading(false);
    }
  }, [checkConnection, token]);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const addTask = useCallback(async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed || !token) return false;

    try {
      const connected = await checkConnection();
      if (!connected) {
        setErrorMessage('Sem conexão. A tarefa não foi enviada.');
        return false;
      }

      setErrorMessage(null);
      const created = await createTaskRequest(token, trimmed);
      setTasks((prev) => [created, ...prev]);
      return true;
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, 'Não foi possível criar a tarefa.'));
      return false;
    }
  }, [checkConnection, token]);

  const toggleTask = useCallback(async (id: string) => {
    if (!token) return;

    try {
      const connected = await checkConnection();
      if (!connected) {
        setErrorMessage('Sem conexão. Não foi possível atualizar a tarefa.');
        return;
      }

      setErrorMessage(null);
      const updated = await toggleTaskRequest(token, id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, 'Não foi possível atualizar a tarefa.'));
    }
  }, [checkConnection, token]);

  const deleteTask = useCallback(async (id: string) => {
    if (!token) return;

    try {
      const connected = await checkConnection();
      if (!connected) {
        setErrorMessage('Sem conexão. Não foi possível remover a tarefa.');
        return;
      }

      setErrorMessage(null);
      await deleteTaskRequest(token, id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, 'Não foi possível remover a tarefa.'));
    }
  }, [checkConnection, token]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        refreshTasks,
        isLoading,
        errorMessage,
        isOffline,
      }}
    >
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
