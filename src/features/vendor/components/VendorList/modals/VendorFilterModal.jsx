// src/features/vendor/components/VendorList/modals/VendorFilterModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const VendorFilterModal = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    minRevenue: '',
    maxRevenue: '',
    minRating: '',
    maxRating: '',
    minProducts: '',
    maxProducts: '',
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      minRevenue: '',
      maxRevenue: '',
      minRating: '',
      maxRating: '',
      minProducts: '',
      maxProducts: '',
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'white' }}>
            Gelişmiş Filtreleme
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Ciro Filtresi */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
              Ciro Aralığı
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                placeholder="Min Ciro"
                value={filters.minRevenue}
                onChange={(e) => setFilters({ ...filters, minRevenue: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="number"
                placeholder="Max Ciro"
                value={filters.maxRevenue}
                onChange={(e) => setFilters({ ...filters, maxRevenue: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Puan Filtresi */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
              Puan Aralığı (0-5)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                placeholder="Min Puan"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="number"
                placeholder="Max Puan"
                min="0"
                max="5"
                step="0.1"
                value={filters.maxRating}
                onChange={(e) => setFilters({ ...filters, maxRating: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Ürün Sayısı Filtresi */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
              Ürün Sayısı Aralığı
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                placeholder="Min Ürün"
                value={filters.minProducts}
                onChange={(e) => setFilters({ ...filters, minProducts: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="number"
                placeholder="Max Ürün"
                value={filters.maxProducts}
                onChange={(e) => setFilters({ ...filters, maxProducts: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Sıfırla
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  );
};

VendorFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
};

export default VendorFilterModal;
