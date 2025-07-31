import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <div className="flex justify-center py-8 pb-20">
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-surface-secondary text-content-accent text-sm rounded transition-opacity glitch-on-click glitch-on-hover"
      >
        ログアウト
      </button>
    </div>
  );
};

export default LogoutButton;