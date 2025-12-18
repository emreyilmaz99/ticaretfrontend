// src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Desktop'a geçince sidebar'ı kapat
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', position: 'relative' }}>
      
      {/* Backdrop - Sadece mobilde sidebar açıkken */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />

      {/* Main Content Area */}
      <div style={{ 
        marginLeft: isMobile ? '0' : '260px',
        width: isMobile ? '100%' : 'calc(100% - 260px)',
        padding: '0',
        backgroundColor: '#F8FAFC', 
        minHeight: '100vh',
        position: 'relative',
      }}>
        
        {/* Mobile Header with Hamburger */}
        {isMobile && (
          <div style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '16px',
            zIndex: 99,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <button 
              onClick={toggleSidebar}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaBars />
            </button>
            
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#0f172a',
                margin: 0,
              }}>
                Admin<span style={{ color: '#10b981' }}>Panel</span>
              </h1>
            </div>
          </div>
        )}

        {/* Page Content */}
        <Outlet /> 
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;