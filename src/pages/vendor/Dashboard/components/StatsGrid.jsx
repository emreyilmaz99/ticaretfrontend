import React from 'react';
import { FaWallet, FaShoppingBag, FaBox, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getStyles } from '../styles';

const ICON_MAP = {
  wallet: FaWallet,
  shopping: FaShoppingBag,
  box: FaBox,
  star: FaStar
};

/**
 * Statistics cards grid
 */
const StatsGrid = ({ stats, isMobile = false }) => {
  const styles = getStyles(isMobile);
  
  return (
    <div style={styles.statsGrid}>
      {stats.map((stat, index) => {
        const IconComponent = ICON_MAP[stat.iconType] || FaBox;
        
        return (
          <div key={index} style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{
                ...styles.statIcon,
                backgroundColor: `${stat.color}15`,
                color: stat.color
              }}>
                <IconComponent size={isMobile ? 18 : 20} />
              </div>
              <div style={{
                ...styles.statChange,
                color: stat.isPositive ? '#10b981' : '#ef4444',
                backgroundColor: stat.isPositive ? '#ecfdf5' : '#fef2f2'
              }}>
                {stat.isPositive ? <FaArrowUp size={isMobile ? 8 : 10} /> : <FaArrowDown size={isMobile ? 8 : 10} />}
                {stat.change}
              </div>
            </div>
            <h3 style={styles.statValue}>{stat.value}</h3>
            <p style={styles.statTitle}>{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
