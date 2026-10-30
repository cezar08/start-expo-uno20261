import axios from 'axios';

export function getRequestErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<{ message?: unknown }>(error)) {
    return fallback;
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'A solicitação demorou muito. Tente novamente.';
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  }

  const responseMessage = error.response.data?.message;
  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (error.response.status === 401) {
    return 'E-mail ou senha incorretos.';
  }

  return `A solicitação falhou (erro ${error.response.status}). Tente novamente.`;
}
