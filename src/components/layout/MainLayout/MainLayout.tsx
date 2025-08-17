import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/common/Navigation';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className={`hidden lg:block transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}>
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;