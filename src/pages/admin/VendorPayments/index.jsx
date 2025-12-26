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
    payouts,
    stats,
    pagination,
    currentPage,
    setCurrentPage,
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
    approvePayout,
    rejectPayout,
    markAsProcessed,
    isApproving,
    isRejecting,
    isProcessing,
  } = useVendorPayments();

  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleViewDetail = (payout) => {
    setSelectedPayout(payout);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayout(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Beklemede', color: '#f59e0b', bg: '#fef3c7' },
      approved: { text: 'Onaylandı', color: '#3b82f6', bg: '#dbeafe' },
      rejected: { text: 'Reddedildi', color: '#dc2626', bg: '#fee2e2' },
      processed: { text: 'İşlendi', color: '#059669', bg: '#d1fae5' },
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
                  <option value="pending">Beklemede</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                  <option value="processed">İşlendi</option>
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
        ) : !payouts || payouts.length === 0 ? (
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
                {payouts.map((payout) => (
                  <div key={payout.id} style={styles.mobileCard}>
                    <div style={styles.mobileCardHeader}>
                      <div style={styles.vendorInfo}>
                        <FaStore size={20} color="#059669" />
                        <div>
                          <h4 style={styles.vendorName}>{payout.vendor?.name || '-'}</h4>
                          <p style={styles.vendorEmail}>{payout.vendor?.email || '-'}</p>
                        </div>
                      </div>
                      {getStatusBadge(payout.status)}
                    </div>

                    <div style={styles.mobileCardBody}>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaMoneyBillWave size={12} /> Tutar
                        </span>
                        <span style={styles.mobileValue}>
                          {formatCurrency(payout.amount)}
                        </span>
                      </div>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaPercentage size={12} /> Komisyon
                        </span>
                        <span style={{ ...styles.mobileValue, color: '#dc2626' }}>
                          -{formatCurrency(payout.fee)}
                        </span>
                      </div>
                      <div style={styles.mobileDivider}></div>
                      <div style={styles.mobileRow}>
                        <span style={{ ...styles.mobileLabel, fontWeight: '600', color: '#059669' }}>
                          <FaReceipt size={12} /> Net Tutar
                        </span>
                        <span style={{ ...styles.mobileValue, fontWeight: '700', fontSize: '18px', color: '#059669' }}>
                          {formatCurrency(parseFloat(payout.amount) - parseFloat(payout.fee))}
                        </span>
                      </div>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaCalendar size={12} /> Ödeme Yöntemi
                        </span>
                        <span style={styles.mobileValue}>
                          {payout.method === 'bank_transfer' ? 'Banka Transferi' : payout.method}
                        </span>
                      </div>
                      <div style={styles.mobileRow}>
                        <span style={styles.mobileLabel}>
                          <FaClock size={12} /> Oluşturulma
                        </span>
                        <span style={styles.mobileValue}>
                          {formatDate(payout.created_at)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.mobileCardFooter}>
                      <button
                        style={styles.viewDetailBtn}
                        onClick={() => handleViewDetail(payout)}
                      >
                        <FaEye size={14} />
                        Detayları Gör
                      </button>
                      {payout.status === 'pending' && (
                        <>
                          <button
                            style={styles.markPaidBtn}
                            onClick={() => approvePayout(payout.id)}
                            disabled={isApproving}
                          >
                            <FaCheck size={14} />
                            Onayla
                          </button>
                          <button
                            style={{ ...styles.markPaidBtn, backgroundColor: '#fee2e2', color: '#dc2626' }}
                            onClick={() => rejectPayout(payout.id)}
                            disabled={isRejecting}
                          >
                            <FaTimes size={14} />
                            Reddet
                          </button>
                        </>
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
                      <th style={styles.th}>Tutar</th>
                      <th style={styles.th}>Komisyon</th>
                      <th style={styles.th}>Net Kazanç</th>
                      <th style={styles.th}>Yöntem</th>
                      <th style={styles.th}>Durum</th>
                      <th style={styles.th}>Tarih</th>
                      <th style={styles.th}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.vendorCell}>
                            <div style={styles.vendorAvatar}>
                              <FaStore size={16} />
                            </div>
                            <div>
                              <div style={styles.vendorNameTable}>{payout.vendor?.name || '-'}</div>
                              <div style={styles.vendorEmailTable}>{payout.vendor?.email || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.amountCell}>
                            <span style={styles.amountValue}>
                              {formatCurrency(payout.amount)}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.commissionCell}>
                            <span style={styles.commissionValue}>
                              -{formatCurrency(payout.fee)}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.netAmountCell}>
                            {formatCurrency(parseFloat(payout.amount) - parseFloat(payout.fee))}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.methodBadge}>
                            {payout.method === 'bank_transfer' ? 'Banka Transferi' : payout.method}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {getStatusBadge(payout.status)}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.dateCell}>
                            <FaCalendar size={12} color="#64748b" />
                            <span style={styles.dateText}>
                              {formatDate(payout.created_at)}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              style={styles.actionBtn}
                              onClick={() => handleViewDetail(payout)}
                              title="Detayları Görüntüle"
                            >
                              <FaEye size={14} />
                            </button>
                            {payout.status === 'pending' && (
                              <>
                                <button
                                  style={{ ...styles.actionBtn, backgroundColor: '#d1fae5', color: '#059669' }}
                                  onClick={() => approvePayout(payout.id)}
                                  title="Onayla"
                                  disabled={isApproving}
                                >
                                  <FaCheck size={14} />
                                </button>
                                <button
                                  style={{ ...styles.actionBtn, backgroundColor: '#fee2e2', color: '#dc2626' }}
                                  onClick={() => rejectPayout(payout.id)}
                                  title="Reddet"
                                  disabled={isRejecting}
                                >
                                  <FaTimes size={14} />
                                </button>
                              </>
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
      {isModalOpen && selectedPayout && (
        <PaymentDetailModal
          payout={selectedPayout}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApprove={approvePayout}
          onReject={rejectPayout}
          onMarkAsProcessed={markAsProcessed}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default VendorPayments;
