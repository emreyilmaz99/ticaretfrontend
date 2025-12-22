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
      const orderData = response.data.data || response.data;
      
      // Debug: API yanıtını kontrol et
      console.log('Order API response:', orderData);
      
      // API yanıtını invoiceService'in beklediği formata dönüştür
      const order = {
        id: orderData.order_number || orderData.id,
        date: orderData.formatted_date || orderData.created_at,
        vendor: orderData.vendor || {
          name: orderData.store_name || 'Satıcı',
          tax_id: orderData.tax_id || '',
          phone: orderData.vendor_phone || '',
          email: orderData.vendor_email || '',
        },
        customer: orderData.customer || {
          name: orderData.customer_name || orderData.user?.name || 'Müşteri',
          email: orderData.customer_email || orderData.user?.email || '',
          phone: orderData.customer_phone || orderData.user?.phone || '',
        },
        shippingAddress: orderData.shipping_address || orderData.address || '',
        paymentMethod: orderData.payment_method || 'Kredi Kartı',
        products: (orderData.items || orderData.products || []).map(item => ({
          name: item.product_name || item.name || 'Ürün',
          variant: item.variant_name || item.variant || '',
          price: parseFloat(item.unit_price || item.price || 0),
          qty: item.quantity || item.qty || 1,
          financials: item.financials || {
            price_without_tax: parseFloat(item.price_without_tax || item.unit_price || item.price || 0),
            tax_rate: parseFloat(item.tax_rate || 0),
            tax_amount: parseFloat(item.tax_amount || 0),
          }
        })),
        shipping: parseFloat(orderData.shipping_cost || orderData.shipping || 0),
      };
      
      console.log('Transformed order:', order);
      printInvoice(order);
    } catch (error) {
      console.error('Fatura yüklenirken hata:', error);
      alert('Fatura yüklenirken bir hata oluştu.');
    } finally {
      setLoadingInvoice(null);
    }
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
