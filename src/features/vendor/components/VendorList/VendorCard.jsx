// src/features/vendor/components/VendorList/VendorCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaCheckCircle, FaTimesCircle, FaBan, FaTags, FaStar, FaEnvelope, FaPhone } from 'react-icons/fa';

const getStatusBadge = (status) => {
  const statusConfig = {
    active: { label: 'Aktif', color: '#10b981', bg: '#d1fae5' },
    inactive: { label: 'Pasif', color: '#6b7280', bg: '#f3f4f6' },
    pending: { label: 'Beklemede', color: '#f59e0b', bg: '#fef3c7' },
    banned: { label: 'Yasaklı', color: '#ef4444', bg: '#fee2e2' },
    pre_pending: { label: 'Ön Başvuru', color: '#8b5cf6', bg: '#ede9fe' },
    pre_approved: { label: 'Ön Onaylı', color: '#06b6d4', bg: '#cffafe' },
    pre_rejected: { label: 'Ön Reddedildi', color: '#f97316', bg: '#ffedd5' },
  };

  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: config.bg,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
};

const VendorCard = React.memo(({
  vendor,
  onEdit,
  onApprove,
  onReject,
  onBan,
  onCategory,
  showCategoryButton = false,
}) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f3f4f6',
  };

  const logoStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#059669',
    fontSize: '20px',
    fontWeight: '700',
    flexShrink: 0,
  };

  const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '13px',
    color: '#6b7280',
  };

  const statsContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
    marginBottom: '12px',
  };

  const statBoxStyle = {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const actionButtonsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  };

  const buttonBaseStyle = {
    flex: 1,
    minWidth: 'calc(50% - 4px)',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    minHeight: '40px',
  };

  const isPending = vendor.status === 'pending';
  const isActive = vendor.status === 'active';

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          {vendor.storeName ? vendor.storeName.charAt(0).toUpperCase() : '?'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {vendor.storeName || 'İsimsiz Mağaza'}
          </div>
          {getStatusBadge(vendor.status)}
        </div>
      </div>

      {/* Info */}
      {vendor.email && (
        <div style={infoRowStyle}>
          <FaEnvelope size={12} style={{ color: '#9ca3af' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {vendor.email}
          </span>
        </div>
      )}
      {vendor.phone && (
        <div style={infoRowStyle}>
          <FaPhone size={12} style={{ color: '#9ca3af' }} />
          <span>{vendor.phone}</span>
        </div>
      )}

      {/* Stats */}
      <div style={statsContainerStyle}>
        <div style={statBoxStyle}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>CİRO</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#059669' }}>
            {vendor.revenue || '0 TL'}
          </div>
        </div>
        <div style={statBoxStyle}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>PUAN</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <FaStar size={12} />
            {vendor.rating || '0.0'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={actionButtonsStyle}>
        <button
          onClick={() => onEdit(vendor)}
          style={{
            ...buttonBaseStyle,
            backgroundColor: '#3b82f6',
            color: 'white',
          }}
        >
          <FaEdit size={12} /> Düzenle
        </button>

        {showCategoryButton && (
          <button
            onClick={() => onCategory(vendor)}
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#8b5cf6',
              color: 'white',
            }}
          >
            <FaTags size={12} /> Kategori
          </button>
        )}

        {isPending && (
          <>
            <button
              onClick={() => onApprove(vendor)}
              style={{
                ...buttonBaseStyle,
                backgroundColor: '#10b981',
                color: 'white',
              }}
            >
              <FaCheckCircle size={12} /> Onayla
            </button>
            <button
              onClick={() => onReject(vendor)}
              style={{
                ...buttonBaseStyle,
                backgroundColor: '#ef4444',
                color: 'white',
              }}
            >
              <FaTimesCircle size={12} /> Reddet
            </button>
          </>
        )}

        {isActive && (
          <button
            onClick={() => onBan(vendor)}
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#dc2626',
              color: 'white',
              minWidth: '100%',
            }}
          >
            <FaBan size={12} /> Yasakla
          </button>
        )}
      </div>
    </div>
  );
});

VendorCard.displayName = 'VendorCard';

VendorCard.propTypes = {
  vendor: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onBan: PropTypes.func.isRequired,
  onCategory: PropTypes.func,
  showCategoryButton: PropTypes.bool,
};

export default VendorCard;
