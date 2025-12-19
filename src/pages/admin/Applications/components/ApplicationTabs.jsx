// src/pages/admin/Applications/components/ApplicationTabs.jsx
import React from 'react';
import { FaFileAlt, FaUserCheck } from 'react-icons/fa';

/**
 * Pre/Full Applications tab değiştirici
 */
const ApplicationTabs = ({ 
  activeTab, 
  onTabChange, 
  preCount = 0, 
  fullCount = 0,
  isMobile = false 
}) => {
  const tabContainerStyle = {
    display: 'flex',
    gap: isMobile ? '6px' : '8px',
    marginBottom: isMobile ? '16px' : '24px',
    background: '#f3f4f6',
    padding: isMobile ? '4px' : '6px',
    borderRadius: isMobile ? '12px' : '16px',
    width: isMobile ? '100%' : 'fit-content',
    overflowX: isMobile ? 'auto' : 'visible',
  };

  const getTabStyle = (isActive) => ({
    padding: isMobile ? '10px 16px' : '12px 24px',
    borderRadius: isMobile ? '10px' : '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '6px' : '8px',
    transition: 'all 0.2s ease',
    background: isActive ? 'white' : 'transparent',
    color: isActive ? '#059669' : '#6b7280',
    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
    flex: isMobile ? 1 : 'none',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    justifyContent: 'center',
  });

  const getBadgeStyle = (isActive) => ({
    background: isActive ? '#d1fae5' : '#e5e7eb',
    color: isActive ? '#059669' : '#6b7280',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: isMobile ? '11px' : '12px',
    fontWeight: '700',
  });

  return (
    <div style={tabContainerStyle}>
      <button 
        style={getTabStyle(activeTab === 'pre')}
        onClick={() => onTabChange('pre')}
      >
        {!isMobile && <FaFileAlt size={14} />}
        {isMobile ? 'Ön Başvurular' : 'Ön Başvurular'}
        <span style={getBadgeStyle(activeTab === 'pre')}>{preCount}</span>
      </button>
      <button 
        style={getTabStyle(activeTab === 'full')}
        onClick={() => onTabChange('full')}
      >
        {!isMobile && <FaUserCheck size={14} />}
        {isMobile ? 'Aktivasyon' : 'Aktivasyon Bekleyenler'}
        <span style={getBadgeStyle(activeTab === 'full')}>{fullCount}</span>
      </button>
    </div>
  );
};

export default ApplicationTabs;
