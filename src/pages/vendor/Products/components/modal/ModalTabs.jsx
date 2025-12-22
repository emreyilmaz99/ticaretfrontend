// src/pages/vendor/Products/components/modal/ModalTabs.jsx
import React from 'react';
import { styles } from '../../styles';

const tabs = [
  { id: 'general', label: 'Genel Bilgiler' },
  { id: 'pricing', label: 'Fiyat & Stok' },
  { id: 'media', label: 'Görseller' },
  { id: 'variants', label: 'Varyantlar' },
  { id: 'settings', label: 'Ayarlar' }
];

const ModalTabs = ({ activeTab, onTabChange, formType, isMobile = false }) => {
  const tabsStyle = isMobile ? {
    ...styles.modalTabs,
    padding: '0 16px',
    gap: '16px'
  } : styles.modalTabs;

  const tabStyle = (isActive) => {
    const baseStyle = isMobile ? {
      ...styles.modalTab,
      fontSize: '13px',
      padding: '12px 0'
    } : styles.modalTab;

    return {
      ...baseStyle,
      ...(isActive ? styles.modalTabActive : {})
    };
  };

  return (
    <div style={tabsStyle}>
      {tabs.map(tab => {
        // Hide variants tab for simple products
        if (tab.id === 'variants' && formType === 'simple') {
          return null;
        }
        
        return (
          <button
            key={tab.id}
            style={tabStyle(activeTab === tab.id)}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default ModalTabs;
