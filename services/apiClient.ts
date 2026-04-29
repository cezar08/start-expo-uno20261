import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_URL,
  timeout: 8000,
});

