// src/data/turkeyDataUtils.js
// Türkiye lokasyon verileri için yardımcı fonksiyonlar ve export'lar

import data from './turkeyData.json';

// JSON'dan veri export'ları
export const TURKEY_LOCATIONS = data.TURKEY_LOCATIONS;
export const cityPlateCodes = data.cityPlateCodes;
export const COUNTRIES = data.COUNTRIES;

// İl listesi (alfabetik sıralı)
export const cities = Object.keys(TURKEY_LOCATIONS).sort((a, b) => a.localeCompare(b, 'tr'));

// Belirli bir ilin ilçelerini getir
export const getDistricts = (city) => {
  return TURKEY_LOCATIONS[city] || [];
};

// Mahalleler için basit bir simülasyon fonksiyonu
export const getNeighborhoods = (district) => {
  const commonNeighborhoods = [
    "Merkez", 
    "Cumhuriyet", 
    "Atatürk", 
    "Fatih", 
    "Yeni", 
    "Bahçelievler", 
    "Hürriyet", 
    "İstiklal", 
    "Zafer", 
    "Gazi", 
    "Mimar Sinan", 
    "Yavuz Selim", 
    "Barış", 
    "Çamlıca", 
    "Esentepe"
  ];
  return commonNeighborhoods.map(n => `${n} Mah.`);
};

// Eski uyumluluk için districts objesi (deprecated - getDistricts kullanın)
export const districts = TURKEY_LOCATIONS;
