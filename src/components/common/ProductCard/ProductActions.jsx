// src/components/common/ProductCard/ProductActions.jsx
import React from 'react';
import { FaHeart, FaRegHeart, FaEye, FaExchangeAlt } from 'react-icons/fa';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { useResponsive } from '../../../hooks/useResponsive';

const ProductActions = React.memo(({ 
  product,
  isFavorite,
  isInCompareList,
  onToggleFavorite,
  onQuickView,
  onToggleCompare,
  styles 
}) => {
  const { isMobile } = useResponsive();
  const iconSize = isMobile ? 13 : 15;
  const compareIconSize = isMobile ? 12 : 14;
  
  const {
    isHovered: isFavHovered,
    handleMouseEnter: handleFavEnter,
    handleMouseLeave: handleFavLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isQuickViewHovered,
    handleMouseEnter: handleQuickViewEnter,
    handleMouseLeave: handleQuickViewLeave,
  } = useHoverEffect();
  
  const {
    isHovered: isCompareHovered,
    handleMouseEnter: handleCompareEnter,
    handleMouseLeave: handleCompareLeave,
  } = useHoverEffect();

  return (
    <div style={styles.actionOverlay}>
      {/* Favorite Button */}
      <button 
        style={{
          ...styles.cardActionBtn,
          ...styles.cardActionBtnFavorite,
          ...(isFavHovered && !isMobile ? styles.cardActionBtnFavoriteHover : {})
        }}
        onClick={onToggleFavorite} 
        title="Favorilere Ekle"
        onMouseEnter={isMobile ? undefined : handleFavEnter}
        onMouseLeave={isMobile ? undefined : handleFavLeave}
      >
        {isFavorite ? <FaHeart color="#ef4444" size={iconSize} /> : <FaRegHeart size={iconSize} />}
      </button>
      
      {/* Quick View Button */}
      <button 
        style={{
          ...styles.cardActionBtn,
          ...(isQuickViewHovered && !isMobile ? styles.cardActionBtnQuickViewHover : {})
        }}
        onClick={onQuickView} 
        title="Hızlı Bakış"
        onMouseEnter={isMobile ? undefined : handleQuickViewEnter}
        onMouseLeave={isMobile ? undefined : handleQuickViewLeave}
      >
        <FaEye size={iconSize} />
      </button>
      
      {/* Compare Button */}
      {onToggleCompare && (
        <button 
          style={{ 
            ...styles.cardActionBtn,
            ...styles.cardActionBtnCompare,
            ...(isCompareHovered && !isMobile ? styles.cardActionBtnCompareHover : {})
          }} 
          onClick={onToggleCompare} 
          title="Karşılaştır"
          onMouseEnter={isMobile ? undefined : handleCompareEnter}
          onMouseLeave={isMobile ? undefined : handleCompareLeave}
        >
          <FaExchangeAlt size={compareIconSize} />
        </button>
      )}
    </div>
  );
});

ProductActions.displayName = 'ProductActions';

export default ProductActions;
