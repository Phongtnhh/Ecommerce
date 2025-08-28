import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={mobileSidebarOpen}
        onMobileToggle={handleMobileSidebarToggle}
      />
      
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader 
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
          onMobileSidebarToggle={handleMobileSidebarToggle}
        />
        
        <main className="admin-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
