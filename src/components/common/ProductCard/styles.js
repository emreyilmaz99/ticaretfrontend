// src/components/common/ProductCard/styles.js
export const getCardStyles = (isMobile, viewMode, isInCompareList = false, isFavorite = false) => ({
  card: {
    backgroundColor: 'white',
    borderRadius: viewMode === 'list' && isMobile ? '12px' : (isMobile ? '16px' : '24px'),
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: isMobile ? '#f1f5f9' : '#e5e7eb',
    boxShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: isMobile ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: viewMode === 'list' ? 'row' : 'column',
    textDecoration: 'none',
    color: 'inherit',
    height: viewMode === 'list' && isMobile ? 'auto' : '100%',
    minHeight: viewMode === 'list' && isMobile ? '100px' : 'auto',
    ...(viewMode === 'list' && !isMobile ? { maxHeight: '280px' } : {}),
  },
  
  cardHover: {
    transform: isMobile ? 'none' : 'translateY(-12px) scale(1.02)',
    boxShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(5, 150, 105, 0.1)',
    borderColor: isMobile ? '#f1f5f9' : '#059669',
  },
  
  imageContainer: {
    width: viewMode === 'list' ? (isMobile ? '100px' : '280px') : '100%',
    height: viewMode === 'list' ? (isMobile ? '100px' : '100%') : (isMobile ? '160px' : '280px'),
    minWidth: viewMode === 'list' && isMobile ? '100px' : 'auto',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
  },
  
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: isMobile ? 'none' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
  },
  
  cardImageHover: {
    transform: isMobile ? 'none' : 'scale(1.08)',
    filter: isMobile ? 'none' : 'brightness(1.05)',
  },
  
  cardBody: {
    padding: viewMode === 'list' && isMobile ? '8px' : (isMobile ? '10px' : '18px'),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: viewMode === 'list' && isMobile ? '3px' : (isMobile ? '5px' : '10px'),
  },
  
  cardCategory: {
    fontSize: viewMode === 'list' && isMobile ? '8px' : (isMobile ? '9px' : '10px'),
    color: '#059669',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: isMobile ? '0.5px' : '1px',
    marginBottom: '0',
    opacity: isMobile ? 0.9 : 1,
  },
  
  cardTitle: {
    fontSize: viewMode === 'list' && isMobile ? '11px' : (isMobile ? '12px' : '14px'),
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: isMobile ? '1.4' : '1.3',
    height: viewMode === 'list' && isMobile ? 'auto' : (isMobile ? '30px' : '36px'),
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    marginBottom: isMobile ? '0' : '4px',
  },
  
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '3px' : '4px',
    fontSize: isMobile ? '10px' : '11px',
    color: '#f59e0b',
    marginBottom: viewMode === 'list' && isMobile ? '2px' : (isMobile ? '3px' : '6px'),
  },
  
  priceSection: {
    marginTop: viewMode === 'list' && isMobile ? '2px' : (isMobile ? '3px' : 'auto'),
    paddingTop: viewMode === 'list' && isMobile ? '3px' : (isMobile ? '4px' : '8px'),
    borderTop: isMobile ? 'none' : '1px solid #f1f5f9',
  },
  
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  
  priceGroup: { 
    display: 'flex', 
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  
  price: { 
    fontSize: viewMode === 'list' && isMobile ? '14px' : (isMobile ? '16px' : '20px'), 
    fontWeight: '800', 
    color: '#0f172a',
    letterSpacing: isMobile ? '-0.3px' : '-0.5px',
  },
  
  oldPrice: { 
    fontSize: isMobile ? '10px' : '11px', 
    color: '#94a3b8', 
    textDecoration: 'line-through',
    fontWeight: '500',
  },
  
  buttonsRow: {
    display: 'flex',
    gap: isMobile ? '6px' : '8px',
    width: '100%',
  },
  
  buyNowBtn: {
    flex: 1,
    height: viewMode === 'list' && isMobile ? '30px' : (isMobile ? '32px' : '38px'),
    borderRadius: isMobile ? '8px' : '10px',
    backgroundColor: '#059669',
    color: 'white',
    borderWidth: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '4px' : '6px',
    fontSize: viewMode === 'list' && isMobile ? '10px' : (isMobile ? '11px' : '12px'),
    fontWeight: '700',
    cursor: 'pointer',
    transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: isMobile ? '0 1px 4px rgba(5, 150, 105, 0.2)' : '0 2px 8px rgba(5, 150, 105, 0.25)',
  },
  
  buyNowBtnHover: {
    backgroundColor: '#047857',
    transform: isMobile ? 'none' : 'translateY(-3px) scale(1.05)',
    boxShadow: isMobile ? '0 1px 4px rgba(5, 150, 105, 0.2)' : '0 8px 20px rgba(5, 150, 105, 0.4)',
  },
  
  addToCartBtn: {
    width: viewMode === 'list' && isMobile ? '30px' : (isMobile ? '32px' : '38px'),
    height: viewMode === 'list' && isMobile ? '30px' : (isMobile ? '32px' : '38px'),
    borderRadius: isMobile ? '8px' : '10px',
    backgroundColor: '#f0fdf4',
    color: '#059669',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: isMobile ? '#e0f2e9' : '#d1fae5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    flexShrink: 0,
  },
  
  addToCartBtnHover: {
    backgroundColor: '#059669',
    color: 'white',
    borderColor: '#059669',
    transform: isMobile ? 'none' : 'scale(1.15) rotate(-5deg)',
    boxShadow: isMobile ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)',
  },
  
  discountBadge: {
    position: 'absolute',
    top: isMobile ? '8px' : '12px',
    left: isMobile ? '8px' : '12px',
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: isMobile ? '9px' : '10px',
    fontWeight: '800',
    padding: isMobile ? '4px 8px' : '5px 10px',
    borderRadius: isMobile ? '6px' : '8px',
    zIndex: 3,
    letterSpacing: '0.5px',
    transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    animation: isMobile ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  actionOverlay: {
    position: 'absolute',
    top: isMobile ? '8px' : '12px',
    right: isMobile ? '8px' : '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '6px' : '8px',
    zIndex: 10,
  },
  
  cardActionBtn: {
    width: isMobile ? '32px' : '36px',
    height: isMobile ? '32px' : '36px',
    borderRadius: isMobile ? '8px' : '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.06)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  
  cardActionBtnFavorite: {
    backgroundColor: isFavorite ? '#fee2e2' : 'rgba(255, 255, 255, 0.95)',
    borderColor: isFavorite ? '#fca5a5' : 'rgba(0, 0, 0, 0.06)',
  },
  
  cardActionBtnFavoriteHover: {
    backgroundColor: isFavorite ? '#fee2e2' : 'white',
    transform: isMobile ? 'none' : 'scale(1.2) rotate(10deg)',
    borderColor: isFavorite ? '#fca5a5' : '#e5e7eb',
    boxShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.06)' : '0 4px 16px rgba(220, 38, 38, 0.3)',
  },
  
  cardActionBtnQuickViewHover: {
    backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.95)' : '#f0fdf4',
    transform: isMobile ? 'none' : 'scale(1.2) rotate(-5deg)',
    color: isMobile ? '#64748b' : '#059669',
    borderColor: isMobile ? 'rgba(0, 0, 0, 0.06)' : '#d1fae5',
    boxShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.06)' : '0 4px 16px rgba(5, 150, 105, 0.3)',
  },
  
  cardActionBtnCompare: {
    backgroundColor: isInCompareList ? '#059669' : 'rgba(255, 255, 255, 0.95)',
    color: isInCompareList ? 'white' : '#64748b',
    borderColor: isInCompareList ? '#059669' : 'rgba(0, 0, 0, 0.06)',
  },
  
  cardActionBtnCompareHover: {
    backgroundColor: isInCompareList ? '#059669' : (isMobile ? 'rgba(255, 255, 255, 0.95)' : '#f0fdf4'),
    color: isInCompareList ? 'white' : (isMobile ? '#64748b' : '#059669'),
    borderColor: isInCompareList ? '#059669' : (isMobile ? 'rgba(0, 0, 0, 0.06)' : '#d1fae5'),
    transform: isMobile ? 'none' : 'scale(1.2) rotate(5deg)',
    boxShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.06)' : '0 4px 16px rgba(5, 150, 105, 0.3)',
  },
});
