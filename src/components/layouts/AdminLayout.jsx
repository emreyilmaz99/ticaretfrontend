// src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaHome, FaBox, FaShoppingBag, FaStore, FaUsers } from 'react-icons/fa';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
        <div style={{
          paddingBottom: isMobile ? '80px' : '0', // Bottom nav için boşluk
        }}>
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            backgroundColor: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 8px',
            zIndex: 100,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
          }}>
            <BottomNavItem 
              icon={FaHome}
              label="Ana Sayfa"
              path="/admin/dashboard"
              isActive={location.pathname === '/admin/dashboard'}
              onClick={() => navigate('/admin/dashboard')}
            />
            <BottomNavItem 
              icon={FaBox}
              label="Ürünler"
              path="/admin/products"
              isActive={location.pathname === '/admin/products'}
              onClick={() => navigate('/admin/products')}
            />
            <BottomNavItem 
              icon={FaShoppingBag}
              label="Siparişler"
              path="/admin/orders"
              isActive={location.pathname === '/admin/orders'}
              onClick={() => navigate('/admin/orders')}
            />
            <BottomNavItem 
              icon={FaStore}
              label="Satıcılar"
              path="/admin/active-vendors"
              isActive={location.pathname === '/admin/active-vendors'}
              onClick={() => navigate('/admin/active-vendors')}
            />
            <BottomNavItem 
              icon={FaUsers}
              label="Kullanıcılar"
              path="/admin/users"
              isActive={location.pathname === '/admin/users'}
              onClick={() => navigate('/admin/users')}
            />
          </div>
        )}
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

// Bottom Navigation Item Component
const BottomNavItem = ({ icon: Icon, label, path, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '8px 4px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <div style={{
        width: '48px',
        height: '32px',
        borderRadius: '12px',
        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        <Icon 
          size={20} 
          color={isActive ? '#10b981' : '#64748b'}
          style={{ transition: 'all 0.2s' }}
        />
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: isActive ? '600' : '500',
        color: isActive ? '#10b981' : '#64748b',
        transition: 'all 0.2s',
      }}>
        {label}
      </span>
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '3px',
          backgroundColor: '#10b981',
          borderRadius: '0 0 3px 3px',
        }} />
      )}
    </button>
  );
};

export default AdminLayout;