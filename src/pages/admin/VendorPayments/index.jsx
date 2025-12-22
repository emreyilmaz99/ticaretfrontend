// src/pages/admin/VendorPayments/index.jsx
import React, { useState } from 'react';
import { 
  FaWallet, FaStore, FaCalendar, FaFilter, FaFileExcel, 
  FaPrint, FaEye, FaCheck, FaTimes, FaChartLine,
  FaMoneyBillWave, FaPercentage, FaReceipt, FaClock
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../../components/admin/PageHeader';
import { getStyles } from './styles';
import { useVendorPayments } from './useVendorPayments';
import PaymentDetailModal from './PaymentDetailModal';
import PaymentStatsCards from './PaymentStatsCards';

const VendorPayments = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const styles = getStyles(isMobile);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const {
    payments,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    selectedVendor,
    setSelectedVendor,
    handleExportExcel,
    handlePrint,
    markAsPaid,
  } = useVendorPayments();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleViewDetail = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Ödeme Bekliyor', color: '#f59e0b', bg: '#fef3c7' },
      paid: { text: 'Ödendi', color: '#059669', bg: '#d1fae5' },
      cancelled: { text: 'İptal Edildi', color: '#dc2626', bg: '#fee2e2' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{
        ...styles.statusBadge,
        color: config.color,
        backgroundColor: config.bg,
      }}>
        {config.text}
      </span>
    );
  };

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

  return (
    <div style={styles.container}>
      
      {/* Page Header */}
      <PageHeader
        title="Satıcı Hakedişleri"
        subtitle="Satıcıların kazançlarını, komisyon kesintilerini ve ödeme durumlarını görüntüleyin"
        icon={FaWallet}
        isMobile={isMobile}
        action={
          <div style={styles.headerActions}>
            <button 
              style={styles.exportBtn}
              onClick={handleExportExcel}
              disabled={isLoading}
            >
              <FaFileExcel size={16} />
              {!isMobile && 'Excel İndir'}
            </button>
            <button 
              style={styles.exportBtn}
              onClick={handlePrint}
              disabled={isLoading}
            >
              <FaPrint size={16} />
              {!isMobile && 'Yazdır'}
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <PaymentStatsCards stats={stats} isMobile={isMobile} />

      {/* Filters Section */}
      <div style={styles.filtersCard}>
        <div style={styles.filtersHeader}>
          <div style={styles.searchWrapper}>
            <FaStore style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Satıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button
            style={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={14} />
            {!isMobile && (showFilters ? 'Filtreleri Gizle' : 'Gelişmiş Filtreler')}
          </button>
        </div>

        {showFilters && (
          <div style={styles.advancedFilters}>
            <div style={styles.filterRow}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Durum</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">Tümü</option>
                  <option value="pending">Ödeme Bekliyor</option>
                  <option value="paid">Ödendi</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  style={styles.filterSelect}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Bitiş Tarihi</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  style={styles.filterSelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <div style={styles.tableCard}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Hakedişler yükleniyor...</p>
          </div>
        ) : !payments || payments.length === 0 ? (
          <div style={styles.emptyState}>
            <FaWallet size={48} color="#cbd5e1" />
            <h3 style={styles.emptyTitle}>Hakediş Bulunamadı</h3>
            <p style={styles.emptyText}>
              Seçilen kriterlere uygun hakediş kaydı bulunmamaktadır.
            </p>
          </div>
        ) : (
          <>
            {isMobile ? (
              // Mobile Card View
              <div style={styles.mobileCardsContainer}>
                {payments.map((payment) => (
                  <div key={payment.id} style={styles.mobileCard}>
                    <div style={styles.mobileCardHeader}>
                      <div style={styles.vendorInfo}>
                        <FaStore size={20} color="#059669" />
                        <div>
                          <h4 style={styles.vendorName}>{payment.vendor_name}</h4>
                          <p style={styles.vendorEmail}>{payment.vendor_email}</p>
                        </div>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div style={styles.mobileCardBody}>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaReceipt size={12} /> Toplam Satış
                        </span>
                        <span style={styles.mobileValue}>
                          {formatCurrency(payment.total_sales)}
                        </span>
                      </div>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaPercentage size={12} /> Komisyon ({payment.commission_rate}%)
                        </span>
                        <span style={{ ...styles.mobileValue, color: '#dc2626' }}>
                          -{formatCurrency(payment.commission_amount)}
                        </span>
                      </div>
                      <div style={styles.mobileDivider}></div>
                      <div style={styles.mobileRow}>
                        <span style={{ ...styles.mobileLabel, fontWeight: '600', color: '#059669' }}>
                          <FaMoneyBillWave size={12} /> Net Kazanç
                        </span>
                        <span style={{ ...styles.mobileValue, fontWeight: '700', fontSize: '18px', color: '#059669' }}>
                          {formatCurrency(payment.net_amount)}
                        </span>
                      </div>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaCalendar size={12} /> Dönem
                        </span>
                        <span style={styles.mobileValue}>
                          {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.mobileCardFooter}>
                      <button
                        style={styles.viewDetailBtn}
                        onClick={() => handleViewDetail(payment)}
                      >
                        <FaEye size={14} />
                        Detayları Gör
                      </button>
                      {payment.status === 'pending' && (
                        <button
                          style={styles.markPaidBtn}
                          onClick={() => markAsPaid(payment.id)}
                        >
                          <FaCheck size={14} />
                          Ödendi İşaretle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Table View
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Satıcı</th>
                      <th style={styles.th}>Dönem</th>
                      <th style={styles.th}>Toplam Satış</th>
                      <th style={styles.th}>Komisyon</th>
                      <th style={styles.th}>Net Kazanç</th>
                      <th style={styles.th}>Durum</th>
                      <th style={styles.th}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.vendorCell}>
                            <div style={styles.vendorAvatar}>
                              <FaStore size={16} />
                            </div>
                            <div>
                              <div style={styles.vendorNameTable}>{payment.vendor_name}</div>
                              <div style={styles.vendorEmailTable}>{payment.vendor_email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.dateCell}>
                            <FaCalendar size={12} color="#64748b" />
                            <span style={styles.dateText}>
                              {formatDate(payment.period_start)}
                              <br />
                              {formatDate(payment.period_end)}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.amountCell}>
                            <span style={styles.amountValue}>
                              {formatCurrency(payment.total_sales)}
                            </span>
                            <span style={styles.amountLabel}>
                              {payment.order_count} sipariş
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.commissionCell}>
                            <span style={styles.commissionValue}>
                              -{formatCurrency(payment.commission_amount)}
                            </span>
                            <span style={styles.commissionLabel}>
                              %{payment.commission_rate}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.netAmountCell}>
                            {formatCurrency(payment.net_amount)}
                          </div>
                        </td>
                        <td style={styles.td}>
                          {getStatusBadge(payment.status)}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              style={styles.actionBtn}
                              onClick={() => handleViewDetail(payment)}
                              title="Detayları Görüntüle"
                            >
                              <FaEye size={14} />
                            </button>
                            {payment.status === 'pending' && (
                              <button
                                style={{ ...styles.actionBtn, backgroundColor: '#d1fae5', color: '#059669' }}
                                onClick={() => markAsPaid(payment.id)}
                                title="Ödendi İşaretle"
                              >
                                <FaCheck size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onMarkAsPaid={markAsPaid}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default VendorPayments;
