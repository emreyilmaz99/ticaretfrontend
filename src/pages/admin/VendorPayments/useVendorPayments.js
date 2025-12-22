// src/pages/admin/VendorPayments/useVendorPayments.js
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';
import { useToast } from '../../../components/common/Toast';

export const useVendorPayments = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch payments
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['vendor-payments', statusFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (dateRange.start) {
        params.append('start_date', dateRange.start);
      }
      if (dateRange.end) {
        params.append('end_date', dateRange.end);
      }

      const response = await apiClient.get(`/v1/admin/vendor-payments?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['vendor-payments-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/vendor-payments/stats');
      return response.data;
    },
  });

  // Mark as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async (paymentId) => {
      const response = await apiClient.post(`/v1/admin/vendor-payments/${paymentId}/mark-paid`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Başarılı', 'Ödeme başarıyla işaretlendi.');
      queryClient.invalidateQueries(['vendor-payments']);
      queryClient.invalidateQueries(['vendor-payments-stats']);
    },
    onError: (error) => {
      toast.error('Hata', error?.response?.data?.message || 'Ödeme işaretlenirken hata oluştu.');
    },
  });

  // Filter payments by search term
  const payments = useMemo(() => {
    const allPayments = paymentsData?.data || [];
    
    if (!searchTerm) return allPayments;

    const lowerSearch = searchTerm.toLowerCase();
    return allPayments.filter(payment => 
      payment.vendor_name?.toLowerCase().includes(lowerSearch) ||
      payment.vendor_email?.toLowerCase().includes(lowerSearch)
    );
  }, [paymentsData, searchTerm]);

  const stats = statsData?.data || {
    total_pending_amount: 0,
    total_paid_amount: 0,
    total_vendors: 0,
    pending_payments_count: 0,
    total_commission: 0,
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      toast.info('Excel Hazırlanıyor', 'Lütfen bekleyin...');
      
      // Prepare CSV data
      const headers = [
        'Satıcı Adı',
        'E-posta',
        'Dönem Başlangıç',
        'Dönem Bitiş',
        'Toplam Satış',
        'Komisyon Oranı',
        'Komisyon Tutarı',
        'Net Kazanç',
        'Sipariş Sayısı',
        'Durum',
      ];

      const rows = payments.map(p => [
        p.vendor_name,
        p.vendor_email,
        new Date(p.period_start).toLocaleDateString('tr-TR'),
        new Date(p.period_end).toLocaleDateString('tr-TR'),
        p.total_sales,
        `%${p.commission_rate}`,
        p.commission_amount,
        p.net_amount,
        p.order_count,
        p.status === 'pending' ? 'Beklemede' : p.status === 'paid' ? 'Ödendi' : 'İptal',
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
          <strong>Toplam Kayıt:</strong> ${payments.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>Satıcı</th>
              <th>Dönem</th>
              <th>Toplam Satış</th>
              <th>Komisyon</th>
              <th>Net Kazanç</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(p => `
              <tr>
                <td>
                  <strong>${p.vendor_name}</strong><br>
                  <small>${p.vendor_email}</small>
                </td>
                <td>
                  ${new Date(p.period_start).toLocaleDateString('tr-TR')}<br>
                  ${new Date(p.period_end).toLocaleDateString('tr-TR')}
                </td>
                <td>${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.total_sales)}</td>
                <td>
                  ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.commission_amount)}<br>
                  <small>(%${p.commission_rate})</small>
                </td>
                <td><strong>${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.net_amount)}</strong></td>
                <td>${p.status === 'pending' ? 'Beklemede' : p.status === 'paid' ? 'Ödendi' : 'İptal'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Bu rapor otomatik olarak oluşturulmuştur.
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
    markAsPaid: (id) => markAsPaidMutation.mutate(id),
  };
};
