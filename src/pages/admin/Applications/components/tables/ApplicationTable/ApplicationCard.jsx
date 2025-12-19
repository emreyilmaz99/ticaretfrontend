// src/pages/admin/Applications/components/tables/ApplicationTable/ApplicationCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaEye, FaCheck, FaTimes, FaBuilding, FaUser } from 'react-icons/fa';
import { ActionButton, StatusBadge } from '../../../shared/components';
import { formatDate, getInitials } from '../../../shared/utils/formatters';

/**
 * Mobile Card View for Applications
 */
const ApplicationCard = React.memo(({
  application,
  mode,
  onView,
  onApprove,
  onReject,
}) => {
  const isFull = mode === 'full';
  const isPre = mode === 'pre';

  const cardStyles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e2e8f0',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '16px',
      flexShrink: 0,
    },
    headerInfo: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#064e3b',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    id: {
      fontSize: '12px',
      color: '#6b7280',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#374151',
    },
    icon: {
      color: '#059669',
      flexShrink: 0,
    },
    label: {
      fontSize: '12px',
      color: '#6b7280',
      marginRight: '4px',
    },
    value: {
      fontSize: '14px',
      color: '#1e293b',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    actions: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #e2e8f0',
    },
    button: {
      flex: 1,
      minHeight: '40px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },
    viewBtn: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    approveBtn: {
      backgroundColor: '#059669',
      color: 'white',
    },
    rejectBtn: {
      backgroundColor: '#dc2626',
      color: 'white',
    },
  };

  return (
    <div style={cardStyles.container}>
      {/* Header */}
      <div style={cardStyles.header}>
        <div style={cardStyles.avatar}>
          {getInitials(application.full_name || application.company_name)}
        </div>
        <div style={cardStyles.headerInfo}>
          <div style={cardStyles.name}>
            {isPre ? application.full_name : application.company_name}
          </div>
          <div style={cardStyles.id}>ID: {application.id}</div>
        </div>
        {isPre && application.status && (
          <StatusBadge status={application.status} />
        )}
      </div>

      {/* Info */}
      <div>
        {/* Email */}
        <div style={cardStyles.infoRow}>
          <FaEnvelope style={cardStyles.icon} size={14} />
          <span style={cardStyles.value}>{application.email}</span>
        </div>

        {/* Phone */}
        {application.phone && (
          <div style={cardStyles.infoRow}>
            <FaPhone style={cardStyles.icon} size={14} />
            <span style={cardStyles.value}>{application.phone}</span>
          </div>
        )}

        {/* Company (for pre) or Owner (for full) */}
        {isPre && application.company_name && (
          <div style={cardStyles.infoRow}>
            <FaBuilding style={cardStyles.icon} size={14} />
            <span style={cardStyles.value}>{application.company_name}</span>
          </div>
        )}

        {isFull && application.full_name && (
          <div style={cardStyles.infoRow}>
            <FaUser style={cardStyles.icon} size={14} />
            <span style={cardStyles.value}>{application.full_name}</span>
          </div>
        )}

        {/* Date */}
        <div style={cardStyles.infoRow}>
          <FaCalendarAlt style={cardStyles.icon} size={14} />
          <span style={cardStyles.label}>Başvuru:</span>
          <span style={cardStyles.value}>{formatDate(application.created_at)}</span>
        </div>

        {/* Merchant Type */}
        {application.merchant_type && (
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.label}>Tür:</span>
            <span style={cardStyles.value}>{application.merchant_type}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={cardStyles.actions}>
        <button
          onClick={() => onView(application)}
          style={{ ...cardStyles.button, ...cardStyles.viewBtn }}
        >
          <FaEye size={14} /> İncele
        </button>
        <button
          onClick={() => onApprove(application)}
          style={{ ...cardStyles.button, ...cardStyles.approveBtn }}
        >
          <FaCheck size={14} /> Onayla
        </button>
        <button
          onClick={() => onReject(application)}
          style={{ ...cardStyles.button, ...cardStyles.rejectBtn }}
        >
          <FaTimes size={14} /> Reddet
        </button>
      </div>
    </div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

ApplicationCard.propTypes = {
  application: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['full', 'pre']).isRequired,
  onView: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default ApplicationCard;
