// src/components/modals/QuickViewModal/styles.js
const isMobile = window.innerWidth <= 768;

export const styles = {
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: isMobile ? '20px 20px 0 0' : '16px',
    width: isMobile ? '100%' : '95%',
    maxWidth: isMobile ? '100%' : '1000px',
    maxHeight: isMobile ? '85vh' : '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalSlideUp 0.3s ease',
  },

  content: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: isMobile ? 'auto' : '500px',
    maxHeight: isMobile ? '85vh' : 'none',
    overflowY: isMobile ? 'auto' : 'visible',
  },

  // Sol taraf - Resim
  imageSection: {
    flex: isMobile ? '0 0 auto' : '0 0 50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '20px' : '40px',
    position: 'relative',
  },

  imageContainer: {
    width: '100%',
    height: isMobile ? '200px' : '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    maxWidth: '100%',
    maxHeight: isMobile ? '200px' : '400px',
    objectFit: 'contain',
  },

  noImage: {
    color: '#94a3b8',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Sağ taraf - Bilgiler
  infoSection: {
    flex: isMobile ? '1' : '0 0 50%',
    padding: isMobile ? '20px 16px' : '32px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },

  // Kapatma butonu
  closeButton: {
    position: 'absolute',
    top: isMobile ? '12px' : '16px',
    right: isMobile ? '12px' : '16px',
    width: isMobile ? '36px' : '40px',
    height: isMobile ? '36px' : '40px',
    borderRadius: '50%',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: isMobile ? '16px' : '18px',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },

  closeButtonHover: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
  },

  // Kategori
  category: {
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '600',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: isMobile ? '6px' : '8px',
  },

  // Başlık
  title: {
    fontSize: isMobile ? '18px' : '24px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.3',
    marginBottom: isMobile ? '12px' : '16px',
    paddingRight: isMobile ? '40px' : '50px',
  },

  // Değerlendirme satırı
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '10px' : '16px',
    marginBottom: isMobile ? '16px' : '20px',
    flexWrap: 'wrap',
  },

  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: isMobile ? '13px' : '15px',
  },

  starIcon: {
    color: '#f59e0b',
  },

  reviewCount: {
    color: '#64748b',
    fontSize: isMobile ? '13px' : '14px',
  },

  stockBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#059669',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
  },

  outOfStock: {
    color: '#dc2626',
  },

  divider: {
    color: '#e2e8f0',
    fontSize: isMobile ? '13px' : '14px',
  },

  // Fiyat
  priceSection: {
    marginBottom: isMobile ? '16px' : '24px',
  },

  price: {
    fontSize: isMobile ? '24px' : '32px',
    fontWeight: '700',
    color: '#1e293b',
  },

  oldPrice: {
    fontSize: isMobile ? '14px' : '18px',
    color: '#94a3b8',
    textDecoration: 'line-through',
    marginLeft: isMobile ? '8px' : '12px',
  },

  // Teknik Özellikler
  specsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: isMobile ? '10px' : '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: isMobile ? '16px' : '24px',
  },

  specsTitle: {
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: isMobile ? '12px' : '16px',
  },

  specsGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '10px' : '12px 24px',
  },

  specItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  specLabel: {
    fontSize: isMobile ? '13px' : '14px',
    color: '#64748b',
  },

  specValue: {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    color: '#1e293b',
  },

  // Alt kısım - Miktar ve butonlar
  bottomSection: {
    marginTop: 'auto',
    paddingBottom: isMobile ? '16px' : '0',
  },

  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '12px',
    marginBottom: isMobile ? '16px' : '20px',
  },

  // Miktar seçici
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: isMobile ? '6px' : '8px',
    overflow: 'hidden',
  },

  quantityButton: {
    width: isMobile ? '36px' : '40px',
    height: isMobile ? '40px' : '44px',
    border: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: isMobile ? '14px' : '16px',
    transition: 'all 0.2s ease',
  },

  quantityButtonHover: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
  },

  quantityButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  quantityInput: {
    width: isMobile ? '44px' : '50px',
    height: isMobile ? '40px' : '44px',
    border: 'none',
    borderLeft: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
    textAlign: 'center',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '600',
    color: '#1e293b',
    outline: 'none',
    MozAppearance: 'textfield',
    WebkitAppearance: 'none',
    appearance: 'textfield',
  },

  // Sepete Ekle butonu
  addToCartButton: {
    flex: 1,
    height: isMobile ? '40px' : '44px',
    backgroundColor: '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: isMobile ? '6px' : '8px',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '6px' : '8px',
    transition: 'all 0.2s ease',
  },

  addToCartButtonHover: {
    backgroundColor: '#334155',
  },

  addToCartButtonDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
  },

  // Favori butonu
  favoriteButton: {
    width: isMobile ? '40px' : '44px',
    height: isMobile ? '40px' : '44px',
    border: '1px solid #e2e8f0',
    borderRadius: isMobile ? '6px' : '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: isMobile ? '16px' : '18px',
    transition: 'all 0.2s ease',
  },

  favoriteButtonHover: {
    borderColor: '#fecaca',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
  },

  favoriteButtonActive: {
    borderColor: '#ef4444',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
  },

  // Detaylara git linki
  viewDetailsLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#059669',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: isMobile ? '6px 0' : '8px 0',
    transition: 'all 0.2s ease',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
  },

  viewDetailsLinkHover: {
    color: '#047857',
    gap: '10px',
  },
};
