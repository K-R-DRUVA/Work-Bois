import React from 'react';
import { Menu, X, LineChart, Upload, Bell, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: <LineChart size={20} />, label: 'Dashboard', active: true },
    { icon: <Upload size={20} />, label: 'Upload Data' },
    { icon: <Bell size={20} />, label: 'Alerts' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <LineChart className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Data Viz</span>
          </div>
          <button 
            className="hidden lg:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  item.active 
                    ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300" 
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <span className={cn(
                  "mr-3",
                  item.active ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"
                )}>
                  {item.icon}
                </span>
                <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;