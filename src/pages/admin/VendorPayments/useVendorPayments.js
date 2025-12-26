// src/pages/admin/VendorPayments/useVendorPayments.js
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { useToast } from '../../../components/common/Toast';
import { 
  getPayouts, 
  updatePayoutStatus,
  approvePayout,
  rejectPayout,
  markPayoutAsProcessed 
} from '../../../features/admin/api/vendorPayoutsApi';

export const useVendorPayments = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch payouts with new API
  const { data: payoutsResponse, isLoading, error } = useQuery({
    queryKey: ['vendor-payouts', currentPage, perPage, statusFilter],
    queryFn: async () => {
      const response = await getPayouts({ 
        page: currentPage, 
        per_page: perPage 
      });
      return response;
    },
    keepPreviousData: true,
  });

  // Approve payout mutation
  const approveMutation = useMutation({
    mutationFn: async (payoutId) => {
      return await approvePayout(payoutId);
    },
    onSuccess: () => {
      toast.success('Başarılı', 'Hakediş onaylandı.');
      queryClient.invalidateQueries(['vendor-payouts']);
    },
    onError: (error) => {
      toast.error('Hata', error?.response?.data?.message || 'Onaylama işlemi başarısız oldu.');
    },
  });

  // Reject payout mutation
  const rejectMutation = useMutation({
    mutationFn: async (payoutId) => {
      return await rejectPayout(payoutId);
    },
    onSuccess: () => {
      toast.success('Başarılı', 'Hakediş reddedildi.');
      queryClient.invalidateQueries(['vendor-payouts']);
    },
    onError: (error) => {
      toast.error('Hata', error?.response?.data?.message || 'Reddetme işlemi başarısız oldu.');
    },
  });

  // Mark as processed mutation
  const markAsProcessedMutation = useMutation({
    mutationFn: async (payoutId) => {
      return await markPayoutAsProcessed(payoutId);
    },
    onSuccess: () => {
      toast.success('Başarılı', 'Hakediş işlendi olarak işaretlendi.');
      queryClient.invalidateQueries(['vendor-payouts']);
    },
    onError: (error) => {
      toast.error('Hata', error?.response?.data?.message || 'İşleme başarısız oldu.');
    },
  });

  // Get raw payouts data
  const rawPayouts = payoutsResponse?.data || [];

  // Filter payouts by search term and status
  const payouts = useMemo(() => {
    let filtered = [...rawPayouts];
    
    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(payout => payout.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(payout => 
        payout.vendor?.name?.toLowerCase().includes(lowerSearch) ||
        payout.vendor?.email?.toLowerCase().includes(lowerSearch) ||
        payout.vendor?.company_name?.toLowerCase().includes(lowerSearch) ||
        payout.reference?.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [rawPayouts, searchTerm, statusFilter]);

  const pagination = payoutsResponse?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  };

  // Calculate stats from payouts
  const stats = useMemo(() => {
    const allPayouts = payoutsResponse?.data || [];
    
    return {
      total_pending_amount: allPayouts
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      total_approved_amount: allPayouts
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      total_processed_amount: allPayouts
        .filter(p => p.status === 'processed')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      pending_count: allPayouts.filter(p => p.status === 'pending').length,
      approved_count: allPayouts.filter(p => p.status === 'approved').length,
      processed_count: allPayouts.filter(p => p.status === 'processed').length,
      total_commission: allPayouts.reduce((sum, p) => sum + parseFloat(p.fee || 0), 0),
    };
  }, [payoutsResponse]);

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      toast.info('Excel Hazırlanıyor', 'Lütfen bekleyin...');
      
      // Prepare CSV data
      const headers = [
        'ID',
        'Satıcı Adı',
        'E-posta',
        'Tutar',
        'Komisyon',
        'Ödeme Yöntemi',
        'Durum',
        'Referans',
        'Oluşturma Tarihi',
        'İşlenme Tarihi',
      ];

      const rows = payouts.map(p => [
        p.id,
        p.vendor?.name || '-',
        p.vendor?.email || '-',
        p.amount,
        p.fee,
        p.method || 'bank_transfer',
        p.status === 'pending' ? 'Beklemede' : 
          p.status === 'approved' ? 'Onaylandı' :
          p.status === 'rejected' ? 'Reddedildi' : 'İşlendi',
        p.reference || '-',
        new Date(p.created_at).toLocaleDateString('tr-TR'),
        p.processed_at ? new Date(p.processed_at).toLocaleDateString('tr-TR') : '-',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `satici-hakedisleri-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Başarılı', 'Excel dosyası indirildi.');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Hata', 'Excel indirilemedi.');
    }
  };

  // Print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Satıcı Hakedişleri Raporu</title>
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
        <h1>💰 Satıcı Hakedişleri Raporu</h1>
        <div class="meta">
          <strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}<br>
          <strong>Toplam Kayıt:</strong> ${payouts.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Satıcı</th>
              <th>Tutar</th>
              <th>Komisyon</th>
              <th>Durum</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            ${payouts.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>
                  <strong>${p.vendor?.name || '-'}</strong><br>
                  <small>${p.vendor?.email || '-'}</small>
                </td>
                <td>₺${parseFloat(p.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                <td>₺${parseFloat(p.fee).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                <td>${p.status === 'pending' ? 'Beklemede' : p.status === 'approved' ? 'Onaylandı' : p.status === 'rejected' ? 'Reddedildi' : 'İşlendi'}</td>
                <td>${new Date(p.created_at).toLocaleDateString('tr-TR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Bu rapor otomatik olarak oluşturulmuştur.</p>
          <p>&copy; ${new Date().getFullYear()} E-Ticaret Platformu - Tüm hakları saklıdır.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return {
    payouts,
    stats,
    pagination,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    isLoading,
    error,
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
    approvePayout: (id) => approveMutation.mutate(id),
    rejectPayout: (id) => rejectMutation.mutate(id),
    markAsProcessed: (id) => markAsProcessedMutation.mutate(id),
    isApproving: approveMutation.isLoading,
    isRejecting: rejectMutation.isLoading,
    isProcessing: markAsProcessedMutation.isLoading,
  };
};
