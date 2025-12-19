// src/pages/admin/Applications/shared/components/StatCard.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for statistics card
 */
const StatCard = React.memo(({ 
  icon, 
  title, 
  value, 
  description, 
  color = '#059669',
  onClick,
  isActive = false,
  style = {},
  isMobile = false 
}) => {
  const cardStyle = {
    background: isActive
      ? `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`
      : 'white',
    padding: isMobile ? '14px' : '20px',
    borderRadius: isMobile ? '12px' : '16px',
    border: isActive ? `2px solid ${color}` : '1px solid #e5e7eb',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s',
    boxShadow: isActive
      ? `0 4px 12px ${color}30`
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 16px ${color}30`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isActive
            ? `0 4px 12px ${color}30`
            : '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '8px' : '12px' }}>
        {icon && (
          <div
            style={{
              fontSize: isMobile ? '18px' : '24px',
              width: isMobile ? '36px' : '48px',
              height: isMobile ? '36px' : '48px',
              borderRadius: isMobile ? '8px' : '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${color}15`,
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: isMobile ? '2px' : '4px',
            }}
          >
            {value}
          </div>
          {description && (
            <div
              style={{
                fontSize: isMobile ? '11px' : '12px',
                color: '#9ca3af',
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

StatCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  style: PropTypes.object,
  isMobile: PropTypes.bool,
};

export default StatCard;
