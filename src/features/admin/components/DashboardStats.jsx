import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminProfile } from '../../auth/api/authApi';
import { FaWallet, FaShoppingBag, FaUsers, FaArrowUp } from 'react-icons/fa';

export const DashboardStats = () => {
  const { data: admin, isLoading: loading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const response = await getAdminProfile();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 dakika boyunca profili tekrar çekme
  });

  if (loading) return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Veriler yükleniyor...</div>;

  // İstatistik Kartı Bileşeni (Tekrar kullanmak için)
  const StatCard = ({ title, value, icon, color, trend }) => {
    const isMobile = window.innerWidth <= 768;
    
    return (
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: isMobile ? '16px' : '24px', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '8px' : '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: isMobile ? '11px' : '14px', fontWeight: '500' }}>{title}</p>
            <h3 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{value}</h3>
          </div>
          <div style={{ 
            backgroundColor: color + '20', // Rengin %20 opak hali
            color: color, 
            padding: isMobile ? '8px' : '12px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '11px' : '13px', color: '#10b981', fontWeight: '500' }}>
            <FaArrowUp size={10} />
            <span>{trend}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>geçen aya göre</span>
          </div>
        )}
      </div>
    );
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      {/* ÜST BİLGİ KARTI */}
      <div style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
        color: '#ffffff',
        padding: isMobile ? '20px 16px' : '28px 32px', 
        borderRadius: isMobile ? '12px' : '16px', 
        marginBottom: isMobile ? '16px' : '32px',
        boxShadow: 'none',
        border: '1px solid #e2e8f0',
      }}>
        <h1 style={{ 
          fontSize: isMobile ? '20px' : '26px', 
          fontWeight: '800', 
          marginBottom: '6px',
          letterSpacing: '-0.02em',
          margin: 0,
          color: '#ffffff',
        }}>
          Hoş Geldin, {admin?.name} 👋
        </h1>
        <p style={{ 
          fontSize: isMobile ? '13px' : '15px',
          margin: '6px 0 0 0',
          color: '#ffffff',
          opacity: 0.9,
        }}>
          Bugün mağazanda neler olup bittiğine bir göz atalım.
        </p>
      </div>

      {/* İSTATİSTİKLER GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: isMobile ? '12px' : '24px' 
      }}>
        <StatCard 
          title="Toplam Satış" 
          value="₺124,500" 
          icon={<FaWallet size={20} />} 
          color="#4f46e5" // Indigo
          trend="%12.5"
        />
        <StatCard 
          title="Yeni Siparişler" 
          value="45" 
          icon={<FaShoppingBag size={20} />} 
          color="#f59e0b" // Amber
          trend="%8.2"
        />
        <StatCard 
          title="Aktif Kullanıcılar" 
          value="1,203" 
          icon={<FaUsers size={20} />} 
          color="#10b981" // Emerald
          trend="%2.1"
        />
      </div>
    </div>
  );
};
