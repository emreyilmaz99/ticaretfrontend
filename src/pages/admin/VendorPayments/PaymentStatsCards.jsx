// src/pages/admin/VendorPayments/PaymentStatsCards.jsx
import React from 'react';
import { 
  FaMoneyBillWave, FaStore, FaClock, FaChartLine, FaPercentage
} from 'react-icons/fa';

const PaymentStatsCards = ({ stats, isMobile }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const cards = [
    {
      title: 'Bekleyen Ödemeler',
      value: formatCurrency(stats.total_pending_amount),
      subValue: `${stats.pending_count || 0} hakediş`,
      icon: FaClock,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Onaylanan Ödemeler',
      value: formatCurrency(stats.total_approved_amount),
      subValue: `${stats.approved_count || 0} hakediş`,
      icon: FaChartLine,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'İşlenen Ödemeler',
      value: formatCurrency(stats.total_processed_amount),
      subValue: `${stats.processed_count || 0} hakediş`,
      icon: FaMoneyBillWave,
      color: '#059669',
      bgColor: '#d1fae5',
    },
    {
      title: 'Toplam Komisyon',
      value: formatCurrency(stats.total_commission),
      subValue: 'Tüm hakedişler',
      icon: FaPercentage,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: isMobile ? '20px' : '24px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'all 0.2s',
    cursor: 'default',
  };

  const iconWrapperStyle = (bgColor, color) => ({
    width: isMobile ? '48px' : '56px',
    height: isMobile ? '48px' : '56px',
    borderRadius: '14px',
    backgroundColor: bgColor,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  });

  const titleStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  };

  const valueStyle = {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.2',
  };

  const subValueStyle = {
    fontSize: '13px',
    color: '#94a3b8',
    marginTop: '4px',
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: isMobile ? '16px' : '20px',
      marginBottom: '24px',
    }}>
      {cards.map((card, index) => (
        <div key={index} style={cardStyle}>
          <div style={iconWrapperStyle(card.bgColor, card.color)}>
            <card.icon size={isMobile ? 20 : 24} />
          </div>
          <div>
            <div style={titleStyle}>{card.title}</div>
            <div style={valueStyle}>{card.value}</div>
            <div style={subValueStyle}>{card.subValue}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStatsCards;
