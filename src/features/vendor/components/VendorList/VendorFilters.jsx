// src/features/vendor/components/VendorList/VendorFilters.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa';
import { VENDOR_TABS } from '../../shared/constants';
import { styles } from '../../shared/styles';

const VendorFilters = React.memo(({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  showTabs = true,
  title,
  onFilterClick,
  activeFilters,
  onApplyFilters,
  isMobile = false,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    sortBy: 'all',
    minRevenue: '',
    maxRevenue: '',
  });

  const handleToggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyLocalFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      sortBy: 'all',
      minRevenue: '',
      maxRevenue: '',
    };
    setLocalFilters(resetFilters);
    if (onApplyFilters) {
      onApplyFilters(resetFilters);
    }
  };
  return (
    <div style={styles.card}>
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '0'
      }}>
        <div style={{
          ...styles.tabContainer,
          overflowX: isMobile ? 'auto' : 'visible',
          width: isMobile ? '100%' : 'auto'
        }}>
          {showTabs ? (
            VENDOR_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                style={{
                  ...styles.tab(activeTab === tab.key),
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '13px' : '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))
          ) : (
            <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: isMobile ? '15px' : '16px' }}>
              {title || 'Satıcı Listesi'}
            </span>
          )}
        </div>
        <div style={{
          ...styles.actionGroup,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto',
          gap: isMobile ? '10px' : '12px'
        }}>
          <div style={{
            ...styles.searchWrapper,
            width: isMobile ? '100%' : 'auto'
          }}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder={isMobile ? "Ara..." : "Mağaza veya E-posta ara..."}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                ...styles.searchInput,
                fontSize: isMobile ? '16px' : '14px',
                minHeight: isMobile ? '44px' : 'auto'
              }}
            />
          </div>
          <button 
            onClick={handleToggleFilter} 
            style={{
              ...styles.filterButton,
              backgroundColor: isFilterOpen ? '#10b981' : 'white',
              color: isFilterOpen ? 'white' : '#10b981',
              width: isMobile ? '100%' : 'auto',
              minHeight: '44px',
              justifyContent: 'center',
              fontSize: isMobile ? '14px' : '14px'
            }}
          >
            <FaFilter /> {isFilterOpen ? 'Kapat' : 'Filtrele'}
          </button>
        </div>
      </div>

      {/* Inline Filter Area */}
      {isFilterOpen && (
        <div style={{
          padding: isMobile ? '16px' : '20px 24px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
            gap: '16px',
            alignItems: 'start',
          }}>
            {/* Sıralama Dropdown */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                SIRALAMA
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                  }}
                >
                  <option value="all">Tüm Satıcılar</option>
                  <option value="revenue-high">Ciro (Yüksek)</option>
                  <option value="revenue-low">Ciro (Düşük)</option>
                  <option value="rating-high">Puan (Yüksek)</option>
                  <option value="rating-low">Puan (Düşük)</option>
                </select>
                <FaChevronDown style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#64748b',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Tutar Aralığı */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                TUTAR ARALIĞI (TL)
              </label>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '12px',
                alignItems: isMobile ? 'stretch' : 'center',
              }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minRevenue}
                  onChange={(e) => setLocalFilters({ ...localFilters, minRevenue: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: isMobile ? '16px' : '14px',
                    outline: 'none',
                    minHeight: isMobile ? '44px' : 'auto'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <span style={{ color: '#94a3b8', fontWeight: '500', textAlign: 'center' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxRevenue}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxRevenue: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: isMobile ? '16px' : '14px',
                    outline: 'none',
                    minHeight: isMobile ? '44px' : 'auto'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  width: isMobile ? '100%' : 'auto'
                }}>
                  <button
                    onClick={handleResetFilters}
                    style={{
                      padding: '10px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      minHeight: '44px',
                      flex: isMobile ? 1 : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Sıfırla
                  </button>
                  <button
                    onClick={handleApplyLocalFilters}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      minHeight: '44px',
                      flex: isMobile ? 1 : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

VendorFilters.displayName = 'VendorFilters';

VendorFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  showTabs: PropTypes.bool,
  title: PropTypes.string,
  onFilterClick: PropTypes.func,
  activeFilters: PropTypes.object,
  onApplyFilters: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default VendorFilters;
