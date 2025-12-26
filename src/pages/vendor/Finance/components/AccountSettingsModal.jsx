import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaUniversity, FaSave, FaEdit } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModalOverlay } from '../../../../components/modals/shared';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { getVendorProfile } from '@/features/vendor/api/vendorAuthApi';

/**
 * AccountSettingsModal - Satıcı hesap ayarları modal
 * API entegrasyonlu dinamik banka hesap yönetimi
 */
const AccountSettingsModal = ({ isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Form verileri
  const [formData, setFormData] = useState({
    bank_name: '',
    account_holder_name: '',
    iban: '',
    branch_name: '',
    account_type: 'Ticari Hesap',
    swift_code: '',
  });

  // Banka hesap bilgilerini çek
  const { data: bankAccountsData, isLoading } = useQuery({
    queryKey: ['vendor-bank-accounts'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/vendor/bank-accounts');
      return response.data;
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Vendor profil bilgilerini çek
  const { data: vendorProfileData } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: getVendorProfile,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Banka hesabı güncelleme mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const bankAccountId = bankAccountsData?.data?.accounts?.[0]?.id;
      
      // Backend'in beklediği field adlarına dönüştür
      const payload = {
        bank_name: data.bank_name,
        account_holder: data.account_holder_name, // Backend account_holder bekliyor
        iban: data.iban,
        branch_name: data.branch_name,
        account_type: data.account_type,
        swift_code: data.swift_code,
      };
      
      if (bankAccountId) {
        // Mevcut hesabı güncelle
        const response = await apiClient.put(`/v1/vendor/bank-accounts/${bankAccountId}`, payload);
        return response.data;
      } else {
        // Yeni hesap oluştur
        const response = await apiClient.post('/v1/vendor/bank-accounts', payload);
        return response.data;
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(['vendor-bank-accounts']);
      setIsEditing(false);
      onSave?.(response);
      alert(response.message || 'Hesap bilgileri başarıyla güncellendi');
    },
    onError: (error) => {
      console.error('Hesap güncellenirken hata:', error);
      alert(error.response?.data?.message || 'Hesap güncellenirken bir hata oluştu');
    },
  });

  // Backend'den veri geldiğinde form'u doldur
  useEffect(() => {
    if (bankAccountsData?.data?.accounts?.[0]) {
      const account = bankAccountsData.data.accounts[0];
      const vendorData = vendorProfileData?.data?.vendor || vendorProfileData?.data;
      
      setFormData({
        bank_name: account.bank_name || account.bankName || '',
        account_holder_name: account.account_holder || 
                            account.account_holder_name || 
                            account.holder_name || 
                            account.accountHolderName ||
                            account.accountHolder ||
                            vendorData?.business_name ||
                            vendorData?.shop_name ||
                            user?.name || '',
        iban: account.iban || account.IBAN || '',
        branch_name: account.branch_name || account.branch || account.branchName || '',
        account_type: account.account_type || account.accountType || 'Ticari Hesap',
        swift_code: account.swift_code || account.swift || account.swiftCode || '',
      });
    }
  }, [bankAccountsData, vendorProfileData, user]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    // Validasyon
    if (!formData.iban || !formData.account_holder_name || !formData.bank_name) {
      alert('Lütfen zorunlu alanları doldurun (IBAN, Hesap Sahibi, Banka Adı)');
      return;
    }

    // IBAN formatı kontrolü (basit)
    if (!formData.iban.startsWith('TR')) {
      alert('IBAN Türkiye için TR ile başlamalıdır');
      return;
    }

    updateMutation.mutate(formData);
  }, [formData, updateMutation]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Önceki verileri geri yükle
    if (bankAccountsData?.data?.accounts?.[0]) {
      const account = bankAccountsData.data.accounts[0];
      setFormData({
        bank_name: account.bank_name || '',
        account_holder_name: account.account_holder_name || '',
        iban: account.iban || '',
        branch_name: account.branch_name || '',
        account_type: account.account_type || 'Ticari Hesap',
        swift_code: account.swift_code || '',
      });
    }
  }, [bankAccountsData]);

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              <FaUniversity size={24} color="#059669" />
            </div>
            <div>
              <h2 style={styles.title}>Hesap Ayarları</h2>
              <p style={styles.subtitle}>Banka ve ödeme bilgilerinizi yönetin</p>
            </div>
          </div>
          
          <button
            style={{
              ...styles.closeButton,
              ...(closeHovered ? styles.closeButtonHover : {}),
            }}
            onClick={onClose}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #059669',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Yükleniyor...</p>
            </div>
          ) : (
            <>
              {/* Banka Bilgileri */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Banka Bilgileri</h3>
                
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Banka Adı *</label>
                    {isEditing ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={formData.bank_name}
                        onChange={(e) => handleInputChange('bank_name', e.target.value)}
                        placeholder="Örn: Ziraat Bankası"
                      />
                    ) : (
                      <p style={styles.value}>{formData.bank_name || '-'}</p>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Şube</label>
                    {isEditing ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={formData.branch_name}
                        onChange={(e) => handleInputChange('branch_name', e.target.value)}
                        placeholder="Örn: Kadıköy Şubesi"
                      />
                    ) : (
                      <p style={styles.value}>{formData.branch_name || '-'}</p>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hesap Sahibi *</label>
                    {isEditing ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={formData.account_holder_name}
                        onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                        placeholder="Ad Soyad veya Şirket Adı"
                      />
                    ) : (
                      <p style={styles.value}>{formData.account_holder_name || '-'}</p>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hesap Türü</label>
                    {isEditing ? (
                      <select
                        style={styles.input}
                        value={formData.account_type}
                        onChange={(e) => handleInputChange('account_type', e.target.value)}
                      >
                        <option value="Ticari Hesap">Ticari Hesap</option>
                        <option value="Bireysel Hesap">Bireysel Hesap</option>
                      </select>
                    ) : (
                      <p style={styles.value}>{formData.account_type || '-'}</p>
                    )}
                  </div>

                  <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>IBAN *</label>
                    {isEditing ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={formData.iban}
                        onChange={(e) => handleInputChange('iban', e.target.value.toUpperCase().replace(/\s/g, ''))}
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                        maxLength={26}
                      />
                    ) : (
                      <p style={styles.valueIban}>{formData.iban || '-'}</p>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>SWIFT Kodu</label>
                    {isEditing ? (
                      <input
                        type="text"
                        style={styles.input}
                        value={formData.swift_code}
                        onChange={(e) => handleInputChange('swift_code', e.target.value.toUpperCase())}
                        placeholder="TCZBTR2A"
                      />
                    ) : (
                      <p style={styles.value}>{formData.swift_code || '-'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Kullanıcı Bilgileri */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Satıcı Bilgileri</h3>
                
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>E-posta</label>
                    <p style={styles.value}>
                      {vendorProfileData?.data?.vendor?.email || 
                       vendorProfileData?.data?.email ||
                       bankAccountsData?.data?.vendor?.email || 
                       user?.email || 
                       user?.user?.email || 
                       '-'}
                    </p>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Telefon</label>
                    <p style={styles.value}>
                      {vendorProfileData?.data?.vendor?.phone || 
                       vendorProfileData?.data?.phone ||
                       bankAccountsData?.data?.vendor?.phone || 
                       user?.phone || 
                       user?.user?.phone || 
                       '-'}
                    </p>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Şirket/Mağaza</label>
                    <p style={styles.value}>
                      {vendorProfileData?.data?.vendor?.shop_name || 
                       vendorProfileData?.data?.vendor?.business_name ||
                       vendorProfileData?.data?.shop_name ||
                       vendorProfileData?.data?.business_name ||
                       bankAccountsData?.data?.vendor?.shop_name || 
                       bankAccountsData?.data?.vendor?.business_name || 
                       user?.shop_name || 
                       user?.business_name || 
                       user?.name || 
                       user?.user?.name || 
                       '-'}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px', fontStyle: 'italic' }}>
                  * Kullanıcı bilgilerinizi değiştirmek için Profil Ayarları sayfasını kullanın.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          {isEditing ? (
            <>
              <button 
                style={styles.cancelButton} 
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                İptal
              </button>
              <button
                style={{
                  ...styles.saveButton,
                  ...(saveHovered ? styles.saveButtonHover : {}),
                  ...(updateMutation.isPending ? { opacity: 0.6, cursor: 'wait' } : {}),
                }}
                onClick={handleSave}
                onMouseEnter={() => setSaveHovered(true)}
                onMouseLeave={() => setSaveHovered(false)}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      marginRight: '8px',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <FaSave style={{ marginRight: '8px' }} />
                    Kaydet
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              style={{
                ...styles.editButton,
                ...(editHovered ? styles.editButtonHover : {}),
              }}
              onClick={() => setIsEditing(true)}
              onMouseEnter={() => setEditHovered(true)}
              onMouseLeave={() => setEditHovered(false)}
              disabled={isLoading}
            >
              <FaEdit style={{ marginRight: '8px' }} />
              Düzenle
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

AccountSettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const styles = {
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    width: '95%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalSlideUp 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 32px 24px 32px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#d1fae5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },

  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },

  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: '18px',
    transition: 'all 0.2s ease',
  },

  closeButtonHover: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    transform: 'scale(1.05)',
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },

  section: {
    marginBottom: '32px',
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #059669',
    display: 'inline-block',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  value: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1e293b',
    padding: '12px 0',
  },

  valueIban: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#059669',
    padding: '12px 0',
    letterSpacing: '1px',
    fontFamily: 'monospace',
  },

  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },

  footer: {
    padding: '24px 32px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },

  editButton: {
    padding: '12px 32px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },

  editButtonHover: {
    backgroundColor: '#047857',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
  },

  cancelButton: {
    padding: '12px 32px',
    backgroundColor: '#fff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  saveButton: {
    padding: '12px 32px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },

  saveButtonHover: {
    backgroundColor: '#047857',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
  },
};

// CSS animasyonları için global style
if (typeof document !== 'undefined' && !document.getElementById('account-settings-animations')) {
  const style = document.createElement('style');
  style.id = 'account-settings-animations';
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

export default AccountSettingsModal;
