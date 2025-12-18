// src/pages/public/Home/components/ProductGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ProductCard from '../../../../components/common/ProductCard';
import Skeleton from '../../../../components/ui/Skeleton';

/**
 * Product grid with loading, error, and empty states
 */
const ProductGrid = React.memo(({ 
  products, 
  isLoading, 
  error, 
  favorites,
  toggleFavorite,
  setQuickViewProduct,
  addToCart,
  clearFilters,
  compareList,
  toggleCompare,
  styles 
}) => {
  if (isLoading) {
    return (
      <div style={styles.productGrid}>
        {Array(8).fill(0).map((_, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Image Skeleton */}
            <Skeleton height="200px" borderRadius="12px" />
            
            {/* Content Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton width="60%" height="14px" />
              <Skeleton width="90%" height="18px" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <Skeleton width="40%" height="24px" />
                <Skeleton width="32px" height="32px" borderRadius="50%" />
              </div>
            </div>
            
            {/* Button Skeleton */}
            <Skeleton height="40px" borderRadius="8px" style={{ marginTop: 'auto' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '8px' 
        }}>
          Bir Hata Oluştu
        </h3>
        <p style={{ color: '#64748b' }}>
          Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '8px' 
        }}>
          Ürün Bulunamadı
        </h3>
        <p style={{ color: '#64748b' }}>
          Seçtiğiniz kriterlere uygun ürün bulunmamaktadır. Filtreleri temizleyip tekrar deneyin.
        </p>
        <button 
          onClick={clearFilters}
          style={{ 
            marginTop: '20px', 
            padding: '10px 24px', 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: '600' 
          }}
        >
          Filtreleri Temizle
        </button>
      </div>
    );
  }

  // ============================================================================
  // PERFORMANCE OPTIMIZATION: Progressive Rendering
  // İlk 4 ürünü hemen render et, kalanını setTimeout ile ekle
  // Bu sayede sayfa daha hızlı interaktif hale gelir
  // ============================================================================
  const [visibleCount, setVisibleCount] = useState(4);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // İlk 4 ürünü göster
    setVisibleCount(4);

    // Kalanları progressive olarak ekle
    if (products.length > 4) {
      timeoutRef.current = setTimeout(() => {
        setVisibleCount(products.length);
      }, 100); // 100ms sonra kalan ürünleri render et
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [products]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div style={styles.grid}>
      {visibleProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={{
            ...product,
            reviews: product.reviews_count || 0,
          }} 
          onAddToCart={addToCart}
          onQuickView={setQuickViewProduct}
          onToggleCompare={toggleCompare}
          isInCompareList={compareList?.some(p => p.id === product.id)}
        />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
