import React, { useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from '@/lib/apiClient';
import { printInvoice } from '../../Orders/invoiceService';
import { useAuth } from '@/context/AuthContext';

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
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Fatura görüntüleme - sipariş detayını çekip invoice aç
  const handleViewInvoice = async (orderId) => {
    if (!orderId) return;
    
    try {
      setLoadingInvoice(orderId);
      
      // Siparişi backend'den al - Orders sayfasındaki gibi
      const response = await apiClient.get(`/v1/orders?order_id=${orderId}`);
      const orders = response.data?.data?.orders || response.data?.data || [];
      
      if (orders.length === 0) {
        alert('Sipariş bulunamadı');
        return;
      }
      
      // Backend filtreleme yapmıyorsa, frontend'de doğru order'ı bul
      const order = orders.find(o => o.order_id === orderId) || orders[0];
      
      if (order.order_id !== orderId) {
        console.warn(`⚠️ Backend filtreleme yapmadı. İstenen: ${orderId}, Bulunan: ${order.order_id}`);
      }
      
      // Backend'den gelen order zaten doğru formattaysa direkt kullan
      // Orders sayfasındaki gibi
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

  // Modal açma
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Modal kapatma
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
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
            <th style={styles.thRight}>İŞLEMLER</th>
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
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleViewDetails(trx)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Görüntüle
                    </button>
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
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Detay Modalı */}
      {isModalOpen && selectedTransaction && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
              }}>
                İşlem Detayları
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Sipariş Bilgileri */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}>
                  Sipariş Bilgileri
                </h4>
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'grid',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Sipariş No:</span>
                    <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                      {selectedTransaction.rawData?.order_number || '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Sipariş Tarihi:</span>
                    <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                      {selectedTransaction.rawData?.order_date ? formatOrderDate(selectedTransaction.rawData.order_date) : '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Ürün:</span>
                    <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                      {selectedTransaction.rawData?.product_name || '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Adet:</span>
                    <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                      {selectedTransaction.rawData?.product_quantity || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Finansal Detaylar */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}>
                  Finansal Detaylar
                </h4>
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'grid',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Brüt Tutar:</span>
                    <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                      ₺{selectedTransaction.rawData?.gross_amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Komisyon Oranı:</span>
                    <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>
                      %{selectedTransaction.rawData?.commission_rate || '0'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Siteye Ödenen Komisyon:</span>
                    <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>
                      -₺{selectedTransaction.rawData?.commission_amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Stopaj Oranı:</span>
                    <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>
                      %{selectedTransaction.rawData?.withholding_tax_rate || '0'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Ödenmesi Gereken Vergi:</span>
                    <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>
                      -₺{selectedTransaction.rawData?.withholding_tax_amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #e5e7eb' }}>
                    <span style={{ color: '#111827', fontSize: '16px', fontWeight: '700' }}>Net Kazanç:</span>
                    <span style={{ color: '#059669', fontSize: '16px', fontWeight: '700' }}>
                      {selectedTransaction.rawData?.formatted_net_earning || 
                        `₺${selectedTransaction.rawData?.net_earning?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}>
                  Durum
                </h4>
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'grid',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Mevcut Durum:</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: getStatusStyle(selectedTransaction.rawData?.status).bg,
                      color: getStatusStyle(selectedTransaction.rawData?.status).color,
                    }}>
                      {selectedTransaction.rawData?.status_label || getStatusStyle(selectedTransaction.rawData?.status).label}
                    </span>
                  </div>
                  {selectedTransaction.rawData?.available_at && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Çekilebilir Olma Tarihi:</span>
                      <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                        {formatOrderDate(selectedTransaction.rawData.available_at)}
                      </span>
                    </div>
                  )}
                  {selectedTransaction.rawData?.settled_at && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Ödenme Tarihi:</span>
                      <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                        {formatOrderDate(selectedTransaction.rawData.settled_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
