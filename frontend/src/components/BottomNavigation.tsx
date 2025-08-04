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
      id: 'statistics',
      path: '/statistics',
      icon: '📈',
      type: 'navigation' as const,
    },
    {
      id: 'exercises',
      path: '/exercises',
      icon: '⚙',
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
    <div className="fixed bottom-0 left-0 right-0 bg-interactive-primary border-none z-50 w-full h-16">
      <div className="grid grid-cols-6 items-center h-full w-full mx-auto relative">
        {navigationItems.map((item, index) => {
          const isActive = item.type === 'navigation' && isActivePath(item.path);
          const isAddButton = item.type === 'action' && item.id === 'add-workout';
          
          if (isAddButton) {
            return null; // プラスボタンは別途レンダリング
          }
          
          // グリッドポジションを設定（プラスボタンの位置を除く）
          let colStart = '';
          if (index === 0) colStart = 'col-start-1';
          else if (index === 1) colStart = 'col-start-2';
          else if (index === 3) colStart = 'col-start-5';
          else if (index === 4) colStart = 'col-start-6';
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`flex items-center justify-center font-dotgothic transition-all border-none touch-manipulation h-16 -mt-6 ${colStart} ${
                isActive
                  ? 'text-content-primary'
                  : 'text-content-primary hover:text-content-primary active:bg-interactive-primary/10 opacity-70 hover:opacity-100'
              }`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                minHeight: '24px',
                minWidth: '24px'
              }}
            >
              <span className={`leading-none font-dotgothic text-xl`}>
                {item.icon}
              </span>
            </button>
          );
        })}
        
        {/* プラスボタンを別途レンダリング - 2.5列目の位置に配置 */}
        <button
          onClick={() => handleItemClick(navigationItems[2])} // add-workout ボタン
          className="bg-interactive-primary text-content-inverse rounded-full w-20 h-20 font-bold active:scale-95 transform absolute left-1/2 -translate-x-1/2 -top-6 flex items-center justify-center font-dotgothic transition-all border-none touch-manipulation z-10"
          data-testid="add-workout-button"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            minHeight: '80px',
            minWidth: '80px'
          }}
        >
          <span className="leading-none font-dotgothic text-2xl" style={{ marginTop: '-2px' }}>+</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
