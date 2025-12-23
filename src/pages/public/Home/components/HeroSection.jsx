// src/pages/public/Home/components/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStore, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../../api/publicApi';

const slides = [
  {
    id: 1,
    title: "Tarzını Keşfet,\nFırsatları Yakala.",
    subtitle: "En yeni koleksiyonlar, özel indirimler ve binlerce ürün seçeneği ile alışverişin keyfini çıkarın.",
    primaryBtn: { text: "Alışverişe Başla", link: "/products", icon: <FaShoppingCart /> },
    secondaryBtn: { text: "Satıcı Ol", link: "/vendor/register", icon: <FaStore /> },
    bgColor: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    emoji: "🛍️",
    showProducts: true,
    productIndex: 0 // İlk ürünü göster
  },
  {
    id: 2,
    title: "Elektronikte\nDev İndirimler",
    subtitle: "Akıllı telefonlardan laptoplara, en yeni teknoloji ürünlerinde kaçırılmayacak fırsatlar.",
    primaryBtn: { text: "İncele", link: "/products?category=elektronik", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgColor: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    emoji: "📱",
    showProducts: true,
    productIndex: 1 // İkinci ürünü göster
  },
  {
    id: 3,
    title: "Eviniz İçin\nEn İyisi",
    subtitle: "Mobilyadan dekorasyona, evinizin havasını değiştirecek şık ve modern tasarımlar.",
    primaryBtn: { text: "Keşfet", link: "/products?category=ev-yasam", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgColor: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    emoji: "🏠",
    showProducts: true,
    productIndex: 2 // Üçüncü ürünü göster
  }
];

/**
 * Hero section with slider and swipe support
 */
const HeroSection = ({ styles, isMobile }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timeoutRef = useRef(null);

  // Fetch featured products for display
  const { data: featuredProducts } = useQuery({
    queryKey: ['hero-products'],
    queryFn: () => getProducts({ 
      per_page: 3, 
      sort_by: 'featured',
      has_deal: true
    }),
    staleTime: 10 * 60 * 1000,
  });

  const products = featuredProducts?.data || [];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
      5000
    );

    return () => resetTimeout();
  }, [currentSlide]);

  // Touch Handlers for Swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const slide = slides[currentSlide];

  return (
    <div 
      style={{ ...styles.hero, background: slide.bgColor, transition: 'background 0.5s ease', position: 'relative', overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div style={styles.heroContent}>
        <div style={{ ...styles.heroText, animation: 'fadeIn 0.5s ease-in-out' }} key={slide.id}>
          <h1 style={{ ...styles.heroTitle, whiteSpace: 'pre-line' }}>
            {slide.title}
          </h1>
          <p style={styles.heroSubtitle}>
            {slide.subtitle}
          </p>
          <div style={styles.heroButtons}>
            <Link to={slide.primaryBtn.link} style={styles.heroBtn}>
              {slide.primaryBtn.icon} {slide.primaryBtn.text}
            </Link>
            {slide.secondaryBtn && (
              <Link to={slide.secondaryBtn.link} style={styles.secondaryButton}>
                {slide.secondaryBtn.icon} {slide.secondaryBtn.text}
              </Link>
            )}
          </div>
        </div>
        
        {/* Hero Image - Show products on first slide, emoji on others */}
        {!isMobile && (
          <div style={{ 
            width: '400px', 
            height: '300px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            animation: 'float 6s ease-in-out infinite',
            flexDirection: 'column',
            gap: '10px',
            padding: '20px'
          }}>
            {slide.showProducts && products.length > 0 ? (
              // Tek premium ürün kartı göster - Her slide kendi ürününü gösterir
              <Link 
                to={`/product/${products[slide.productIndex]?.slug}`}
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: '24px',
                  padding: '24px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  width: isMobile ? '280px' : '380px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Gradient overlay effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
                  borderRadius: '24px 24px 0 0'
                }} />

                {/* Ürün resmi */}
                <div style={{
                  width: '100%',
                  height: isMobile ? '200px' : '280px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  position: 'relative',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <img 
                    src={products[slide.productIndex]?.image || '/placeholder-product.png'}
                    alt={products[slide.productIndex]?.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  
                  {/* İndirim badge */}
                  {products[slide.productIndex]?.has_deal && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                      letterSpacing: '0.5px'
                    }}>
                      FIRSAT
                    </div>
                  )}
                </div>

                {/* Ürün bilgileri */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Ürün adı */}
                  <h3 style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0,
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '44px'
                  }}>
                    {products[slide.productIndex]?.name}
                  </h3>

                  {/* Fiyat */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '24px' : '28px',
                      fontWeight: '800',
                      color: '#059669',
                      letterSpacing: '-0.5px'
                    }}>
                      ₺{typeof products[slide.productIndex]?.price === 'number' 
                        ? products[slide.productIndex].price.toFixed(2) 
                        : parseFloat(products[slide.productIndex]?.price || 0).toFixed(2)}
                    </span>
                    {products[slide.productIndex]?.original_price && (
                      <span style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        textDecoration: 'line-through',
                        fontWeight: '500'
                      }}>
                        ₺{typeof products[slide.productIndex]?.original_price === 'number'
                          ? products[slide.productIndex].original_price.toFixed(2)
                          : parseFloat(products[slide.productIndex]?.original_price || 0).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    backgroundColor: '#059669',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '15px',
                    marginTop: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                  }}>
                    <FaShoppingCart style={{ fontSize: '16px' }} />
                    <span>Ürünü İncele</span>
                  </div>
                </div>
              </Link>
            ) : (
              <span style={{ fontSize: '120px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
                {slide.emoji}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevSlide}
        style={navigationButtonStyle.left}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
      >
        <FaChevronLeft size={24} />
      </button>

      <button 
        onClick={goToNextSlide}
        style={navigationButtonStyle.right}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
      >
        <FaChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {slides.map((_, idx) => (
          <div 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: currentSlide === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: 'white',
              opacity: currentSlide === idx ? 1 : 0.4,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};

const navigationButtonStyle = {
  left: {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  right: {
    position: 'absolute',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  }
};

export default HeroSection;
