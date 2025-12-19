// src/pages/admin/Applications/components/InfoBox.jsx
import React from 'react';
import { FaClock } from 'react-icons/fa';

/**
 * Bilgi kutusu komponenti
 */
const InfoBox = ({ count, message, isMobile = false }) => {
  return (
    <div style={{ 
      background: '#fef3c7', 
      padding: isMobile ? '14px 16px' : '16px 20px', 
      borderRadius: '12px', 
      marginBottom: isMobile ? '16px' : '24px',
      border: '1px solid #fde68a',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '10px' : '12px'
    }}>
      <FaClock size={isMobile ? 18 : 20} color="#d97706" />
      <div style={{ fontSize: isMobile ? '13px' : '14px', color: '#92400e', lineHeight: '1.4' }}>
        <strong>Toplam {count} satıcı</strong> {message || 'aktivasyon bekliyor.'}
      </div>
    </div>
  );
};

export default InfoBox;
