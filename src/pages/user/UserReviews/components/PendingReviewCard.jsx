// src/pages/user/UserReviews/components/PendingReviewCard.jsx
import React from 'react';
import { FaPen, FaShoppingBag } from 'react-icons/fa';

const PendingReviewCard = ({ item, orderNumber, orderId, onReview, styles }) => {
  // Dokümantasyona göre product_image full URL olarak geliyor
  const imageUrl = item.product_image 
    || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E';

  return (
    <div 
      style={styles.pendingCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.borderColor = '#fbbf24';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = '#fef08a';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <img
        src={imageUrl}
        alt={item.product_name}
        style={styles.pendingProductImage}
        onError={(e) => { 
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E';
        }}
      />
      
      <div style={styles.pendingProductInfo}>
        <div>
          <div style={styles.pendingProductName}>{item.product_name}</div>
          <div style={styles.pendingOrderInfo}>
            <FaShoppingBag size={11} />
            <span>Sipariş #{orderNumber}</span>
          </div>
        </div>
        
        <button
          style={styles.pendingReviewBtn}
          onClick={() => onReview(orderId, item.order_item_id, {
            ...item,
            order_number: orderNumber,
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.2)';
          }}
        >
          <FaPen size={12} />
          Değerlendir
        </button>
      </div>
    </div>
  );
};

export default PendingReviewCard;