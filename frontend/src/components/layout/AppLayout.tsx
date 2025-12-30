/**
 * App Layout Component
 * 
 * Why unified layout:
 * - Consistent UI across all pages
 * - Single source of truth for navigation
 * - Responsive design in one place
 * - Professional SaaS appearance
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useThemeSync } from '../../features/settings/hooks/useThemeSync';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sync theme with DOM
  useThemeSync();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Navbar - Fixed at top */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 w-0 min-w-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

