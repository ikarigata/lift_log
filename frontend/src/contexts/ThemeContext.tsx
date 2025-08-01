import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the type for theme names
export type Theme = 'default' | 'cool' | 'light' | 'emerald-coast' | 'dusty-twilight' | 'coral-sunset';

// Define the shape of the context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the ThemeProvider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    // 1. Check for a saved theme in localStorage
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // 2. Apply the theme to the <html> element and save to localStorage
    const root = document.documentElement;

    // Remove old theme classes
    root.removeAttribute('data-theme');

    // Add the new theme attribute if it's not the default
    if (theme !== 'default') {
      root.setAttribute('data-theme', theme);
    }

    // 3. Save the new theme to localStorage
    localStorage.setItem('app-theme', theme);

  }, [theme]);

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
