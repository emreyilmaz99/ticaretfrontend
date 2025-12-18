import React, { Suspense, lazy } from 'react';
import { DashboardStats } from '../../features/admin/components/DashboardStats';

// Chart ve ağır componentler lazy load
const DashboardChart = lazy(() => import('../../features/admin/components/DashboardChart').then(m => ({ default: m.DashboardChart })));
const RecentOrders = lazy(() => import('../../features/admin/components/RecentOrders').then(m => ({ default: m.RecentOrders })));
const TopProducts = lazy(() => import('../../features/admin/components/TopProducts').then(m => ({ default: m.TopProducts })));
const ActivityTimeline = lazy(() => import('../../features/admin/components/ActivityTimeline').then(m => ({ default: m.ActivityTimeline })));
const PendingApprovals = lazy(() => import('../../features/admin/components/PendingApprovals').then(m => ({ default: m.PendingApprovals })));

// Skeleton loading component
const ChartSkeleton = () => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTopColor: '#059669',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
);

const Dashboard = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      padding: '32px',
      backgroundColor: '#F3F4F6',
      minHeight: '100vh',
    }}>
      {/* 1. İstatistik Kartları */}
      <DashboardStats />
      
      {/* 2. Grafikler (Satış & Ziyaretçi) - LAZY LOADED */}
      <Suspense fallback={<ChartSkeleton />}>
        <DashboardChart />
      </Suspense>
      
      {/* 3. Orta Bölüm: Siparişler ve Ürünler - LAZY LOADED */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Suspense fallback={<ChartSkeleton />}>
          <RecentOrders />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TopProducts />
        </Suspense>
      </div>

      {/* 4. Alt Bölüm: Aktiviteler ve Onaylar - LAZY LOADED */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <Suspense fallback={<ChartSkeleton />}>
          <ActivityTimeline />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <PendingApprovals />
        </Suspense>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;