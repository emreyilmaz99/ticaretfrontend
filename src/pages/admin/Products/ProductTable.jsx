// src/pages/admin/Products/ProductTable.jsx
import React from 'react';
import { FaStore, FaImage, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { StatusBadge } from '../../../features/admin/shared';
import SecureImage from '../../../components/common/SecureImage';
import { toFullUrl } from './styles';

/**
 * Ürün tablosu bileşeni
 */
const ProductTable = ({
  products,
  isLoading,
  selectedProducts,
  onToggleSelectAll,
  onToggleSelect,
  onView,
  onStatusChange,
  styles,
  isMobile
}) => {
  // Debug logging
  console.log('ProductTable - products:', products);
  console.log('ProductTable - products length:', products?.length);
  console.log('ProductTable - isLoading:', isLoading);
  
  // Mobile Card View
  if (isMobile) {
    // Debug: İlk ürünü console'a yazdır
    if (products && products.length > 0) {
      console.log('First product in table:', products[0]);
      console.log('Has thumbnail?', products[0].thumbnail);
      console.log('Has photos?', products[0].photos);
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', backgroundColor: 'white', borderRadius: '12px' }}>
            Yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', backgroundColor: 'white', borderRadius: '12px' }}>
            Ürün bulunamadı
          </div>
        ) : products.map(product => (
          <div key={product.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Product Header */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <input 
                type="checkbox" 
                checked={selectedProducts.includes(product.id)}
                onChange={() => onToggleSelect(product.id)}
                style={{ marginTop: '4px', width: '18px', height: '18px' }}
              />
              <div style={styles.thumbnail}>
                {product.image ? (
                  <SecureImage 
                    src={product.image} 
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <FaImage style={{ color: '#cbd5e1' }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px', marginBottom: '4px' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>SKU: {product.sku || '-'}</div>
              </div>
            </div>
            
            {/* Product Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Satıcı</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: '500' }}>
                  <FaStore size={10} style={{ color: '#64748b' }} />
                  {product.vendor?.store_name || product.vendor?.shop_name || product.vendor?.company_name || '-'}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Fiyat</div>
                <div style={{ color: '#0f172a', fontWeight: '600' }}>₺{product.price}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Stok</div>
                <div style={{ color: product.stock > 0 ? '#059669' : '#ef4444', fontWeight: '600' }}>
                  {product.stock}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Durum</div>
                <StatusBadge status={product.status} />
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                onClick={() => onView(product)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#059669',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '44px'
                }}
              >
                <FaEye size={12} /> Detay
              </button>
              {product.status === 'pending' && (
                <>
                  <button 
                    onClick={() => onStatusChange(product.id, 'active')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#dcfce7',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#166534',
                      cursor: 'pointer',
                      minHeight: '44px',
                      minWidth: '44px'
                    }}
                    title="Onayla"
                  >
                    <FaCheck />
                  </button>
                  <button 
                    onClick={() => onStatusChange(product.id, 'rejected')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#991b1b',
                      cursor: 'pointer',
                      minHeight: '44px',
                      minWidth: '44px'
                    }}
                    title="Reddet"
                  >
                    <FaTimes />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>
            <input 
              type="checkbox" 
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={onToggleSelectAll}
            />
          </th>
          <th style={styles.th}>Ürün</th>
          <th style={styles.th}>Satıcı</th>
          <th style={styles.th}>Fiyat</th>
          <th style={styles.th}>Stok</th>
          <th style={styles.th}>Durum</th>
          <th style={styles.th}>Tarih</th>
          <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Yükleniyor...
            </td>
          </tr>
        ) : products.length === 0 ? (
          <tr>
            <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Ürün bulunamadı
            </td>
          </tr>
        ) : products.map(product => (
          <tr key={product.id}>
            <td style={styles.td}>
              <input 
                type="checkbox" 
                checked={selectedProducts.includes(product.id)}
                onChange={() => onToggleSelect(product.id)}
              />
            </td>
            <td style={styles.td}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={styles.thumbnail}>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <FaImage style={{ color: '#cbd5e1' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>SKU: {product.sku || '-'}</div>
                </div>
              </div>
            </td>
            <td style={styles.td}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaStore size={14} color="#64748b" />
                <span>{product.vendor?.company_name || product.vendor?.full_name || '-'}</span>
              </div>
            </td>
            <td style={{ ...styles.td, fontWeight: '600' }}>
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price || 0)}
            </td>
            <td style={styles.td}>
              <span style={{ 
                color: product.stock > 10 ? '#047857' : product.stock > 0 ? '#b45309' : '#dc2626'
              }}>
                {product.stock} adet
              </span>
            </td>
            <td style={styles.td}>
              <StatusBadge status={product.status} />
            </td>
            <td style={styles.td}>
              <div style={{ fontSize: '13px' }}>
                {new Date(product.created_at).toLocaleDateString('tr-TR')}
              </div>
            </td>
            <td style={{ ...styles.td, textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => onView(product)} 
                  style={{ ...styles.btn(), padding: '8px' }}
                  title="Görüntüle"
                >
                  <FaEye />
                </button>
                {product.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onStatusChange(product.id, 'active')} 
                      style={{ ...styles.btn('success'), padding: '8px' }}
                      title="Onayla"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      onClick={() => onStatusChange(product.id, 'rejected', product.name)} 
                      style={{ ...styles.btn('danger'), padding: '8px' }}
                      title="Reddet"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
                {product.status === 'active' && (
                  <button 
                    onClick={() => onStatusChange(product.id, 'inactive')} 
                    style={{ ...styles.btn('danger'), padding: '8px' }}
                    title="Pasife Al"
                  >
                    <FaTimes />
                  </button>
                )}
                {(product.status === 'rejected' || product.status === 'inactive' || product.status === 'draft') && (
                  <button 
                    onClick={() => onStatusChange(product.id, 'active')} 
                    style={{ ...styles.btn('success'), padding: '8px' }}
                    title="Yayına Al"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
