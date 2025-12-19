// src/pages/admin/Applications/components/PreApplicationDetailModal.jsx
import React from 'react';
import { 
  FaTimes, FaUser, FaMapMarkerAlt, FaUniversity, FaStore, 
  FaCalendarAlt, FaInstagram, FaGlobe, FaFilePdf, FaExternalLinkAlt
} from 'react-icons/fa';
import { styles } from '../styles';
import { DetailField, DetailSection } from '../shared/components';
import { formatDate } from '../shared/utils/formatters';

/**
 * Ön Başvuru Detay Modalı
 * Daha detaylı bilgi gösterir: sekmeler, belgeler vs.
 */
const PreApplicationDetailModal = ({ 
  vendor, 
  activeTab,
  setActiveTab,
  adminNote,
  setAdminNote,
  onClose, 
  onApprove, 
  onReject,
  isApproving,
  isRejecting
}) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!vendor) return null;

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: <FaUser size={12} /> },
    { id: 'address', label: 'Adres', icon: <FaMapMarkerAlt size={12} /> },
    { id: 'bank', label: 'Banka', icon: <FaUniversity size={12} /> },
  ];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{
          ...styles.modalContent, 
          ...(isMobile ? {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            top: 'auto',
            maxWidth: '100%',
            maxHeight: '95vh',
            borderRadius: '20px 20px 0 0',
            margin: 0
          } : {
            maxWidth: '800px', 
            maxHeight: '90vh'
          })
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          ...styles.modalHeader,
          padding: isMobile ? '16px' : styles.modalHeader.padding
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              ...styles.storeIcon,
              width: isMobile ? '40px' : styles.storeIcon.width,
              height: isMobile ? '40px' : styles.storeIcon.height,
              flexShrink: 0
            }}>
              <FaStore size={isMobile ? 16 : 20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: isMobile ? '16px' : '18px', 
                fontWeight: '700', 
                color: '#064e3b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {vendor.storeName || vendor.company_name || 'Mağaza Adı Yok'}
              </h2>
              <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#6b7280' }}>
                {vendor.owner || vendor.full_name} • ID: {vendor.id}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              padding: isMobile ? '12px' : '8px', 
              borderRadius: '8px',
              color: '#6b7280',
              minWidth: isMobile ? '44px' : 'auto',
              minHeight: isMobile ? '44px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e5e7eb', 
          padding: isMobile ? '0 12px' : '0 24px',
          background: '#f9fafb',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: isMobile ? '12px 16px' : '14px 20px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                color: activeTab === tab.id ? '#059669' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                minHeight: isMobile ? '44px' : 'auto'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ 
          ...styles.modalBody, 
          overflowY: 'auto', 
          maxHeight: isMobile ? 'calc(95vh - 280px)' : 'calc(90vh - 250px)',
          padding: isMobile ? '16px' : styles.modalBody.padding
        }}>
          {activeTab === 'general' && (
            <div>
              <DetailSection title="Genel Bilgiler" icon={<FaUser />}>
                <div style={styles.detailGrid}>
                  <DetailField label="Mağaza Adı" value={vendor.storeName || '-'} icon={<FaStore size={12} />} />
                  <DetailField label="Yetkili Kişi" value={vendor.owner || vendor.full_name || '-'} icon={<FaUser size={12} />} />
                  <DetailField label="E-posta" value={vendor.email || '-'} />
                  <DetailField label="Telefon" value={vendor.phone || '-'} />
                  <DetailField 
                    label="Kayıt Tarihi" 
                    value={vendor.created_at ? formatDate(vendor.created_at) : '-'} 
                    icon={<FaCalendarAlt size={12} />} 
                  />
                  <DetailField label="Durum" value={getStatusLabel(vendor.status)} />
                </div>
              </DetailSection>

              {/* Sosyal Medya */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#064e3b', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Sosyal Medya
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {vendor.instagram && (
                    <SocialLink 
                      href={`https://instagram.com/${vendor.instagram}`} 
                      icon={<FaInstagram />} 
                      label={vendor.instagram}
                      color="#E1306C"
                    />
                  )}
                  {vendor.website && (
                    <SocialLink 
                      href={vendor.website} 
                      icon={<FaGlobe />} 
                      label="Website"
                      color="#059669"
                    />
                  )}
                </div>
                {!vendor.instagram && !vendor.website && (
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>Sosyal medya bilgisi yok</span>
                )}
              </div>

              {/* Belgeler */}
              {vendor.documents && vendor.documents.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#064e3b', 
                    marginBottom: '12px'
                  }}>
                    Belgeler
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {vendor.documents.map((doc, idx) => (
                      <a 
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '8px',
                          fontSize: '12px',
                          textDecoration: 'none'
                        }}
                      >
                        <FaFilePdf /> {doc.name || `Belge ${idx + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <DetailSection title="Adres Bilgileri" icon={<FaMapMarkerAlt />}>
              <div style={styles.detailGrid}>
                <DetailField label="İl" value={vendor.city || '-'} />
                <DetailField label="İlçe" value={vendor.district || '-'} />
              </div>
              <DetailField label="Adres" value={vendor.address || '-'} style={{ marginTop: '16px' }} />
            </DetailSection>
          )}

          {activeTab === 'bank' && (
            <DetailSection title="Banka Bilgileri" icon={<FaUniversity />}>
              <div style={styles.detailGrid}>
                <DetailField label="Banka" value={vendor.bankName || '-'} icon={<FaUniversity size={12} />} />
                <DetailField label="IBAN" value={vendor.iban || '-'} />
                <DetailField label="Hesap Sahibi" value={vendor.accountHolder || '-'} />
              </div>
            </DetailSection>
          )}

          {/* Admin Notu */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Admin Notu
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Satıcı hakkında not ekleyin..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          ...styles.modalFooter,
          flexDirection: isMobile ? 'column-reverse' : 'row',
          gap: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : styles.modalFooter.padding
        }}>
          <button 
            onClick={onClose} 
            style={{
              padding: isMobile ? '12px 24px' : '12px 24px', 
              borderRadius: '10px', 
              border: '2px solid #e5e7eb', 
              background: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '14px',
              color: '#6b7280',
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '44px' : 'auto'
            }}
          >
            Kapat
          </button>
          <button 
            onClick={() => onReject(vendor)}
            disabled={isRejecting}
            style={{
              padding: isMobile ? '12px 24px' : '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '14px',
              opacity: isRejecting ? 0.7 : 1,
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '44px' : 'auto'
            }}
          >
            {isRejecting ? 'Reddediliyor...' : 'Reddet'}
          </button>
          <button 
            onClick={() => onApprove(vendor)}
            disabled={isApproving}
            style={{
              padding: isMobile ? '12px 24px' : '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '14px',
              opacity: isApproving ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '44px' : 'auto'
            }}
          >
            {isApproving ? 'Onaylanıyor...' : 'Onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SocialLink = ({ href, icon, label, color }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      background: `${color}15`,
      color: color,
      borderRadius: '8px',
      fontSize: '13px',
      textDecoration: 'none',
      fontWeight: '500'
    }}
  >
    {icon} {label} <FaExternalLinkAlt size={10} />
  </a>
);

const getStatusLabel = (status) => {
  const statusMap = {
    'pre_pending': 'Ön Başvuru Bekliyor',
    'pre_approved': 'Ön Başvuru Onaylandı',
    'pending': 'Tam Başvuru Bekliyor',
    'pending_full_approval': 'Aktivasyon Bekliyor',
    'active': 'Aktif',
    'rejected': 'Reddedildi'
  };
  return statusMap[status] || status;
};

export default PreApplicationDetailModal;
