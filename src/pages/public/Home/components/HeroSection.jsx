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
    bgImage: "/hero-slide-1.jpeg",
    emoji: "🛍️",
    showProducts: true,
    productIndex: 0
  },
  {
    id: 2,
    title: "Elektronikte\nDev İndirimler",
    subtitle: "Akıllı telefonlardan laptoplara, en yeni teknoloji ürünlerinde kaçırılmayacak fırsatlar.",
    primaryBtn: { text: "İncele", link: "/products?category=elektronik", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgImage: "/hero-slide-2.jpeg",
    emoji: "📱",
    showProducts: true,
    productIndex: 1
  },
  {
    id: 3,
    title: "Eviniz İçin\nEn İyisi",
    subtitle: "Mobilyadan dekorasyona, evinizin havasını değiştirecek şık ve modern tasarımlar.",
    primaryBtn: { text: "Keşfet", link: "/products?category=ev-yasam", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgImage: "/hero-slide-3.jpeg",
    emoji: "🏠",
    showProducts: true,
    productIndex: 2
  },
  {
    id: 4,
    title: "Yeni Sezon\nKampanyaları",
    subtitle: "Tüm kategorilerde özel fırsatlar ve kampanyalar sizi bekliyor.",
    primaryBtn: { text: "Keşfet", link: "/products", icon: <FaShoppingCart /> },
    secondaryBtn: null,
    bgImage: "/hero-slide-4.jpeg",
    emoji: "🎉",
    showProducts: false
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
      style={{ 
        ...styles.hero, 
        backgroundImage: `url(${slide.bgImage})`,
        backgroundSize: isMobile ? 'cover' : 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        transition: 'all 0.5s ease', 
        position: 'relative', 
        overflow: 'hidden',
        cursor: isMobile ? 'pointer' : 'default',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={isMobile ? () => window.location.href = slide.primaryBtn.link : undefined}
    >
      {/* Mobil için overlay - daha iyi okunabilirlik */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
          zIndex: 1,
        }} />
      )}

      <div style={{ ...styles.heroContent, position: 'relative', zIndex: 2 }}>
        {!isMobile && (
          <div style={{ 
            ...styles.heroText, 
            animation: 'fadeIn 0.5s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            height: '100%'
          }} key={slide.id}>
            <div style={styles.heroButtons}>
              <Link 
                to={slide.primaryBtn.link} 
                style={styles.heroBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                }}
              >
                {slide.primaryBtn.icon} {slide.primaryBtn.text}
              </Link>
              {slide.secondaryBtn && (
                <Link 
                  to={slide.secondaryBtn.link} 
                  style={styles.secondaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.boxShadow = '0 16px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                >
                  {slide.secondaryBtn.icon} {slide.secondaryBtn.text}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows - Sadece Desktop */}
      {!isMobile && (
        <>
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
        </>
      )}

      {/* Indicators */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '12px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: isMobile ? '6px' : '8px',
        zIndex: 10
      }}>
        {slides.map((_, idx) => (
          <div 
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            style={{
              width: currentSlide === idx ? (isMobile ? '20px' : '24px') : (isMobile ? '6px' : '8px'),
              height: isMobile ? '6px' : '8px',
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
