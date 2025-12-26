// src/components/common/ProductCard/ProductActionButtons.jsx
import React from 'react';
import { FaBolt, FaShoppingCart } from 'react-icons/fa';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { useResponsive } from '../../../hooks/useResponsive';

const ProductActionButtons = React.memo(({ styles, onBuyNow, onAddToCart }) => {
  const { isMobile } = useResponsive();
  const buyNowIconSize = isMobile ? 11 : 13;
  const cartIconSize = isMobile ? 13 : 15;
  
  const {
    isHovered: isBuyNowHovered,
    handleMouseEnter: handleBuyNowEnter,
    handleMouseLeave: handleBuyNowLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isAddToCartHovered,
    handleMouseEnter: handleAddToCartEnter,
    handleMouseLeave: handleAddToCartLeave,
  } = useHoverEffect();

  return (
    <div style={styles.buttonsRow}>
      <button 
        style={{
          ...styles.buyNowBtn,
          ...(isBuyNowHovered && !isMobile ? styles.buyNowBtnHover : {})
        }}
        onClick={onBuyNow} 
        title="Hemen Satın Al"
        onMouseEnter={isMobile ? undefined : handleBuyNowEnter}
        onMouseLeave={isMobile ? undefined : handleBuyNowLeave}
      >
        <FaBolt size={buyNowIconSize} />
        <span>Hemen Al</span>
      </button>
      
      <button 
        style={{
          ...styles.addToCartBtn,
          ...(isAddToCartHovered && !isMobile ? styles.addToCartBtnHover : {})
        }}
        onClick={onAddToCart} 
        title="Sepete Ekle"
        onMouseEnter={isMobile ? undefined : handleAddToCartEnter}
        onMouseLeave={isMobile ? undefined : handleAddToCartLeave}
      >
        <FaShoppingCart size={cartIconSize} />
      </button>
    </div>
  );
});

ProductActionButtons.displayName = 'ProductActionButtons';

export default ProductActionButtons;
