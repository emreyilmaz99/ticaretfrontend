// src/pages/admin/VendorPayments/PaymentDetailModal.jsx
import React from 'react';
import { 
  FaTimes, FaStore, FaCalendar, FaReceipt, FaMoneyBillWave,
  FaPercentage, FaShoppingCart, FaInfoCircle, FaCheck
} from 'react-icons/fa';

const PaymentDetailModal = ({ payment, isOpen, onClose, onMarkAsPaid, isMobile }) => {
  if (!isOpen || !payment) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY' 
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '16px' : '24px',
      backdropFilter: 'blur(4px)',
    },

    modal: {
      backgroundColor: 'white',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '700px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },

    header: {
      padding: isMobile ? '20px' : '28px',
      borderBottom: '2px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    },

    headerLeft: {
      flex: 1,
    },

    title: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },

    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
    },

    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0,
    },

    body: {
      padding: isMobile ? '20px' : '28px',
      overflowY: 'auto',
      flex: 1,
    },

    section: {
      marginBottom: '28px',
    },

    sectionTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },

    infoGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '16px',
    },

    infoItem: {
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },

    infoLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },

    infoValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
    },

    breakdown: {
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
    },

    breakdownRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e2e8f0',
    },

    breakdownLabel: {
      fontSize: '14px',
      color: '#475569',
      fontWeight: '500',
    },

    breakdownValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
    },

    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0 0 0',
      marginTop: '8px',
    },

    totalLabel: {
      fontSize: '16px',
      color: '#059669',
      fontWeight: '700',
    },

    totalValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#059669',
    },

    footer: {
      padding: isMobile ? '16px 20px' : '20px 28px',
      borderTop: '2px solid #e2e8f0',
      display: 'flex',
      gap: '12px',
      backgroundColor: '#f8fafc',
    },

    cancelBtn: {
      flex: 1,
      padding: '14px',
      borderRadius: '10px',
      border: '1.5px solid #e2e8f0',
      backgroundColor: 'white',
      color: '#475569',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },

    confirmBtn: {
      flex: 1,
      padding: '14px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#059669',
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },

    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
    },
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { text: 'Ödeme Bekliyor', color: '#f59e0b', bg: '#fef3c7' },
      paid: { text: 'Ödendi', color: '#059669', bg: '#d1fae5' },
      cancelled: { text: 'İptal Edildi', color: '#dc2626', bg: '#fee2e2' },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(payment.status);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h2 style={styles.title}>
              <FaReceipt size={24} color="#059669" />
              Hakediş Detayları
            </h2>
            <p style={styles.subtitle}>ID: #{payment.id}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <FaTimes size={16} />
          </button>
        </div>

        <div style={styles.body}>
          {/* Vendor Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaStore size={14} />
              Satıcı Bilgileri
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Mağaza Adı</div>
                <div style={styles.infoValue}>{payment.vendor_name}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>E-posta</div>
                <div style={styles.infoValue}>{payment.vendor_email}</div>
              </div>
            </div>
          </div>

          {/* Period Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaCalendar size={14} />
              Dönem Bilgileri
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Başlangıç</div>
                <div style={styles.infoValue}>{formatDate(payment.period_start)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Bitiş</div>
                <div style={styles.infoValue}>{formatDate(payment.period_end)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <FaShoppingCart size={12} />
                  Sipariş Sayısı
                </div>
                <div style={styles.infoValue}>{payment.order_count} adet</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Durum</div>
                <span 
                  style={{
                    ...styles.statusBadge,
                    color: statusConfig.color,
                    backgroundColor: statusConfig.bg,
                  }}
                >
                  {statusConfig.text}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaMoneyBillWave size={14} />
              Ödeme Detayı
            </div>
            <div style={styles.breakdown}>
              <div style={styles.breakdownRow}>
                <div style={styles.breakdownLabel}>Toplam Satış Tutarı</div>
                <div style={styles.breakdownValue}>{formatCurrency(payment.total_sales)}</div>
              </div>
              <div style={styles.breakdownRow}>
                <div style={styles.breakdownLabel}>
                  Komisyon Kesintisi ({payment.commission_rate}%)
                </div>
                <div style={{ ...styles.breakdownValue, color: '#dc2626' }}>
                  -{formatCurrency(payment.commission_amount)}
                </div>
              </div>
              <div style={styles.totalRow}>
                <div style={styles.totalLabel}>Net Kazanç (Ödenecek Tutar)</div>
                <div style={styles.totalValue}>{formatCurrency(payment.net_amount)}</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {payment.notes && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <FaInfoCircle size={14} />
                Notlar
              </div>
              <div style={{
                ...styles.infoItem,
                gridColumn: '1 / -1',
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                  {payment.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Kapat
          </button>
          {payment.status === 'pending' && (
            <button 
              style={styles.confirmBtn}
              onClick={() => {
                onMarkAsPaid(payment.id);
                onClose();
              }}
            >
              <FaCheck size={16} />
              Ödendi İşaretle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
