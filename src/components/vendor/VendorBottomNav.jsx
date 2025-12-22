import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingBag, FaWallet, FaCog } from 'react-icons/fa';

const VendorBottomNav = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/vendor/dashboard', icon: FaHome, label: 'Ana Sayfa' },
    { path: '/vendor/products', icon: FaBox, label: 'Ürünler' },
    { path: '/vendor/orders', icon: FaShoppingBag, label: 'Siparişler' },
    { path: '/vendor/finance', icon: FaWallet, label: 'Finans' },
    { path: '/vendor/settings', icon: FaCog, label: 'Ayarlar' },
  ];

  return (
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
      zIndex: 1100,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
    }}>
      {navItems.map((item) => (
        <BottomNavItem 
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          isActive={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        />
      ))}
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
        backgroundColor: isActive ? 'rgba(5, 150, 105, 0.12)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        <Icon 
          size={20} 
          color={isActive ? '#059669' : '#64748b'}
          style={{ transition: 'all 0.2s' }}
        />
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: isActive ? '600' : '500',
        color: isActive ? '#059669' : '#64748b',
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
          backgroundColor: '#059669',
          borderRadius: '0 0 3px 3px',
        }} />
      )}
    </button>
  );
};

export default VendorBottomNav;
