import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { LoadingSpinner } from '../components/ui/Modal';
import { PageTransition } from '../components/ui/PageTransition';
import { BrandWatermark } from '../components/ui/BrandWatermark';
import { PortalFooter } from '../components/navigation/PortalFooter';

export const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#060D1F]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] dark:bg-[#060D1F] transition-colors duration-300 overflow-hidden relative">
      {/* Official Nexora Technologies Company Logo Ambient Watermark */}
      <BrandWatermark />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-10">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        {/* Official Company Logo Footer at the bottom of every page */}
        <PortalFooter />
      </div>
    </div>
  );
};

export const EmployeeLayout = () => {
  const { user, loading, isEmployee } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#060D1F]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] dark:bg-[#060D1F] transition-colors duration-300 overflow-hidden relative">
      {/* Official Nexora Technologies Company Logo Ambient Watermark */}
      <BrandWatermark />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-10">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        {/* Official Company Logo Footer at the bottom of every page */}
        <PortalFooter />
      </div>
    </div>
  );
};
