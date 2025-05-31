import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
    >
      {theme === 'light' ? (
        <>
          <Moon size={18} className="mr-2" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={18} className="mr-2" />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;