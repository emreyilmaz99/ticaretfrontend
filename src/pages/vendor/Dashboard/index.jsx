import React, { useState, useEffect } from 'react';
import { useVendorDashboard } from './useVendorDashboard';
import { getStyles } from './styles';
import {
  DashboardHeader,
  StatsGrid,
  RevenueChart,
  TopProducts,
  RecentOrders,
  PendingScreen,
  BannedScreen
} from './components';

/**
 * VendorDashboard - Main vendor dashboard page
 * Shows performance stats, charts, and recent orders
 */
const VendorDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = getStyles(isMobile);

  const {
    // Data
    vendor,
    stats,
    topProducts,
    revenueData,
    recentOrders,
    
    // Loading
    isLoading,
    
    // Status checks
    isPending,
    isBanned
  } = useVendorDashboard();

  // Loading state
  if (isLoading) {
    return <div style={{ padding: isMobile ? 16 : 24 }}>Yükleniyor...</div>;
  }

  // Pending approval state
  if (isPending) {
    return <PendingScreen vendor={vendor} isMobile={isMobile} />;
  }

  // Banned/Suspended state
  if (isBanned) {
    return <BannedScreen vendor={vendor} isMobile={isMobile} />;
  }

  // Active vendor dashboard
  return (
    <div style={styles.container}>
      <DashboardHeader isMobile={isMobile} />

      <StatsGrid stats={stats} isMobile={isMobile} />

      <div style={styles.chartsGrid}>
        <RevenueChart data={revenueData} isMobile={isMobile} />
        <TopProducts products={topProducts} isMobile={isMobile} />
      </div>

      <RecentOrders orders={recentOrders} isMobile={isMobile} />
    </div>
  );
};

export default VendorDashboard;
