import React from 'react';
import { FaClipboardList, FaFileExcel, FaPrint } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import VendorList from '../../features/vendor/components/VendorList';
import { getVendors } from '../../features/vendor/api/vendorApi';
import { useToast } from '../../components/common/Toast';

const VendorsPage = () => {
  const toast = useToast();

  const handleDownloadExcel = async () => {
    try {
      toast.info('Excel hazırlanıyor...', 'Lütfen bekleyin.');
      
      // Tüm satıcıları çek
      const response = await getVendors({ per_page: 1000 });
      const vendors = response.data?.data || [];

      if (vendors.length === 0) {
        toast.warning('Veri Yok', 'Dışa aktarılacak satıcı bulunamadı.');
        return;
      }

      // CSV formatında hazırla
      const headers = ['ID', 'Mağaza Adı', 'Yetkili', 'E-posta', 'Telefon', 'Durum', 'Kayıt Tarihi'];
      const csvContent = [
        headers.join(','),
        ...vendors.map(v => [
          v.id,
          `"${v.store_name || ''}"`,
          `"${v.full_name || v.owner || ''}"`,
          v.email || '',
          v.phone || '',
          v.status === 'active' ? 'Aktif' : 
          v.status === 'inactive' ? 'Pasif' : 
          v.status === 'pending' ? 'Bekliyor' : 
          v.status === 'rejected' ? 'Reddedildi' : 
          v.status === 'banned' ? 'Yasaklı' : v.status || '',
          v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : ''
        ].join(','))
      ].join('\n');

      // BOM ekle ve indir
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `satici-basvurulari-${new Date().toISOString().split('T')[0]}.csv`);
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

  const handlePrint = async () => {
    try {
      toast.info('Yazdırma hazırlanıyor...', 'Lütfen bekleyin.');
      
      // Tüm satıcıları çek
      const response = await getVendors({ per_page: 1000 });
      const vendors = response.data?.data || [];

      if (vendors.length === 0) {
        toast.warning('Veri Yok', 'Yazdırılacak satıcı bulunamadı.');
        return;
      }

      // Durum istatistikleri
      const stats = {
        total: vendors.length,
        active: vendors.filter(v => v.status === 'active').length,
        pending: vendors.filter(v => v.status === 'pending').length,
        inactive: vendors.filter(v => v.status === 'inactive').length,
        rejected: vendors.filter(v => v.status === 'rejected').length,
        banned: vendors.filter(v => v.status === 'banned').length,
      };

      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Satıcı Başvuruları Raporu</title>
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
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
              font-size: 28px;
              font-weight: bold;
              color: #059669;
            }
            .stat-card .label {
              font-size: 12px;
              color: #6b7280;
              margin-top: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
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
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              display: inline-block;
            }
            .status-active {
              background: #d1fae5;
              color: #065f46;
            }
            .status-pending {
              background: #fef3c7;
              color: #92400e;
            }
            .status-inactive {
              background: #e5e7eb;
              color: #374151;
            }
            .status-rejected {
              background: #fee2e2;
              color: #991b1b;
            }
            .status-banned {
              background: #fecaca;
              color: #7f1d1d;
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
          <h1>📋 Satıcı Başvuruları Raporu</h1>
          <div class="meta">
            <strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}<br>
            <strong>Toplam Kayıt:</strong> ${vendors.length}
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="number">${stats.total}</div>
              <div class="label">Toplam</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.active}</div>
              <div class="label">Aktif</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.pending}</div>
              <div class="label">Bekleyen</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.inactive}</div>
              <div class="label">Pasif</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.rejected}</div>
              <div class="label">Reddedilen</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.banned}</div>
              <div class="label">Yasaklı</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mağaza Adı</th>
                <th>Yetkili</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>Durum</th>
                <th>Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              ${vendors.map(v => {
                const statusClass = `status-${v.status || 'pending'}`;
                const statusText = 
                  v.status === 'active' ? 'Aktif' :
                  v.status === 'pending' ? 'Bekliyor' :
                  v.status === 'inactive' ? 'Pasif' :
                  v.status === 'rejected' ? 'Reddedildi' :
                  v.status === 'banned' ? 'Yasaklı' : v.status;
                
                return `
                  <tr>
                    <td>${v.id}</td>
                    <td><strong>${v.store_name || '-'}</strong></td>
                    <td>${v.full_name || v.owner || '-'}</td>
                    <td>${v.email || '-'}</td>
                    <td>${v.phone || '-'}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${v.created_at ? new Date(v.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                  </tr>
                `;
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
      {/* Header - Siparişler sayfasındaki gibi */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Satıcı Başvuruları</h1>
          <p style={styles.subtitle}>Platformdaki tüm mağaza başvurularını buradan yönetebilirsiniz.</p>
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

      <VendorList />
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
    background: 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'rgb(15, 23, 42)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgb(100, 116, 139)',
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
};

export default VendorsPage;
