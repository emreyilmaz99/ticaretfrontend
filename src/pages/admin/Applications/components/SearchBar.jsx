// src/pages/admin/Applications/components/SearchBar.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { getStyles } from '../styles';

/**
 * Arama çubuğu komponenti
 */
const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "İsim, e-posta, şirket veya vergi no ara...",
  isMobile = false
}) => {
  const styles = getStyles(isMobile);
  
  return (
    <div style={{
      position: 'relative',
      marginBottom: isMobile ? '16px' : '24px'
    }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
        <FaSearch style={{
          position: 'absolute',
          left: isMobile ? '14px' : '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94a3b8'
        }} />
        <input
          type="text"
          placeholder={isMobile ? "Ara..." : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...styles.searchInput,
            padding: isMobile ? '12px 14px 12px 42px' : '10px 16px 10px 40px',
            fontSize: isMobile ? '16px' : '14px',
            minHeight: isMobile ? '44px' : 'auto',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
