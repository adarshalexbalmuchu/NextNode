/**
 * Dark mode enforcer - ensures the app is always in dark mode
 */
import { createContext, useContext, useEffect } from 'react';

type DarkModeProviderProps = {
  children: React.ReactNode;
};

type DarkModeProviderState = {
  theme: 'dark';
  actualTheme: 'dark';
};

const initialState: DarkModeProviderState = {
  theme: 'dark',
  actualTheme: 'dark',
};

const DarkModeProviderContext = createContext<DarkModeProviderState>(initialState);

export function ThemeProvider({ children }: DarkModeProviderProps) {
  useEffect(() => {
    // Always enforce dark mode
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    
    // Remove any stored theme preferences since we only use dark mode
    localStorage.removeItem('neural-ui-theme');
  }, []);

  const value = {
    theme: 'dark' as const,
    actualTheme: 'dark' as const,
  };

  return (
    <DarkModeProviderContext.Provider value={value}>
      {children}
    </DarkModeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(DarkModeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
