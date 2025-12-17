// src/features/admin/shared/components/StatCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Merkezi StatCard bileşeni - İstatistik kartları için
 * Tüm admin modüllerinde kullanılabilir
 */
const StatCard = ({ 
  icon, 
  title, 
  value, 
  count, // alias for value
  description, 
  color = '#3b82f6',
  onClick,
  isActive = false,
  gradient = false,
  size = 'medium',
  filter,
  style = {} 
}) => {
  // Use count if provided, otherwise use value
  const displayValue = count !== undefined ? count : value;

  const cardStyle = {
    background: 'white',
    padding: '16px 20px',
    borderRadius: '12px',
    border: isActive ? `2px solid ${color}` : '1px solid #e5e7eb',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    boxShadow: isActive
      ? `0 4px 12px ${color}20`
      : '0 1px 3px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minWidth: '200px',
    ...style,
  };

  // Ikon arka plan rengi (açık ton)
  const getIconBgColor = () => {
    if (color === '#3b82f6') return '#eff6ff'; // blue
    if (color === '#f59e0b') return '#fef3c7'; // amber
    if (color === '#10b981') return '#d1fae5'; // green
    if (color === '#ef4444') return '#fee2e2'; // red
    return `${color}15`;
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 6px 16px ${color}15`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isActive
            ? `0 4px 12px ${color}20`
            : '0 1px 3px rgba(0, 0, 0, 0.05)';
        }
      }}
    >
      {/* Count - Büyük sayı */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: getIconBgColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: '700',
          color: color,
          flexShrink: 0,
        }}
      >
        {displayValue}
      </div>
      
      {/* Title */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  gradient: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  filter: PropTypes.string,
  style: PropTypes.object,
};

export default React.memo(StatCard);
