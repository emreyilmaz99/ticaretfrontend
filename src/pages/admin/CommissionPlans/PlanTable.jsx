// src/pages/admin/CommissionPlans/PlanTable.jsx
import React from 'react';
import { FaStar, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

/**
 * Komisyon planları tablosu
 */
const PlanTable = ({
  plans,
  onEdit,
  onDelete,
  onToggleActive,
  onSetDefault,
  styles,
  isMobile
}) => {
  if (plans.length === 0) {
    return (
      <div style={{
        ...styles.tableContainer,
        padding: isMobile ? '24px 16px' : '48px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Henüz komisyon planı eklenmemiş.
      </div>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {plans.map((plan) => (
          <div 
            key={plan.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Header with name and default badge */}
            <div style={{ 
              paddingBottom: '12px', 
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '16px' }}>
                {plan.name}
              </div>
              {plan.is_default && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  whiteSpace: 'nowrap'
                }}>
                  <FaStar size={10} /> Varsayılan
                </span>
              )}
            </div>

            {/* Rate */}
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                Komisyon Oranı
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>
                %{plan.rate}
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                Açıklama
              </div>
              <div style={{ color: '#475569', fontSize: '13px' }}>
                {plan.description || '-'}
              </div>
            </div>

            {/* Status */}
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>
                Durum
              </div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: plan.is_active ? '#dcfce7' : '#fee2e2',
                color: plan.is_active ? '#166534' : '#991b1b'
              }}>
                {plan.is_active ? 'Aktif' : 'Pasif'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <button 
                onClick={() => onToggleActive(plan)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: plan.is_active ? '1px solid #e2e8f0' : '1px solid #d1fae5',
                  backgroundColor: plan.is_active ? '#f8fafc' : '#ecfdf5',
                  color: plan.is_active ? '#64748b' : '#059669',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  minHeight: '44px'
                }}
              >
                {plan.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                {plan.is_active ? 'Pasife Al' : 'Aktife Al'}
              </button>
              
              <button 
                onClick={() => onSetDefault(plan)}
                disabled={plan.is_default}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: plan.is_default ? '1px solid #e2e8f0' : '1px solid #fef3c7',
                  backgroundColor: plan.is_default ? '#f8fafc' : '#fefce8',
                  color: plan.is_default ? '#cbd5e1' : '#854d0e',
                  cursor: plan.is_default ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  minHeight: '44px',
                  opacity: plan.is_default ? 0.6 : 1
                }}
              >
                <FaStar size={16} />
                Varsayılan Yap
              </button>

              <button 
                onClick={() => onEdit(plan)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
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
                <FaEdit size={16} />
                Düzenle
              </button>
              
              <button 
                onClick={() => onDelete(plan)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  minHeight: '44px'
                }}
              >
                <FaTrash size={16} />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Plan Adı</th>
            <th style={styles.th}>Oran (%)</th>
            <th style={styles.th}>Açıklama</th>
            <th style={styles.th}>Durum</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} style={styles.row}>
              <td style={styles.td}>
                <span style={{ fontWeight: '500' }}>{plan.name}</span>
                {plan.is_default && (
                  <span style={{ ...styles.badge, ...styles.badgeDefault }}>
                    <FaStar size={10} style={{ marginRight: 4 }} /> Varsayılan
                  </span>
                )}
              </td>
              <td style={styles.td}>%{plan.rate}</td>
              <td style={styles.td}>{plan.description || '-'}</td>
              <td style={styles.td}>
                <span style={{ 
                  ...styles.badge, 
                  ...(plan.is_active ? styles.badgeActive : styles.badgeInactive) 
                }}>
                  {plan.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td style={{ ...styles.td, textAlign: 'right' }}>
                <button 
                  onClick={() => onToggleActive(plan)}
                  style={{ 
                    ...styles.actionBtn, 
                    ...(plan.is_active ? styles.btnToggleOn : styles.btnToggleOff) 
                  }}
                  title={plan.is_active ? 'Pasife Al' : 'Aktife Al'}
                >
                  {plan.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                </button>
                <button 
                  onClick={() => onSetDefault(plan)}
                  style={{ 
                    ...styles.actionBtn, 
                    ...(plan.is_default ? styles.btnDefaultDisabled : styles.btnDefault) 
                  }}
                  title="Varsayılan Yap"
                  disabled={plan.is_default}
                >
                  <FaStar size={16} />
                </button>
                <button 
                  onClick={() => onEdit(plan)}
                  style={{ ...styles.actionBtn, ...styles.btnEdit }}
                  title="Düzenle"
                >
                  <FaEdit size={16} />
                </button>
                <button 
                  onClick={() => onDelete(plan)}
                  style={{ ...styles.actionBtn, ...styles.btnDelete }}
                  title="Sil"
                >
                  <FaTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;
