// src/features/users/components/UserList/UserFilters.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { styles } from '../../shared/styles';

const UserFilters = React.memo(({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onResetFilters,
  totalUsers,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.card}>
      <div style={{
        ...styles.headerCard,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '0'
      }}>
        <div style={{
          ...styles.searchWrapper,
          width: isMobile ? '100%' : 'auto'
        }}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="İsim, email veya telefon ile ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              ...styles.searchInput,
              width: isMobile ? '100%' : 'auto'
            }}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : 'flex-start',
          width: isMobile ? '100%' : 'auto'
        }}>
          <div style={styles.stats}>
            <span>Toplam: <strong>{totalUsers || 0}</strong></span>
          </div>
          <button
            onClick={onToggleFilters}
            style={{
              ...styles.btn,
              ...(showFilters ? { backgroundColor: '#f1f5f9' } : {}),
              minHeight: isMobile ? '44px' : 'auto',
              flex: isMobile ? 1 : 'none'
            }}
          >
            <FaFilter /> Filtreler
          </button>
        </div>
      </div>

      {showFilters && (
        <div style={{
          ...styles.filterPanel,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px' : '12px'
        }}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Durum</label>
            <select
              value={filters.is_active === null ? '' : filters.is_active.toString()}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('is_active', val === '' ? null : val === 'true');
              }}
              style={{
                ...styles.filterSelect,
                minHeight: isMobile ? '44px' : 'auto'
              }}
            >
              <option value="">Tümü</option>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Cinsiyet</label>
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange('gender', e.target.value)}
              style={{
                ...styles.filterSelect,
                minHeight: isMobile ? '44px' : 'auto'
              }}
            >
              <option value="">Tümü</option>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Email Doğrulama</label>
            <select
              value={filters.email_verified === null ? '' : filters.email_verified.toString()}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('email_verified', val === '' ? null : val === 'true');
              }}
              style={{
                ...styles.filterSelect,
                minHeight: isMobile ? '44px' : 'auto'
              }}
            >
              <option value="">Tümü</option>
              <option value="true">Doğrulanmış</option>
              <option value="false">Doğrulanmamış</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{isMobile ? '' : '\u00A0'}</label>
            <button 
              onClick={onResetFilters} 
              style={{ 
                ...styles.btn, 
                padding: isMobile ? '12px' : '8px 12px',
                minHeight: isMobile ? '44px' : 'auto',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
                ...(isMobile && {
                  border: '1px solid #d1fae5',
                  backgroundColor: '#ecfdf5',
                  color: '#059669'
                })
              }}
            >
              <FaTimes size={12} /> Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

UserFilters.displayName = 'UserFilters';

UserFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  totalUsers: PropTypes.number,
};

export default UserFilters;
