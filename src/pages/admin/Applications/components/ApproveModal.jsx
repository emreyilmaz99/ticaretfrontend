// src/pages/admin/Applications/components/ApproveModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaStore, FaPercent, FaStar } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Komisyon planı seçim modalı
 */
const ApproveModal = ({
  isOpen,
  vendor,
  commissionPlans = [],
  selectedPlan,
  onSelectPlan,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !vendor) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{
          ...styles.modalContent,
          maxWidth: isMobile ? '100%' : '700px',
          ...(isMobile && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: '20px 20px 0 0',
            maxHeight: '95vh',
            margin: 0,
            width: '100%',
          })
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          ...styles.modalHeader,
          ...(isMobile && {
            padding: '20px',
            borderBottom: '1px solid #e5e7eb'
          })
        }}>
          <h2 style={{margin: 0, fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#064e3b'}}>
            ✅ Satıcıyı Aktifleştir
          </h2>
          <button 
            onClick={onClose} 
            style={{
              background: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px', 
              borderRadius: '8px',
              color: '#6b7280',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <div style={{
          ...styles.modalBody,
          ...(isMobile && {
            padding: '20px',
            overflowY: 'auto',
            maxHeight: 'calc(95vh - 180px)'
          })
        }}>
          {/* Satıcı Özeti */}
          <div style={{ 
            background: '#f0fdf4', 
            padding: isMobile ? '14px' : '16px', 
            borderRadius: '12px', 
            marginBottom: isMobile ? '20px' : '24px',
            border: '1px solid #d1fae5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px' }}>
              <div style={{...styles.storeIcon, ...(isMobile && {width: '40px', height: '40px'})}}>
                <FaStore size={isMobile ? 18 : 20} />
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{ fontWeight: '700', fontSize: isMobile ? '15px' : '16px', color: '#064e3b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {vendor.company_name || vendor.storeName}
                </div>
                <div style={{ fontSize: isMobile ? '12px' : '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {vendor.full_name || vendor.owner} • {vendor.email}
                </div>
              </div>
            </div>
          </div>

          {/* Komisyon Planı Seçimi */}
          <div>
            <h3 style={{ 
              fontSize: isMobile ? '15px' : '16px', 
              fontWeight: '700', 
              color: '#064e3b', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaPercent size={14} /> Komisyon Planı Seçin
            </h3>
            
            {commissionPlans.length === 0 ? (
              <div style={{ 
                padding: isMobile ? '20px' : '24px', 
                textAlign: 'center', 
                background: '#fef3c7', 
                borderRadius: '12px',
                color: '#92400e',
                fontSize: isMobile ? '13px' : '14px'
              }}>
                Aktif komisyon planı bulunamadı. Lütfen önce bir komisyon planı oluşturun.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '12px' }}>
                {commissionPlans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => onSelectPlan(plan.id)}
                    style={{
                      padding: isMobile ? '14px 16px' : '16px 20px',
                      borderRadius: '12px',
                      border: selectedPlan === plan.id 
                        ? '2px solid #059669' 
                        : '2px solid #e5e7eb',
                      background: selectedPlan === plan.id 
                        ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                        : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      minHeight: '44px',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedPlan === plan.id 
                          ? '6px solid #059669' 
                          : '2px solid #d1d5db',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }} />
                      <div style={{flex: 1, minWidth: 0}}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#064e3b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: isMobile ? '14px' : '15px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{plan.name}</span>
                          {plan.is_default && (
                            <span style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              flexShrink: 0
                            }}>
                              <FaStar size={10} /> Varsayılan
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: isMobile ? '12px' : '13px', color: '#6b7280', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {plan.description || 'Açıklama yok'}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: selectedPlan === plan.id ? '#059669' : '#f3f4f6',
                      color: selectedPlan === plan.id ? 'white' : '#064e3b',
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: isMobile ? '14px' : '15px',
                      minWidth: isMobile ? '70px' : '80px',
                      textAlign: 'center',
                      flexShrink: 0
                    }}>
                      %{parseFloat(plan.rate).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={{
          ...styles.modalFooter,
          ...(isMobile && {
            flexDirection: 'column-reverse',
            padding: '20px',
            gap: '12px',
            borderTop: '1px solid #e5e7eb'
          })
        }}>
          <button 
            onClick={onClose} 
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: '2px solid #e5e7eb', 
              background: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '14px',
              color: '#6b7280',
              minHeight: '44px',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            İptal
          </button>
          <button 
            onClick={onSubmit}
            disabled={!selectedPlan || isSubmitting}
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: !selectedPlan 
                ? '#a7f3d0' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              cursor: !selectedPlan ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '14px',
              boxShadow: selectedPlan ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '44px',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <FaCheck /> {isSubmitting ? 'Onaylanıyor...' : (isMobile ? 'Onayla' : 'Onayla ve Aktifleştir')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
