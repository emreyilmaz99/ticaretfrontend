import apiClient from '@lib/apiClient';

// Vendor: listele
export const getVendorProducts = async (params = {}) => {
  const res = await apiClient.get('/v1/products/my-products', { params });
  return res.data;
};

// Vendor: oluştur
export const createVendorProduct = async (payload) => {
  // payload may contain files -> FormData
  let body = payload;
  let config = {};
  if (payload instanceof FormData) {
    body = payload;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await apiClient.post('/v1/products', body, config);
  return res.data;
};

// Vendor: güncelle
export const updateVendorProduct = async (id, payload) => {
  let body = payload;
  let config = {};
  
  if (payload instanceof FormData) {
    body = payload;
    // Laravel/PHP, PUT isteklerinde FormData'yı (dosyaları) düzgün okuyamaz.
    // Bu yüzden POST kullanıp _method=PUT gönderiyoruz.
    body.append('_method', 'PUT');
    config.headers = { 'Content-Type': 'multipart/form-data' };
    
    // Token'ı manuel olarak ekle (Interceptor bazen FormData ile sorun yaşayabilir)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await apiClient.post(`/v1/products/${id}`, body, config);
    return res.data;
  }

  const res = await apiClient.put(`/v1/products/${id}`, body, config);
  return res.data;
};

// Vendor: sil
export const deleteVendorProduct = async (id) => {
  const res = await apiClient.delete(`/v1/products/${id}`);
  return res.data;
};

// Vendor: fotoğraf sil
export const deleteVendorProductPhoto = async (productId, photoId) => {
  const res = await apiClient.delete(`/v1/products/${productId}/photos/${photoId}`);
  return res.data;
};

// Vendor: ürün durumunu güncelle (active/inactive)
export const updateVendorProductStatus = async (id, status) => {
  const res = await apiClient.put(`/v1/products/${id}/status`, { status });
  return res.data;
};
