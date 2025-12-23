// src/components/navigation/Navbar/MegaMenu.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

const MegaMenu = ({ categories, styles }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const timeoutRef = React.useRef(null);

  // Icon helper function
  const getIconComponent = (iconName) => {
    if (!iconName) return null;
    const IconComponent = FaIcons[iconName];
    return IconComponent || null;
  };

  // Debug: Kategorileri console'a yazdır
  React.useEffect(() => {
    if (categories && categories.length > 0) {
      console.log('[MegaMenu] Categories:', categories);
      console.log('[MegaMenu] First category active_children:', categories[0]?.active_children);
    }
  }, [categories]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Scroll olduğunda mega menu'yu kapat
  React.useEffect(() => {
    const handleScroll = () => {
      if (hoveredCategory !== null) {
        setHoveredCategory(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hoveredCategory]);

  const handleMouseEnter = (categoryId) => {
    // Timeout varsa iptal et, açık kalsın
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredCategory(categoryId);
  };

  const handleContainerMouseLeave = () => {
    // Kısa bir gecikme ile kapat (200ms) - Böylece dropdown'a geçiş yapabilirsiniz
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  };

  const megaMenuStyles = {
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '0',
    },
    categoryItem: {
      position: 'relative',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    categoryItemHover: {
      backgroundColor: '#f3f4f6',
      color: '#059669',
    },
    megaMenuDropdown: {
      position: 'fixed',
      top: '165px',
      left: '50%',
      transform: 'translateX(-50%) translateY(-10px)',
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      borderRadius: '12px',
      padding: '24px',
      width: '90%',
      maxWidth: '1200px',
      zIndex: 1000,
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.3s ease',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '24px',
    },
    megaMenuDropdownVisible: {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(-50%) translateY(0)',
    },
    subcategoryColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    subcategoryTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: '#111827',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px',
      borderBottom: '2px solid #059669',
      paddingBottom: '6px',
      textDecoration: 'none',
      display: 'block',
      transition: 'color 0.2s ease',
    },
    subcategoryList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    subcategoryItem: {
      fontSize: '13px',
      color: '#6b7280',
      textDecoration: 'none',
      padding: '6px 0',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    subcategoryItemHover: {
      color: '#059669',
      paddingLeft: '8px',
    },
  };

  return (
    <div style={megaMenuStyles.container} onMouseLeave={handleContainerMouseLeave}>
      {categories.map((cat) => {
        const Icon = cat.IconComponent;
        const isHovered = hoveredCategory === cat.id;
        const hasChildren = cat.active_children && cat.active_children.length > 0;

        return (
          <div
            key={cat.id}
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter(cat.id)}
          >
            <Link
              to={`/products?category=${cat.slug}`}
              style={{
                ...megaMenuStyles.categoryItem,
                ...(isHovered ? megaMenuStyles.categoryItemHover : {}),
              }}
            >
              {Icon && <Icon style={{ fontSize: '14px' }} />}
              {cat.name}
              {hasChildren && <FaChevronRight style={{ fontSize: '10px', marginLeft: '4px' }} />}
            </Link>

            {hasChildren && isHovered && (
              <div
                style={{
                  ...megaMenuStyles.megaMenuDropdown,
                  ...megaMenuStyles.megaMenuDropdownVisible,
                }}
              >
                {cat.active_children.map((subcat) => {
                  const SubcatIcon = getIconComponent(subcat.icon);
                  return (
                  <div key={subcat.id} style={megaMenuStyles.subcategoryColumn}>
                    <Link
                      to={`/products?category=${subcat.slug}`}
                      style={megaMenuStyles.subcategoryTitle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#111827';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {SubcatIcon && <SubcatIcon style={{ fontSize: '14px', flexShrink: 0 }} />}
                        <span>{subcat.name}</span>
                      </div>
                    </Link>
                    {subcat.active_children && subcat.active_children.length > 0 && (
                      <div style={megaMenuStyles.subcategoryList}>
                        {subcat.active_children.map((child) => {
                          const ChildIcon = getIconComponent(child.icon);
                          return (
                          <Link
                            key={child.id}
                            to={`/products?category=${child.slug}`}
                            style={megaMenuStyles.subcategoryItem}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = megaMenuStyles.subcategoryItemHover.color;
                              e.currentTarget.style.paddingLeft = megaMenuStyles.subcategoryItemHover.paddingLeft;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = megaMenuStyles.subcategoryItem.color;
                              e.currentTarget.style.paddingLeft = megaMenuStyles.subcategoryItem.paddingLeft;
                            }}
                          >
                            {ChildIcon ? (
                              <ChildIcon style={{ fontSize: '11px', color: '#10b981', flexShrink: 0 }} />
                            ) : (
                              <FaChevronRight style={{ fontSize: '8px', flexShrink: 0 }} />
                            )}
                            {child.name}
                          </Link>
                        );})}
                      </div>
                    )}
                  </div>
                );})}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MegaMenu;
