import React from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { name: Theme; label: string }[] = [
    { name: 'default', label: 'Default' },
    { name: 'cool', label: 'Cool' },
    { name: 'light', label: 'Light' },
    { name: 'pattern-1', label: 'Pattern 1' },
    { name: 'pattern-2', label: 'Pattern 2' },
    { name: 'pattern-3', 'label': 'Pattern 3' },
    { name: 'pattern-4', label: 'Pattern 4' },
    { name: 'pattern-5', label: 'Pattern 5' },
  ];

  const getButtonClass = (buttonTheme: Theme) => {
    const baseClass = "px-3 py-1 text-sm rounded-lg transition-colors w-full text-center";
    if (buttonTheme === theme) {
      // Active theme button style
      return `${baseClass} bg-interactive-primary text-content-inverse`;
    } else {
      // Inactive theme button style
      return `${baseClass} bg-surface-container text-content-secondary hover:bg-interactive-secondary`;
    }
  };

  return (
    <div className="p-2 rounded-lg bg-surface-secondary">
      <div className="grid grid-cols-3 gap-2">
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
    </div>
  );
};

export default ThemeSwitcher;
