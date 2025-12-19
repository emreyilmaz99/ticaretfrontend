// src/pages/admin/Applications/FullApplications/index.jsx
import React, { useState, useEffect } from 'react';
import { FaFileExcel, FaPrint } from 'react-icons/fa';
import useFullApplications from '../useFullApplications';
import { styles } from '../styles';
import { useToast } from '../../../../components/common/Toast';
import {
  VendorTable,
  VendorDetailModal,
  ApproveModal,
  RejectModal,
  SearchBar,
  InfoBox
} from '../components';

/**
 * Aktivasyon Bekleyen Satıcılar (Full Applications)
 * Tam başvurusunu tamamlamış ve onay bekleyen satıcılar
 */
const FullApplicationsPage = () => {
  const toast = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const {
    // Data
    vendors,
    totalVendors,
    commissionPlans,
    isLoading,
    
    // UI State
    hoveredRow,
    setHoveredRow,
    searchTerm,
    setSearchTerm,
    
    // Selected Vendor
    selectedVendor,
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    handleApproveClick,
    closeApproveModal,
    submitApprove,
    isApproving,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    handleRejectClick,
    closeRejectModal,
    submitReject,
    isRejecting
  } = useFullApplications();

  // Detail modal açık mı kontrolü
  const isDetailModalOpen = selectedVendor && !rejectModalOpen && !approveModalOpen;

  const handleDownloadExcel = () => {
    try {
      toast.info('Excel hazırlanıyor...', 'Lütfen bekleyin.');
      
      if (!vendors || vendors.length === 0) {
        toast.warning('Veri Yok', 'Dışa aktarılacak satıcı bulunamadı.');
        return;
      }

      const headers = ['ID', 'Mağaza Adı', 'Yetkili', 'E-posta', 'Telefon', 'Ticari Tür', 'Durum', 'Başvuru Tarihi'];
      const csvContent = [
        headers.join(','),
        ...vendors.map(v => [
          v.id,
          `"${v.store_name || ''}"`,
          `"${v.full_name || v.owner || ''}"`,
          v.email || '',
          v.phone || '',
          v.merchant_type === 'personal' ? 'Bireysel' : 
          v.merchant_type === 'private_company' ? 'Şahıs Şirketi' : 
          v.merchant_type === 'limited_company' ? 'Limited Şirketi' : v.merchant_type || '',
          v.status || '',
          v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `aktivasyon-bekleyen-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('İndirildi', 'Excel dosyası başarıyla indirildi.');
    } catch (error) {
      console.error('Excel download error:', error);
      toast.error('Hata', 'Excel indirilemedi. Lütfen tekrar deneyin.');
    }
  };

  const handlePrint = () => {
    try {
      toast.info('Yazdırma hazırlanıyor...', 'Lütfen bekleyin.');
      
      if (!vendors || vendors.length === 0) {
        toast.warning('Veri Yok', 'Yazdırılacak satıcı bulunamadı.');
        return;
      }

      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Aktivasyon Bekleyen Satıcılar Raporu</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #059669; border-bottom: 3px solid #059669; padding-bottom: 10px; margin-bottom: 20px; }
            .meta { margin-bottom: 20px; color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f3f4f6; color: #374151; padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600; font-size: 12px; }
            td { padding: 10px; border: 1px solid #e5e7eb; font-size: 13px; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>⏳ Aktivasyon Bekleyen Satıcılar Raporu</h1>
          <div class="meta">
            <strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}<br>
            <strong>Toplam Kayıt:</strong> ${vendors.length}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Mağaza Adı</th><th>Yetkili</th><th>E-posta</th><th>Telefon</th><th>Ticari Tür</th><th>Başvuru Tarihi</th>
              </tr>
            </thead>
            <tbody>
              ${vendors.map(v => `
                <tr>
                  <td>${v.id}</td>
                  <td><strong>${v.store_name || '-'}</strong></td>
                  <td>${v.full_name || v.owner || '-'}</td>
                  <td>${v.email || '-'}</td>
                  <td>${v.phone || '-'}</td>
                  <td>${v.merchant_type === 'personal' ? 'Bireysel' : v.merchant_type === 'private_company' ? 'Şahıs Şirketi' : v.merchant_type === 'limited_company' ? 'Limited Şirketi' : v.merchant_type || '-'}</td>
                  <td>${v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer"><p>Bu rapor otomatik olarak oluşturulmuştur.</p></div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); };</script>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Hata', 'Yazdırma işlemi başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header - Siparişler sayfasındaki gibi */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '16px' : '0'
      }}>
        <div>
          <h1 style={styles.title}>Aktivasyon Bekleyen Satıcılar</h1>
          <p style={styles.subtitle}>
            Tam başvurularını tamamlayan satıcıları inceleyin ve onaylayın.<br />
            Onaylanan satıcılar iyzico'ya kaydedilecek ve aktifleştirilecek.
          </p>
        </div>
        <div style={{
          ...styles.headerActions,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <button style={{
            ...styles.exportBtn,
            width: isMobile ? '100%' : 'auto',
            minHeight: '44px',
            fontSize: isMobile ? '14px' : '15px',
            justifyContent: 'center'
          }} onClick={handlePrint}>
            <FaPrint /> Rapor Yazdır
          </button>
          <button style={{
            ...styles.exportBtn,
            width: isMobile ? '100%' : 'auto',
            minHeight: '44px',
            fontSize: isMobile ? '14px' : '15px',
            justifyContent: 'center'
          }} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* Info Box */}
      <InfoBox count={totalVendors} message="aktivasyon bekliyor." isMobile={isMobile} />

      {/* Search Bar */}
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="İsim, e-posta, şirket veya vergi no ara..."
        isMobile={isMobile}
      />

      {/* Table */}
      <VendorTable
        vendors={vendors}
        isLoading={isLoading}
        searchTerm={searchTerm}
        hoveredRow={hoveredRow}
        setHoveredRow={setHoveredRow}
        onView={openDetailModal}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        showMerchantType={true}
        emptyMessage="Aktivasyon bekleyen satıcı yok"
        isMobile={isMobile}
      />

      {/* Approve Modal - Komisyon Planı Seçimi */}
      <ApproveModal
        isOpen={approveModalOpen}
        vendor={selectedVendor}
        commissionPlans={commissionPlans}
        selectedPlan={selectedCommissionPlan}
        onSelectPlan={setSelectedCommissionPlan}
        onClose={closeApproveModal}
        onSubmit={submitApprove}
        isSubmitting={isApproving}
      />

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={closeDetailModal}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
          showApproveButton={true}
          showRejectButton={true}
        />
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        vendor={selectedVendor}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={closeRejectModal}
        onSubmit={submitReject}
        isSubmitting={isRejecting}
        minLength={10}
        isMobile={isMobile}
      />
    </div>
  );
};

export default FullApplicationsPage;
