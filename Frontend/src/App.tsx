import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;