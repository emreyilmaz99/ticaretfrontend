import React, { useState } from 'react';
import { FaBell, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getStyles } from '../styles';

/**
 * Dashboard header with title and action buttons
 */
const DashboardHeader = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Bu Hafta');
  
  const styles = getStyles(isMobile);

  const handleNewProduct = () => {
    navigate('/vendor/products');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openProductModal'));
    }, 100);
  };

  const handleNotifications = () => {
    alert('Bildirimler özelliği yakında eklenecek!');
  };

  const handleDateFilterToggle = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowDateFilter(false);
  };

  return (
    <div style={styles.header}>
      <div style={{ flex: 1 }}>
        <h1 style={styles.title}>Özet</h1>
        <p style={styles.subtitle}>
          {isMobile ? 'Mağaza performans özeti' : 'Hoşgeldiniz, mağazanızın performans özeti burada'}
        </p>
      </div>
      <div style={styles.headerActions}>
        {/* Date Filter */}
        <div style={{ position: 'relative', flex: isMobile ? 1 : 'initial' }}>
          <div 
            style={styles.dateFilter}
            onClick={handleDateFilterToggle}
          >
            <FaCalendarAlt size={isMobile ? 14 : 16} /> 
            <span style={{ whiteSpace: 'nowrap' }}>{selectedPeriod}</span>
          </div>
          
          {showDateFilter && (
            <div style={{
              position: 'absolute',
              top: isMobile ? '42px' : '48px',
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '160px',
              overflow: 'hidden'
            }}>
              {['Bugün', 'Bu Hafta', 'Bu Ay', 'Son 3 Ay', 'Bu Yıl'].map((period) => (
                <div
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedPeriod === period ? '#f0fdf4' : '#fff',
                    color: selectedPeriod === period ? '#059669' : '#475569',
                    fontWeight: selectedPeriod === period ? '600' : '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPeriod !== period) {
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPeriod !== period) {
                      e.target.style.backgroundColor = '#fff';
                    }
                  }}
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button 
          style={styles.notificationButton}
          onClick={handleNotifications}
        >
          <FaBell size={isMobile ? 16 : 18} />
          <span style={styles.notificationDot}></span>
        </button>

        {/* Add Product Button - shown on desktop, hidden on mobile (in styles) */}
        <button 
          style={styles.addButton}
          onClick={handleNewProduct}
        >
          <FaPlus size={12} /> Yeni Ürün
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
