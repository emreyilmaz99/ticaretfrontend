// src/pages/admin/Applications/components/modals/VendorDetailModal/TabNavigation.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaInfoCircle, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { styles } from '../../../styles';

/**
 * Tab Navigation Component
 * Handles switching between General, Address, and Bank tabs
 */
const TabNavigation = React.memo(({ activeTab, setActiveTab, isMobile = false }) => {
  const tabs = [
    { id: 'general', label: isMobile ? 'Genel' : 'Genel Bilgiler', icon: <FaInfoCircle /> },
    { id: 'address', label: isMobile ? 'Adres' : 'Adres Bilgileri', icon: <FaMapMarkerAlt /> },
    { id: 'bank', label: isMobile ? 'Banka' : 'Banka Bilgileri', icon: <FaCreditCard /> },
  ];

  return (
    <div style={{
      ...styles.vendorModal.tabNav,
      ...(isMobile && { padding: '0 12px', overflowX: 'auto', gap: '6px' })
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.vendorModal.tabButton(isActive),
              ...(isMobile && {
                padding: '12px 16px',
                fontSize: '13px',
                minHeight: '44px',
                flex: 1,
                whiteSpace: 'nowrap'
              })
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.background = '#f0fdf4';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: isMobile ? '16px' : '18px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';

TabNavigation.propTypes = {
  activeTab: PropTypes.oneOf(['general', 'address', 'bank']).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default TabNavigation;
