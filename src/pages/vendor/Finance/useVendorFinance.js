/**
 * useVendorFinance Hook - Finance sayfası business logic
 */

import { useState, useMemo } from 'react';
import { useToast } from '../../../components/common/Toast';

export const useVendorFinance = () => {
  const toast = useToast();
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

  // Mock data - gerçek uygulamada API'den gelecek
  const [transactions] = useState([
    { 
      id: 'TRX-9876', 
      date: '27 Kas 2025', 
      type: 'payout', 
      description: 'Haftalık Ödeme', 
      amount: '₺12,450.00', 
      status: 'completed' 
    },
    { 
      id: 'TRX-9875', 
      date: '26 Kas 2025', 
      type: 'sale', 
      description: 'Sipariş #1024 Geliri', 
      amount: '₺1,299.00', 
      status: 'completed' 
    },
    { 
      id: 'TRX-9874', 
      date: '25 Kas 2025', 
      type: 'refund', 
      description: 'İade #1019', 
      amount: '-₺450.00', 
      status: 'completed' 
    },
    { 
      id: 'TRX-9873', 
      date: '24 Kas 2025', 
      type: 'sale', 
      description: 'Sipariş #1022 Geliri', 
      amount: '₺3,499.00', 
      status: 'pending' 
    },
  ]);

  const walletData = useMemo(() => ({
    availableBalance: '₺24,850.50',
    pendingAmount: '₺3,499.00',
    pendingDate: 'Gelecek Çarşamba ödenecek',
    totalPaid: '₺148,250',
    growthPercent: '+%12',
  }), []);

  const handleWithdraw = () => {
    // Para çekme işlemi - API call yapılacak
  };

  const handleSettings = () => {
    console.log('handleSettings clicked!');
    setIsAccountSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsAccountSettingsOpen(false);
  };

  const handleSaveSettings = (formData) => {
    // API call yapılacak - örnek:
    // await updateVendorBankDetails(formData);
    console.log('Saving settings:', formData);
    toast.success('Kaydedildi', 'Hesap ayarlarınız başarıyla güncellendi!');
    setIsAccountSettingsOpen(false);
  };

  return {
    transactions,
    walletData,
    handleWithdraw,
    handleSettings,
    isAccountSettingsOpen,
    handleCloseSettings,
    handleSaveSettings,
  };
};

export default useVendorFinance;
