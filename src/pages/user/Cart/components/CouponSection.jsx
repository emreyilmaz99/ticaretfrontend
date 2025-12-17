// src/pages/user/Cart/CouponSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiTag, FiX } from 'react-icons/fi';

/**
 * Kupon giriş ve görüntüleme bileşeni
 */
const CouponSection = ({ 
  coupon, 
  couponInput,
  couponLoading,
  onCouponInputChange, 
  onApplyCoupon, 
  onRemoveCoupon, 
  styles 
}) => {
  return (
    <div style={styles.couponSection}>
      <label style={styles.couponLabel}>İndirim Kuponu</label>
      
      {coupon ? (
        <ActiveCoupon 
          coupon={coupon} 
          onRemove={onRemoveCoupon} 
          styles={styles}
        />
      ) : (
        <CouponForm 
          value={couponInput}
          onChange={onCouponInputChange}
          onSubmit={onApplyCoupon}
          loading={couponLoading}
          styles={styles}
        />
      )}
      
      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
        Örnek: YAZ20, HOSGELDIN
      </p>
    </div>
  );
};

/**
 * Aktif kupon görüntüleme
 */
const ActiveCoupon = ({ coupon, onRemove, styles }) => {
  // İndirim miktarını formatla
  const discountText = coupon.type === 'percentage' 
    ? `%${coupon.discount} İndirim`
    : `${coupon.discount} TL İndirim`;

  return (
    <div style={styles.activeCoupon}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiTag />
          <span style={{ fontWeight: '600' }}>{coupon.code}</span>
        </div>
        <span style={{ fontSize: '12px', color: '#059669' }}>{discountText}</span>
        {coupon.min_amount && (
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Min. {coupon.min_amount} TL
          </span>
        )}
      </div>
      <button 
        onClick={onRemove} 
        style={{
          background: 'none', 
          border: 'none', 
          color: 'inherit', 
          cursor: 'pointer',
          padding: '4px',
        }}
        title="Kuponu Kaldır"
      >
        <FiX size={20} />
      </button>
    </div>
  );
};

/**
 * Kupon giriş formu
 */
const CouponForm = ({ value, onChange, onSubmit, loading, styles }) => (
  <form onSubmit={onSubmit} style={styles.couponForm}>
    <input 
      type="text" 
      placeholder="Kupon Kodu" 
      style={styles.couponInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
    />
    <button 
      type="submit" 
      style={{
        ...styles.couponBtn,
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
      disabled={loading}
    >
      {loading ? 'Uygulanıyor...' : 'Uygula'}
    </button>
  </form>
);

CouponSection.propTypes = {
  coupon: PropTypes.shape({
    code: PropTypes.string,
    discount: PropTypes.number,
  }),
  couponInput: PropTypes.string.isRequired,
  couponLoading: PropTypes.bool,
  onCouponInputChange: PropTypes.func.isRequired,
  onApplyCoupon: PropTypes.func.isRequired,
  onRemoveCoupon: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

ActiveCoupon.propTypes = {
  coupon: PropTypes.shape({
    code: PropTypes.string.isRequired,
    discount: PropTypes.number,
    type: PropTypes.string,
    min_amount: PropTypes.number,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

CouponForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  styles: PropTypes.object.isRequired,
};

export default CouponSection;
