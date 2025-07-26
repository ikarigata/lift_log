import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavigationProps {
  onAddWorkout?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onAddWorkout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      path: '/',
      icon: '▬',
      type: 'navigation' as const,
    },
    {
      id: 'calendar',
      path: '/calendar',
      icon: '▦',
      type: 'navigation' as const,
    },
    {
      id: 'add-workout',
      path: '',
      icon: '+',
      type: 'action' as const,
    },
    {
      id: 'exercises',
      path: '/exercises',
      icon: '⚡',
      type: 'navigation' as const,
    },
    {
      id: 'more',
      path: '/more',
      icon: '⋯',
      type: 'navigation' as const,
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (item: typeof navigationItems[0]) => {
    if (item.type === 'action' && item.id === 'add-workout') {
      onAddWorkout?.();
    } else if (item.type === 'navigation') {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navigation-bg border-none z-50 w-full bottom-nav-safe">
      <div className="flex justify-around items-center h-12 w-full mx-auto">
        {navigationItems.map((item) => {
          const isActive = item.type === 'navigation' && isActivePath(item.path);
          const isAddButton = item.type === 'action' && item.id === 'add-workout';
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`flex items-center justify-center h-full flex-1 font-dotgothic transition-all border-none touch-manipulation ${
                isAddButton
                  ? 'bg-interactive-primary text-content-inverse rounded-full w-10 h-10 mx-1 font-bold hover:bg-interactive-primary/80 active:scale-95 transform'
                  : isActive
                  ? 'text-navigation-active'
                  : 'text-navigation-text hover:text-navigation-active active:bg-navigation-bg/10 opacity-70 hover:opacity-100'
              }`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                minHeight: '40px', // タップ領域を少し小さく
                minWidth: '40px'
              }}
            >
              <span className={`leading-none font-dotgothic ${isAddButton ? 'text-2xl' : 'text-xl'}`}>
                {item.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;