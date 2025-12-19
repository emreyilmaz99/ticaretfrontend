// src/pages/public/ProductDetail/index.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

// Hooks & Styles
import { useProductDetail } from './useProductDetail';
import { getStyles } from './styles';

// Components
import Breadcrumb from './components/Breadcrumb';
import ImageGallery from './components/ImageGallery';
import Lightbox from './components/Lightbox';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';

/**
 * Product detail page
 */
const ProductDetail = () => {
  const {
    // State
    isMobile,
    quantity,
    selectedVariant,
    selectedImage,
    activeTab,
    showShareMenu,
    recentlyViewed,
    showLightbox,

    // Data
    product,
    relatedProducts,
    isLoading,
    error,

    // Calculated
    currentPrice,
    currentStock,
    isInStock,
    showLowStockWarning,

    // Context
    isFavorite,

    // Setters
    setQuantity,
    setSelectedVariant,
    setSelectedImage,
    setActiveTab,
    setShowShareMenu,
    setShowLightbox,

    // Handlers
    handleAddToCart,
    handleShare,
    copyToClipboard,
    handleToggleFavorite,
  } = useProductDetail();

  // PERFORMANCE: Memoize styles to prevent recalculation on every render
  const styles = useMemo(() => getStyles(isMobile), [isMobile]);

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Ürün yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Error state - SADECE 404 ve gerçek hatalar için göster, 401 ignore edilmeli
  if (error && error.response?.status !== 401 && !product) {
    return (
      <div style={styles.container}>
        <div style={{ 
          padding: '80px 20px', 
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          margin: '40px auto',
          maxWidth: '600px'
        }}>
          <FaClock size={64} color="#cbd5e1" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
            Ürün Bulunamadı
          </h2>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>
            {error.response?.status === 404 
              ? 'Aradığınız ürün bulunamadı veya mevcut değil.'
              : 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}
          </p>
          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: '#059669',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // Product yok ama loading bitti - backend issue olabilir
  if (!isLoading && !product) {
    console.warn('[ProductDetail] No product data but not loading, backend may require auth');
  }

  return (
    <div style={styles.container}>
      {/* Lightbox Modal */}
      {showLightbox && (
        <Lightbox 
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onClose={() => setShowLightbox(false)}
          styles={styles}
        />
      )}

      {/* Breadcrumb */}
      <Breadcrumb product={product} styles={styles} />

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Image Gallery */}
        <ImageGallery 
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setShowLightbox={setShowLightbox}
          styles={styles}
        />

        {/* Product Info */}
        <ProductInfo 
          product={product}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          quantity={quantity}
          setQuantity={setQuantity}
          currentPrice={currentPrice}
          currentStock={currentStock}
          isInStock={isInStock}
          showLowStockWarning={showLowStockWarning}
          isFavorite={isFavorite}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          handleAddToCart={handleAddToCart}
          handleToggleFavorite={handleToggleFavorite}
          handleShare={handleShare}
          copyToClipboard={copyToClipboard}
          styles={styles}
        />
      </div>

      {/* Tabs Section */}
      <ProductTabs 
        product={product}
        selectedVariant={selectedVariant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        styles={styles}
      />

      {/* Related Products */}
      <RelatedProducts 
        products={relatedProducts}
        title="Benzer Ürünler"
        styles={styles}
      />

      {/* Recently Viewed Products */}
      <RelatedProducts 
        products={recentlyViewed.slice(0, 4)}
        title="Son Görüntülediğiniz Ürünler"
        icon={<FaClock />}
        styles={styles}
      />
    </div>
  );
};

export default ProductDetail;
