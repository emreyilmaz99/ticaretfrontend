// src/pages/admin/Applications/PreApplications/index.jsx
import React from 'react';
import { FaFileExcel, FaPrint } from 'react-icons/fa';
import usePreApplications from '../usePreApplications';
import { styles } from '../styles';
import { useToast } from '../../../../components/common/Toast';
import Pagination from '../../../../components/ui/Pagination';
import {
  VendorTable,
  PreApplicationDetailModal,
  RejectModal,
  SearchBar,
  InfoBox
} from '../components';

/**
 * Ön Başvurular Sayfası
 * pre_pending durumundaki satıcıları listeler
 */
const PreApplicationsPage = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const toast = useToast();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const {
    // Data
    vendors,
    allVendors,
    meta,
    isLoading,
    
    // Pagination & Filter
    currentPage,
    setCurrentPage,
    perPage,
    searchTerm,
    setSearchTerm,
    
    // UI State
    hoveredRow,
    setHoveredRow,
    
    // Detail Modal
    selectedVendor,
    isDetailModalOpen,
    activeTab,
    setActiveTab,
    adminNote,
    setAdminNote,
    openDetailModal,
    closeDetailModal,
    
    // Approve
    handleApproveClick,
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
  } = usePreApplications();

  const handleDownloadExcel = () => {
    try {
      toast.info('Excel hazırlanıyor...', 'Lütfen bekleyin.');
      
      const dataToExport = allVendors || vendors || [];
      
      if (dataToExport.length === 0) {
        toast.warning('Veri Yok', 'Dışa aktarılacak başvuru bulunamadı.');
        return;
      }

      const headers = ['ID', 'Ad Soyad', 'E-posta', 'Telefon', 'Şirket', 'Durum', 'Başvuru Tarihi'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(v => [
          v.id,
          `"${v.full_name || ''}"`,
          v.email || '',
          v.phone || '',
          `"${v.company_name || ''}"`,
          v.status || '',
          v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `on-basvurular-${new Date().toISOString().split('T')[0]}.csv`);
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
      
      const dataToExport = allVendors || vendors || [];
      
      if (dataToExport.length === 0) {
        toast.warning('Veri Yok', 'Yazdırılacak başvuru bulunamadı.');
        return;
      }

      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Ön Başvurular Raporu</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #059669; border-bottom: 3px solid #059669; padding-bottom: 10px; margin-bottom: 20px; }
            .meta { margin-bottom: 20px; color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f3f4f6; color: #374151; padding: 12px; text-align: left; border: 1px solid #e5e7eb; font-weight: 600; font-size: 12px; }
            td { padding: 10px; border: 1px solid #e5e7eb; font-size: 13px; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-approved { background: #d1fae5; color: #065f46; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>📋 Ön Başvurular Raporu</h1>
          <div class="meta">
            <strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}<br>
            <strong>Toplam Kayıt:</strong> ${dataToExport.length}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Şirket</th><th>Durum</th><th>Başvuru Tarihi</th>
              </tr>
            </thead>
            <tbody>
              ${dataToExport.map(v => {
                const statusClass = `status-${v.status || 'pending'}`;
                const statusText = v.status === 'pending' ? 'Bekliyor' : 
                                 v.status === 'approved' ? 'Onaylandı' : 
                                 v.status === 'rejected' ? 'Reddedildi' : v.status;
                return `
                  <tr>
                    <td>${v.id}</td>
                    <td><strong>${v.full_name || '-'}</strong></td>
                    <td>${v.email || '-'}</td>
                    <td>${v.phone || '-'}</td>
                    <td>${v.company_name || '-'}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                  </tr>
                `;
              }).join('')}
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
    <div style={{
      ...styles.container,
      padding: isMobile ? '16px' : styles.container.padding
    }}>
      {/* Header */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '16px' : '24px',
        padding: isMobile ? '20px 16px' : styles.header.padding
      }}>
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <h1 style={{
            ...styles.title,
            fontSize: isMobile ? '20px' : styles.title.fontSize
          }}>📋 Ön Başvurular</h1>
          <p style={{
            ...styles.subtitle,
            fontSize: isMobile ? '13px' : styles.subtitle.fontSize
          }}>
            Satıcı olmak için ön başvuru yapan kişileri inceleyin.
            {!isMobile && <br />}
            Onaylanan başvurular tam başvuru formunu doldurmaya yönlendirilir.
          </p>
        </div>
        <div style={{
          ...styles.headerActions,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto',
          gap: isMobile ? '8px' : '12px'
        }}>
          <button style={{
            ...styles.exportBtn,
            width: isMobile ? '100%' : 'auto',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : styles.exportBtn.fontSize,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }} onClick={handlePrint}>
            <FaPrint /> Rapor Yazdır
          </button>
          <button style={{
            ...styles.exportBtn,
            width: isMobile ? '100%' : 'auto',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : styles.exportBtn.fontSize,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* Info Box */}
      <InfoBox 
        count={(allVendors || []).length} 
        message="ön başvuru bekliyor." 
        isMobile={isMobile}
      />

      {/* Search Bar */}
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Mağaza adı, yetkili veya e-posta ara..."
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
        showMerchantType={false}
        emptyMessage="Ön başvuru bekleyen satıcı yok"
        isMobile={isMobile}
      />

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div style={{ marginTop: '16px' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={meta.last_page}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Detail Modal with Tabs */}
      {isDetailModalOpen && selectedVendor && (
        <PreApplicationDetailModal
          vendor={selectedVendor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminNote={adminNote}
          setAdminNote={setAdminNote}
          onClose={closeDetailModal}
          onApprove={() => submitApprove()}
          onReject={handleRejectClick}
          isApproving={isApproving}
          isRejecting={isRejecting}
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
        minLength={5}
      />
    </div>
  );
};

export default PreApplicationsPage;
