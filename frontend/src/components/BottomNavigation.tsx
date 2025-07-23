import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

interface BottomNavigationProps {
  onAddWorkout: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onAddWorkout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/exercises', icon: <CogIcon />, label: '種目管理' },
    { path: '/calendar', icon: <CalendarIcon />, label: 'カレンダー' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-primary-bg border-t border-primary-border flex items-center justify-around">
      {/* Left Icons */}
      <NavLink
        to={navItems[0].path}
        className={`flex flex-col items-center justify-center w-1/4 ${isActive(navItems[0].path) ? 'text-primary-accent' : 'text-primary-text'}`}
      >
        {React.cloneElement(navItems[0].icon, { className: 'w-6 h-6' })}
        <span className="text-xs mt-1">{navItems[0].label}</span>
      </NavLink>

      {/* Center Add Button */}
      <div
        className="w-1/4 flex justify-center"
        onClick={() => {
          if (location.pathname !== '/') {
            navigate('/');
          }
          // Use a short timeout to allow the navigation to complete before adding the workout
          setTimeout(onAddWorkout, 50);
        }}
      >
        <div className="bg-primary-accent text-primary-text rounded-full w-16 h-16 flex items-center justify-center -mt-8 border-4 border-primary-bg cursor-pointer">
          <PlusIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Right Icons */}
      <NavLink
        to={navItems[1].path}
        className={`flex flex-col items-center justify-center w-1/4 ${isActive(navItems[1].path) ? 'text-primary-accent' : 'text-primary-text'}`}
      >
        {React.cloneElement(navItems[1].icon, { className: 'w-6 h-6' })}
        <span className="text-xs mt-1">{navItems[1].label}</span>
      </NavLink>
    </div>
  );
};

// SVG Icons (Heroicons)
const CogIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.28-.082c.55-.161 1.148-.161 1.697 0l.28.082c.55.219 1.02.684 1.11 1.226l.068.418c.28.161.54.35.78.569l.27.24c.45.399.99.64 1.56.64h.45c.61 0 1.17.25 1.58.68l.2.21c.41.44.63.99.63 1.58v.45c0 .57.24.11.64.156l.24.27c.22.24.41.5.57.78l.07.28c.16.55.16 1.148 0 1.697l-.08.28c-.22.55-.68 1.02-1.22 1.11l-.42.07c-.16.28-.35.54-.57.78l-.24.27c-.4.45-.64.99-.64 1.56v.45c0 .61-.25 1.17-.68 1.58l-.21.2c-.44.41-.99.63-1.58.63h-.45c-.57 0-1.11.24-1.56.64l-.27.24c-.24.22-.5.41-.78.57l-.28.07c-.55.16-1.148.16-1.697 0l-.28-.08c-.55-.22-1.02-.68-1.11-1.22l-.07-.42c-.28-.16-.54-.35-.78-.57l-.27-.24c-.45-.4-.99-.64-1.56-.64h-.45c-.61 0-1.17-.25-1.58-.68l-.2-.21c-.41-.44-.63-.99-.63-1.58v-.45c0-.57-.24-1.11-.64-1.56l-.24-.27c-.22-.24-.41-.5-.57-.78l-.07-.28c-.16-.55-.16-1.148 0-1.697l.08-.28c.22-.55.68-1.02 1.22-1.11l.42-.07c.16-.28.35-.54.57-.78l.24-.27c.4-.45.64-.99.64-1.56v-.45c0-.61.25-1.17.68-1.58l.21-.2c.44-.41.99-.63 1.58-.63h.45c.57 0 1.11-.24 1.56-.64l.27-.24c.24-.22.5-.41.78-.57l.28-.07zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 14.25h.008v.008H12v-.008z" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default BottomNavigation;
