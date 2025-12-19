import React, { useState, useEffect } from 'react';
import { FaStore, FaPlus, FaFileExcel, FaPrint } from 'react-icons/fa';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ActiveVendorList from '../../features/vendor/components/ActiveVendorList';
import { getVendors } from '../../features/vendor/api/vendorApi';
import { useToast } from '../../components/common/Toast';
import AddVendorModal from '../../features/vendor/components/AddVendorModal';

const ActiveVendorsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Export için tüm aktif satıcıları çeken query - daha küçük per_page ile
  const { refetch: fetchAllVendors } = useQuery({
    queryKey: ['all-active-vendors-export'],
    queryFn: async () => {
      // Tüm sayfaları çekmek için önce ilk sayfayı al
      const firstPage = await getVendors({ status: 'active', per_page: 50, page: 1 });
      const totalPages = firstPage.data?.meta?.last_page || 1;
      
      let allVendors = firstPage.data?.data || [];
      
      // Eğer birden fazla sayfa varsa, diğerlerini de çek
      if (totalPages > 1) {
        const promises = [];
        for (let page = 2; page <= Math.min(totalPages, 20); page++) { // Max 20 sayfa (1000 satıcı)
          promises.push(getVendors({ status: 'active', per_page: 50, page }));
        }
        const results = await Promise.all(promises);
        results.forEach(res => {
          allVendors = [...allVendors, ...(res.data?.data || [])];
        });
      }
      
      return allVendors;
    },
    enabled: false,
    retry: 1,
  });

  const handleDownloadExcel = async () => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      toast.info('Excel hazırlanıyor...', 'Lütfen bekleyin.');
      
      // API'den veri çek
      const result = await fetchAllVendors();
      const vendors = result.data || [];
      
      console.log('Excel - API Result:', result);
      console.log('Excel - Vendors:', vendors);

      if (!vendors || vendors.length === 0) {
        toast.warning('Veri Yok', 'Aktif satıcı bulunamadı.');
        return;
      }

      // Excel için CSV formatında veri hazırla
      const headers = ['ID', 'Mağaza Adı', 'Yetkili', 'E-posta', 'Telefon', 'Durum', 'Kayıt Tarihi'];
      const csvContent = [
        headers.join(','),
        ...vendors.map(v => [
          v.id,
          `"${(v.store_name || '').replace(/"/g, '""')}"`,
          `"${(v.full_name || v.owner || '').replace(/"/g, '""')}"`,
          v.email || '',
          v.phone || '',
          v.status || '',
          v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : ''
        ].join(','))
      ].join('\n');

      // BOM ekle (Excel'de Türkçe karakterler için)
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `aktif-saticilar-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('İndirildi', 'Excel dosyası başarıyla indirildi.');
    } catch (error) {
      console.error('Excel download error:', error);
      toast.error('Hata', 'Excel indirilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      toast.info('Yazdırma hazırlanıyor...', 'Lütfen bekleyin.');
      
      // API'den veri çek
      const result = await fetchAllVendors();
      const vendors = result.data || [];
      
      console.log('Print - API Result:', result);
      console.log('Print - Vendors:', vendors);

      if (!vendors || vendors.length === 0) {
        toast.warning('Veri Yok', 'Aktif satıcı bulunamadı.');
        return;
      }

      // Yeni pencere aç ve yazdırma formatı oluştur
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Aktif Satıcılar Raporu</title>
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
            }
            td { 
              padding: 10px;
              border: 1px solid #e5e7eb;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb;
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
            }
          </style>
        </head>
        <body>
          <h1>🏪 Aktif Satıcılar Raporu</h1>
          <div class="meta">
            <strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}<br>
            <strong>Toplam Satıcı:</strong> ${vendors.length}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mağaza Adı</th>
                <th>Yetkili</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>Kayıt Tarihi</th>
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
                  <td>${v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                </tr>
              `).join('')}
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
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{...styles.container, padding: isMobile ? '16px' : '32px'}}>
      {/* Header - Siparişler sayfasındaki gibi */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '16px' : '0',
        padding: isMobile ? '20px 16px' : '28px 32px'
      }}>
        <div>
          <h1 style={{...styles.title, fontSize: isMobile ? '22px' : '26px'}}>Satıcılar</h1>
          <p style={styles.subtitle}>Platformdaki aktif mağazaları buradan yönetebilirsiniz.</p>
        </div>
        <div style={{
          ...styles.headerActions,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <button 
            style={{
              ...styles.exportBtn,
              width: isMobile ? '100%' : 'auto',
              minHeight: '44px',
              fontSize: isMobile ? '14px' : '14px',
              justifyContent: 'center',
              opacity: isExporting ? 0.6 : 1,
              cursor: isExporting ? 'wait' : 'pointer'
            }} 
            onClick={handlePrint}
            disabled={isExporting}
          >
            <FaPrint /> {isExporting ? 'Hazırlanıyor...' : 'Rapor Yazdır'}
          </button>
          <button 
            style={{
              ...styles.exportBtn,
              width: isMobile ? '100%' : 'auto',
              minHeight: '44px',
              fontSize: isMobile ? '14px' : '14px',
              justifyContent: 'center',
              opacity: isExporting ? 0.6 : 1,
              cursor: isExporting ? 'wait' : 'pointer'
            }} 
            onClick={handleDownloadExcel}
            disabled={isExporting}
          >
            <FaFileExcel /> {isExporting ? 'Hazırlanıyor...' : 'Excel İndir'}
          </button>
          <button style={{
            ...styles.addBtn,
            width: isMobile ? '100%' : 'auto',
            minHeight: '44px',
            fontSize: isMobile ? '15px' : '14px',
            justifyContent: 'center'
          }} onClick={() => setIsAddModalOpen(true)}>
            <FaPlus /> Yeni Satıcı Ekle
          </button>
        </div>
      </div>

      <ActiveVendorList isMobile={isMobile} />

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <AddVendorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: '#ffffff',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginTop: '6px',
    margin: '6px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgb(255, 255, 255)',
    border: '1px solid rgb(229, 231, 235)',
    borderRadius: '10px',
    color: 'rgb(17, 24, 39)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
  },
};

export default ActiveVendorsPage;
