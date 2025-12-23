// src/components/common/ProductCard/ProductInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { formatRating } from '../../../utils/formatters';
import PriceDisplay from '../../shared/PriceDisplay';
import ProductActionButtons from './ProductActionButtons';

const getCategoryName = (product) => {
  if (product.vendor_name) return product.vendor_name;
  if (product.category && typeof product.category === 'object') {
    return product.category.name || 'GENEL';
  }
  return product.category || 'GENEL';
};

const ProductInfo = React.memo(({ 
  product, 
  productUrl, 
  styles, 
  isMobile,
  viewMode = 'grid',
  onBuyNow,
  onAddToCart
}) => {
  const rating = formatRating(product.rating || product.rating_avg || 0);
  const reviewCount = product.review_count || product.reviews_count || 0;
  const isListMobile = viewMode === 'list' && isMobile;
  
  // Mobile list view specific styles
  const mobileListStyles = isListMobile ? {
    cardBody: {
      ...styles.cardBody,
      padding: '10px',
      gap: '4px',
      justifyContent: 'space-between',
    },
    cardCategory: {
      ...styles.cardCategory,
      fontSize: '8px',
      marginBottom: '2px',
    },
    cardTitle: {
      ...styles.cardTitle,
      fontSize: '11px',
      height: 'auto',
      marginBottom: '2px',
      WebkitLineClamp: 2,
    },
    priceSection: {
      ...styles.priceSection,
      marginTop: '0',
      paddingTop: '4px',
      borderTop: 'none',
    },
  } : {};

  return (
    <div style={isListMobile ? mobileListStyles.cardBody : styles.cardBody}>
      {/* Category */}
      <div style={isListMobile ? mobileListStyles.cardCategory : styles.cardCategory}>
        {getCategoryName(product)}
      </div>
      
      {/* Product Title */}
      <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 
          style={{
            ...(isListMobile ? mobileListStyles.cardTitle : styles.cardTitle),
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#0f172a'}
        >
          {product.name}
        </h3>
      </Link>

      {/* Rating - Hide in mobile list view */}
      {!isListMobile && (
        <div style={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              color={i < Math.floor(rating) ? '#f59e0b' : '#e5e7eb'} 
              size={11}
            />
          ))}
          <span style={{ color: '#0f172a', marginLeft: '4px', fontSize: '11px', fontWeight: '700' }}>
            {parseFloat(rating || 0).toFixed(1)}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>
            ({reviewCount})
          </span>
        </div>
      )}

      {/* Price Section */}
      <div style={isListMobile ? mobileListStyles.priceSection : styles.priceSection}>
        <PriceDisplay
          price={parseFloat(product.price || 0)}
          originalPrice={
            product.has_deal 
              ? parseFloat(product.original_price || 0)
              : product.discount_percent > 0 
                ? parseFloat(product.compare_at_price || 0) 
                : null
          }
          hasDiscount={product.has_deal || product.discount_percent > 0}
          isMobile={isMobile}
          isCompact={isListMobile}
        />
        
        {/* Action Buttons - Simplified for mobile list */}
        {isListMobile ? (
          <button 
            style={{
              width: '100%',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '6px',
            }}
            onClick={onBuyNow}
          >
            <span style={{ fontSize: '10px' }}>⚡</span>
            <span>Hemen Al</span>
          </button>
        ) : (
          <ProductActionButtons
            styles={styles}
            onBuyNow={onBuyNow}
            onAddToCart={onAddToCart}
          />
        )}
      </div>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
