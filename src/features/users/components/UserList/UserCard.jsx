// src/features/users/components/UserList/UserCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaTrash, FaToggleOn, FaToggleOff, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import UserAvatar from './UserAvatar';
import { formatDate, formatDateTime } from '../../utils/formatters';

const UserCard = React.memo(({
  user,
  onView,
  onToggleStatus,
  onDelete,
  isToggling,
}) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* User Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <UserAvatar user={user} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>{user.name}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>ID: #{user.id}</div>
        </div>
      </div>

      {/* Phone */}
      <div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
          Telefon
        </div>
        <div style={{ color: '#0f172a', fontSize: '13px' }}>
          {user.phone || '-'}
        </div>
      </div>

      {/* Status & Email Verification */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>
            Durum
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: user.is_active ? '#dcfce7' : '#fee2e2',
            color: user.is_active ? '#166534' : '#991b1b'
          }}>
            {user.is_active ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
            {user.is_active ? 'Aktif' : 'Pasif'}
          </span>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>
            Email Doğrulama
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: user.email_verified_at ? '#dcfce7' : '#fef9c3',
            color: user.email_verified_at ? '#166534' : '#854d0e'
          }}>
            {user.email_verified_at ? 'Doğrulanmış' : 'Bekliyor'}
          </span>
        </div>
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
            Son Giriş
          </div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>
            {formatDateTime(user.last_login_at)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
            Kayıt Tarihi
          </div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>
            {formatDate(user.created_at)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '8px',
        paddingTop: '12px',
        borderTop: '1px solid #f1f5f9'
      }}>
        <button
          onClick={() => onView(user)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #dbeafe',
            backgroundColor: '#eff6ff',
            color: '#1e40af',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px',
            minHeight: '44px'
          }}
        >
          <FaEye /> Detay
        </button>
        <button
          onClick={() => onToggleStatus(user.id)}
          disabled={isToggling}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px',
            borderRadius: '8px',
            border: user.is_active ? '1px solid #e2e8f0' : '1px solid #d1fae5',
            backgroundColor: user.is_active ? '#f8fafc' : '#ecfdf5',
            color: user.is_active ? '#64748b' : '#059669',
            cursor: isToggling ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '13px',
            minHeight: '44px',
            opacity: isToggling ? 0.6 : 1
          }}
        >
          {user.is_active ? <FaToggleOff /> : <FaToggleOn />}
          {user.is_active ? 'Pasife Al' : 'Aktif Et'}
        </button>
        <button
          onClick={() => onDelete(user)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px',
            minHeight: '44px',
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    is_active: PropTypes.bool,
    email_verified_at: PropTypes.string,
    last_login_at: PropTypes.string,
    created_at: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isToggling: PropTypes.bool,
};

export default UserCard;
