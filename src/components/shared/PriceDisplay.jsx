// src/components/shared/PriceDisplay.jsx
import React from 'react';
import { formatPrice } from '../../utils/formatters';

const PriceDisplay = React.memo(({ 
  price, 
  originalPrice = null, 
  hasDiscount = false,
  isMobile = false,
  isCompact = false,
  showOldPrice = true
}) => {
  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: isCompact ? '4px' : '8px',
      marginBottom: isCompact ? '0' : '10px'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isCompact ? 'row' : 'column',
        alignItems: isCompact ? 'center' : 'flex-start',
        gap: isCompact ? '6px' : '2px',
        flex: 1,
      }}>
        {/* Current Price */}
        <div style={{
          fontSize: isCompact ? '14px' : (isMobile ? '17px' : '20px'), 
          fontWeight: '800', 
          color: hasDiscount ? '#059669' : '#0f172a',
          letterSpacing: '-0.5px',
        }}>
          {formatPrice(price)}
        </div>
        
        {/* Original Price (crossed out) */}
        {showOldPrice && originalPrice && originalPrice > price && (
          <span style={{
            fontSize: isCompact ? '10px' : '11px', 
            color: '#94a3b8', 
            textDecoration: 'line-through',
            fontWeight: '500',
          }}>
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
});

PriceDisplay.displayName = 'PriceDisplay';

export default PriceDisplay;
