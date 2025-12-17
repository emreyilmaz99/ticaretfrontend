import React from 'react';
import { useNavigate } from 'react-router-dom';
import getStyles from './styles';
import { useCategoryProducts } from './useCategoryProducts';

import {
  Breadcrumb,
  FilterSidebar,
  SortBar,
  ProductsGrid,
  CompareBar,
  CompareModal,
  QuickViewModal
} from './components';

const CategoryProducts = () => {
  const navigate = useNavigate();
  const {
    isMobile,
    viewMode,
    sortBy,
    priceRange,
    searchQuery,
    selectedCategories,
    quickViewProduct,
    showMobileFilters,
    compareList,
    isCompareModalOpen,
    favorites,
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    breadcrumbs,
    availableCategories,
    loadMoreRef,
    setViewMode,
    setSortBy,
    setPriceRange,
    setSearchQuery,
    setQuickViewProduct,
    setShowMobileFilters,
    setIsCompareModalOpen,
    handleAddToCart,
    toggleCompare,
    toggleCategory,
    toggleFavorite,
  } = useCategoryProducts();

  const styles = getStyles(isMobile);

  // Add pulse animation for loading state
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      
      {/* BANNER KALDIRILDI. Sayfa direkt başlıyor. */}

      <div style={styles.wrapper}>
        {/* Navigasyon Yolu (Breadcrumb) */}
        <div style={styles.breadcrumbArea}>
          <Breadcrumb items={breadcrumbs} styles={styles} />
        </div>

        <div style={styles.mainContent}>
          {/* Sidebar - Artık Beyaz Kutu İçinde ve Sticky */}
          <FilterSidebar
            isMobile={isMobile}
            showMobileFilters={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            availableCategories={availableCategories}
            styles={styles}
          />

          {/* Ana Ürün Alanı */}
          <main style={styles.productsSection}>
            {/* Sıralama Barı */}
            <SortBar
              isMobile={isMobile}
              productCount={products ? products.length : 0}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onOpenMobileFilter={() => setShowMobileFilters(true)}
              styles={styles}
            />

            {/* Ürünler Grid */}
            <ProductsGrid
              products={products}
              viewMode={viewMode}
              compareList={compareList}
              onToggleCompare={toggleCompare}
              onAddToCart={handleAddToCart}
              onQuickView={setQuickViewProduct}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              loadMoreRef={loadMoreRef}
              styles={styles}
            />
          </main>
        </div>
      </div>

      {/* CompareBar kaldırıldı - Sadece modal kullanılıyor */}

      {quickViewProduct && (
        <QuickViewModal
          isOpen={!!quickViewProduct}
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(product, quantity) => {
            handleAddToCart({ ...product, quantity });
            setQuickViewProduct(null);
          }}
          onAddToFavorites={(product) => {
            toggleFavorite(null, product.id);
          }}
          onViewDetails={(product) => {
            navigate(`/product/${product.slug || product.id}`);
          }}
          isFavorite={favorites.includes(quickViewProduct.id)}
        />
      )}

      {isCompareModalOpen && (
        <CompareModal
          compareList={compareList}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={toggleCompare}
          styles={styles}
        />
      )}
    </div>
  );
};

export default CategoryProducts;