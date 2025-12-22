// src/pages/admin/Products/ProductDetailModal.jsx
import React from 'react';
import { FaTimes, FaStore, FaImage, FaCheck, FaTimesCircle } from 'react-icons/fa';
import { StatusBadge } from '../../../features/admin/shared';
import SecureImage from '../../../components/common/SecureImage';
import { toFullUrl } from './styles';

/**
 * Ürün detay modal bileşeni
 */
const ProductDetailModal = ({
  product,
  selectedImage,
  onSelectImage,
  onOpenLightbox,
  onStatusChange,
  onClose,
  styles
}) => {
  if (!product) return null;

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Backend'den gelen field'ları kullan: thumbnail veya photos array
  console.log('[ProductDetailModal] Product:', product);
  console.log('[ProductDetailModal] product.thumbnail:', product.thumbnail);
  console.log('[ProductDetailModal] product.photos:', product.photos);
  console.log('[ProductDetailModal] product.image:', product.image);
  
  const productImages = product.photos?.map(p => p.url) || product.images || [];
  const defaultImage = product.thumbnail || productImages[0] || product.image;
  const mainImage = selectedImage || defaultImage;
  
  console.log('[ProductDetailModal] productImages:', productImages);
  console.log('[ProductDetailModal] defaultImage:', defaultImage);
  console.log('[ProductDetailModal] mainImage:', mainImage);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ 
        ...styles.modalContent, 
        maxWidth: isMobile ? '100%' : '1000px',
        width: isMobile ? '100%' : '90%',
        maxHeight: isMobile ? '100vh' : '90vh',
        borderRadius: isMobile ? '0' : '16px',
        margin: isMobile ? '0' : 'auto',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          ...styles.modalHeader,
          padding: isMobile ? '16px 20px' : '20px 24px',
          position: isMobile ? 'sticky' : 'relative',
          top: isMobile ? 0 : 'auto',
          zIndex: isMobile ? 10 : 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flex: 1 }}>
            <h2 style={{ 
              fontSize: isMobile ? '16px' : '18px', 
              fontWeight: '700', 
              color: '#0f172a',
              margin: 0,
            }}>
              Ürün Detayı
            </h2>
            <StatusBadge status={product.status} />
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#94a3b8', 
              padding: '8px',
              flexShrink: 0,
            }}
          >
            <FaTimes size={isMobile ? 18 : 20} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          ...styles.modalBody,
          padding: isMobile ? '16px' : '24px',
          maxHeight: isMobile ? 'calc(100vh - 140px)' : '70vh',
          overflowY: 'auto',
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '320px 1fr', 
            gap: isMobile ? '24px' : '32px',
          }}>
            
            {/* Sol - Görseller */}
            <div>
              {/* Ana Görsel */}
              <div 
                style={{ 
                  aspectRatio: '1/1', 
                  borderRadius: isMobile ? '10px' : '12px', 
                  backgroundColor: '#f1f5f9', 
                  overflow: 'hidden', 
                  marginBottom: isMobile ? '10px' : '12px', 
                  border: '1px solid #e2e8f0', 
                  cursor: 'pointer',
                  maxHeight: isMobile ? '300px' : 'none',
                }}
                onClick={() => mainImage && onOpenLightbox(mainImage)}
              >
                {mainImage ? (
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      console.error('[ProductDetailModal] Image failed to load:', mainImage);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('[ProductDetailModal] Image loaded successfully:', mainImage);
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                    <FaImage size={isMobile ? 40 : 48} color="#cbd5e1" />
                    <span style={{ color: '#94a3b8', fontSize: isMobile ? '12px' : '13px' }}>Görsel yok</span>
                  </div>
                )}
              </div>
              
              {/* Diğer Görseller */}
              {productImages && productImages.length > 1 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)', 
                  gap: isMobile ? '6px' : '8px',
                }}>
                  {productImages.map((imageUrl, i) => {
                    const isSelected = selectedImage === imageUrl;
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          aspectRatio: '1/1', 
                          borderRadius: isMobile ? '6px' : '8px', 
                          overflow: 'hidden', 
                          backgroundColor: '#f1f5f9', 
                          border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0', 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          opacity: isSelected ? 1 : 0.8
                        }}
                        onClick={() => onSelectImage(imageUrl)}
                      >
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => console.error('[ProductDetailModal] Thumbnail failed:', imageUrl)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Satıcı Bilgisi */}
              <div style={{ 
                marginTop: isMobile ? '16px' : '24px', 
                padding: isMobile ? '14px' : '16px', 
                backgroundColor: '#f8fafc', 
                borderRadius: isMobile ? '10px' : '12px', 
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#64748b', 
                  textTransform: 'uppercase', 
                  fontWeight: '600', 
                  marginBottom: isMobile ? '10px' : '12px',
                }}>
                  Satıcı Bilgileri
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px' }}>
                  <div style={{ 
                    width: isMobile ? '36px' : '40px', 
                    height: isMobile ? '36px' : '40px', 
                    borderRadius: isMobile ? '8px' : '10px', 
                    backgroundColor: '#059669', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FaStore size={isMobile ? 16 : 18} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#0f172a',
                      fontSize: isMobile ? '13px' : '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {product.vendor?.store_name || product.vendor?.shop_name || product.vendor?.company_name || '-'}
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? '11px' : '12px', 
                      color: '#64748b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {product.vendor?.full_name || product.vendor?.owner || product.vendor?.name || '-'}
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? '11px' : '12px', 
                      color: '#64748b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {product.vendor?.email || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ - Detaylar */}
            <div>
              <h3 style={{ 
                fontSize: isMobile ? '18px' : '24px', 
                fontWeight: '700', 
                color: '#0f172a', 
                marginBottom: isMobile ? '6px' : '8px', 
                lineHeight: '1.3',
              }}>
                {product.name}
              </h3>
              
              {/* Temel Bilgiler */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
                gap: isMobile ? '10px' : '12px', 
                marginBottom: isMobile ? '16px' : '24px', 
                marginTop: isMobile ? '12px' : '16px',
              }}>
                <div style={styles.infoBox('#ecfdf5')}>
                  <div style={styles.infoLabel('#047857')}>FİYAT</div>
                  <div style={styles.infoValue('#047857')}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
                  </div>
                </div>
                <div style={styles.infoBox('#eff6ff')}>
                  <div style={styles.infoLabel('#2563eb')}>STOK</div>
                  <div style={styles.infoValue('#2563eb')}>{product.stock} adet</div>
                </div>
                <div style={styles.infoBox('#fef3c7')}>
                  <div style={styles.infoLabel('#b45309')}>TİP</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#b45309' }}>
                    {product.type === 'simple' ? 'Basit' : 'Varyantlı'}
                  </div>
                </div>
                <div style={styles.infoBox('#f1f5f9')}>
                  <div style={styles.infoLabel('#475569')}>KATEGORİ</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                    {product.category?.name || '-'}
                  </div>
                </div>
              </div>

              {/* Detay Bilgiler */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: isMobile ? '12px' : '16px', 
                marginBottom: isMobile ? '16px' : '24px',
              }}>
                <DetailItem label="SKU (Stok Kodu)" value={product.sku || '-'} />
                <DetailItem label="Slug (URL)" value={product.slug || '-'} />
                <DetailItem label="Oluşturulma Tarihi" value={new Date(product.created_at).toLocaleString('tr-TR')} />
                <DetailItem label="Güncellenme Tarihi" value={new Date(product.updated_at).toLocaleString('tr-TR')} />
                <DetailItem 
                  label="Öne Çıkan" 
                  value={product.is_featured ? '✓ Evet' : 'Hayır'} 
                  valueColor={product.is_featured ? '#059669' : '#64748b'} 
                />
                <DetailItem label="Ürün ID" value={product.id} isCode />
              </div>

              {/* Açıklamalar */}
              {product.short_description && (
                <DescriptionBox title="Kısa Açıklama" content={product.short_description} />
              )}
              
              {product.description && (
                <DescriptionBox title="Detaylı Açıklama" content={product.description} scrollable />
              )}

              {/* Etiketler */}
              {product.tags && product.tags.length > 0 && (
                <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#64748b', 
                    fontWeight: '600', 
                    marginBottom: '8px', 
                    textTransform: 'uppercase',
                  }}>
                    Etiketler
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.tags.map((tag, i) => (
                      <span key={i} style={{ 
                        padding: isMobile ? '5px 12px' : '6px 14px', 
                        backgroundColor: '#059669', 
                        color: 'white', 
                        borderRadius: '20px', 
                        fontSize: isMobile ? '11px' : '12px', 
                        fontWeight: '500',
                      }}>
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Red Sebebi */}
              {product.status === 'rejected' && product.rejection_reason && (
                <div style={{ 
                  marginBottom: isMobile ? '16px' : '20px', 
                  padding: isMobile ? '14px' : '16px', 
                  backgroundColor: '#fef2f2', 
                  borderRadius: '10px', 
                  border: '1px solid #fecaca',
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#dc2626', 
                    fontWeight: '600', 
                    marginBottom: '8px', 
                    textTransform: 'uppercase', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                  }}>
                    <FaTimesCircle size={isMobile ? 12 : 14} /> Red Sebebi
                  </div>
                  <p style={{ 
                    color: '#991b1b', 
                    fontSize: isMobile ? '13px' : '14px', 
                    lineHeight: '1.6', 
                    margin: 0,
                  }}>
                    {product.rejection_reason}
                  </p>
                  {product.rejected_at && (
                    <p style={{ 
                      color: '#b91c1c', 
                      fontSize: isMobile ? '11px' : '12px', 
                      marginTop: '8px', 
                      margin: '8px 0 0 0',
                    }}>
                      Reddedilme tarihi: {new Date(product.rejected_at).toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
              )}

              {/* Varyantlar */}
              {product.variants && product.variants.length > 0 && (
                <VariantsTable variants={product.variants} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          ...styles.modalFooter,
          padding: isMobile ? '14px 16px' : '20px 24px',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '0',
          alignItems: isMobile ? 'stretch' : 'center',
          position: isMobile ? 'sticky' : 'relative',
          bottom: isMobile ? 0 : 'auto',
          zIndex: isMobile ? 10 : 'auto',
        }}>
          <div style={{ 
            fontSize: isMobile ? '12px' : '13px', 
            color: '#64748b',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            ID: <span style={{ fontFamily: 'monospace', fontSize: isMobile ? '11px' : '12px' }}>{product.id}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '8px' : '12px',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end',
          }}>
            {product.status === 'pending' && (
              <>
                <button 
                  onClick={() => onStatusChange(product.id, 'rejected', product.name)}
                  style={{ 
                    ...styles.btn('danger'), 
                    padding: isMobile ? '10px 16px' : '10px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: isMobile ? '13px' : '14px',
                    flex: isMobile ? '1' : 'none',
                    justifyContent: 'center',
                  }}
                >
                  <FaTimes size={isMobile ? 12 : 14} /> Reddet
                </button>
                <button 
                  onClick={() => { onStatusChange(product.id, 'active'); onClose(); }}
                  style={{ 
                    ...styles.btn('primary'), 
                    padding: isMobile ? '10px 16px' : '10px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: isMobile ? '13px' : '14px',
                    flex: isMobile ? '1' : 'none',
                    justifyContent: 'center',
                  }}
                >
                  <FaCheck size={isMobile ? 12 : 14} /> Onayla ve Yayınla
                </button>
              </>
            )}
            {product.status === 'active' && (
              <button 
                onClick={() => { onStatusChange(product.id, 'inactive'); onClose(); }}
                style={{ 
                  ...styles.btn('danger'), 
                  padding: isMobile ? '10px 16px' : '10px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: isMobile ? '13px' : '14px',
                  flex: isMobile ? '1' : 'none',
                  justifyContent: 'center',
                }}
              >
                <FaTimes size={isMobile ? 12 : 14} /> Pasife Al
              </button>
            )}
            {(product.status === 'rejected' || product.status === 'inactive' || product.status === 'draft') && (
              <button 
                onClick={() => { onStatusChange(product.id, 'active'); onClose(); }}
                style={{ 
                  ...styles.btn('primary'), 
                  padding: isMobile ? '10px 16px' : '10px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: isMobile ? '13px' : '14px',
                  flex: isMobile ? '1' : 'none',
                  justifyContent: 'center',
                }}
              >
                <FaCheck size={isMobile ? 12 : 14} /> Yayına Al
              </button>
            )}
            <button 
              onClick={onClose}
              style={{ 
                ...styles.btn(), 
                padding: isMobile ? '10px 16px' : '10px 20px',
                fontSize: isMobile ? '13px' : '14px',
                flex: isMobile ? '1' : 'none',
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const DetailItem = ({ label, value, valueColor = '#0f172a', isCode = false }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div style={{ 
        fontSize: '11px', 
        color: '#64748b', 
        fontWeight: '600', 
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: isCode ? (isMobile ? '11px' : '12px') : (isMobile ? '13px' : '14px'), 
        color: isCode ? '#64748b' : valueColor, 
        fontWeight: '500',
        fontFamily: isCode ? 'monospace' : 'inherit',
        wordBreak: 'break-word',
      }}>
        {value}
      </div>
    </div>
  );
};

const DescriptionBox = ({ title, content, scrollable = false }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
      <div style={{ 
        fontSize: '11px', 
        color: '#64748b', 
        fontWeight: '600', 
        marginBottom: '8px', 
        textTransform: 'uppercase',
      }}>
        {title}
      </div>
      <div style={{ 
        color: '#334155', 
        fontSize: isMobile ? '13px' : '14px', 
        lineHeight: '1.6', 
        padding: isMobile ? '10px' : '12px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        ...(scrollable ? { maxHeight: isMobile ? '120px' : '150px', overflowY: 'auto' } : {})
      }}>
        {content}
      </div>
    </div>
  );
};

const VariantsTable = ({ variants }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    // Mobile: Card view
    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          fontSize: '11px', 
          color: '#64748b', 
          fontWeight: '600', 
          marginBottom: '12px', 
          textTransform: 'uppercase',
        }}>
          Varyantlar ({variants.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {variants.map((variant, i) => (
            <div 
              key={i} 
              style={{ 
                padding: '12px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ 
                fontWeight: '600', 
                fontSize: '13px', 
                color: '#0f172a', 
                marginBottom: '8px',
              }}>
                {variant.title || 'Varsayılan'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>SKU:</span>
                <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                  {variant.sku || '-'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Fiyat:</span>
                <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(variant.price || 0)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Stok:</span>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  fontWeight: '500',
                  backgroundColor: variant.stock > 10 ? '#d1fae5' : variant.stock > 0 ? '#fef3c7' : '#fee2e2',
                  color: variant.stock > 10 ? '#047857' : variant.stock > 0 ? '#b45309' : '#dc2626',
                }}>
                  {variant.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Table view
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ 
        fontSize: '11px', 
        color: '#64748b', 
        fontWeight: '600', 
        marginBottom: '12px', 
        textTransform: 'uppercase',
      }}>
        Varyantlar ({variants.length})
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Varyant</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Fiyat</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Stok</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, i) => (
              <tr key={i} style={{ borderBottom: i < variants.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '500' }}>{variant.title || 'Varsayılan'}</td>
                <td style={{ padding: '10px 12px', color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{variant.sku || '-'}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(variant.price || 0)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    backgroundColor: variant.stock > 10 ? '#d1fae5' : variant.stock > 0 ? '#fef3c7' : '#fee2e2',
                    color: variant.stock > 10 ? '#047857' : variant.stock > 0 ? '#b45309' : '#dc2626'
                  }}>
                    {variant.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetailModal;
