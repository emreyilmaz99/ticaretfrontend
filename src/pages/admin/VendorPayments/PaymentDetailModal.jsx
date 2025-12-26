// src/pages/admin/VendorPayments/PaymentDetailModal.jsx
import React from 'react';
import { 
  FaTimes, FaStore, FaCalendar, FaReceipt, FaMoneyBillWave,
  FaPercentage, FaShoppingCart, FaInfoCircle, FaCheck
} from 'react-icons/fa';

const PaymentDetailModal = ({ payout, isOpen, onClose, onApprove, onReject, onMarkAsProcessed, isMobile }) => {
  if (!isOpen || !payout) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY' 
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      pending: { text: 'Beklemede', color: '#f59e0b', bg: '#fef3c7' },
      approved: { text: 'Onaylandı', color: '#3b82f6', bg: '#dbeafe' },
      rejected: { text: 'Reddedildi', color: '#dc2626', bg: '#fee2e2' },
      processed: { text: 'İşlendi', color: '#059669', bg: '#d1fae5' },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(payout.status);
  const netAmount = parseFloat(payout.amount) - parseFloat(payout.fee);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h2 style={styles.title}>
              <FaReceipt size={24} color="#059669" />
              Hakediş Detayları
            </h2>
            <p style={styles.subtitle}>ID: #{payout.id} • Referans: {payout.reference || '-'}</p>
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
                <div style={styles.infoValue}>{payout.vendor?.name || '-'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>E-posta</div>
                <div style={styles.infoValue}>{payout.vendor?.email || '-'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Şirket Adı</div>
                <div style={styles.infoValue}>{payout.vendor?.company_name || '-'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Telefon</div>
                <div style={styles.infoValue}>{payout.vendor?.phone || '-'}</div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaCalendar size={14} />
              Hakediş Bilgileri
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Ödeme Yöntemi</div>
                <div style={styles.infoValue}>
                  {payout.method === 'bank_transfer' ? 'Banka Transferi' : payout.method}
                </div>
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
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Oluşturulma Tarihi</div>
                <div style={styles.infoValue}>{formatDate(payout.created_at)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>İşlenme Tarihi</div>
                <div style={styles.infoValue}>{formatDate(payout.processed_at)}</div>
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
                <div style={styles.breakdownLabel}>Toplam Tutar</div>
                <div style={styles.breakdownValue}>{formatCurrency(payout.amount)}</div>
              </div>
              <div style={styles.breakdownRow}>
                <div style={styles.breakdownLabel}>
                  Komisyon Kesintisi
                </div>
                <div style={{ ...styles.breakdownValue, color: '#dc2626' }}>
                  -{formatCurrency(payout.fee)}
                </div>
              </div>
              <div style={styles.totalRow}>
                <div style={styles.totalLabel}>Net Kazanç (Ödenecek Tutar)</div>
                <div style={styles.totalValue}>{formatCurrency(netAmount)}</div>
              </div>
            </div>
          </div>

          {/* Vendor Balance Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaInfoCircle size={14} />
              Satıcı Bakiye Bilgisi
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Mevcut Bakiye</div>
                <div style={styles.infoValue}>{formatCurrency(payout.vendor?.balance || 0)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Komisyon Planı</div>
                <div style={styles.infoValue}>Plan #{payout.vendor?.commission_plan_id || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Kapat
          </button>
          {payout.status === 'pending' && (
            <>
              <button 
                style={{ ...styles.confirmBtn, backgroundColor: '#dc2626' }}
                onClick={() => {
                  onReject(payout.id);
                  onClose();
                }}
              >
                <FaTimes size={16} />
                Reddet
              </button>
              <button 
                style={styles.confirmBtn}
                onClick={() => {
                  onApprove(payout.id);
                  onClose();
                }}
              >
                <FaCheck size={16} />
                Onayla
              </button>
            </>
          )}
          {payout.status === 'approved' && (
            <button 
              style={{ ...styles.confirmBtn, backgroundColor: '#3b82f6' }}
              onClick={() => {
                onMarkAsProcessed(payout.id);
                onClose();
              }}
            >
              <FaCheck size={16} />
              İşlendi Olarak İşaretle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
