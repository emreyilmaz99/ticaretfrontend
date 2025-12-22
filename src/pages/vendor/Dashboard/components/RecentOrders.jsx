import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStyles, getStatusStyle } from '../styles';

/**
 * Recent orders table / mobile cards
 */
const RecentOrders = ({ orders, isMobile = false }) => {
  const navigate = useNavigate();
  const styles = getStyles(isMobile);

  const handleViewAllOrders = () => {
    navigate('/vendor/orders');
  };

  return (
    <div style={styles.tableCard}>
      <div style={styles.tableHeader}>
        <h3 style={styles.cardTitle}>Son Siparişler</h3>
        <button 
          style={{ ...styles.tableViewAll, cursor: 'pointer' }}
          onClick={handleViewAllOrders}
        >
          Tümünü Gör
        </button>
      </div>
      
      {/* Desktop Table View */}
      <table style={styles.table}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <th style={styles.tableHeaderCell}>Sipariş No</th>
            <th style={styles.tableHeaderCell}>Müşteri</th>
            <th style={styles.tableHeaderCell}>Ürün</th>
            <th style={styles.tableHeaderCell}>Tarih</th>
            <th style={styles.tableHeaderCell}>Tutar</th>
            <th style={styles.tableHeaderCell}>Durum</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr 
              key={index} 
              style={{ 
                borderBottom: index !== orders.length - 1 ? '1px solid #f8fafc' : 'none' 
              }}
            >
              <td style={{ ...styles.tableCell, fontWeight: '600', color: '#0f172a' }}>
                {order.id}
              </td>
              <td style={{ ...styles.tableCell, color: '#475569' }}>
                {order.customer}
              </td>
              <td style={{ ...styles.tableCell, color: '#475569' }}>
                {order.product}
              </td>
              <td style={{ ...styles.tableCell, color: '#94a3b8', fontSize: '13px' }}>
                {order.date}
              </td>
              <td style={{ ...styles.tableCell, fontWeight: '600', color: '#0f172a' }}>
                {order.amount}
              </td>
              <td style={styles.tableCell}>
                <span style={{ 
                  ...styles.statusBadge,
                  ...getStatusStyle(order.status)
                }}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div style={{ display: isMobile ? 'block' : 'none' }}>
        {orders.map((order, index) => (
          <div key={index} style={styles.mobileOrderCard}>
            <div style={styles.mobileOrderHeader}>
              <span style={styles.mobileOrderId}>{order.id}</span>
              <span style={styles.mobileOrderAmount}>{order.amount}</span>
            </div>
            <div style={styles.mobileOrderInfo}>
              <div style={styles.mobileOrderRow}>
                <span style={styles.mobileOrderLabel}>Müşteri:</span>
                <span style={styles.mobileOrderValue}>{order.customer}</span>
              </div>
              <div style={styles.mobileOrderRow}>
                <span style={styles.mobileOrderLabel}>Ürün:</span>
                <span style={styles.mobileOrderValue}>{order.product}</span>
              </div>
              <div style={styles.mobileOrderRow}>
                <span style={styles.mobileOrderLabel}>Tarih:</span>
                <span style={{ ...styles.mobileOrderValue, color: '#94a3b8' }}>{order.date}</span>
              </div>
              <div style={styles.mobileOrderRow}>
                <span style={styles.mobileOrderLabel}>Durum:</span>
                <span style={{ 
                  ...styles.statusBadge,
                  ...getStatusStyle(order.status)
                }}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
