// src/pages/admin/Applications/VendorApplications/index.jsx
import React from 'react';
import { FaFileExcel, FaPrint } from 'react-icons/fa';
import useVendorApplications from '../useVendorApplications';
import { styles } from '../styles';
import { useToast } from '../../../../components/common/Toast';
import {
  ApplicationTabs,
  SearchBar,
  VendorTable,
  PreApplicationTable,
  VendorDetailModal,
  PreApplicationDetailModal,
  ApproveModal,
  RejectModal,
  StatCard
} from '../components';

/**
 * Vendor Applications - Birleşik Başvuru Yönetimi
 * Hem Pre Applications hem de Full Applications'u yönetir
 */
const VendorApplicationsPage = () => {
  const toast = useToast();
  
  const {
    // Tab State
    activeTab,
    handleTabChange,
    
    // Data
    applications,
    allApplications,
    vendors,
    allVendors,
    commissionPlans,
    isLoading,
    
    // Stats
    preStats,
    vendorStats,
    
    // Search & Filter
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoveredRow,
    setHoveredRow,
    
    // Selected Items
    selectedApp,
    selectedVendor,
    
    // Detail Modal
    detailModalOpen,
    openDetailModal,
    closeDetailModal,
    
    // Approve Modal
    approveModalOpen,
    selectedCommissionPlan,
    setSelectedCommissionPlan,
    closeApproveModal,
    
    // Pre Application handlers
    handleApprovePreClick,
    submitApprovePre,
    isApprovingPre,
    
    // Vendor handlers
    handleApproveVendorClick,
    submitApproveVendor,
    isApprovingVendor,
    
    // Reject Modal
    rejectModalOpen,
    rejectionReason,
    setRejectionReason,
    closeRejectModal,
    
    // Pre Application reject
    handleRejectPreClick,
    submitRejectPre,
    isRejectingPre,
    
    // Vendor reject
    handleRejectVendorClick,
    submitRejectVendor,
    isRejectingVendor,
  } = useVendorApplications();

  // Email kopyalama
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Kopyalandı', 'E-posta adresi panoya kopyalandı.');
  };

  // Excel İndir
  const handleDownloadExcel = async () => {
    try {
      toast.info('Excel hazırlanıyor...', 'Lütfen bekleyin.');
      
      const dataToExport = activeTab === 'pre' ? allApplications : allVendors;
      
      if (!dataToExport || dataToExport.length === 0) {
        toast.warning('Veri Yok', 'Dışa aktarılacak başvuru bulunamadı.');
        return;
      }

      const headers = activeTab === 'pre' 
        ? ['ID', 'Ad Soyad', 'E-posta', 'Telefon', 'Şirket', 'Durum', 'Başvuru Tarihi']
        : ['ID', 'Mağaza Adı', 'Yetkili', 'E-posta', 'Telefon', 'Ticari Tür', 'Durum', 'Başvuru Tarihi'];

      const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => {
          if (activeTab === 'pre') {
            return [
              item.id,
              `"${item.full_name || ''}"`,
              item.email || '',
              item.phone || '',
              `"${item.company_name || ''}"`,
              item.status || '',
              item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : ''
            ].join(',');
          } else {
            return [
              item.id,
              `"${item.store_name || ''}"`,
              `"${item.full_name || item.owner || ''}"`,
              item.email || '',
              item.phone || '',
              item.merchant_type || '',
              item.status || '',
              item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : ''
            ].join(',');
          }
        })
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const fileName = activeTab === 'pre' 
        ? `on-basvurular-${new Date().toISOString().split('T')[0]}.csv`
        : `aktivasyon-bekleyen-${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
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

  // Rapor Yazdır
  const handlePrint = async () => {
    try {
      toast.info('Yazdırma hazırlanıyor...', 'Lütfen bekleyin.');
      
      const dataToExport = activeTab === 'pre' ? allApplications : allVendors;
      
      if (!dataToExport || dataToExport.length === 0) {
        toast.warning('Veri Yok', 'Yazdırılacak başvuru bulunamadı.');
        return;
      }

      const printWindow = window.open('', '_blank');
      
      const title = activeTab === 'pre' ? 'Ön Başvurular Raporu' : 'Aktivasyon Bekleyen Satıcılar Raporu';
      const statusCounts = activeTab === 'pre' ? {
        total: allApplications.length,
        pending: allApplications.filter(a => a.status === 'pending').length,
        approved: allApplications.filter(a => a.status === 'approved').length,
        rejected: allApplications.filter(a => a.status === 'rejected').length,
      } : null;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              color: #333;
            }
            h1 { 
              color: #059669;
              border-bottom: 3px solid #059669;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .meta {
              margin-bottom: 20px;
              color: #666;
              font-size: 14px;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 24px;
            }
            .stat-card {
              background: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              text-align: center;
            }
            .stat-card .number {
              font-size: 32px;
              font-weight: bold;
              color: #059669;
            }
            .stat-card .label {
              font-size: 14px;
              color: #6b7280;
              margin-top: 8px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 20px;
            }
            th { 
              background-color: #f3f4f6;
              color: #374151;
              padding: 12px;
              text-align: left;
              border: 1px solid #e5e7eb;
              font-weight: 600;
              font-size: 12px;
            }
            td { 
              padding: 10px;
              border: 1px solid #e5e7eb;
              font-size: 13px;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }
            .status-pending {
              background: #fef3c7;
              color: #92400e;
            }
            .status-approved {
              background: #d1fae5;
              color: #065f46;
            }
            .status-rejected {
              background: #fee2e2;
              color: #991b1b;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              button { display: none; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>📋 ${title}</h1>
          <div class="meta">
            <strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}<br>
            <strong>Toplam Kayıt:</strong> ${dataToExport.length}
          </div>
          
          ${activeTab === 'pre' && statusCounts ? `
            <div class="stats">
              <div class="stat-card">
                <div class="number">${statusCounts.total}</div>
                <div class="label">Toplam Başvuru</div>
              </div>
              <div class="stat-card">
                <div class="number">${statusCounts.pending}</div>
                <div class="label">Bekleyen</div>
              </div>
              <div class="stat-card">
                <div class="number">${statusCounts.approved}</div>
                <div class="label">Onaylanan</div>
              </div>
              <div class="stat-card">
                <div class="number">${statusCounts.rejected}</div>
                <div class="label">Reddedilen</div>
              </div>
            </div>
          ` : ''}
          
          <table>
            <thead>
              <tr>
                ${activeTab === 'pre' ? `
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Şirket</th>
                  <th>Durum</th>
                  <th>Başvuru Tarihi</th>
                ` : `
                  <th>ID</th>
                  <th>Mağaza Adı</th>
                  <th>Yetkili</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Ticari Tür</th>
                  <th>Başvuru Tarihi</th>
                `}
              </tr>
            </thead>
            <tbody>
              ${dataToExport.map(item => {
                const statusClass = `status-${item.status || 'pending'}`;
                const statusText = item.status === 'pending' ? 'Bekliyor' : 
                                 item.status === 'approved' ? 'Onaylandı' : 
                                 item.status === 'rejected' ? 'Reddedildi' : item.status;
                
                if (activeTab === 'pre') {
                  return `
                    <tr>
                      <td>${item.id}</td>
                      <td><strong>${item.full_name || '-'}</strong></td>
                      <td>${item.email || '-'}</td>
                      <td>${item.phone || '-'}</td>
                      <td>${item.company_name || '-'}</td>
                      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                      <td>${item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                    </tr>
                  `;
                } else {
                  return `
                    <tr>
                      <td>${item.id}</td>
                      <td><strong>${item.store_name || '-'}</strong></td>
                      <td>${item.full_name || item.owner || '-'}</td>
                      <td>${item.email || '-'}</td>
                      <td>${item.phone || '-'}</td>
                      <td>${item.merchant_type === 'personal' ? 'Bireysel' : item.merchant_type === 'private_company' ? 'Şahıs Şirketi' : item.merchant_type === 'limited_company' ? 'Limited Şirketi' : item.merchant_type || '-'}</td>
                      <td>${item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                    </tr>
                  `;
                }
              }).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Bu rapor otomatik olarak oluşturulmuştur.</p>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Satıcı Başvuruları</h1>
          <p style={styles.subtitle}>
            Ön başvuruları inceleyin ve onaylayın, aktivasyon bekleyen satıcıları aktifleştirin.
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.exportBtn} onClick={handlePrint}>
            <FaPrint /> Rapor Yazdır
          </button>
          <button style={styles.exportBtn} onClick={handleDownloadExcel}>
            <FaFileExcel /> Excel İndir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ApplicationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        preCount={preStats.pending}
        fullCount={vendorStats.total}
      />

      {/* Pre Applications Tab */}
      {activeTab === 'pre' && (
        <>
          {/* Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            {preStats?.map((stat, index) => (
              <StatCard
                key={index}
                {...stat}
                isActive={statusFilter === stat.filter}
                onClick={() => setStatusFilter(stat.filter)}
              />
            ))}
          </div>

          {/* Search */}
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="İsim, e-posta, şirket veya telefon ara..."
          />

          {/* Table */}
          <PreApplicationTable
            applications={applications}
            isLoading={isLoading}
            searchTerm={searchTerm}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            onView={openDetailModal}
            onApprove={handleApprovePreClick}
            onReject={handleRejectPreClick}
            onCopyEmail={handleCopyEmail}
          />
        </>
      )}

      {/* Full Applications Tab */}
      {activeTab === 'full' && (
        <>
          {/* Info */}
          <div style={{ 
            background: '#f0fdf4', 
            padding: '16px 20px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>⏳</span>
            <div style={{ fontSize: '14px', color: '#065f46' }}>
              <strong>Toplam {vendorStats.total} satıcı</strong> aktivasyon bekliyor.
            </div>
          </div>

          {/* Search */}
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="İsim, e-posta, şirket veya telefon ara..."
          />

          {/* Table */}
          <VendorTable
            vendors={vendors}
            isLoading={isLoading}
            searchTerm={searchTerm}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            onView={openDetailModal}
            onApprove={handleApproveVendorClick}
            onReject={handleRejectVendorClick}
            showMerchantType={true}
            emptyMessage="Aktivasyon bekleyen satıcı yok"
          />
        </>
      )}

      {/* Approve Modal - Pre Application */}
      {activeTab === 'pre' && approveModalOpen && selectedApp && (
        <div style={styles.modalOverlay} onClick={closeApproveModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#064e3b'}}>
                ✅ Ön Başvuruyu Onayla
              </h2>
            </div>
            <div style={styles.modalBody}>
              <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#374151' }}>
                <strong>{selectedApp.full_name}</strong> için ön başvuruyu onaylamak üzeresiniz.
              </p>
              <div style={{ 
                background: '#f0fdf4', 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid #d1fae5',
                fontSize: '14px',
                color: '#065f46'
              }}>
                ✓ Satıcı hesabı oluşturulacak<br />
                ✓ Satıcıya e-posta gönderilecek<br />
                ✓ Tam başvuru formu doldurabilecek
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={closeApproveModal} 
                style={{
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: '2px solid #e5e7eb', 
                  background: 'white', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
              >
                İptal
              </button>
              <button 
                onClick={submitApprovePre}
                disabled={isApprovingPre}
                style={{
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  opacity: isApprovingPre ? 0.7 : 1
                }}
              >
                {isApprovingPre ? 'Onaylanıyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal - Vendor (Full Application) */}
      {activeTab === 'full' && (
        <ApproveModal
          isOpen={approveModalOpen}
          vendor={selectedVendor}
          commissionPlans={commissionPlans}
          selectedPlan={selectedCommissionPlan}
          onSelectPlan={setSelectedCommissionPlan}
          onClose={closeApproveModal}
          onSubmit={submitApproveVendor}
          isSubmitting={isApprovingVendor}
        />
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        vendor={activeTab === 'pre' ? selectedApp : selectedVendor}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={closeRejectModal}
        onSubmit={activeTab === 'pre' ? submitRejectPre : submitRejectVendor}
        isSubmitting={activeTab === 'pre' ? isRejectingPre : isRejectingVendor}
        minLength={10}
      />

      {/* Detail Modal - Pre Application */}
      {activeTab === 'pre' && detailModalOpen && selectedApp && (
        <VendorDetailModal
          vendor={selectedApp}
          onClose={closeDetailModal}
          onApprove={() => {
            closeDetailModal();
            handleApprovePreClick(selectedApp);
          }}
          onReject={() => {
            closeDetailModal();
            handleRejectPreClick(selectedApp);
          }}
          showApproveButton={selectedApp.status === 'pending'}
          showRejectButton={selectedApp.status === 'pending'}
        />
      )}

      {/* Detail Modal - Full Application (Vendor) */}
      {activeTab === 'full' && detailModalOpen && selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={closeDetailModal}
          onApprove={() => {
            closeDetailModal();
            handleApproveVendorClick(selectedVendor);
          }}
          onReject={() => {
            closeDetailModal();
            handleRejectVendorClick(selectedVendor);
          }}
          showApproveButton={true}
          showRejectButton={true}
        />
      )}
    </div>
  );
};

export default VendorApplicationsPage;
