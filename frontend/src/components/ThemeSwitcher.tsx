import React from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { name: Theme; label: string }[] = [
    { name: 'default', label: 'Default' },
    { name: 'cool', label: 'Cool' },
    { name: 'light', label: 'Light' },
    { name: 'deep-ocean', label: 'Deep Ocean' },
    { name: 'emerald-coast', label: 'Emerald Coast' },
    { name: 'dusty-twilight', label: 'Dusty Twilight' },
    { name: 'sandy-lagoon', label: 'Sandy Lagoon' },
    { name: 'coral-sunset', label: 'Coral Sunset' },
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
