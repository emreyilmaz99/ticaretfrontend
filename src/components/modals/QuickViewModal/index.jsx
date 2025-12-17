// src/components/modals/QuickViewModal/index.jsx
import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaCheck, FaShoppingCart, FaHeart, FaRegHeart, FaArrowRight, FaMinus, FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import { ModalOverlay } from '../shared';
import { useToast } from '../../common/Toast';
import { styles } from './styles';

const QuickViewModal = React.memo(({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onAddToFavorites,
  onViewDetails,
  isFavorite = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [closeHovered, setCloseHovered] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [favHovered, setFavHovered] = useState(false);
  const [detailsHovered, setDetailsHovered] = useState(false);
  const [minusHovered, setMinusHovered] = useState(false);
  const [plusHovered, setPlusHovered] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const toast = useToast();

  const handleAddToCart = useCallback(() => {
    if (product && product.stock > 0) {
      onAddToCart(product, quantity);
      onClose();
    }
  }, [product, quantity, onAddToCart, onClose]);

  const handleAddToFavorites = useCallback(() => {
    if (product) {
      const newFavState = !localFavorite;
      setLocalFavorite(newFavState);
      onAddToFavorites(product);
      
      if (newFavState) {
        toast.success('Favorilere Eklendi', `${product.name} favorilere eklendi!`);
      } else {
        toast.info('Favorilerden Çıkarıldı', `${product.name} favorilerden çıkarıldı.`);
      }
    }
  }, [product, onAddToFavorites, localFavorite, toast]);

  const handleViewDetails = useCallback(() => {
    if (product) {
      onViewDetails(product);
      onClose();
    }
  }, [product, onViewDetails, onClose]);

  const maxQuantity = useMemo(
    () => Math.min(product?.stock || 0, 99),
    [product?.stock]
  );

  const hasStock = useMemo(() => product?.stock > 0, [product?.stock]);

  const categoryName = useMemo(() => {
    if (!product?.category) return '';
    return typeof product.category === 'object' ? product.category.name : product.category;
  }, [product?.category]);

  const imageUrl = useMemo(() => {
    if (product?.image_url) return product.image_url;
    if (product?.images?.length > 0) return product.images[0];
    return null;
  }, [product]);

  // Teknik özellikler - statik demo değerler veya ürün verilerinden
  const specifications = useMemo(() => {
    if (!product) return [];
    
    const specs = [];
    
    // Önce specifications alanını kontrol et
    if (product.specifications && typeof product.specifications === 'object') {
      Object.entries(product.specifications).forEach(([key, value]) => {
        if (value) {
          specs.push({ label: key, value: String(value) });
        }
      });
    }
    
    // Ürünün diğer alanlarından özellik çıkar
    if (specs.length === 0) {
      if (product.connectivity) specs.push({ label: 'Bağlantı', value: product.connectivity });
      if (product.battery_life) specs.push({ label: 'Pil Ömrü', value: product.battery_life });
      if (product.warranty) specs.push({ label: 'Garanti', value: product.warranty });
      if (product.color) specs.push({ label: 'Renk', value: product.color });
      if (product.brand) specs.push({ label: 'Marka', value: product.brand });
      if (product.model) specs.push({ label: 'Model', value: product.model });
      if (product.sku) specs.push({ label: 'Ürün Kodu', value: product.sku });
      if (product.weight) specs.push({ label: 'Ağırlık', value: product.weight });
      if (product.dimensions) specs.push({ label: 'Boyut', value: product.dimensions });
      if (product.material) specs.push({ label: 'Malzeme', value: product.material });
    }
    
    // Eğer hala boşsa statik demo değerler ekle
    if (specs.length === 0) {
      specs.push({ label: 'Bağlantı', value: 'Bluetooth 5.2' });
      specs.push({ label: 'Pil Ömrü', value: '30 Saat' });
      specs.push({ label: 'Garanti', value: '2 Yıl' });
      specs.push({ label: 'Renk', value: 'Siyah' });
    }
    
    return specs.slice(0, 4); // Max 4 özellik göster (2x2 grid)
  }, [product]);

  if (!isOpen || !product) return null;

  // Number input spinner'larını gizlemek için CSS
  const hideSpinnerCSS = `
    .quantity-input::-webkit-outer-spin-button,
    .quantity-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .quantity-input[type=number] {
      -moz-appearance: textfield;
    }
  `;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <style>{hideSpinnerCSS}</style>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.content}>
          {/* Sol - Resim */}
          <div style={styles.imageSection}>
            <div style={styles.imageContainer}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{ ...styles.noImage, display: imageUrl ? 'none' : 'flex' }}>
                <FaImage size={24} />
                <span>{product.name}</span>
              </div>
            </div>
          </div>

          {/* Sağ - Bilgiler */}
          <div style={styles.infoSection}>
            {/* Kapatma butonu */}
            <button
              style={{
                ...styles.closeButton,
                ...(closeHovered ? styles.closeButtonHover : {}),
              }}
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
            >
              <FaTimes />
            </button>

            {/* Kategori */}
            {categoryName && (
              <div style={styles.category}>{categoryName}</div>
            )}

            {/* Başlık */}
            <h2 style={styles.title}>{product.name}</h2>

            {/* Değerlendirme satırı */}
            <div style={styles.ratingRow}>
              <div style={styles.ratingBadge}>
                <FaStar style={styles.starIcon} />
                <span>{product.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <span style={styles.reviewCount}>
                {product.reviews_count || 0} Değerlendirme
              </span>
              <span style={styles.divider}>|</span>
              <div style={{
                ...styles.stockBadge,
                ...(hasStock ? {} : styles.outOfStock),
              }}>
                {hasStock ? (
                  <>
                    <FaCheck size={12} />
                    <span>Stokta Var</span>
                  </>
                ) : (
                  <span>Stokta Yok</span>
                )}
              </div>
            </div>

            {/* Fiyat */}
            <div style={styles.priceSection}>
              <span style={styles.price}>
                ₺{(product.price * quantity)?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span style={styles.oldPrice}>
                  ₺{(product.original_price * quantity)?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              )}
              {quantity > 1 && (
                <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>
                  ({quantity} x ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })})
                </span>
              )}
            </div>

            {/* Teknik Özellikler */}
            {specifications.length > 0 && (
              <div style={styles.specsContainer}>
                <div style={styles.specsTitle}>Teknik Özellikler</div>
                <div style={styles.specsGrid}>
                  {specifications.map((spec, index) => (
                    <div key={index} style={styles.specItem}>
                      <span style={styles.specLabel}>{spec.label}</span>
                      <span style={styles.specValue}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alt kısım */}
            <div style={styles.bottomSection}>
              {/* Miktar ve Butonlar */}
              <div style={styles.actionsRow}>
                {/* Miktar Seçici */}
                <div style={styles.quantityControl}>
                  <button
                    style={{
                      ...styles.quantityButton,
                      ...(minusHovered ? styles.quantityButtonHover : {}),
                      ...(quantity <= 1 ? styles.quantityButtonDisabled : {}),
                    }}
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                    disabled={quantity <= 1}
                    onMouseEnter={() => setMinusHovered(true)}
                    onMouseLeave={() => setMinusHovered(false)}
                  >
                    <FaMinus size={12} />
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(maxQuantity, val)));
                    }}
                    style={styles.quantityInput}
                    min={1}
                    max={maxQuantity}
                  />
                  <button
                    style={{
                      ...styles.quantityButton,
                      ...(plusHovered ? styles.quantityButtonHover : {}),
                      ...(quantity >= maxQuantity ? styles.quantityButtonDisabled : {}),
                    }}
                    onClick={() => quantity < maxQuantity && setQuantity(q => q + 1)}
                    disabled={quantity >= maxQuantity}
                    onMouseEnter={() => setPlusHovered(true)}
                    onMouseLeave={() => setPlusHovered(false)}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Sepete Ekle */}
                <button
                  style={{
                    ...styles.addToCartButton,
                    ...(cartHovered ? styles.addToCartButtonHover : {}),
                    ...(!hasStock ? styles.addToCartButtonDisabled : {}),
                  }}
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  onMouseEnter={() => setCartHovered(true)}
                  onMouseLeave={() => setCartHovered(false)}
                >
                  <FaShoppingCart size={16} />
                  Sepete Ekle
                </button>

                {/* Favori */}
                <button
                  style={{
                    ...styles.favoriteButton,
                    ...(localFavorite ? styles.favoriteButtonActive : {}),
                    ...(favHovered && !localFavorite ? styles.favoriteButtonHover : {}),
                  }}
                  onClick={handleAddToFavorites}
                  onMouseEnter={() => setFavHovered(true)}
                  onMouseLeave={() => setFavHovered(false)}
                >
                  {localFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Detaylara Git */}
              <button
                style={{
                  ...styles.viewDetailsLink,
                  ...(detailsHovered ? styles.viewDetailsLinkHover : {}),
                }}
                onClick={handleViewDetails}
                onMouseEnter={() => setDetailsHovered(true)}
                onMouseLeave={() => setDetailsHovered(false)}
              >
                Ürün Detaylarına Git
                <FaArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
});

QuickViewModal.displayName = 'QuickViewModal';

QuickViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    price: PropTypes.number,
    original_price: PropTypes.number,
    stock: PropTypes.number,
    image_url: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rating: PropTypes.number,
    reviews_count: PropTypes.number,
    sku: PropTypes.string,
    specifications: PropTypes.object,
  }),
  onAddToCart: PropTypes.func.isRequired,
  onAddToFavorites: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
};

export default QuickViewModal;
