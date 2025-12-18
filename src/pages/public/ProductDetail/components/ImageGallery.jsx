// src/pages/public/ProductDetail/components/ImageGallery.jsx
import React from 'react';
import { FaBox, FaEye } from 'react-icons/fa';

/**
 * Product image gallery with thumbnails
 */
const ImageGallery = React.memo(({
  product, 
  selectedImage, 
  setSelectedImage, 
  setShowLightbox, 
  styles 
}) => {
  return (
    <div style={styles.imageSection}>
      {/* Thumbnails */}
      {product.images?.length > 1 && (
        <div style={styles.thumbnails}>
          {product.images.map((img, idx) => (
            <div 
              key={img.id || idx}
              style={styles.thumbnail(selectedImage === idx)}
              onClick={() => setSelectedImage(idx)}
            >
              <img 
                src={img.url} 
                alt={img.alt || product.name} 
                style={styles.thumbnailImg}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div 
        style={styles.mainImage} 
        onClick={() => product.images?.length > 0 && setShowLightbox(true)}
      >
        {product.is_featured && (
          <span style={styles.featuredBadge}>⭐ Öne Çıkan</span>
        )}
        
        {product.images?.length > 0 ? (
          <img 
            src={product.images[selectedImage]?.url} 
            alt={product.name}
            style={styles.mainImageImg}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div style={styles.noImage}>
            <FaBox size={64} />
            <span>Görsel yok</span>
          </div>
        )}
        
        {product.images?.length > 0 && (
          <div style={styles.zoomHint}>
            <FaEye size={12} /> Büyütmek için tıkla
          </div>
        )}
      </div>
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;
