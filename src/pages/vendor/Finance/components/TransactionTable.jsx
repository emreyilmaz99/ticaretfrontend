import React, { useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/lib/apiClient';
import { printInvoice } from '../../Orders/invoiceService';

/**
 * Status renk ve label eşleştirmesi
 */
const getStatusStyle = (status) => {
  const statusMap = {
    pending: { bg: '#fef3c7', color: '#92400e', label: 'Beklemede' },
    available: { bg: '#d1fae5', color: '#065f46', label: 'Çekilebilir' },
    settled: { bg: '#dbeafe', color: '#1e40af', label: 'Ödendi' },
    refunded: { bg: '#fee2e2', color: '#991b1b', label: 'İade Edildi' },
    completed: { bg: '#d1fae5', color: '#065f46', label: 'Tamamlandı' },
  };
  return statusMap[status] || { bg: '#f3f4f6', color: '#374151', label: status };
};

/**
 * TransactionTable Component - İşlem geçmişi tablosu
 */
const TransactionTable = ({ transactions, styles }) => {
  const [loadingInvoice, setLoadingInvoice] = useState(null);

  // Fatura görüntüleme - sipariş detayını çekip invoice aç
  const handleViewInvoice = async (orderId) => {
    if (!orderId) return;
    
    try {
      setLoadingInvoice(orderId);
      const response = await apiClient.get(`/v1/orders/${orderId}`);
      
      // API yanıtını al
      const data = response.data?.data || response.data;
      console.log('Raw API Response:', data);
      
      // Backend'den gelen veriyi invoiceService formatına dönüştür
      // Backend yapısı: { order, items, customer, vendor, address }
      const orderInfo = data.order || data;
      const items = data.items || orderInfo.items || orderInfo.products || [];
      const customer = data.customer || orderInfo.customer || {};
      const vendor = data.vendor || orderInfo.vendor || {};
      const address = data.address || orderInfo.address || orderInfo.shipping_address || {};
      
      const order = {
        // Sipariş temel bilgileri
        id: orderInfo.order_number || orderInfo.id || `ORD-${orderId}`,
        date: formatOrderDate(orderInfo.created_at || orderInfo.order_date),
        status: orderInfo.status || 'pending',
        
        // Satıcı bilgileri
        vendor: {
          name: vendor.store_name || vendor.name || vendor.business_name || 'Satıcı',
          tax_id: vendor.tax_number || vendor.tax_id || vendor.vkn || '',
          phone: vendor.phone || vendor.contact_phone || '',
          email: vendor.email || vendor.contact_email || '',
          address: vendor.address || vendor.business_address || '',
        },
        
        // Müşteri bilgileri
        customer: {
          name: customer.name || customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Müşteri',
          email: customer.email || '',
          phone: customer.phone || customer.mobile || '',
        },
        
        // Teslimat adresi - string veya object olabilir
        shippingAddress: typeof address === 'string' 
          ? address 
          : formatAddress(address),
        
        // Ödeme
        paymentMethod: orderInfo.payment_method || orderInfo.paymentMethod || 'Kredi Kartı',
        
        // Ürünler
        products: items.map(item => ({
          name: item.product_name || item.name || item.title || 'Ürün',
          variant: item.variant_name || item.variant || item.options || '',
          price: parseFloat(item.unit_price || item.price || 0),
          qty: parseInt(item.quantity || item.qty || 1),
          financials: {
            price_without_tax: parseFloat(item.price_without_tax || item.subtotal || item.unit_price || item.price || 0),
            tax_rate: parseFloat(item.tax_rate || item.vat_rate || 0),
            tax_amount: parseFloat(item.tax_amount || item.vat_amount || 0),
          }
        })),
        
        // Kargo
        shipping: parseFloat(orderInfo.shipping_cost || orderInfo.shipping_fee || orderInfo.shipping || 0),
      };
      
      console.log('Transformed Order for Invoice:', order);
      printInvoice(order);
    } catch (error) {
      console.error('Fatura yüklenirken hata:', error);
      alert('Fatura yüklenirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingInvoice(null);
    }
  };
  
  // Tarih formatlama helper
  const formatOrderDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };
  
  // Adres formatlama helper
  const formatAddress = (addr) => {
    if (!addr) return 'Adres bilgisi bulunamadı.';
    const parts = [
      addr.address_line || addr.street || addr.line1,
      addr.district || addr.neighborhood,
      addr.city || addr.province,
      addr.country
    ].filter(Boolean);
    return parts.join(', ') || 'Adres bilgisi bulunamadı.';
  };

  // Boş durum
  if (!transactions || transactions.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Son İşlemler</h3>
        <div style={{ 
          padding: '48px 24px', 
          textAlign: 'center', 
          color: '#64748b',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px dashed #e2e8f0'
        }}>
          <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
            Henüz işlem kaydı bulunmuyor
          </p>
          <p style={{ fontSize: '14px' }}>
            Siparişler teslim edildikçe kazançlarınız burada görünecek.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <h3 style={styles.tableTitle}>Son İşlemler</h3>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>İŞLEM ID</th>
            <th style={styles.th}>TARİH</th>
            <th style={styles.th}>AÇIKLAMA</th>
            <th style={styles.thRight}>TUTAR</th>
            <th style={styles.thRight}>DURUM</th>
            <th style={styles.thRight}>İŞLEM</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx, index) => {
            const statusInfo = getStatusStyle(trx.status);
            return (
              <tr key={trx.id} style={styles.tr(index === transactions.length - 1)}>
                <td style={styles.tdId}>{trx.id}</td>
                <td style={styles.tdDate}>{trx.date}</td>
                <td style={styles.tdDescription}>{trx.description}</td>
                <td style={styles.tdAmount(trx.amount.startsWith('-'))}>
                  {trx.amount}
                </td>
                <td style={styles.tdStatus}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.color,
                  }}>
                    {trx.statusLabel || statusInfo.label}
                  </span>
                </td>
                <td style={{ ...styles.tdStatus, textAlign: 'right' }}>
                  <button
                    onClick={() => handleViewInvoice(trx.rawData?.order_id)}
                    disabled={loadingInvoice === trx.rawData?.order_id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: loadingInvoice === trx.rawData?.order_id ? '#e5e7eb' : '#f0fdf4',
                      color: loadingInvoice === trx.rawData?.order_id ? '#9ca3af' : '#15803d',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: loadingInvoice === trx.rawData?.order_id ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (loadingInvoice !== trx.rawData?.order_id) {
                        e.currentTarget.style.backgroundColor = '#dcfce7';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (loadingInvoice !== trx.rawData?.order_id) {
                        e.currentTarget.style.backgroundColor = '#f0fdf4';
                      }
                    }}
                  >
                    {loadingInvoice === trx.rawData?.order_id ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                          <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"/>
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Fatura
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  styles: PropTypes.object.isRequired,
};

export default TransactionTable;
