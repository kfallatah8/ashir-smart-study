
import React, { useState, useEffect } from 'react';
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Initialize sidebar state based on device
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarMenu open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          {/* 3D Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Top right decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/20 to-primary-300/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            
            {/* Bottom left decorative element */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-purple-300/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          {/* Main content with z-index to appear above the decorative background */}
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
