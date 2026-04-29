import type { Task } from '@/types/task';
import { apiClient } from '@/services/apiClient';

function authHeader(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function listTasksRequest(token: string) {
  const response = await apiClient.get<Task[]>('/tasks', authHeader(token));
  return response.data;
}

export async function createTaskRequest(token: string, title: string) {
  const response = await apiClient.post<Task>('/tasks', { title }, authHeader(token));
  return response.data;
}

export async function toggleTaskRequest(token: string, id: string) {
  const response = await apiClient.patch<Task>(`/tasks/${id}/toggle`, undefined, authHeader(token));
  return response.data;
}

export async function deleteTaskRequest(token: string, id: string) {
  await apiClient.delete(`/tasks/${id}`, authHeader(token));
}

