import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary-bg flex font-sans">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Sticky Top Navigation */}
        <AdminTopNav onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
