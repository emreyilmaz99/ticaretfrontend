// src/pages/admin/Reviews/index.jsx
import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaFileExcel, FaPrint,
  FaComments, FaClock, FaCheck, FaTimes, FaTrash,
  FaStar, FaEye, FaStore, FaUser, FaBox, FaBan,
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle
} from 'react-icons/fa';

import { useReviewsPage } from './useReviewsPage';
import ReviewDetailModal from './ReviewDetailModal';
import RejectReviewModal from './RejectReviewModal';
import BannedWordsTab from './BannedWordsTab';
import Pagination from '../../../components/ui/Pagination';
import { getStyles } from './styles';
import { useToast } from '../../../components/common/Toast';

const ReviewsPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const styles = getStyles(isMobile);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'banned-words'

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    // Data
    reviews,
    pagination,
    stats,
    isLoading,
    isLoadingStats,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    currentPage,
    setCurrentPage,
    
    // Selection
    selectedReviews,
    toggleSelectAll,
    toggleSelect,
    
    // Actions
    handleApprove,
    handleReject,
    handleBulkApprove,
    handleBulkReject,
    
    // Modals
    viewReview,
    setViewReview,
    rejectModal,
    setRejectModal,
    rejectionReason,
    setRejectionReason,
    handleRejectSubmit,
    
    // Mutations
    isApproving,
    isRejecting,
  } = useReviewsPage();

  // Excel indirme
  const handleDownloadExcel = () => {
    if (reviews.length === 0) {
      toast.error('İndirilecek veri bulunamadı');
      return;
    }
    const headers = ["ID", "Kullanici", "Urun", "Satici", "Puan", "Yorum", "Durum", "Tarih"];
    const rows = reviews.map(review => [
      review.id,
      `"${review.user?.name || 'Anonim'}"`,
      `"${review.product?.name || '-'}"`,
      `"${review.product?.vendor?.name || '-'}"`,
      review.rating,
      `"${(review.comment || '').replace(/"/g, '""').substring(0, 100)}"`,
      review.status,
      new Date(review.created_at).toLocaleDateString('tr-TR')
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Yorumlar_${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${reviews.length} yorum Excel dosyası olarak indirildi`);
  };

  // Yazdırma
  const handlePrint = () => {
    if (reviews.length === 0) {
      toast.error('Yazdırılacak veri yok');
      return;
    }
    const printWindow = window.open('', '_blank', 'width=900,height=600');
    const printContent = `
      <html><head><title>Yorum Listesi</title>
      <style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ddd;padding:10px;text-align:left;font-size:12px;} th{background-color:#f4f4f4;}</style>
      </head><body><h2>Yorum Listesi</h2><table><thead><tr><th>Kullanıcı</th><th>Ürün</th><th>Puan</th><th>Durum</th><th>Tarih</th></tr></thead>
      <tbody>${reviews.map(r => `<tr><td>${r.user?.name || 'Anonim'}</td><td>${r.product?.name || '-'}</td><td>${r.rating}/5</td><td>${r.status}</td><td>${new Date(r.created_at).toLocaleDateString('tr-TR')}</td></tr>`).join('')}</tbody></table>
      <script>window.onload=function(){window.print();}</script></body></html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success('Yazdırma penceresi açıldı');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Beklemede', color: '#f59e0b', bg: '#fef3c7', icon: <FaClock size={12} /> },
      approved: { text: 'Onaylandı', color: '#10b981', bg: '#d1fae5', icon: <FaCheck size={12} /> },
      rejected: { text: 'Reddedildi', color: '#ef4444', bg: '#fee2e2', icon: <FaTimes size={12} /> },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{ ...styles.statusBadge, backgroundColor: config.bg, color: config.color }}>
        {config.icon}
        <span>{config.text}</span>
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={14}
            color={star <= rating ? '#f59e0b' : '#e5e7eb'}
          />
        ))}
        <span style={styles.ratingText}>{rating}/5</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : styles.header.flexDirection,
        gap: isMobile ? '16px' : '0'
      }}>
        <div style={styles.titleGroup}>
          <h1 style={{
            ...styles.title,
            fontSize: isMobile ? '24px' : styles.title.fontSize
          }}>Değerlendirme & Yorum Yönetimi</h1>
          <p style={{
            ...styles.subtitle,
            fontSize: isMobile ? '13px' : styles.subtitle.fontSize
          }}>Kullanıcı yorumlarını inceleyin, onaylayın veya reddedin. Yasaklı kelimeleri yönetin.</p>
        </div>
        <div style={{
          ...styles.headerActions,
          width: isMobile ? '100%' : 'auto'
        }}>
          <button style={{
            ...styles.exportBtn,
            width: isMobile ? '100%' : 'auto',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : styles.exportBtn.fontSize
          }} onClick={handlePrint}>
            <FaPrint /> Yazdır
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        ...styles.tabsContainer,
        gap: isMobile ? '8px' : styles.tabsContainer.gap
      }}>
        <button
          style={{
            ...(activeTab === 'reviews' ? styles.tabActive : styles.tab),
            flex: isMobile ? '1' : 'none',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : (activeTab === 'reviews' ? styles.tabActive.fontSize : styles.tab.fontSize)
          }}
          onClick={() => setActiveTab('reviews')}
        >
          <FaComments /> {isMobile ? 'Yorumlar' : 'Yorumlar'}
        </button>
        <button
          style={{
            ...(activeTab === 'banned-words' ? styles.tabActive : styles.tab),
            flex: isMobile ? '1' : 'none',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : (activeTab === 'banned-words' ? styles.tabActive.fontSize : styles.tab.fontSize)
          }}
          onClick={() => setActiveTab('banned-words')}
        >
          <FaBan /> {isMobile ? 'Yasaklı' : 'Yasaklı Kelimeler'}
        </button>
      </div>

      {activeTab === 'reviews' ? (
        <>
          {/* Stats Cards */}
          <div style={{
            ...styles.statsGrid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : styles.statsGrid.gridTemplateColumns,
            gap: isMobile ? '12px' : styles.statsGrid.gap
          }}>
            <div 
              style={{ 
                ...styles.statCard, 
                cursor: 'pointer', 
                border: statusFilter === '' ? '2px solid #059669' : '1px solid #e5e7eb',
                padding: isMobile ? '14px' : styles.statCard.padding
              }}
              onClick={() => setStatusFilter('')}
            >
              <div style={styles.statInfo}>
                <span style={{
                  ...styles.statLabel,
                  fontSize: isMobile ? '11px' : styles.statLabel.fontSize
                }}>Toplam Yorum</span>
                <span style={{
                  ...styles.statValue,
                  fontSize: isMobile ? '20px' : styles.statValue.fontSize
                }}>{stats.total || 0}</span>
              </div>
              <div style={{ 
                ...styles.statIconBox, 
                backgroundColor: '#e0e7ff', 
                color: '#4f46e5',
                width: isMobile ? '40px' : styles.statIconBox.width,
                height: isMobile ? '40px' : styles.statIconBox.height
              }}>
                <FaComments size={isMobile ? 16 : 20} />
              </div>
            </div>
            <div 
              style={{ 
                ...styles.statCard, 
                cursor: 'pointer', 
                border: statusFilter === 'pending' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                padding: isMobile ? '14px' : styles.statCard.padding
              }}
              onClick={() => setStatusFilter('pending')}
            >
              <div style={styles.statInfo}>
                <span style={{
                  ...styles.statLabel,
                  fontSize: isMobile ? '11px' : styles.statLabel.fontSize
                }}>Bekleyen</span>
                <span style={{
                  ...styles.statValue,
                  fontSize: isMobile ? '20px' : styles.statValue.fontSize
                }}>{stats.pending || 0}</span>
              </div>
              <div style={{ 
                ...styles.statIconBox, 
                backgroundColor: '#fef3c7', 
                color: '#f59e0b',
                width: isMobile ? '40px' : styles.statIconBox.width,
                height: isMobile ? '40px' : styles.statIconBox.height
              }}>
                <FaClock size={isMobile ? 16 : 20} />
              </div>
            </div>
            <div 
              style={{ 
                ...styles.statCard, 
                cursor: 'pointer', 
                border: statusFilter === 'approved' ? '2px solid #10b981' : '1px solid #e5e7eb',
                padding: isMobile ? '14px' : styles.statCard.padding
              }}
              onClick={() => setStatusFilter('approved')}
            >
              <div style={styles.statInfo}>
                <span style={{
                  ...styles.statLabel,
                  fontSize: isMobile ? '11px' : styles.statLabel.fontSize
                }}>Onaylanan</span>
                <span style={{
                  ...styles.statValue,
                  fontSize: isMobile ? '20px' : styles.statValue.fontSize
                }}>{stats.approved || 0}</span>
              </div>
              <div style={{ 
                ...styles.statIconBox, 
                backgroundColor: '#d1fae5', 
                color: '#10b981',
                width: isMobile ? '40px' : styles.statIconBox.width,
                height: isMobile ? '40px' : styles.statIconBox.height
              }}>
                <FaCheckCircle size={isMobile ? 16 : 20} />
              </div>
            </div>
            <div 
              style={{ 
                ...styles.statCard, 
                cursor: 'pointer', 
                border: statusFilter === 'rejected' ? '2px solid #ef4444' : '1px solid #e5e7eb',
                padding: isMobile ? '14px' : styles.statCard.padding
              }}
              onClick={() => setStatusFilter('rejected')}
            >
              <div style={styles.statInfo}>
                <span style={{
                  ...styles.statLabel,
                  fontSize: isMobile ? '11px' : styles.statLabel.fontSize
                }}>Reddedilen</span>
                <span style={{
                  ...styles.statValue,
                  fontSize: isMobile ? '20px' : styles.statValue.fontSize
                }}>{stats.rejected || 0}</span>
              </div>
              <div style={{ 
                ...styles.statIconBox, 
                backgroundColor: '#fee2e2', 
                color: '#ef4444',
                width: isMobile ? '40px' : styles.statIconBox.width,
                height: isMobile ? '40px' : styles.statIconBox.height
              }}>
                <FaTimesCircle size={isMobile ? 16 : 20} />
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div style={{
            ...styles.toolbar,
            flexDirection: isMobile ? 'column' : styles.toolbar.flexDirection,
            gap: isMobile ? '12px' : '0'
          }}>
            <div style={{
              ...styles.toolbarLeft,
              flexDirection: isMobile ? 'column' : styles.toolbarLeft.flexDirection,
              width: isMobile ? '100%' : 'auto',
              gap: isMobile ? '12px' : styles.toolbarLeft.gap
            }}>
              <div style={{
                ...styles.searchWrapper,
                width: isMobile ? '100%' : 'auto'
              }}>
                <FaSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={isMobile ? "Ara..." : "Yorum, kullanıcı veya ürün ara..."}
                  style={{
                    ...styles.searchInput,
                    minHeight: isMobile ? '44px' : 'auto',
                    fontSize: isMobile ? '16px' : styles.searchInput.fontSize
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                style={{
                  ...styles.filterSelect,
                  width: isMobile ? '100%' : 'auto',
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.filterSelect.fontSize
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
              <select
                style={{
                  ...styles.filterSelect,
                  width: isMobile ? '100%' : 'auto',
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.filterSelect.fontSize
                }}
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">Tüm Puanlar</option>
                <option value="5">5 Yıldız</option>
                <option value="4">4 Yıldız</option>
                <option value="3">3 Yıldız</option>
                <option value="2">2 Yıldız</option>
                <option value="1">1 Yıldız</option>
              </select>
            </div>
            
            {selectedReviews.length > 0 && (
              <div style={{
                ...styles.bulkActions,
                flexDirection: isMobile ? 'column' : styles.bulkActions.flexDirection,
                width: isMobile ? '100%' : 'auto',
                gap: isMobile ? '8px' : styles.bulkActions.gap
              }}>
                <span style={{
                  ...styles.selectedCount,
                  fontSize: isMobile ? '13px' : styles.selectedCount.fontSize
                }}>{selectedReviews.length} seçili</span>
                <button
                  style={{
                    ...styles.bulkApproveBtn,
                    flex: isMobile ? '1' : 'none',
                    minHeight: isMobile ? '44px' : 'auto',
                    fontSize: isMobile ? '14px' : styles.bulkApproveBtn.fontSize
                  }}
                  onClick={handleBulkApprove}
                  disabled={isApproving}
                >
                  <FaCheck /> Toplu Onayla
                </button>
                <button
                  style={{
                    ...styles.bulkRejectBtn,
                    flex: isMobile ? '1' : 'none',
                    minHeight: isMobile ? '44px' : 'auto',
                    fontSize: isMobile ? '14px' : styles.bulkRejectBtn.fontSize
                  }}
                  onClick={() => setRejectModal({ isOpen: true, isBulk: true })}
                  disabled={isRejecting}
                >
                  <FaTimes /> Toplu Reddet
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          {isMobile ? (
            // Mobile Card View
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', backgroundColor: 'white', borderRadius: '12px' }}>
                  <div style={styles.loader}></div>
                  Yorumlar yükleniyor...
                </div>
              ) : reviews.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280', backgroundColor: 'white', borderRadius: '12px' }}>
                  <FaComments size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                  <p>Henüz yorum bulunmuyor.</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div 
                    key={review.id} 
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      border: selectedReviews.includes(review.id) ? '2px solid #059669' : '1px solid #e5e7eb'
                    }}
                  >
                    {/* Header with checkbox and status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => toggleSelect(review.id)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                          #{review.id}
                        </span>
                      </label>
                      {getStatusBadge(review.status)}
                    </div>

                    {/* User Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaUser size={18} color="#4f46e5" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                          {review.is_anonymous ? 'Anonim Kullanıcı' : review.user?.name || 'Bilinmiyor'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {review.user?.email || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Product & Vendor */}
                    <div style={{ marginBottom: '12px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <FaBox size={12} style={{ color: '#6b7280' }} />
                        <span style={{ color: '#374151', fontWeight: '500' }}>
                          {review.product?.name?.substring(0, 40) || '-'}
                          {review.product?.name?.length > 40 ? '...' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaStore size={12} style={{ color: '#059669' }} />
                        <span style={{ color: '#6B7280' }}>
                          {review.product?.vendor?.name || review.product?.vendor?.company_name || '-'}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div style={{ marginBottom: '12px' }}>
                      {renderStars(review.rating)}
                    </div>

                    {/* Comment */}
                    <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#111827', marginBottom: '4px' }}>
                        {review.title || 'Başlıksız'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                        {review.comment?.substring(0, 100) || '-'}
                        {review.comment?.length > 100 ? '...' : ''}
                      </div>
                      {review.media?.length > 0 && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669' }}>
                          📷 {review.media.length} görsel
                        </div>
                      )}
                    </div>

                    {/* Rejection Reason */}
                    {review.status === 'rejected' && review.rejection_reason && (
                      <div style={{ 
                        marginBottom: '12px', 
                        padding: '8px 12px', 
                        backgroundColor: '#fee2e2', 
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FaExclamationTriangle size={12} />
                        <span>{review.rejection_reason}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
                      {new Date(review.created_at).toLocaleDateString('tr-TR')} {' '}
                      {new Date(review.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          flex: 1,
                          minHeight: '44px',
                          padding: '0 16px',
                          backgroundColor: '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onClick={() => setViewReview(review)}
                      >
                        <FaEye /> Detay
                      </button>
                      {review.status !== 'approved' && (
                        <button
                          style={{
                            flex: 1,
                            minHeight: '44px',
                            padding: '0 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            opacity: isApproving ? 0.6 : 1
                          }}
                          onClick={() => handleApprove(review.id)}
                          disabled={isApproving}
                        >
                          <FaCheck /> Onayla
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button
                          style={{
                            flex: 1,
                            minHeight: '44px',
                            padding: '0 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            opacity: isRejecting ? 0.6 : 1
                          }}
                          onClick={() => setRejectModal({ isOpen: true, reviewId: review.id, isBulk: false })}
                          disabled={isRejecting}
                        >
                          <FaTimes /> Reddet
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Desktop Table View
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={selectedReviews.length === reviews.length && reviews.length > 0}
                      onChange={toggleSelectAll}
                      style={styles.checkbox}
                    />
                  </th>
                  <th style={styles.th}>Kullanıcı</th>
                  <th style={styles.th}>Ürün</th>
                  <th style={styles.th}>Satıcı</th>
                  <th style={styles.th}>Puan</th>
                  <th style={styles.th}>Yorum</th>
                  <th style={styles.th}>Durum</th>
                  <th style={styles.th}>Tarih</th>
                  <th style={styles.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="9" style={styles.loadingCell}>
                      <div style={styles.loader}></div>
                      Yorumlar yükleniyor...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={styles.emptyCell}>
                      <FaComments size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                      <p>Henüz yorum bulunmuyor.</p>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} style={styles.tr}>
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => toggleSelect(review.id)}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.userAvatar}>
                            <FaUser size={14} />
                          </div>
                          <div>
                            <div style={styles.userName}>
                              {review.is_anonymous ? 'Anonim Kullanıcı' : review.user?.name || 'Bilinmiyor'}
                            </div>
                            <div style={styles.userEmail}>{review.user?.email || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <FaBox size={12} style={{ color: '#6b7280', marginRight: '8px' }} />
                          <span style={styles.productName}>
                            {review.product?.name?.substring(0, 30) || '-'}
                            {review.product?.name?.length > 30 ? '...' : ''}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.vendorCell}>
                          <FaStore size={12} style={{ color: '#059669', marginRight: '8px' }} />
                          <span>{review.product?.vendor?.name || review.product?.vendor?.company_name || '-'}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {renderStars(review.rating)}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.commentCell}>
                          <div style={styles.commentTitle}>{review.title || 'Başlıksız'}</div>
                          <div style={styles.commentText}>
                            {review.comment?.substring(0, 80) || '-'}
                            {review.comment?.length > 80 ? '...' : ''}
                          </div>
                          {review.media?.length > 0 && (
                            <div style={styles.mediaIndicator}>
                              📷 {review.media.length} görsel
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {getStatusBadge(review.status)}
                        {review.status === 'rejected' && review.rejection_reason && (
                          <div style={styles.rejectionReason} title={review.rejection_reason}>
                            <FaExclamationTriangle size={10} /> {review.rejection_reason.substring(0, 20)}...
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          {new Date(review.created_at).toLocaleDateString('tr-TR')}
                        </div>
                        <div style={styles.timeCell}>
                          {new Date(review.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => setViewReview(review)}
                            title="Detay Görüntüle"
                          >
                            <FaEye />
                          </button>
                          {review.status !== 'approved' && (
                            <button
                              style={styles.approveBtn}
                              onClick={() => handleApprove(review.id)}
                              disabled={isApproving}
                              title="Onayla"
                            >
                              <FaCheck />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              style={styles.rejectBtn}
                              onClick={() => setRejectModal({ isOpen: true, reviewId: review.id, isBulk: false })}
                              disabled={isRejecting}
                              title="Reddet"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div style={{ marginTop: '24px' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.last_page}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <BannedWordsTab styles={styles} />
      )}

      {/* Review Detail Modal */}
      {viewReview && (
        <ReviewDetailModal
          review={viewReview}
          onClose={() => setViewReview(null)}
          onApprove={() => {
            handleApprove(viewReview.id);
            setViewReview(null);
          }}
          onReject={() => {
            setRejectModal({ isOpen: true, reviewId: viewReview.id, isBulk: false });
            setViewReview(null);
          }}
          styles={styles}
        />
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <RejectReviewModal
          isBulk={rejectModal.isBulk}
          count={rejectModal.isBulk ? selectedReviews.length : 1}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onSubmit={handleRejectSubmit}
          onClose={() => {
            setRejectModal({ isOpen: false, reviewId: null, isBulk: false });
            setRejectionReason('');
          }}
          isLoading={isRejecting}
          styles={styles}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
