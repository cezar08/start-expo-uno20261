import { apiClient } from '@/services/apiClient';

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function loginRequest(email: string, password: string) {
  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
}

