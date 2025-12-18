// src/components/modals/CompareModal/CompareCard.jsx
import React from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { useProductImage } from '../../../hooks/useProductImage';
import AttributeRow from './AttributeRow';
import { compareAttributes } from './config';

const CompareCard = React.memo(({ product, onRemove, isSingleProduct = false }) => {
  const navigate = useNavigate();
  const imageUrl = useProductImage(product);
  const isMobile = window.innerWidth <= 768;
  
  const {
    isHovered: isRemoveBtnHovered,
    handleMouseEnter: handleRemoveBtnEnter,
    handleMouseLeave: handleRemoveBtnLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isActionBtnHovered,
    handleMouseEnter: handleActionBtnEnter,
    handleMouseLeave: handleActionBtnLeave,
  } = useHoverEffect();

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    position: 'relative',
  };

  const removeBtnStyle = {
    position: 'absolute',
    top: isMobile ? '10px' : '12px',
    right: isMobile ? '10px' : '12px',
    width: isMobile ? '30px' : '32px',
    height: isMobile ? '30px' : '32px',
    backgroundColor: isRemoveBtnHovered ? '#DC2626' : '#FFFFFF',
    color: isRemoveBtnHovered ? '#FFFFFF' : '#DC2626',
    border: '1px solid #E5E7EB',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    zIndex: 10,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transform: isRemoveBtnHovered ? 'scale(1.1)' : 'scale(1)',
  };

  const actionBtnStyle = {
    width: '100%',
    padding: isMobile ? '10px' : '12px',
    backgroundColor: isActionBtnHovered ? '#047857' : '#059669',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: isMobile ? '8px' : '10px',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: isMobile ? '12px' : '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '6px' : '8px',
    transition: 'all 0.2s ease',
    fontFamily: '"Inter", sans-serif',
    transform: isActionBtnHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isActionBtnHovered ? '0 8px 16px rgba(5, 150, 105, 0.3)' : 'none',
  };

  return (
    <div style={cardStyle}>
      {onRemove && (
        <button
          style={removeBtnStyle}
          onClick={() => onRemove(product)}
          title="Listeden Çıkar"
          onMouseEnter={handleRemoveBtnEnter}
          onMouseLeave={handleRemoveBtnLeave}
        >
          <FaTimes />
        </button>
      )}
      
      <div
        style={{
          width: '100%',
          height: isMobile ? '180px' : (isSingleProduct ? '250px' : '200px'),
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '16px' : '20px',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <div style={{ padding: isMobile ? '16px' : '20px' }}>
        <h3
          style={{
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: isMobile ? '12px' : '16px',
            lineHeight: '1.4',
            minHeight: isMobile ? 'auto' : '42px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {product.name || product.title}
        </h3>

        {compareAttributes.map((attr, index) => {
          const value = product[attr.key];
          const formattedValue = attr.format ? attr.format(value) : value || '-';
          
          return (
            <AttributeRow
              key={attr.key}
              label={attr.label}
              value={formattedValue}
              icon={attr.icon}
              isLast={index === compareAttributes.length - 1}
            />
          );
        })}

        <button
          style={actionBtnStyle}
          onClick={() => navigate(`/product/${product.slug || product.id}`)}
          onMouseEnter={handleActionBtnEnter}
          onMouseLeave={handleActionBtnLeave}
        >
          <FaShoppingCart />
          Detaya Git
        </button>
      </div>
    </div>
  );
});

CompareCard.displayName = 'CompareCard';

export default CompareCard;
