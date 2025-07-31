import React from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { name: Theme; label: string }[] = [
    { name: 'default', label: 'Default' },
    { name: 'cool', label: 'Cool' },
    { name: 'light', label: 'Light' },
  ];

  const getButtonClass = (buttonTheme: Theme) => {
    const baseClass = "px-3 py-1 text-sm rounded-full transition-colors";
    if (buttonTheme === theme) {
      // Active theme button style
      return `${baseClass} bg-interactive-primary text-content-inverse`;
    } else {
      // Inactive theme button style
      return `${baseClass} bg-surface-container text-content-secondary hover:bg-interactive-secondary`;
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-full bg-surface-secondary">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={getButtonClass(t.name)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
