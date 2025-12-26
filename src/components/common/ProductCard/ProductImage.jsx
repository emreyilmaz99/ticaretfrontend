// src/components/common/ProductCard/ProductImage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductImage } from '../../../hooks/useProductImage';

const ProductImage = React.memo(({ product, productUrl, styles, isMobile, isHovered }) => {
  const defaultImageUrl = useProductImage(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Ürünün tüm görsellerini al
  const productImages = React.useMemo(() => {
    const images = [];
    
    // Ana görsel
    if (defaultImageUrl) {
      images.push(defaultImageUrl);
    }
    
    // Eğer product.images array varsa ekle
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        const imgUrl = typeof img === 'string' ? img : img?.image_path || img?.url;
        if (imgUrl && !images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      });
    }
    
    // Eğer product.image_gallery varsa ekle
    if (product.image_gallery && Array.isArray(product.image_gallery)) {
      product.image_gallery.forEach(img => {
        const imgUrl = typeof img === 'string' ? img : img?.image_path || img?.url;
        if (imgUrl && !images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      });
    }
    
    return images;
  }, [product, defaultImageUrl]);

  // Hover edildiğinde görseller arasında geçiş yap
  useEffect(() => {
    if (!isHovered || productImages.length <= 1 || isMobile) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
        setIsTransitioning(false);
      }, 150);
    }, 800); // Her 800ms'de bir görsel değiştir

    return () => clearInterval(interval);
  }, [isHovered, productImages.length, isMobile]);
  
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23fafafa" width="400" height="400"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" font-weight="600" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';
  };

  const currentImage = productImages[currentImageIndex] || defaultImageUrl;

  return (
    <Link to={productUrl} style={{ textDecoration: 'none' }}>
      <div style={styles.imageContainer}>
        <img
          key={currentImageIndex}
          src={currentImage}
          alt={product.name}
          style={{
            ...styles.cardImage,
            opacity: isTransitioning && !isMobile ? 0.7 : 1,
            transition: isMobile ? 'none' : 'opacity 0.15s ease-in-out',
          }}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        
        {/* Görsel göstergeleri - sadece birden fazla görsel varsa ve hover ediliyorsa */}
        {productImages.length > 1 && isHovered && !isMobile && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px',
            zIndex: 5,
          }}>
            {productImages.map((img, index) => (
              <div
                key={`image-indicator-${index}-${img}`}
                style={{
                  width: currentImageIndex === index ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: currentImageIndex === index ? '#059669' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
});

ProductImage.displayName = 'ProductImage';

export default ProductImage;
