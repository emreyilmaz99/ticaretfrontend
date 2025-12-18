// src/components/modals/CompareModal/AttributeRow.jsx
import React from 'react';

const AttributeRow = React.memo(({ label, value, icon, isLast = false }) => {
  const isMobile = window.innerWidth <= 768;
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: isMobile ? '10px 0' : '12px 0',
        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
        gap: isMobile ? '8px' : '12px',
      }}
    >
      <span
        style={{
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: '600',
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '4px' : '6px',
          fontFamily: '"Inter", sans-serif',
          flex: '0 0 auto',
        }}
      >
        <span style={{ fontSize: isMobile ? '10px' : '12px' }}>{icon}</span>
        {label}
      </span>
      <span
        style={{
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: '600',
          color: '#111827',
          textAlign: 'right',
          fontFamily: '"Inter", sans-serif',
          flex: '1 1 auto',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  );
});

AttributeRow.displayName = 'AttributeRow';

export default AttributeRow;
