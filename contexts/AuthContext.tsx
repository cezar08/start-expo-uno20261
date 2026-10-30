import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { loginRequest } from '@/services/authApi';
import { getRequestErrorMessage } from '@/services/requestError';

const AUTH_STORAGE_KEY = '@exemplo/auth';
const SECURE_AUTH_STORAGE_KEY = 'exemplo.auth';

async function getStoredSession() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(AUTH_STORAGE_KEY);
  }

  const secureSession = await SecureStore.getItemAsync(SECURE_AUTH_STORAGE_KEY);
  if (secureSession) return secureSession;

  const legacySession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (!legacySession) return null;

  await SecureStore.setItemAsync(SECURE_AUTH_STORAGE_KEY, legacySession);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  return legacySession;
}

function setStoredSession(session: string) {
  return Platform.OS === 'web'
    ? AsyncStorage.setItem(AUTH_STORAGE_KEY, session)
    : SecureStore.setItemAsync(SECURE_AUTH_STORAGE_KEY, session);
}

async function removeStoredSession() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SECURE_AUTH_STORAGE_KEY);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getStoredSession();
        if (!raw) return;

        const session = JSON.parse(raw) as { token: string; user: User };
        if (session?.token && session?.user) {
          setToken(session.token);
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setAuthError('Informe e-mail e senha para entrar.');
      return false;
    }

    let stage: 'api-request' | 'session-storage' = 'api-request';

    try {
      const payload = await loginRequest(normalizedEmail, password);
      stage = 'session-storage';
      await setStoredSession(JSON.stringify({ token: payload.token, user: payload.user }));
      setToken(payload.token);
      setUser(payload.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('[AuthContext] Login failed', {
        stage,
        platform: Platform.OS,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      setAuthError(
        stage === 'session-storage'
          ? 'Login realizado, mas não foi possível salvar a sessão neste dispositivo.'
          : getRequestErrorMessage(error, 'Não foi possível entrar. Tente novamente.'),
      );
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    setAuthError(null);
    await removeStoredSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        isAuthLoading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
