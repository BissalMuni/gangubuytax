import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header'
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      <Header/>
      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className={`hidden lg:block transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}>
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 relative">
          {/* 사이드바가 닫혔을 때 토글 버튼 */}
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="fixed top-20 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="사이드바 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${
            !isSidebarOpen ? 'ml-0' : 'ml-0'
          }`}>
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;