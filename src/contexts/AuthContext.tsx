'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    family: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      setState({
        isAuthenticated: data.authenticated,
        isLoading: false,
        family: data.family,
      });
    } catch {
      setState({
        isAuthenticated: false,
        isLoading: false,
        family: null,
      });
    }
  }, []);

  const login = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        family: data.family,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors on logout
    }

    setState({
      isAuthenticated: false,
      isLoading: false,
      family: null,
    });
  };

  // Check auth status on mount
  useEffect(() => {
    let isMounted = true;

    const performAuthCheck = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (isMounted) {
          setState({
            isAuthenticated: data.authenticated,
            isLoading: false,
            family: data.family,
          });
        }
      } catch {
        if (isMounted) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            family: null,
          });
        }
      }
    };

    performAuthCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
