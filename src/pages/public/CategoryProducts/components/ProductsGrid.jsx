import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../../../components/common/ProductCard';

export const ProductsGrid = ({ 
  products, 
  onAddToCart, 
  onQuickView,
  viewMode,
  compareList = [],
  onToggleCompare,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  loadMoreRef,
  styles 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  // Calculate pagination
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = isMobile ? products?.slice(startIndex, endIndex) : products;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginationStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    button: {
      minWidth: '40px',
      height: '40px',
      padding: '8px 12px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#6B7280',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonActive: {
      backgroundColor: '#059669',
      color: '#fff',
      borderColor: '#059669',
      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
    },
    buttonDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    info: {
      fontSize: '13px',
      color: '#6B7280',
      fontWeight: '500',
      padding: '0 8px',
    },
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          🔄
        </div>
        <p style={{ 
          color: '#1F2937', 
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          Ürünler Yükleniyor...
        </p>
        <p style={{ 
          color: '#6B7280', 
          fontSize: '14px' 
        }}>
          Lütfen bekleyin
        </p>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '24px',
          opacity: '0.5'
        }}>
          🔍
        </div>
        <h3 style={{ 
          color: '#1F2937', 
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Sonuç Bulunamadı
        </h3>
        <p style={{ 
          color: '#6B7280', 
          fontSize: '15px',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          Aradığınız kriterlere uygun ürün bulunamadı.<br />
          Farklı filtreler deneyebilir veya arama teriminizi değiştirebilirsiniz.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Filtreleri Temizle
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={viewMode === 'list' ? {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '12px' : '16px'
      } : styles.grid}>
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            isInCompareList={compareList?.some(p => p.id === product.id)}
            onToggleCompare={onToggleCompare}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {/* Mobile Pagination */}
      {isMobile && totalPages > 1 && (
        <div style={paginationStyles.container}>
          {/* Previous Button */}
          <button
            style={{
              ...paginationStyles.button,
              ...(currentPage === 1 ? paginationStyles.buttonDisabled : {}),
            }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const showPage = 
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (!showPage) {
              // Show ellipsis
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} style={paginationStyles.info}>...</span>;
              }
              return null;
            }

            return (
              <button
                key={page}
                style={{
                  ...paginationStyles.button,
                  ...(page === currentPage ? paginationStyles.buttonActive : {}),
                }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            style={{
              ...paginationStyles.button,
              ...(currentPage === totalPages ? paginationStyles.buttonDisabled : {}),
            }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      {/* Desktop Infinite Scroll */}
      {!isMobile && (
        <>
          {isFetchingNextPage && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: '#6B7280', fontSize: '14px' }}>Daha fazla ürün yükleniyor...</p>
            </div>
          )}
          <div ref={loadMoreRef} style={{ height: '20px', width: '100%' }} />
        </>
      )}
    </>
  );
};

export default ProductsGrid;