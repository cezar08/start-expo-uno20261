import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { loginRequest } from '@/services/authApi';

const AUTH_STORAGE_KEY = '@exemplo/auth';

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
  login: (email: string, password: string) => Promise<void>;
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
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
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
      throw new Error('Credenciais invalidas');
    }

    try {
      const payload = await loginRequest(normalizedEmail, password);
      setToken(payload.token);
      setUser(payload.user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: payload.token, user: payload.user })
      );
    } catch {
      setAuthError('Falha no login. Verifique credenciais e conexao.');
      throw new Error('Falha no login');
    }
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    setAuthError(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
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
