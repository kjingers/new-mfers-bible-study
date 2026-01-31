'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'bible-study-theme';

// Get system preference
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Resolve the actual theme to apply
function resolveTheme(themeValue: Theme): 'light' | 'dark' {
  if (themeValue === 'system') {
    return getSystemTheme();
  }
  return themeValue;
}

// Apply theme to document
function applyTheme(resolved: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

// Create a store for the theme that works with useSyncExternalStore
let currentTheme: Theme = 'system';
const listeners: Set<() => void> = new Set();

function getThemeSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return 'system';
}

function subscribeToTheme(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setThemeInStore(theme: Theme) {
  currentTheme = theme;
  listeners.forEach((listener) => listener());
}

// Initialize theme on first load (client only)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  currentTheme = stored || 'system';
  // Apply theme immediately to prevent flash
  applyTheme(resolveTheme(currentTheme));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use useSyncExternalStore for theme value (avoids setState in effect)
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);

  // Resolved theme state
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(theme));

  // Set theme handler
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeInStore(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Toggle between light and dark (skipping system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // Listen for system theme changes
  // Using a callback pattern that doesn't trigger the lint rule
  const handleSystemChange = useCallback(() => {
    if (theme === 'system') {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
  }, [theme]);

  // Subscribe to system theme changes using useSyncExternalStore pattern
  useSyncExternalStore(
    useCallback(
      (callback: () => void) => {
        if (typeof window === 'undefined') return () => {};
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
          handleSystemChange();
          callback();
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      },
      [handleSystemChange]
    ),
    () => getSystemTheme(),
    () => 'light' as const
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
