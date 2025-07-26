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
    <div className="fixed bottom-0 left-0 right-0 bg-surface-secondary border-none z-50 w-full h-10">
      <div className="grid grid-cols-5 items-center h-full w-full mx-auto relative">
        {navigationItems.map((item, index) => {
          const isActive = item.type === 'navigation' && isActivePath(item.path);
          const isAddButton = item.type === 'action' && item.id === 'add-workout';
          
          if (isAddButton) {
            return <div key={item.id} className="col-start-3" />; // 真ん中のグリッド位置を確保
          }
          
          // グリッドポジションを設定（プラスボタンの位置を除く）
          let colStart = '';
          if (index === 0) colStart = 'col-start-1';
          else if (index === 1) colStart = 'col-start-2';
          else if (index === 3) colStart = 'col-start-4';
          else if (index === 4) colStart = 'col-start-5';
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`flex items-center justify-center font-dotgothic transition-all border-none touch-manipulation h-full ${colStart} ${
                isActive
                  ? 'text-interactive-primary'
                  : 'text-content-secondary hover:text-interactive-primary active:bg-surface-secondary/10 opacity-70 hover:opacity-100'
              }`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                minHeight: '24px',
                minWidth: '24px'
              }}
            >
              <span className={`leading-none font-dotgothic text-sm`}>
                {item.icon}
              </span>
            </button>
          );
        })}
        
        {/* プラスボタンを別途レンダリング - 3番目のグリッド位置に配置 */}
        <button
          onClick={() => handleItemClick(navigationItems[2])} // add-workout ボタン
          className="bg-interactive-primary text-content-inverse rounded-full w-16 h-16 font-bold active:scale-95 transform col-start-3 justify-self-center -top-12 relative flex items-center justify-center font-dotgothic transition-all border-none touch-manipulation z-10"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            minHeight: '64px',
            minWidth: '64px'
          }}
        >
          <span className="leading-none font-dotgothic text-2xl" style={{ marginTop: '-2px' }}>+</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;