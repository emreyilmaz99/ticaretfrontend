// src/components/modals/CompareModal/styles.js
const isMobile = window.innerWidth <= 768;

export const getCompareModalStyles = (compareCount) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: isMobile ? '0' : '20px',
  },
  
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: isMobile ? '20px 20px 0 0' : '24px',
    width: '100%',
    maxWidth: isMobile ? '100%' : '1100px',
    maxHeight: isMobile ? '85vh' : '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  header: {
    padding: isMobile ? '20px 16px' : '28px 32px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    flexShrink: 0,
  },
  
  title: {
    fontSize: isMobile ? '18px' : '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    fontFamily: '"Inter", sans-serif',
    letterSpacing: '-0.5px',
  },
  
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    overflowX: isMobile ? 'hidden' : 'hidden',
    padding: isMobile ? '16px' : (compareCount === 1 ? '32px 120px' : '32px'),
  },
  
  grid: {
    display: isMobile ? 'flex' : 'grid',
    flexDirection: isMobile ? 'column' : undefined,
    gridTemplateColumns: isMobile ? undefined : (compareCount === 1 ? '1fr' : `repeat(${compareCount}, 1fr)`),
    gap: isMobile ? '16px' : '20px',
    maxWidth: compareCount === 1 ? '500px' : '100%',
    margin: compareCount === 1 ? '0 auto' : '0',
  },
});
